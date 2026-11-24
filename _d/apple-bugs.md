---
layout: post
title: "Apple Bugs: A Running List"
permalink: /apple-bugs
tags:
  - tools
  - ai
redirect_from:
  - /apple-bug
  - /xcode-bugs
---

I build iPhone and iPad apps with AI agents, so I spend a lot of time in Xcode, and Xcode keeps finding new ways to waste my afternoon. This is my running list of Apple bugs: what broke, why, and the workaround I ended up with. Newest first.

{% include ai-slop.html percent="80" %}

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- Newest bug goes at the top, as an H2 with the Xcode/macOS version in the title.
- Each entry: symptom, mechanism, what I ruled out, workaround. Keep it short and concrete.
- Never include team IDs, device UDIDs, emails, or names of private repos.
-->

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Xcode 27 throws away your Apple ID if you sign a build while the Mac is locked](#xcode-27-throws-away-your-apple-id-if-you-sign-a-build-while-the-mac-is-locked)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Xcode 27 throws away your Apple ID if you sign a build while the Mac is locked

What a pain in the ass.

**Symptom.** Settings > Accounts is suddenly empty, and every signing build fails with `No Accounts: Add a new account in Accounts settings`. Unlocking the Mac doesn't fix it. The account stays gone until I sign in again. I hit this on October 11, 2026, and again the next day.

**Mechanism.** My Mac locks the moment the display sleeps (screen lock set to "immediately"). Xcode 27 keeps account credentials in the data-protection keychain, and that keychain is unreadable while the Mac is locked: `secd` returns `-25308` (`errKCInteractionNotAllowed`). If an `xcodebuild -allowProvisioningUpdates` build runs then, Xcode logs:

```
DVTDeveloperAccountManager: Failed to load credentials … Invalid credentials in keychain … missing Xcode-Username
```

"Locked, try later" is a temporary error. Xcode treats it as "this account is corrupt" and deletes it.

**Why AI agents hit it.** Coding agents run signing builds while I'm away from the keyboard. `caffeinate -i` keeps the Mac awake, but it still lets the display sleep, and when the display sleeps the Mac locks. The first deploy after that deletes the account. On October 12 the screen locked at 18:28 and an agent's deploy at 18:36 wiped the account.

**What it wasn't.** My first guess was concurrent builds racing on the keychain. Wrong: the build that broke it ran alone. The logs also ruled out sandboxing (sandboxed builds that failed left the account alone), agents editing Xcode prefs (none did), and token expiry (no sign-out; it's a local read error).

**Workaround.** A guard in front of every signing build: wait for unlock, then keep the display on for the length of the build. `ioreg` reports the lock state:

```sh
if ioreg -n Root -d1 | grep -q '"CGSSessionScreenIsLocked"=Yes'; then
  echo "Screen locked: a signing build would make Xcode drop the Apple ID; waiting for unlock" >&2
  until ! ioreg -n Root -d1 | grep -q '"CGSSessionScreenIsLocked"=Yes'; do sleep 30; done
fi
caffeinate -d -w $$ &
```

Builds that only use cached profiles, and `devicectl` installs, are fine while locked. It's only `-allowProvisioningUpdates` that touches the account. The guard is going into [bug-kit as issue #53](https://github.com/idvorkin/bug-kit/issues/53). If a build does report "No Accounts", stop all signing builds and sign in again. Retrying won't help.

The real fix is Apple's: a locked keychain is a reason to retry later, not a reason to delete my account.
