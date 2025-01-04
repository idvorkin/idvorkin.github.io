---
title: Screencasting on OSX
permalink: /screencast
layout: post
---

Screencasting has become an essential tool for content creators, educators, and professionals alike. In this post, I'll share my experiences and insights on screencasting on macOS, covering various tools, techniques, and tips I've discovered along the way. From recording software to post-production enhancements, this guide aims to help you navigate the world of screencasting on your Mac.

### Screen Recording

For screen recording, use the built-in macOS screen recorder:

- Press Cmd+Shift+5 to open screen recording controls
- Select window or portion of screen
- Choose microphone input if needed
- Simple and reliable

### Facecam

Record facecam as a separate track for maximum flexibility:

1. Record facecam independently:

   ```bash
   # Using QuickTime Player from CLI
   open -a "QuickTime Player" --args -record
   ```

   or

   ```bash
   # Using ffmpeg with webcam and audio
   ffmpeg -f avfoundation -framerate 30 -i "0:0" -c:v h264 -c:a aac facecam_$(date +%Y%m%d_%H%M%S).mp4
   ```

2. Benefits of separate recording:

   - Easier to reshoot just the facecam portion
   - Can record multiple takes without redoing screen capture
   - Better control over camera settings
   - No performance impact on screen recording

3. Post-production in CapCut:

   - Import facecam as separate track
   - Use AI background removal
   - Easily position and resize
   - Add transitions or effects
   - Perfect sync with main content

4. Position scripts (for live preview while recording):
   ```bash
   # Example script to position Hand Mirror window
   osascript -e 'tell application "Hand Mirror" to set bounds of window 1 to {1600, 50, 1850, 300}'
   ```

### Microphone cleanup

TBD if I need this.

### Hosting - YouTube!

- Check out auto uploading via [youtubeuploader](https://github.com/porjo/youtubeuploader/)

### Video trimming

[CapCut](https://www.capcut.com/) is my recommended choice for video editing:

- Free and powerful video editor
- Easy trimming and multi-take management
- Built-in background removal for facecam
- Text-to-speech and auto-captions
- Cross-platform (web, desktop, mobile)
- Export directly to YouTube

### Captions and Chapters

ChatGPT prompts

### Mouse Key Press Overlay

- [KeyCastr](https://github.com/keycastr/keycastr)
- Mouse - TBD

### CUT: Previous approaches

#### QuickRecorder

[QuickRecorder](https://github.com/lihaoyun6/QuickRecorder):

- Initially promising in 2024
- Multi-window capture and latest APIs
- Includes Microphone
- Cut due to preferring separate recording tracks for more flexibility

#### FFMPEG

1. Too low level

#### OBS

While OBS itself can be challenging, here's a better approach:

1. Use OBS only for screen recording, not the full production
2. Record your camera/facecam separately
   - Gives you more control
   - Enables easy reshoots of just the video portion
   - Can apply background removal/transparency in post-production
3. Pro Tips:
   - Say "Take 1", "Take 2" etc. at the start of each recording
   - This makes it easier to find good takes during editing
   - Look at the audio waveform to find natural cut points if not using transcript-based editing
4. Why the original approach failed:
   - Too painful to set up capture and screen size
   - Trying to get everything perfect in one take is inefficient

#### Loom

While Loom seemed promising, I ultimately cut it from my workflow:

1. Great features in theory:
   - Video edit via text transcript (remove ah/ums)
   - Window/Application capture
   - Mouse Capture
2. Deal-breaking issues:
   - Screen capture performance issues (slow, stopping fails)
   - Happens on multiple computers
   - Expensive ($20/month)
   - Better to use dedicated tools for each function
