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

# 4. Do NOT start etserver as a daemon — ET manages it over SSH
```

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
- **Don't run etserver as a daemon** — ET bootstraps its own server process via SSH. A pre-running daemon on port 2022 will conflict.

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
