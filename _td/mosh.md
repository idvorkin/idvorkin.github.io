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
