---
layout: post
title: "Keyboards: Hardware, Remapping, and Programming from macOS"
permalink: /keyboard
redirect_from:
  - /keyboards
  - /key-remap
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/dual_keyboard.jpg
---

I use split mechanical keyboards because I can't [externally rotate my shoulders](/shoulder-pain) — I need keyboards 3+ feet apart or I'm in pain within hours. This post covers everything: the hardware I use, key remapping with Karabiner, and programming the RK Royal Kludge RK-S70 from macOS (which requires a Windows VM because RK's software is Windows-only).

{%include blob_image_float_right.html src="blog/raccoon-split-keyboard.webp" alt="Raccoon typing on two split RGB mechanical keyboards spread wide apart" %}

Keyboards can be a huge rabbit hole. If you just want a nice ergo keyboard for your desk, get the [Logitech K860](#recommendation-for-most-people). If you just want one for your bag, get the [iClever BK06](#coffee-shop-dual-folding-bluetooth-keyboards). Everything below is the rabbit hole.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Why I need split keyboards](#why-i-need-split-keyboards)
    - [The backstory](#the-backstory)
- [My keyboards](#my-keyboards)
    - [Home: RK Royal Kludge RK-S70](#home-rk-royal-kludge-rk-s70)
    - [Coffee shop: Dual folding Bluetooth keyboards](#coffee-shop-dual-folding-bluetooth-keyboards)
    - [Recommendation for most people](#recommendation-for-most-people)
    - [Other keyboards I tried](#other-keyboards-i-tried)
    - [On mechanical keyboards](#on-mechanical-keyboards)
- [Key Remapping with Karabiner Elements](#key-remapping-with-karabiner-elements)
    - [Multi-keyboard sync](#multi-keyboard-sync)
    - [My Karabiner config](#my-karabiner-config)
- [Programming the RK-S70 from macOS](#programming-the-rk-s70-from-macos)
    - [The problem: Windows-only software](#the-problem-windows-only-software)
    - [The solution: UTM with a Windows VM](#the-solution-utm-with-a-windows-vm)
    - [Step 1: Install UTM](#step-1-install-utm)
    - [Step 2: Get Windows](#step-2-get-windows)
    - [Step 3: Create the VM](#step-3-create-the-vm)
    - [Step 4: USB passthrough for the keyboard](#step-4-usb-passthrough-for-the-keyboard)
    - [Step 5: Install the RK software](#step-5-install-the-rk-software)
    - [What you can configure](#what-you-can-configure)
- [Cross-platform alternatives I tried](#cross-platform-alternatives-i-tried)

<!-- vim-markdown-toc-end -->

<!-- prettier-ignore-end -->

## Why I need split keyboards

My wrist issues aren't about wrists - they're about shoulders. I can't [externally rotate my shoulders](/shoulder-pain), which means I need keyboards that can sit 3+ feet apart. This isn't preference, it's medical necessity. Using a laptop or straight keyboard causes pain within hours.

### The backstory

- **1996**: High school - played countless hours of Street Fighter II. The damage was done early.
- **2010-2021**: Decade of flare-ups. Wrists would hurt for a week or so, I'd wear a brace, and they'd be fine again. Repeat.
- **2022**: Complete wrist failure after 24 hours of magic practice. Took months to recover. Miserable - couldn't do magic, which was extra painful since I was already in a COVID funk.
- **Discovery**: Zero shoulder external rotation, grip strength at 15 lbs
- **Solution**: Year of [physical therapy focused on shoulders](/shoulder-pain)
- **Result**: Grip strength now 135 lbs, wrists functional with proper keyboard setup
- **Key insight**: The split isn't just comfort - it's necessary for my shoulder mechanics

## My keyboards

### Home: RK Royal Kludge RK-S70

{%include ipaste_image_float_right.html src="20260125_091437.webp" alt="RK ROYAL KLUDGE ergonomic mechanical keyboard at home desk setup" %}

[RK ROYAL KLUDGE Ergonomic Mechanical](https://www.amazon.com/RK-ROYAL-KLUDGE-Ergonomic-Mechanical/dp/B0FGN9GC2G) - Full-featured mechanical keyboard with hot-swappable switches (meaning you can replace individual keys without soldering). This is my daily driver at home. Ergonomic split design, tri-mode connectivity (Bluetooth/2.4GHz/USB-C), and 5 programmable macro keys (M1-M5).

{%include amazon.html asin="B0FGN9GC2G" %}

{% include alert.html content="CRITICAL: Make sure whatever mechanical keyboard you get has hot-swappable keys! This lets you replace individual switches without soldering. Total game-changer." style="warning" %}

### Coffee shop: Dual folding Bluetooth keyboards

{%include blob_image_float_right.html src="blog/dual_keyboard.jpg" alt="Dual folding Bluetooth keyboards positioned wide apart for coffee shop setup" %}

Two folding Bluetooth keyboards synced via [Karabiner Elements](#key-remapping-with-karabiner-elements). I position them 3+ feet apart to allow proper shoulder rotation. Portable and flexible.

{%include amazon.html asin="B01JA6HG88" %}

I've bought 9 of these iClever folding keyboards - they're compact, reliable, and let me position my hands exactly where my shoulders need them.

<div style="clear: both;"></div>

### Recommendation for most people

Logitech Ergo K860 - If you liked the classic MS Sculpt or Surface Sculpt keyboard, this is the modern version. Bluetooth, comfortable split design, good palm rest. This is what I'd recommend for most people with wrist issues.

{%include amazon.html asin="B07ZWK2TQT" %}

### Other keyboards I tried

- MS Sculpt - The classic ergo keyboard. Bought 6 spares before they discontinued it. Great keyboard, but they stopped making it.
- [Kinesis Freestyle (Quiet)](https://kinesis-ergo.com/products/#keyboards) - First true wide-split keyboard. Adjustable width, Cherry Red linear switches (quiet, smooth). Wired connection between halves, USB-A only. Note: I tried the Kinesis Advantage but dislike ortholinear layouts.

### On mechanical keyboards

I deliberately avoided mechanical keyboards for years. The Kinesis Freestyle forced my hand - it only comes in mechanical. Turns out linear keys (Cherry Red) are much better than clicky for me. Eventually I gave up resisting and embraced them - hence the RK ROYAL KLUDGE at home.

**Simple switch guide** (if you're trying to figure it out):

- Want clickity? Get **brown** switches
- Want quiet (linear, no click)? Get **red** switches
- Otherwise, prepare to go down a very long rabbit hole

## Key Remapping with Karabiner Elements

[Karabiner Elements](https://karabiner-elements.pqrs.org/) is the Swiss army knife of keyboard customization on macOS. I use it for everything from basic key swaps to syncing two separate keyboards into one unified input.

### Multi-keyboard sync

My coffee shop setup uses two folding Bluetooth keyboards positioned 3+ feet apart. Karabiner treats them as a single keyboard — I can chord across both (e.g., hold shift on the left, type on the right). This is the magic that makes the dual-keyboard setup work.

[My multi-keyboard sync config](https://github.com/idvorkin/settings/blob/d37d021f27bdec58dfd9e80fc727d9c00f5c103d/mac/multi_keyboard_sync.json?plain=1#L210)

### My Karabiner config

[Full Karabiner config](https://github.com/idvorkin/settings/blob/313acb3b163ec3bb3dd89ac0c970031ffbf8af8c/mac/karabiner.json?plain=1#L1) — the complete set of remappings I use across all my keyboards.

## Programming the RK-S70 from macOS

### The problem: Windows-only software

Royal Kludge's configuration software only runs on Windows. There's no macOS version and RK has confirmed they have no plans to make one. The official software handles:

- Key remapping
- RGB lighting customization
- Macro programming
- Firmware updates

You can download it from [rkgamingstore.com/pages/software](https://rkgamingstore.com/pages/software).

### The solution: UTM with a Windows VM

[UTM](https://mac.getutm.app/) is a free, polished QEMU frontend for macOS. It gives you a Windows VM with USB passthrough so the RK software can see your keyboard. This is simpler than raw QEMU (which has flaky USB passthrough on Apple Silicon) and free unlike Parallels.

### Step 1: Install UTM

Download from [mac.getutm.app](https://mac.getutm.app/) or install from the Mac App Store.

### Step 2: Get Windows

Download a Windows 11 ARM ISO from Microsoft's Insider Preview program. You can run Windows unactivated — you'll get a watermark but everything works.

### Step 3: Create the VM

1. Open UTM and click "Create a New Virtual Machine"
2. Select **Virtualize** (not Emulate) — this uses Apple's Hypervisor framework and is much faster
3. Choose Windows
4. Point to your Windows ARM ISO
5. Allocate at least 4GB RAM and 2 CPU cores
6. Create a 32GB+ disk (Windows needs room)
7. Install Windows normally

### Step 4: USB passthrough for the keyboard

1. In VM Settings, ensure **USB Sharing** is enabled
2. Connect the RK-S70 via USB-C cable (Bluetooth won't work — the software needs a wired connection)
3. When the keyboard connects, UTM will prompt you to attach it to the VM
4. Your Mac will temporarily lose keyboard input from that device — use a different keyboard or the on-screen keyboard to navigate

{% include alert.html content="The keyboard must be connected via USB, not Bluetooth. The RK software communicates with the keyboard's firmware over the USB connection." style="warning" %}

### Step 5: Install the RK software

1. Download the RK software inside the VM from [rkgamingstore.com/pages/software](https://rkgamingstore.com/pages/software)
2. Install and launch it
3. The software should detect the RK-S70 — if not, try unplugging and reattaching the USB in UTM's device menu

### What you can configure

| Feature          | Description                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| **Key Mapping**  | Remap any key to any other key or function                                    |
| **RGB Lighting** | Per-key colors, effects (breathing, wave, static, rainbow), brightness, speed |
| **Macros**       | Record keystroke sequences triggered by a single key (M1-M5 keys)             |
| **Firmware**     | Flash firmware updates from RK                                                |

## Cross-platform alternatives I tried

Before going the VM route, I tried these macOS-native options:

- **[Kludge Knight](https://kludgeknight.com/)** — Browser-based tool that claims S70 support (the dev owns one). Uses WebHID in Chrome/Edge. Didn't work for me — worth trying since it's zero-install.
- **[Rangoli](https://github.com/rnayabed/rangoli)** — Open-source native app. Effectively abandoned (last commit 2023), doesn't support the S70.
- **[RK Web App](https://drive.rkgaming.com/)** — Official browser-based tool from RK. Unclear if it supports the S70.
- **Raw QEMU** — Possible but USB passthrough on Apple Silicon is [problematic](https://gitlab.com/qemu-project/qemu/-/issues/2178). UTM wraps QEMU with the right entitlements and a GUI — just use UTM.
- **VirtualBox** — Doesn't support Apple Silicon well. No USB passthrough on ARM.
