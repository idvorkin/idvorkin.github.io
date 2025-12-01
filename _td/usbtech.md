---
layout: post
no-render-title: true
title: USB Tech
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/usbtech.md)_

# Usb Tech

I'll admit it, I have a USB charging fetish. Here's my brain dump:

## It just works USB charging (but kinda slow - 5W and 12.5W)

USB 2.0 (and 1.1 before it) are the ubiquitous legacy charging tech that just works. I'll share a bit of knowledge to cut down your charge time.

1. Old USB chargers can be limited to 5W (5V \* 1A).
1. New USB chargers can be limited to 12W (5V \* 2.4A).
1. Some multiport chargers can charge all ports at maximum current. E.g a 5 port charger could output 60W total (5 _ 12W). However, it's not uncommon to have a maximum power that's less then that e.g. 38W (4 _ 5W + 1 \* 12W) =
1. At this point all cables support 12W.

**Recommendations**

1. Make sure all your single port chargers are rated for 12W
1. Make sure all your multi port chargers are rated for 12W \* number of ports.
1. If you're obsessed you can measure using this USB A [multimeter](http://amzn.to/2C4ErcR).
1. My multiport [USB car charger](http://amzn.to/2l9n3ZL)

## It works fast USB charging (but rarely works - up to 100W)

USB Power Delivery (PD) is the new charging standard on the block, and can charge at 10x faster than legacy chargers (up to 100W!!!). USB PD is delivered via the USB C connector. As is normally the case with new tech, the state of chargers and cables currently a mess.

1. Not all USB-PD to USB-C connectors can carry USB-PD.
1. Not all USB-C chargers support PD.
1. USB-C Chargers that support USB-PD may not support all the different power outputs.
1. Not all devices with USB-C ports can charge via USB PD (likely because they have a USB-C port but it doesn't support PD at a sufficient wattage to charge the battery)
1. My [USB-PD travel charger](http://amzn.to/2ztzwgf).
1. My multiport USB-PD charger is (still waiting for it to exist)
1. My multiport USB-PD car charger is (still waiting for it to exist)
1. If you're obsessed my USB C [multimeter](http://amzn.to/2Dc6aVZ).

**Fast USB Charging for Apple Devices**

OMG [this is complicated](https://www.chargerlab.com/iphone-11-pro-max-charging-test)

iPad Pro, iPhones X and iPhone 8 can charge over USB-PD, and do so by using a USB C to Lightening adapter. However, the value of doing so varies by device:

- **IPhone X** In theory the iPhoneX charges over USB-PD, however it's charge rate is only 14W (9V \* 1.5A), only 10% faster then the normal 12W charging. See [here](https://www.macrumors.com/guide/iphone-x-fast-charging-speeds-compared/) for full details.
- **IPad Pro 2017** The IPad pro can charge 30W (14.5\*2A) 29W, more then double the speed of the normal 12W charging.

**Recommendations**

1. Check all USB-C accessories you plan to buy carefully.
1. Do get a USB-PD charger and cable for an iPad Pro.
1. Do **not** get a USB-PD charger and cable for an iPhone X
1. (If you're really into this) Get a USB multimeter and measure.
