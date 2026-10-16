---
layout: post
title: "My Old iPhone Turned Up in Shenzhen"
permalink: /iphone-security
redirect_from:
  - /phone-in-china
  - /lost-iphone
tags:
  - tools
  - security
---

I returned my old work phone, an iPhone 14, about two years ago and forgot about it. Then Find My showed it in Shenzhen, in the electronics-market district, 6,472 miles away. That worried me. Years of my data are on that phone, and somebody over there makes a living opening phones. So I dug into how the iPhone protects that data. Short answer: it's fine. Here's why.

{% include repo_image_float_right.html src="find-my-iphone14-shenzhen.webp" alt="Find My screenshot: a map of Shenzhen with a phone pin near Shennan Middle Road, and a card reading Igor iPhone 14, Shenzhen, Guangdong, China, Erase pending" %}

{% include ai-slop.html percent="80" %}

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- This is a work phone. Never name the employer, the team, the IT process, or what was on it. "My old work phone" is the whole description.
- Every technical claim links to Apple's Platform Security guide (support.apple.com/guide/security). Re-verify the delay table against that page before editing it; Apple has changed it before.
- Numbers from outside Apple (72 hours, Cellebrite) stay labeled as researcher or press reporting.
-->

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Why I wasn't actually in trouble](#why-i-wasnt-actually-in-trouble)
- [What a forensics lab can and can't do](#what-a-forensics-lab-can-and-cant-do)
- [The last line: erase it from here](#the-last-line-erase-it-from-here)
- [What I'd tell you](#what-id-tell-you)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Why I wasn't actually in trouble

Everything below comes from Apple's [Platform Security guide](https://support.apple.com/guide/security/welcome/web). The short version: the data on the phone is encrypted, the key only exists while the phone is unlocked, and the only way to make the key is to type the passcode into that exact phone, slowly.

**The flash chip is ciphertext.** Every file gets its own 256-bit key, and those keys are wrapped by class keys that only unlock once the passcode has been entered ([Data Protection overview](https://support.apple.com/guide/security/data-protection-overview-secf6276da8a/web)). Pull the chip off the board and you have a very expensive random number generator.

**The passcode is tied to the chip.** The passcode is entangled with a key fused into the Secure Enclave at the factory, the UID, which software can use but never read out ([the Secure Enclave](https://support.apple.com/guide/security/secure-enclave-sec59b0b31ff/web)). So you cannot copy my data to a rack of GPUs and guess passcodes there. Apple's words: brute-force attempts "need to be performed on the device under attack" ([Passcodes and passwords](https://support.apple.com/guide/security/passcodes-and-passwords-sec20230a10d/web)).

**Each guess costs 80 milliseconds.** The key derivation is tuned so one attempt takes about 80 ms on the phone itself. That sounds fast until you multiply (see the math below).

**The phone counts your guesses.** The Secure Enclave enforces escalating delays, and a restart doesn't reset them. Apple's current table for the iPhone lock screen:

| Wrong attempts | Delay before the next try                                                               |
| -------------- | --------------------------------------------------------------------------------------- |
| 1 to 3         | None                                                                                    |
| 4              | 1 minute                                                                                |
| 5              | 5 minutes                                                                               |
| 6              | 15 minutes                                                                              |
| 7              | 1 hour                                                                                  |
| 8              | 3 hours                                                                                 |
| 9              | 8 hours                                                                                 |
| 10 or more     | Locked. Needs a computer, or the owner's Apple Account to erase it from the lock screen |

Source: [Passcodes and passwords](https://support.apple.com/guide/security/passcodes-and-passwords-sec20230a10d/web); the lock-screen behavior is in [this support article](https://support.apple.com/105090). Retyping the same wrong passcode doesn't count, so your own fat fingers don't lock you out.

**Ten strikes can mean a wipe.** With Erase Data on (Settings > Face ID & Passcode), ten consecutive wrong passcodes erase the phone. On an A12 or later chip (the iPhone 14 is an A15), the attempt counter lives in a separate Secure Storage Component that does the erasing itself, and it refuses unlock attempts that don't come from its paired Secure Enclave ([the Secure Enclave](https://support.apple.com/guide/security/secure-enclave-sec59b0b31ff/web)). That last clause matters. In 2016 a researcher [beat the iPhone 5c's counter](https://arxiv.org/abs/1609.04327) by desoldering the flash chip and restoring a copy after every ten guesses. That trick is what the Secure Storage Component exists to kill.

**Sitting in a drawer makes it safer, not weaker.** Since iOS 18.1, the Secure Enclave watches for unlocks, and a phone that stays locked "for a prolonged period" restarts itself, dropping from After First Unlock to Before First Unlock and purging keys from memory ([Protecting user data in the face of attack](https://support.apple.com/guide/security/secf5549a4f5/web)). Apple doesn't publish the timer; [researchers measured about 72 hours](https://techcrunch.com/2024/11/14/new-apple-security-feature-reboots-iphones-after-3-days-researchers-confirm). Apple also says it's off by default on supervised devices, so I don't lean on it. I don't need to: a phone nobody has charged in two years has rebooted the old-fashioned way, and a cold boot lands in the same Before First Unlock state.

## What a forensics lab can and can't do

The companies that sell phone-cracking to police (Cellebrite, GrayKey) are the sophisticated attacker I was imagining. Here's where they stand.

- **Before First Unlock is the hard case.** After a reboot, nothing in the default protection class is readable until the passcode goes in ([Data Protection classes](https://support.apple.com/guide/security/data-protection-classes-secb010e978a/web)). After First Unlock, the class keys stay in memory while the phone is locked, which is why labs want a phone that's still warm. Mine isn't.
- **They need a bug, not a bigger computer.** Everything above is enforced by the Secure Enclave, so the only way around it is an exploit in the Secure Enclave or iOS that lets them send guesses without the delays. Those bugs exist, get patched, and get rarer. Cellebrite's own leaked support matrix showed it [couldn't unlock a sizable chunk of then-current iPhones](https://www.404media.co/leaked-docs-show-what-phones-cellebrite-can-and-cant-unlock/) as of April 2024.
- **checkm8 doesn't apply.** The famous unpatchable boot ROM exploit [tops out at the A11](https://github.com/axi0mX/ipwndfu), the iPhone 8 and X. An iPhone 14 is four chip generations past it, and even on affected phones it doesn't produce the passcode.
- **Even a perfect bug hits the 80 ms floor.** Suppose a lab defeats every delay and can fire guesses at the Secure Enclave as fast as it will take them. My arithmetic at 80 ms per guess, worst case for the attacker, all combinations:

| Passcode                           | Combinations    | Time to try them all       |
| ---------------------------------- | --------------- | -------------------------- |
| 4 digits                           | 10,000          | about 13 minutes           |
| 6 digits                           | 1,000,000       | about 22 hours             |
| 6 characters, lowercase + digits   | 2.2 billion     | 5.5 years (Apple's figure) |
| 10 characters, mixed case + digits | 840 quadrillion | about 2 billion years      |

So a 6-digit PIN is a bet that nobody has a working Secure Enclave exploit for your iOS version. An alphanumeric passcode isn't a bet at all.

## The last line: erase it from here

Find My has a nuclear option, and I pressed it. "Erase pending" in the screenshot means the command is queued: if the phone is offline, the erase [begins the next time it's online](https://support.apple.com/guide/icloud/erase-a-device-mmfc0ef36f/icloud). The moment it touches Wi-Fi or a cell tower to become useful to someone, it wipes itself. Activation Lock stays on afterward, so even a wiped phone can't be set up without my Apple Account ([Activation Lock security](https://support.apple.com/guide/security/sec0f8dfd030/web)). It's a brick that knows it's a brick.

Honest caveat: nobody needs the erase for the data. The encryption already did that job. The erase is for my peace of mind and for whoever buys the phone next.

## What I'd tell you

- **Use six digits or more, or go alphanumeric.** Four digits is 13 minutes against a lab with an exploit. Six is a day. Letters make the problem geological.
- **Keep iOS updated.** The delay table and the counter are only as good as the Secure Enclave firmware enforcing them. The forensic wins that leak out are against older iOS versions.
- **Turn on Erase Data.** Settings > Face ID & Passcode > Erase Data. Ten wrong guesses and the phone wipes. The same-passcode-twice rule means you won't do it to yourself.
- **Erase before you hand a phone off.** Settings > General > Transfer or Reset > Erase All Content and Settings. I honestly don't remember whether I did. I was fine anyway, but "I don't remember" is a bad plan.
- **Leave Find My on.** It's the only way to see the phone in Shenzhen, and the only way to queue the erase that eventually finds it.
