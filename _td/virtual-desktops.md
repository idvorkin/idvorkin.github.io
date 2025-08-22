---
layout: post
no-render-title: true
title: Virtual desktops in Wox
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/virtual-desktops.md)_

# Virtual desktops in Wox

## Success Criteria

- Able to switch virtual desktops from WoX

#### P/Invoke via Python

#### I can switch virtual desktops from python app.

Access GetDesktopNumber from FFI to load dll.
https://docs.python.org/3/library/ctypes.html

#### I can switch virtual desktops from wox

My plugin:

http://github.com/idvorkin/wox-desktop-switcher/

However, there's an issue where wox crashes tracked:

https://github.com/Wox-launcher/Wox/issues/2294

## Tasks

#### Build Virtual Desktop Accessor

https://github.com/Ciantic/VirtualDesktopAccessor
There is a C++ Bridge DLL that reexposes a nicer interface to the COM APIs.
Needs VS 2017 with C++ DLL to build and use.

- Can't build stdafx.h

This occurs if you clone using wsl. Clone from windows and it works.

- Random calls in the API fail

Don't care - ChangeDesktop is the only API I need to use, so will use that.

## Reference

https://github.com/sdias/win-10-virtual-desktop-enhancer
