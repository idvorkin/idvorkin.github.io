---
description: "Check/start Jekyll server and show preview URL"
argument-hint: "[port]"
allowed-tools: ["Bash", "Read"]
---

# Serve

Quick-start or find the Jekyll server for this blog directory.

**Port Override:** "$ARGUMENTS" (optional, defaults to auto-detect or 4000)

## Workflow

### 1. Check for Running Server

```bash
running-servers check .
```

**If a server is already running:**
- Display the Tailscale URL (e.g., `http://c-5001.squeaker-teeth.ts.net:4001`)
- Done — no further action needed.

### 2. Start Server if Not Running

Find an available port:

```bash
running-servers suggest
```

If `$ARGUMENTS` is a number, use that as the port instead.

Start the server (livereload port = 35729 + (port - 4000)):

```bash
just jekyll-serve <port> <livereload_port>
```

Run this in the background — don't wait for it to finish.

### 3. Show Status

After starting, wait a few seconds then verify:

```bash
running-servers check .
```

Display the URL to Igor.

### 4. Verify Server is Responding

Use the Tailscale URL from `running-servers` output (not localhost) to verify. This confirms the server is reachable the same way Igor will access it.

```bash
curl -s -o /dev/null -w "%{http_code}" http://{tailscale-hostname}:{port}/
```

If the status is 200, the server is healthy. If not (connection refused, 404, etc.), warn Igor.

Also extract the `<title>` to confirm it's the right site:

```bash
curl -s http://{tailscale-hostname}:{port}/ | head -50 | grep -o '<title>[^<]*</title>'
```

### 5. Show Current Branch Context

Show what branch is being served so Igor knows what content to expect:

```bash
git branch --show-current
```

## Output Format

```
Server: http://{tailscale-hostname}:{port} ✓ (200 OK)
Branch: {branch-name}
Title: {page-title}
```

If the server isn't responding:

```
Server: http://{tailscale-hostname}:{port} ✗ (not responding)
Branch: {branch-name}
```

Keep it minimal — just the URL, status, and branch.
