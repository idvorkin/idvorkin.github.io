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

We watch a tonne of videos now, so it's good to be efficient with them. Go learn these keyboard shortcuts, you'll be happier. Not only will they save you time, but they'll make your viewing experience much more fluid and enjoyable.

**Note: We have switched to IINA Player from VLC. This reference documents IINA's keyboard shortcuts.**

## Key Notation Reference

| Notation | Key                  |
| -------- | -------------------- |
| M        | Meta/Command (⌘)     |
| A        | Alt/Option (⌥)       |
| C        | Control (^)          |
| S        | Shift (⇧)            |
| BS       | Backspace/Delete (⌫) |

## Playback Controls

- Space - Cycle Pause
- ⌫ - Stop
- → - Seek forward 5s
- ← - Seek backward 5s
- → - Next frame
- ← - Previous frame
- A-← - Seek to previous subtitle
- A-→ - Seek to next subtitle

## Playback Speed

- M-[ - Multiply Speed by 0.5x
- M-] - Multiply Speed by 2.0x
- M-A-[ - Multiply Speed by 0.9091x
- M-A-] - Multiply Speed by 1.1x
- M-\ - Set Speed to 1.0

## Chapter Navigation

- A-S-C - Chapter panel
- M-> - Chapter +1
- M-< - Chapter -1

## Media Controls

- S-S - Screenshot
- S-L - A-B loop
- A-S-L - Cycle loop in ()
- A-S-P - Playlist panel
- M-→ - Next media
- M-← - Previous media

## Window Size

- M-0 - Set Window scale to 0.5
- M-1 - Set Window scale to 1
- M-2 - Set Window scale to 2
- M-3 - Fit to Screen
- M-- - Smaller Window
- M-= - Bigger Window

## Display Controls

- C-S-P - Toggle Picture-in-Picture
- C-S-F - Cycle Fullscreen
- C-S-T - Cycle Float on top
- M-S-M - Toggle Music Mode

## Volume Controls

- ↑ - Volume +5
- ↓ - Volume -5
- A-↑ - Volume +1
- A-↓ - Volume -1
- M-/ - Cycle Mute

## Audio Delay

- ) - Audio delay +0.5
- ( - Audio delay -0.5
- } - Audio delay +0.1
- { - Audio delay -0.1
- : - Set Audio delay to 0

## Subtitle Controls

- A-S-D - Find online subtitles
- A-Z - Subtitle delay -0.5
- A-X - Subtitle delay +0.5
- A-S-Z - Subtitle delay -0.1
- A-S-X - Subtitle delay +0.1
- A-C - Set Subtitle delay to 0
- ↩ - Set Fullscreen to No
- ⇥ - Set Fullscreen to Yes
- Q - Quit

## Additional Controls

- P - Cycle Pause
- . - Next frame
- , - Previous frame
- M - Cycle Mute
- A-S-F - Seek forward 600s
- A-S-B - Seek backward 600s
- A-O - Subtitle scale +0.1
- A-F - Subtitle scale -0.1
- R - Subtitle position -1
- A-R - Subtitle position +1
- T - Subtitle position +1
- F - Cycle Fullscreen
- A-E - Cycle edition

## Remote-Style Controls

- POWER - Quit
- PLAY - Cycle Pause
- PAUSE - Cycle Pause
- PLAYPAUSE - Cycle Pause
- STOP - Quit
- FORWARD - Seek forward 60s
- REWIND - Seek backward 60s
- NEXT - Next media
- PREV - Previous media
- VOLUME_UP - Volume +2
- VOLUME_DOWN - Volume -2
- MUTE - Cycle Mute
- CLOSE_WIN - Quit

## Panel Controls

- A-S-V - Video panel
- A-S-A - Audio panel
- A-S-S - Subtitle panel
- C-S-V - Cycle Video track
- C-S-S - Cycle Subtitle track
- C-S-A - Cycle Audio track

_Note: These keybindings are for IINA Player. Key combinations may vary depending on your OS and IINA version._ 🎥

# MPV

mpv is a cli tool that lets you using cli with keybindings, i even added custom chapters commands

- c - show chapter list - i added myself [mpv config](https://github.com/idvorkin/settings/blob/0fc587aa33e5a92bcbca409e71447bc831fa7e3d/config/mpv/input.conf?plain=1#l8)
- !/@ - next/prev chapter
- [ / ] - decrease/increase playback speed
- { / } - halve/double playback speed

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/vlc_player.md)_
