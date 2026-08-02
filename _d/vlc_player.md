---
layout: post
no-render-title: true
title: IINA Player Keyboard Shortcuts
permalink: /vlc
redirect_from:
  - /iina
  - /videoplayer
  - /video-player
---

# IINA Player Keyboard Shortcuts

I watch a tonne of videos, so it's worth being efficient with them. Learn these keyboard shortcuts, you'll be happier. I switched from VLC to IINA a while back, so this reference is for IINA.

## Key Notation Reference

| Notation | Key                  |
| -------- | -------------------- |
| M        | Meta/Command (⌘)     |
| A        | Alt/Option (⌥)       |
| C        | Control (^)          |
| S        | Shift (⇧)            |
| BS       | Backspace/Delete (⌫) |

## The Shortcuts I Actually Use

- Space - Pause/Play
- ← / → - Seek backward/forward 5s
- A-← / A-→ - Seek to previous/next subtitle
- , / . - Previous/next frame
- M-[ / M-] - Halve/double playback speed
- M-\ - Reset speed to 1.0
- M-< / M-> - Previous/next chapter
- M-← / M-→ - Previous/next media
- ↑ / ↓ - Volume +5/-5
- M-/ - Mute
- C-S-F - Fullscreen
- C-S-P - Picture-in-Picture
- S-S - Screenshot
- A-S-D - Find online subtitles
- A-Z / A-X - Subtitle delay -0.5s/+0.5s

# MPV

mpv is a CLI player driven by keybindings, and I added custom chapter commands myself in my [mpv config](https://github.com/idvorkin/settings/blob/0fc587aa33e5a92bcbca409e71447bc831fa7e3d/config/mpv/input.conf?plain=1#l8):

- c - show chapter list
- !/@ - next/prev chapter
- [ / ] - decrease/increase playback speed
- { / } - halve/double playback speed
