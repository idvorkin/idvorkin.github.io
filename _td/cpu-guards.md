---
layout: post
title: CPU Guards for OrbStack Linux VMs
permalink: /cpu-guards
---

My dev VM is an OrbStack Linux container on a Mac, and a runaway process inside it can easily chew through every core, wedge the host, and make me regret life. I wanted a simple two-layer guard so one accidental `yes >/dev/null` or a misbehaving agent can't tank the whole machine. The canonical 2026 Linux recipe (`systemd-run --scope -p CPUQuota=N%`) doesn't work on OrbStack — details below — so this is the fallback that actually runs.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The two layers](#the-two-layers)
- [Why the systemd recipe doesn't work on OrbStack](#why-the-systemd-recipe-doesnt-work-on-orbstack)
- [Layer 1 — OrbStack hypervisor cap (Mac side)](#layer-1--orbstack-hypervisor-cap-mac-side)
- [Layer 2 — In-VM cpu-watchdog.sh](#layer-2--in-vm-cpu-watchdogsh)
    - [Install cpulimit](#install-cpulimit)
    - [The script](#the-script)
    - [Boot hook in ~/.zshrc](#boot-hook-in-zshrc)
    - [Defaults](#defaults)
    - [Exclude list](#exclude-list)
- [Smoke test](#smoke-test)
- [Gotchas](#gotchas)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The two layers

1. **Hypervisor ceiling** — OrbStack's `orb config set cpu <N>` caps the whole VM from the Mac side. Enforced at the hypervisor boundary, covers every process inside, can't be escaped. This is the real ceiling.
2. **Reactive in-VM throttle** — a small watchdog that polls `top`, spots any single process exceeding a threshold, and attaches `cpulimit` to cap it. Surgical, fast, and keeps the rest of the VM responsive even when one process has gone feral.

Layer 1 protects the host from the VM. Layer 2 protects the VM from itself (and from any one tenant eating all the cores). You want both.

## Why the systemd recipe doesn't work on OrbStack

If you search for "limit CPU usage Linux 2026", you get `systemd-run --scope -p CPUQuota=200% -- my-command` — a transient cgroup v2 scope that covers a whole process tree. Clean, modern, the right answer on a normal box. On OrbStack containers it fails twice over:

- **No systemd as PID 1.** OrbStack boots with `sh -c 'while true; do tmux...'` as PID 1. `systemd-run --user` dies with a `DBUS_SESSION_BUS_ADDRESS` error; `sudo systemd-run` dies with "System has not been booted with systemd as init system. Can't operate." Same root cause as the [etserver init.d gotcha over in the mosh doc](/mosh#install-on-orbstack--linux-vms-with-tailscale-ssh) — there's no systemd here to talk to.
- **Read-only cgroup filesystem.** `/sys/fs/cgroup` is mounted `ro,nsdelegate`. `sudo mount -o remount,rw /sys/fs/cgroup` is denied with "permission denied" even as root — OrbStack strips the container's capability to remount the cgroup fs. So going under systemd and writing `cpu.max` directly (`echo "400000 100000" > /sys/fs/cgroup/cpu.max`) also fails.

That leaves userspace tools. `cpulimit` (the [opsengine/cpulimit](https://github.com/opsengine/cpulimit) project, `apt install cpulimit`, version 3.1-1 on Ubuntu) duty-cycles processes with SIGSTOP/SIGCONT. It's not pretty — see [gotchas](#gotchas) — but it works without any privileged kernel operations.

## Layer 1 — OrbStack hypervisor cap (Mac side)

From the Mac:

```bash
orb config set cpu 10   # cap the VM at 10 cores
```

Or use the OrbStack GUI. This is a one-liner and a one-time setting. Everything below is the reactive layer that runs _inside_ the VM and complements this ceiling.

## Layer 2 — In-VM `cpu-watchdog.sh`

### Install cpulimit

```bash
sudo apt install cpulimit
```

### The script

The watchdog lives in my settings repo and is symlinked into `~/bin/cpu-watchdog.sh`:

- Script: [`~/settings/shared/cpu-watchdog.sh`](https://github.com/idvorkin/Settings/blob/main/shared/cpu-watchdog.sh) (~60 lines of bash)
- Symlink: `~/bin/cpu-watchdog.sh` → the file in the settings repo

What it does, in 30 seconds:

1. Every 30s, run `/usr/bin/top -bn2 -d1` and take the second sample (the first is noise).
2. For each process over the fire threshold (default 400% CPU, i.e. four cores sustained), check whether it's already being limited.
3. If not, attach `cpulimit -l 200 -p <pid> -z -q` to cap it at 200% (two cores). `-z` exits when the target exits; `-q` is quiet.
4. Skip anything in the exclude list — critical processes where throttling would wedge the VM.

The exact values, excludes, and flags are in the script — I don't want to embed it here and then drift out of sync.

### Boot hook in `~/.zshrc`

Same idempotent `pgrep` + `setsid` pattern as the [tailscaled and etserver bootstraps](/mosh#auto-start-on-boot-initd-script--shell-hook) — OrbStack's PID 1 never runs `/etc/rc*.d`, so the first interactive shell is what brings everything up:

```bash
# Start CPU watchdog if not already running.
# OrbStack's PID 1 is a trivial sh loop, so /etc/rc*.d never runs — hook it here.
if [ -x "$HOME/bin/cpu-watchdog.sh" ] && ! pgrep -f cpu-watchdog.sh > /dev/null; then
    setsid "$HOME/bin/cpu-watchdog.sh" >> /tmp/cpu-watchdog.log 2>&1 < /dev/null &
    disown
fi
```

After a VM reboot, the first zsh you launch brings the watchdog back up. If you never open a shell, nothing runs — which is fine because if nothing's running then nothing can burn CPU anyway.

### Defaults

| Knob               | Value                   | Env override              | Meaning                                             |
| ------------------ | ----------------------- | ------------------------- | --------------------------------------------------- |
| Scan interval      | 30s                     | `CPU_WATCHDOG_INTERVAL`   | How often to run `top` and look for offenders.     |
| Fire threshold     | 400%                    | `CPU_WATCHDOG_THRESHOLD`  | A process sustaining >4 cores triggers the limiter.|
| Cap                | 200%                    | `CPU_WATCHDOG_LIMIT`      | Offenders get pinned to 2 cores worth.             |
| Log file           | `/tmp/cpu-watchdog.log` | `CPU_WATCHDOG_LOG`        | Where throttle events are recorded.                |
| `top` sample count | 2                       | (hard-coded)              | First sample is noise; use the second.             |

These are tuned for a 10-core VM. If your ceiling is smaller, scale down proportionally. Every knob except `top` sample count can be overridden per-invocation via the env vars above — useful for smoke tests (see below).

### Exclude list

The watchdog refuses to limit anything in this list, so it can't wedge the VM by throttling the thing that's keeping it alive:

- `tailscaled` — network comes from here
- `etserver` and `etterminal` — ET server + the per-session client binaries that carry my actual shell. Throttle either and you lock yourself out of your own SSH session.
- `tmux` and `"tmux:"*` — tmux server and panes; throttling these makes the VM feel broken. Both the bare `tmux` comm (from `/proc/PID/comm`) and the argv form `tmux: server` are matched.
- `dolt` — hosts the beads issue tracker; long-running legit CPU
- `cpulimit` — don't let the watchdog throttle its own limiters (self-deadlock)
- `sh`, `init`, `systemd` — PID 1 / init-like processes; SIGSTOP'ing them hurts
- Kernel threads by comm pattern: `kthreadd`, `kworker*`, `ksoftirqd*`, `migration*`, `rcu_*`

If a critical process goes rogue you'll still have the [Layer 1 hypervisor cap](#layer-1--orbstack-hypervisor-cap-mac-side) protecting the Mac — and you can kill the process manually — but the watchdog itself won't touch it.

## Smoke test

The production thresholds (400%/200%/30s) make a real smoke test tedious — you'd have to burn four cores for half a minute. Instead, launch a second watchdog with low test thresholds against a separate log file so it fires in seconds:

```bash
# 1. Start a test watchdog with low thresholds and its own log.
CPU_WATCHDOG_LIMIT=30 \
CPU_WATCHDOG_THRESHOLD=50 \
CPU_WATCHDOG_INTERVAL=5 \
CPU_WATCHDOG_LOG=/tmp/cpu-watchdog.test.log \
  ~/bin/cpu-watchdog.sh &
WATCHDOG=$!

# 2. Burn a core.
yes > /dev/null &
BURNER=$!

# 3. Wait one scan cycle + cpulimit settle.
sleep 15

# 4. Verify the watchdog caught it and throttled to ~30%.
cat /tmp/cpu-watchdog.test.log             # should contain: throttle pid=$BURNER ... → cap 30%
/usr/bin/ps -p $BURNER -o pid,pcpu,comm,state  # %CPU ~30, state T (caught mid SIGSTOP)
pgrep -af cpulimit                         # should show cpulimit -p $BURNER

# 5. Cleanup.
kill $BURNER $WATCHDOG 2>/dev/null
rm -f /tmp/cpu-watchdog.test.log
```

You should see `yes` at ~100% on one core until the first 5s scan, then dropping to ~30% with state `T` — cpulimit is duty-cycling it via SIGSTOP/SIGCONT. It looks juddery in `top`, not smooth. Test log goes to `/tmp/cpu-watchdog.test.log`; the real watchdog (if it's also running) logs to `/tmp/cpu-watchdog.log`.

## Gotchas

- **cpulimit polls (~2s).** New children of a limited process run unconstrained until the next poll. For fork-heavy workloads you want the hypervisor cap doing most of the work.
- **SIGSTOP/SIGCONT is blunt.** `cpulimit` pauses the process for ~100ms at a time to hit the cap. Users see "juddery" not "smooth slow." Fine for background burners, noticeable for interactive processes.
- **It's per-process, not cumulative.** Ten processes each sitting just under the fire threshold won't trigger anything. That's why you still want the hypervisor cap.
- **Root-owned processes need `sudo`.** `cpulimit` can't signal a process it doesn't own. If rogue root processes are a real risk, run the watchdog as root — or better, rely on Layer 1.
- **No systemd, no cgroups.** If OrbStack ever gains writable cgroups or runs a real init, replace the whole Layer 2 with `systemd-run --scope -p CPUQuota=…` and delete this post. Until then, this is the least-bad option.
