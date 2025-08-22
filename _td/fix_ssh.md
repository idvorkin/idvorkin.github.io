---
layout: post
no-render-title: true
title: SSH Client Commands Timing Out from Some Clients Sometimes
---

For some reason, SSH is just hanging out of no where. To debug on the server, be sure to open your firewall

> sudo /usr/sbin/sshd -d -D -p 6161

Then on the client use

> ssh -vv hostname -p 6161

Final output on server log:

> server_input_global_request: rtype no-more-sessions@openssh.com want_reply 0

Server Logs

```
➜  gits /usr/sbin/sshd -d -D -p 6161                                                                                               <<<
debug1: sshd version OpenSSH_7.4, OpenSSL 1.0.2k-fips  26 Jan 2017
debug1: key_load_private: Permission denied
Could not load host key: /etc/ssh/ssh_host_rsa_key
debug1: key_load_private: Permission denied
Could not load host key: /etc/ssh/ssh_host_ecdsa_key
debug1: key_load_private: Permission denied
Could not load host key: /etc/ssh/ssh_host_ed25519_key
sshd: no hostkeys available -- exiting.
➜  gits sudo /usr/sbin/sshd -d -D -p 6161
debug1: sshd version OpenSSH_7.4, OpenSSL 1.0.2k-fips  26 Jan 2017
debug1: private host key #0: ssh-rsa SHA256:pXsLitGWnDXime4sXr9TH6f9sR/RhaiY6to/2T4UW8I
debug1: private host key #1: ecdsa-sha2-nistp256 SHA256:l30gZbFyNbPocmUHW68DdeqwG4AWiiw6MWEdcNmvIu0
debug1: private host key #2: ssh-ed25519 SHA256:b6YkH6m5HpB1TeFRsQUMBkJVZ9Ofe4/j3wSA6y0wlyY
debug1: rexec_argv[0]='/usr/sbin/sshd'
debug1: rexec_argv[1]='-d'
debug1: rexec_argv[2]='-D'
debug1: rexec_argv[3]='-p'
debug1: rexec_argv[4]='6161'
debug1: Set /proc/self/oom_score_adj from 0 to -1000
debug1: Bind to port 6161 on 0.0.0.0.
Server listening on 0.0.0.0 port 6161.
debug1: Bind to port 6161 on ::.
Server listening on :: port 6161.
debug1: Server will not fork when running in debugging mode.
debug1: rexec start in 5 out 5 newsock 5 pipe -1 sock 8
debug1: inetd sockets after dupping: 3, 3
Connection from 97.113.70.177 port 55339 on 172.26.2.180 port 6161
debug1: Client protocol version 2.0; client software version OpenSSH_8.1
debug1: match: OpenSSH_8.1 pat OpenSSH* compat 0x04000000
debug1: Local version string SSH-2.0-OpenSSH_7.4
debug1: Enabling compatibility mode for protocol 2.0
debug1: SELinux support disabled [preauth]
debug1: permanently_set_uid: 74/74 [preauth]
debug1: list_hostkey_types: ssh-rsa,rsa-sha2-512,rsa-sha2-256,ecdsa-sha2-nistp256,ssh-ed25519 [preauth]
debug1: SSH2_MSG_KEXINIT sent [preauth]
debug1: SSH2_MSG_KEXINIT received [preauth]
debug1: kex: algorithm: curve25519-sha256 [preauth]
debug1: kex: host key algorithm: ecdsa-sha2-nistp256 [preauth]
debug1: kex: client->server cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none [preauth]
debug1: kex: server->client cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none [preauth]
debug1: kex: curve25519-sha256 need=64 dh_need=64 [preauth]
debug1: kex: curve25519-sha256 need=64 dh_need=64 [preauth]
debug1: expecting SSH2_MSG_KEX_ECDH_INIT [preauth]
debug1: rekey after 134217728 blocks [preauth]
debug1: SSH2_MSG_NEWKEYS sent [preauth]
debug1: expecting SSH2_MSG_NEWKEYS [preauth]
debug1: SSH2_MSG_NEWKEYS received [preauth]
debug1: rekey after 134217728 blocks [preauth]
debug1: KEX done [preauth]
debug1: userauth-request for user ec2-user service ssh-connection method none [preauth]
debug1: attempt 0 failures 0 [preauth]
debug1: PAM: initializing for "ec2-user"
debug1: PAM: setting PAM_RHOST to "97-113-70-177.tukw.qwest.net"
debug1: PAM: setting PAM_TTY to "ssh"
debug1: userauth-request for user ec2-user service ssh-connection method publickey [preauth]
debug1: attempt 1 failures 0 [preauth]
debug1: userauth_pubkey: test whether pkalg/pkblob are acceptable for RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0 [preauth]
debug1: temporarily_use_uid: 500/500 (e=0/0)
debug1: trying public key file /home/ec2-user/.ssh/authorized_keys
debug1: fd 4 clearing O_NONBLOCK
debug1: matching key found: file /home/ec2-user/.ssh/authorized_keys, line 11 RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0
debug1: restore_uid: 0/0
Postponed publickey for ec2-user from 97.113.70.177 port 55339 ssh2 [preauth]
debug1: userauth-request for user ec2-user service ssh-connection method publickey [preauth]
debug1: attempt 2 failures 0 [preauth]
debug1: temporarily_use_uid: 500/500 (e=0/0)
debug1: trying public key file /home/ec2-user/.ssh/authorized_keys
debug1: fd 4 clearing O_NONBLOCK
debug1: matching key found: file /home/ec2-user/.ssh/authorized_keys, line 11 RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0
debug1: restore_uid: 0/0
debug1: do_pam_account: called
Accepted publickey for ec2-user from 97.113.70.177 port 55339 ssh2: RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0
debug1: monitor_child_preauth: ec2-user has been authenticated by privileged process
debug1: monitor_read_log: child log fd closed
debug1: SELinux support disabled
debug1: PAM: establishing credentials
User child is on pid 3495
debug1: PAM: establishing credentials
debug1: permanently_set_uid: 500/500
debug1: rekey after 134217728 blocks
debug1: rekey after 134217728 blocks
debug1: ssh_packet_set_postauth: called
debug1: Entering interactive session for SSH2.
debug1: server_init_dispatch
debug1: server_input_channel_open: ctype session rchan 0 win 1048576 max 16384
debug1: input_session_request
debug1: channel 0: new [server-session]
debug1: session_new: session 0
debug1: session_open: channel 0
debug1: session_open: session 0: link with channel 0
debug1: server_input_channel_open: confirm session
debug1: server_input_global_request: rtype no-more-sessions@openssh.com want_reply 0
```

