---
layout: post
no-render-title: true
title: Ring Video Doorbell
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/ring-video-download.md)_

# Ring Video Doorbell

## Success Criteria

- [x] Have an archive of all my ring videos.
- [x] Learn python web download technology
- [x] Cloud sync videos.

## Aritifacts

- [Implementation](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/ring-video-doorbell.py)
- [Bug: Can't download more then last 100 events from API](https://github.com/tchellomello/python-ring-doorbell/issues/84)

## Use cases - Functional

- Download all ring videos to a directory.
- Put directories in a cloud location:
  - Cheated and used One Drive.
- Do not re-download duplicate videos.

## Up next

Erase video content that hasn't changed, so videos are actually interesting:
https://stackoverflow.com/questions/13142541/extract-thumbnails-of-every-camera-change-on-a-video-file

I'm exploring this in my [video editing](https://github.com/idvorkin/video-edit) project.

## Notes

Ring video doorbell
https://github.com/tchellomello/python-ring-doorbell

Requests Library
http://docs.python-requests.org/en/master/
