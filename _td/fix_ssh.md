For some reason, SSH is just hanging out of no where. To debug on the server, be sure to open your firewall

> sudo /usr/sbin/sshd -d -D -p 6161

Then on the client use

> ssh -vv hostname -p 6161

Final output on server log:

> server_input_global_request: rtype no-more-sessions@openssh.com want_reply 0

References:

- https://sfxpt.wordpress.com/2011/03/05/troubleshooting-sshd-server-configuration-2/
- https://allthingscloud.eu/2017/09/29/ssh-login-hang-when-working-from-home/
