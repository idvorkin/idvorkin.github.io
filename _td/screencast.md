---
title: Screencasting on OSX
permalink: /screencast
layout: post
---

I record with [Cap](https://cap.so) and edit in CapCut. One press of Record captures my screen and my facecam as two separate files, already in sync, so I can still cut, resize and background-remove the facecam on its own. I landed here after Loom kept stalling on capture (while costing \$20/month), one-take OBS recordings ate my time, and juggling two recorders got old. Here's the setup, plus the tips I picked up along the way.

### Recording: Cap

[Cap](https://cap.so) is an open source ([GitHub](https://github.com/CapSoftware/Cap)) Loom alternative:

```bash
brew install --cask cap
```

The key is **Studio Mode**. Each take writes the screen and the webcam as separate files, `display.mp4` and `camera.mp4`. They live inside the `.cap` package: right-click it, Show Package Contents, then `content/segments/...`. Drop both into CapCut as two tracks.

- Use Studio Mode, not Instant Mode. Instant Mode bakes the camera into the screen video.
- Cap's editor has no camera-only export yet, so grab the raw files from the package.
- For a live preview of my face while recording, I position Hand Mirror out of the way:

  ```bash
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
- Built-in background removal for facecam, positioned and resized as its own track
- Text-to-speech and auto-captions
- Cross-platform (web, desktop, mobile)
- Export directly to YouTube

### Captions and Chapters

ChatGPT prompts

### Mouse Key Press Overlay

- [KeyCastr](https://github.com/keycastr/keycastr)
- Mouse - TBD

### CUT: Previous approaches

#### Two recorders: Cmd+Shift+5 plus a separate facecam

I used to record the screen with the built-in macOS recorder (Cmd+Shift+5) and the facecam separately with QuickTime or ffmpeg:

```bash
ffmpeg -f avfoundation -framerate 30 -i "0:0" -c:v h264 -c:a aac facecam_$(date +%Y%m%d_%H%M%S).mp4
```

Separate tracks were the right idea, but two recorders meant two starts, two stops and syncing in CapCut. Cap gives me both streams from one Record press, already in sync.

#### OBS Source Record plugin

The [Source Record](https://obsproject.com/forum/resources/source-record.1285/) plugin can write each OBS source to its own file. I considered it, but forum users report it hanging on stop and garbling screen files on Apple Silicon, and it keeps all the OBS setup pain.

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
   - Expensive (\$20/month)
   - Better to use dedicated tools for each function