Client Logs

```
debug1: SSH2_MSG_EXT_INFO received
debug1: kex_input_ext_info: server-sig-algs=<rsa-sha2-256,rsa-sha2-512>
debug2: service_accept: ssh-userauth
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey
debug1: Next authentication method: publickey
debug1: Offering public key: /root/.ssh/id_rsa RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0
debug2: we sent a publickey packet, wait for reply
debug1: Server accepts key: /root/.ssh/id_rsa RSA SHA256:R99TBv07yrFf9Y2KlPwm7xBSDtkHLekl9qJomhO7FD0
debug1: Authentication succeeded (publickey).
Authenticated to shell.idvork.in ([54.188.193.247]:6161).
debug1: channel 0: new [client-session]
debug2: channel 0: send open
debug1: Requesting no-more-sessions@openssh.com
debug1: Entering interactive session.
debug1: pledge: network
debug1: client_input_global_request: rtype hostkeys-00@openssh.com want_reply 0
debug2: channel_input_open_confirmation: channel 0: callback start
debug2: fd 3 setting TCP_NODELAY
debug2: client_session2_setup: id 0
debug2: channel 0: request pty-req confirm 1
debug2: channel 0: request shell confirm 1
debug2: channel_input_open_confirmation: channel 0: callback done
debug2: channel 0: open confirm rwindow 0 rmax 32768
client_loop: send disconnect: Broken pipe
```

Holy slug bug, it is an MTU issue!

A few observations:

- Even when creating a new lightsail instance, I still hang on connect
- On my work VPN, I don't hang, nor on my windows macines.
- Bizarre

References:

- https://sfxpt.wordpress.com/2011/03/05/troubleshooting-sshd-server-configuration-2/
- https://allthingscloud.eu/2017/09/29/ssh-login-hang-when-working-from-home/
