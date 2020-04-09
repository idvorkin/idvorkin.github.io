---
layout: post
no-render-title: true
title: Mosh
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/notes/mosh.md)_

# Mosh

**I no longer recommend mosh. It hasn't been updated in years, and it still doesn't support true color. I use ssh with tmux and an auto tmux reconnection script instead**

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
