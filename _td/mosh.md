---
layout: post
no-render-title: true
title: Mosh and Eternal Terminal
permalink: /mosh
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/mosh.md)_

# Mosh and Eternal Terminal

Both mosh and ET solve the same problem — persistent remote terminals that survive network changes. I've used mosh historically, and I'm currently running both. Facebook uses ET internally. They're both easy to try — pick whichever works for your setup.

## Eternal Terminal (ET)

[Eternal Terminal](https://mistertea.github.io/EternalTerminal/) — remote terminal with IP roaming, true color support, and active development. It works over SSH so your existing auth (including Tailscale SSH) just works.

### Install on OrbStack / Linux VMs (with Tailscale SSH)

```bash
# 1. Install via Homebrew
brew install et

# 2. Symlink BOTH binaries to /usr/local/bin
#    Critical for Tailscale SSH — its non-interactive sessions
#    have a minimal PATH that doesn't include linuxbrew
sudo ln -s /home/linuxbrew/.linuxbrew/bin/etserver /usr/local/bin/etserver
sudo ln -s /home/linuxbrew/.linuxbrew/bin/etterminal /usr/local/bin/etterminal

# 3. Config: bind to all interfaces (needed for Tailscale)
echo 'bindip=0.0.0.0' | sudo tee /etc/et.cfg

# 4. Create the pidfile (root-owned, standard permissions) and start the daemon
sudo touch /var/run/etserver.pid && sudo chmod 644 /var/run/etserver.pid
sudo etserver --cfgfile /etc/et.cfg --daemon

# 5. Verify it's listening
ss -tlnp | grep 2022
```

Running etserver via `sudo` keeps the pidfile owned by root (644) — matches the init.d behavior below and avoids a world-writable pidfile.

#### Auto-start on boot (init.d script + shell hook)

OrbStack containers have neither systemd nor sysv-init — PID 1 is a trivial `sh` loop that never runs `/etc/rc*.d/*`. So `update-rc.d` alone won't bring etserver back after a VM restart. The working pattern here is the same one tailscaled uses: an init.d script that owns start/stop, plus a one-line hook in `~/.zshrc` that calls it when the first interactive shell comes up.

First, the init.d script:

```bash
sudo tee /etc/init.d/etserver << 'EOF'
#!/bin/sh
### BEGIN INIT INFO
# Provides:          etserver
# Required-Start:    $network $remote_fs
# Required-Stop:     $network $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Description:       Eternal Terminal server
### END INIT INFO

DAEMON=/usr/local/bin/etserver
PIDFILE=/var/run/etserver.pid
CFGFILE=/etc/et.cfg

case "$1" in
  start)
    echo "Starting etserver..."
    touch "$PIDFILE" && chmod 644 "$PIDFILE"
    $DAEMON --cfgfile "$CFGFILE" --daemon
    sleep 1
    if [ -s "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      echo "etserver started (pid $(cat "$PIDFILE"))"
    else
      echo "Failed to start etserver"
      exit 1
    fi
    ;;
  stop)
    echo "Stopping etserver..."
    if [ -s "$PIDFILE" ]; then
      PID=$(cat "$PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        sleep 1
        kill -0 "$PID" 2>/dev/null && kill -9 "$PID"
        echo "etserver stopped"
      else
        echo "etserver not running (stale pidfile)"
      fi
      rm -f "$PIDFILE"
    else
      echo "etserver not running (no pidfile)"
    fi
    ;;
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
exit 0
EOF
sudo chmod +x /etc/init.d/etserver
```

Then the shell hook — drop this into `~/.zshrc` next to your tailscaled bootstrap:

```bash
# Start Eternal Terminal server if not already running.
# OrbStack's PID 1 is a trivial sh loop, so /etc/rc*.d never runs — hook it here.
if [ -x /etc/init.d/etserver ] && ! pgrep -x etserver > /dev/null; then
    sudo /etc/init.d/etserver start &>/dev/null &
fi
```

After a VM reboot, the first zsh you launch brings etserver back. Without this hook, the init.d script just sits there — nothing ever calls it.

### Install on Mac (client only)

```bash
brew install et
```

### Connect

```bash
et developer@<tailscale-hostname>
```

### Tailscale gotchas

- **Symlinks are mandatory** — ET's client SSHes in and runs `etterminal` (not `etserver`). Tailscale SSH non-interactive sessions only have `/usr/local/bin` in PATH, not `/home/linuxbrew/.linuxbrew/bin`. Without the symlinks, `etterminal` isn't found and the connection fails silently.
- **Bind to 0.0.0.0** — ET defaults to localhost, but Tailscale traffic arrives on the tailscale0 interface.
- **Port 2022** — Make sure your Tailscale ACLs allow port 2022 between nodes.
- **You DO need to run etserver as a daemon with Tailscale SSH** — ET normally bootstraps its own server via SSH, but Tailscale SSH's environment doesn't support this. Run `etserver --daemon` and set up the init.d script + `~/.zshrc` hook above for persistence across reboots.
- **`update-rc.d` is a trap on OrbStack** — the rc.d symlinks land in place but OrbStack's PID 1 is a bare `sh -c 'while true; do tmux...'` loop. Nothing executes `/etc/rc2.d/*` on boot. The `~/.zshrc` hook is what actually restarts etserver after a VM restart.
- **Pidfile permissions** — `etserver --daemon` writes to `/var/run/etserver.pid`. In OrbStack containers the file may not exist yet — create it with `sudo touch /var/run/etserver.pid && sudo chmod 644 /var/run/etserver.pid` and run etserver via `sudo` so root owns the pidfile. Don't `chmod 666` it (world-writable pidfile = anyone can write a fake PID that the init script would then `kill` as root).

### Verify

```bash
# From client — check port reachability
nc -zv <hostname> 2022

# From client — check etterminal is findable via SSH
ssh developer@<hostname> 'which etterminal'
```

### Bonus: CPU runaway watchdog (same boot-hook pattern)

An OrbStack dev VM will happily let one runaway process (a Claude agent loop, a Jekyll rebuild gone wild, `yes > /dev/null` from a typo) eat every core until the whole Mac grinds. The fix I run is a **two-layer CPU guard** — the same boot-hook pattern as etserver, just for a different problem.

- **Layer 1 — Mac-side hypervisor cap:** `orb config set cpu <N>` on the Mac (pick physical cores − 1 so the Mac always has a core to itself). This is the hard ceiling.
- **Layer 2 — in-VM reactive watchdog:** a small shell script that polls `top` every 30s, and when a user process exceeds a threshold, attaches `cpulimit` to throttle it. Script lives in my settings repo at [`shared/cpu-watchdog.sh`](https://github.com/idvorkin/Settings/blob/main/shared/cpu-watchdog.sh).

```bash
# 1. Install cpulimit from apt (NOT Homebrew — see gotcha below)
sudo apt install -y cpulimit

# 2. Symlink the script from ~/settings
mkdir -p ~/bin
ln -sf ~/settings/shared/cpu-watchdog.sh ~/bin/cpu-watchdog.sh

# 3. Add the boot hook to ~/.zshrc — next to the tailscaled and etserver hooks
cat >> ~/.zshrc << 'EOF'

# Start in-VM CPU watchdog (Layer 2 of the two-layer CPU guard)
if [ -x ~/bin/cpu-watchdog.sh ] && ! pgrep -f 'bin/cpu-watchdog.sh$' > /dev/null; then
    setsid ~/bin/cpu-watchdog.sh &>/dev/null &
fi
EOF

# 4. Start it now (don't wait for a new shell)
setsid ~/bin/cpu-watchdog.sh &>/dev/null &
```

Verify it's alive and caught the boot line:

```bash
pgrep -af 'bin/cpu-watchdog.sh$'
tail -1 /tmp/cpu-watchdog.log   # should show "cpu-watchdog starting ..."
```

#### OrbStack / Linux gotchas

- **systemd-run doesn't work inside OrbStack.** The canonical 2026 move is `systemd-run --scope -p CPUQuota=N%`, but OrbStack's PID 1 is a bare `sh` loop (no systemd), and `/sys/fs/cgroup` is mounted read-only with the remount capability stripped. Userspace `cpulimit` is the fallback.
- **Homebrew cpulimit on Linux is an unrelated fork stuck at v0.2** — it lacks `-q` and other flags the watchdog uses, and it silently errors out. Worse, linuxbrew prepends its bin to PATH, so if you've ever run `brew install cpulimit` it will shadow `/usr/bin/cpulimit` even after you `apt install cpulimit`. Symptom: the watchdog log shows a `throttle pid=...` line every scan but `%CPU` never drops. Fix: `brew uninstall cpulimit` or hardcode `/usr/bin/cpulimit` in the script.
- **cpulimit is per-process, not cumulative.** Ten processes each sitting just under the threshold stay invisible even though they sum to 10 cores. That's what Layer 1 is for — the watchdog is an early reactive throttle, not the ceiling.
- **Root-owned processes are invisible** (cpulimit can only signal processes it can `kill()`), along with the exclusion list (`tailscaled`, `etserver`, `dolt`, `tmux`, etc.). Fine for dev workloads; don't use this for system services.

Smoke test the whole stack with `CPU_WATCHDOG_LIMIT=30 CPU_WATCHDOG_THRESHOLD=50 CPU_WATCHDOG_INTERVAL=5 ~/bin/cpu-watchdog.sh &` against a `yes > /dev/null` burner and confirm `ps` shows the burner dropping to ~30% and a live `/usr/bin/cpulimit -l 30 -p <pid>` child.

---

## Mosh

I want to do remote development on linux, the best way to do this is mosh (instead of ssh). It's better because:

    1) Lower latency
    2) Reconnects to session.

Setup on iOS

- Install Blink
- Copy public key to clipboard, and mail it to yourself to install into the AMI @ ssh

Setup on Server (AMI)

- sudo yum install mosh
- In AWS console open UDP ports 60000-61000
- Copy in the AWS public key
- Paste into the clipboard thing on the bottom.
- Then right click will work to paste

General Lightsail setup (To move to setup linux)

```bash
   sudo yum update
   sudo yum install git tig zsh most

   # Install settings
   cd ~
   git clone http://github.com/idvorkin/settings

   # Setup authorized keys for ssh access
   vim ~/.ssh/authorized_keys
```

Install on WSL

```sudo add-apt-repository ppa:keithw/mosh-dev
sudo apt-get install mosh
```
