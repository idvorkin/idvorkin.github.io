---
layout: post
title: Igor's OSX Tools
permalink: /osx
redirect-from:
  - /mac
---

I pretty much use mac exclusively. I have 3 at work, and a mac mini at home, and I'm an automation nerd so I try to have everything auto install/syncronize across the machines. On the mac, I'm either in chrome/edge, Cursor (the new VS.code), the terminal (I use iterm), capcut (video editor), zoom, or the few super handy utilities I list below.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Alfred](#alfred)
- [Random](#random)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Apps

### Alfred - The everything launcher/doer!

I LOVE Alfred. I can do all sorts of stuff

- Snippets - Helpful snippets
- Clipboard - Browse clipboard history
  - Often I copy multiple things and paste them back in order later

#### 3rd Party Plugins:

- Emoji Snippets ; to get emoji
  `; emoji to look for`
- GitFred -
  - `gmy` (search my repos)
- ChatGPT
- System Settings
- Screen Shots
  - clipls - View Clipboard Images
- Window Manager
- Thumbnail navigation (use fnav)

#### 2nd Party - E.g., Igor wrote it.

My CLI for Yabai/and other apps and generate Alfred commands

My personal plugin:

- "idv" Search my blog
- ss - Capture Screen Shot
- A bunch of cool stuff for Yabai + random [y.py](https://github.com/idvorkin/settings/blob/313acb3b163ec3bb3dd89ac0c970031ffbf8af8c/py/y.py?plain=1#L578)

### Productivity

- Omnifocus - Task Manager
  - My [handy cli](https://github.com/idvorkin/omnifocus_cli)
- Flow - A Pomodoro Timer
  - Write back sessions to calendar
  - Name sessions
  - Nice UX
- The terminal
  - I do crazy stuff in [there](https://github.com/idvorkin/settings).
  - Nerd Fonts

### Quality of life utility

- Hand Mirror - Preview Your Camera
- [Ice](https://github.com/jordanbaird/Ice) Manage the menu bar
  - (The new Bartender)
- [Alt Tab](https://alt-tab-macos.netlify.app/) - Windows-like alt tab
- Yabai - Tiling Window Manager
  - Aerospace - Different window manager - seems more powerful, but not stable yet.
  - Borders - Highlight current selected window
- Menubar - Show next meeting in the menu bar
- mpv+iina - Video Players
- 1password - Awesome Password Manager
- [Karabiner Elements](https://karabiner-elements.pqrs.org/) - [Make my keyboard perfect](https://github.com/idvorkin/settings/blob/313acb3b163ec3bb3dd89ac0c970031ffbf8af8c/mac/karabiner.json?plain=1#L1)
  - Even does crazy stuff like let me use 2 keyboards at once, chording across keyboards!#$!
- [Screencasting specific](/screencast)

### Screen Resolutions and Display Settings

OSX has several built-in ways to manage screen resolutions and displays:

1. **Default Settings**: System Settings -> Displays

   - Choose between Default or Scaled resolution
   - In Scaled mode, you can select from several preset options

2. **Advanced Resolution Options**:

   - Hold Option key while clicking "Scaled" to see all available resolutions
   - This reveals additional resolutions your display supports

3. **Command Line Tools**:

   ```bash
   # List all available resolutions
   system_profiler SPDisplaysDataType

   # Get current resolution
   system_profiler SPDisplaysDataType | grep Resolution
   ```

4. **Third-Party Tools**:

   - [BetterDisplay](https://github.com/waydabber/BetterDisplay) - Force custom resolutions, manage display settings, and override system limitations
     - Allows forcing any resolution your display can handle
     - Supports HiDPI and scaled resolutions
     - Can override system limitations for refresh rates
     - Free and open source

5. **Testing Your Display**:

   - Use [TestUFO Refresh Rate Test](https://www.testufo.com/refreshrate) to verify your display's refresh rate and resolution
   - For accurate results:
     - Close other applications and browser tabs
     - Run the test for at least 30 seconds
     - Use full-screen mode
   - TestUFO helps identify frame skipping and confirms if your custom resolution settings are working correctly

6. **Tips**:
   - For external displays, try "Default for display" first
   - For Retina displays, "Looks like" resolutions scale content while maintaining sharpness
   - Use Option key in Display settings to access HiDPI modes

## Philisophy

### Do not switch back and forth between windows and osx.

I used to try to use windows and mac, and move between them. Super hard on my brain. I highly recommend against. Give up windows, and go all mac. And you'll feel a lot better for it.

### When you go all in on the appleverse, it's glorious

iPhone/watch/iMessage/iPad, it all just works, syncs perfectly. it's a dream come true.
