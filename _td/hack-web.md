---
layout: post
no-render-title: true
title: Hacking the web for fun and profit
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/hack-web.md)_

# Hacking the web for fun and profit

Now a days javascript and HTML are the assembly language of the web (I first [said this in 2012](http://ig2600.blogspot.com/2012/05/assembly-to-javascript-tsrs-to.html)). While still stuff is fun, it's very brittle because 1) the approach is brittle, and 2) everytime the code changes, which it will everything will break.

<!-- vim-markdown-toc-start -->

- [Script Injection](#script-injection)
  - [Bookmarklets](#bookmarklets)
  - [Grease Monkey - User Script loader](#grease-monkey---user-script-loader)
- [Console Tricks](#console-tricks)
  - [Load Jquery](#load-jquery)
  - [Speed up video playback](#speed-up-video-playback)
- [Debugging 101](#debugging-101)
  - [Chrome Keyboard shortcuts](#chrome-keyboard-shortcuts)
  - [Force reloading](#force-reloading)
  - [Capturing an object for later use](#capturing-an-object-for-later-use)
  - [Black boxing](#black-boxing)
  - [Event Handlers](#event-handlers)
  - [Chrome local overrides](#chrome-local-overrides)
- [Real life examples](#real-life-examples)
  - [Download the Alexa sound recording](#download-the-alexa-sound-recording)
    - [Putting it all together.](#putting-it-all-together)
    - [Red herrings - but good approaches](#red-herrings---but-good-approaches)
  - [Automating todo item creation in omnifocus for web](#automating-todo-item-creation-in-omnifocus-for-web)
  - [Screen Size Previews](#screen-size-previews)
  - [Open graph preview Facebook](#open-graph-preview-facebook)
  - [Web Site Preview Debugger](#web-site-preview-debugger)
  - [Kindle Cloud Reader](#kindle-cloud-reader)
- [Fly out TOC](#fly-out-toc)
  - [CSS](#css)
  - [Javascript Reverse Engineering Fly out TOC](#javascript-reverse-engineering-fly-out-toc)
- [CSS - Styling a web page low level abstraction.](#css---styling-a-web-page-low-level-abstraction)
  - [CSS selectors](#css-selectors)
- [Bootstrap - A higher level abstraction over css.](#bootstrap---a-higher-level-abstraction-over-css)
- [Other resources](#other-resources)

<!-- vim-markdown-toc-end -->

## Script Injection

### Bookmarklets

Turns out you can stick javascript in the address bar, that's a bookmarklet. Here it is from the [way back machine](http://ig2600.blogspot.com/2012/05/assembly-to-javascript-tsrs-to.html))

### Grease Monkey - User Script loader

Called Taper Monkey for chrome, it auto loads a script when you enter a webpage. Useful to personalize websites via css and javascript.

I'm not sure the differences, but I use [Voilent Monkey](https://violentmonkey.github.io/) now.

## Console Tricks

### Load Jquery

You almost always want jquery to play

```
var jq = document.createElement('script');
jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
// ... give time for script to load, then type (or see below for non wait option)
jQuery.noConflict();
```

### Speed up video playback

```
document.querySelector("video").playbackRate = 1.25
document.querySelector("video").play()
document.querySelector("video").pause()
```

## Debugging 101

### Chrome Keyboard shortcuts

https://developers.google.com/web/tools/chrome-devtools/shortcuts

| Key   | Command                       |
| ----- | ----------------------------- |
| C-S-I | Enter dev tools               |
| C-S-M | Toggle Mobile Emulator        |
| C-S-R | Hard reload (breaking cache)  |
| C-S-P | Command Palette (super cool) |

### Force reloading

Often needed for CSS -

- A) C-S-R
- Network Tab -> Disable caching

### Capturing an object for later use

Often there's a useful object, that's only available in the closure. You can always assign a reference on window e.g.

    window.foo = foo_from_within_a_closure_found_from_debugging

### Black boxing

### Event Handlers

### Chrome local overrides

Allows you to save a local copy of the source files for editing. To use

How to use:

- Goto Sources -> Page
- Find your file, right click and save to overrides

Now you can edit your file to your hearts content

## Real life examples

### Download the Alexa sound recording

Goto page:

https://www.amazon.com/hz/mycd/myx/#/home/alexaPrivacy/activityHistory&custom&1388538769000&1587497019949

Turns out there are audio elements on the page

    $("audio")

Normally, the src attribute in the src element would have a src element, which is does not:

    <audio id="audio-A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1">
        <source id="audioSource-A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1"/>
    </audio>

However, when you click on the play button src attribute appears on the source element:

    <audio id="audio-A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1">
        <source id="audioSource-A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1"
        src="https://www.amazon.com/hz/mycd/playOption?id=A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1">
    </audio>

And luckily, the "src" is encoding in the audio source id. Let's pull those out:

       https://www.amazon.com/hz/mycd/playOption?id=

So

    $("audio source").each((i,e)=> console.log($(e).attr("id").replace("audioSource-","")))

And lets prepend the download URL

       https://www.amazon.com/hz/mycd/playOption?id=A3S5BH2HU6VAYF:1.0/2020/04/21/19/G090LF1175130LD2/23:09::TNIH_2V.252ac310-314c-48e4-b433-749bdb9e8b5eZXV/0

       <audio
       id="audio-A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1"
       >
       <source
       id="audioSource-                                  A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1"
       src="https://www.amazon.com/hz/mycd/playOption?id=A32DOYMUN6DTXA:1.0/2020/04/21/14/G090U61091621908/08:16::TNIH_2V.4f0562e5-aff9-48a1-868a-85aa77aac07aZXV/1"
       />
       </audio>

#### Putting it all together.

This is gobboldy gook for most folks, but useful for me to look up later:

    let playerPrefix = "https://www.amazon.com/hz/mycd/playOption?id="
    function dumpClips() {
        // For every  entry in the list
        $(".mainBox").each((i,e)=> {
            var audio_src =  $(e).find("audio source").attr("id").replace("audioSource-","");
            console.log(playerPrefix+audio_src);
            var timeLoc  =  $(e).find(".subInfo").get(0)
            if (timeLoc)
            {
                console.log(timeLoc.textContent.trim())
            }
            var textElem  =  $(e).find(".summaryCss").get(0)
            if (textElem)
            {
                var text = textElem.textContent.trim()
                console.log(text);
            }
            else
            {
                // console.log("Text not found", e)
            }
        })
    }

    function everyTick() {
        dumpClips()
        $("#nextButton").click()
    }

    setInterval(everyTick, 5*1000)

#### Red herrings - but good approaches

Red Herring: Look at source

You could go looking for the code, but don't bother it's minified and not required as you can easily execute the code, and interact with the results. However, if you want to chase this path

1. Look at what code is downloaded from network and sources tab.
2. Prettify source code
3. Add breakpoints on source code, or DOM modification events, or callbacks like keyboard or mouse.

Red Herring: Play button doesn't appear till you open the chevrons:

    $(".fa-angle-down").click()

Red Herring: Audio src doesn't appear till you click the play button:

    $(".playButton").click()

Red Herring: Search for a handy JSON blob.

If you're lucky the JS downloads a data blob, you can check this by going to the network view, and searching for what you're looking for. In this case, a partial html page was downloaded, which is harder to parse then the DOM (which you can search via JQuery)

### Automating todo item creation in omnifocus for web

**Too painful - got into some react/redux sync model, gave up**

Ominfocus doesn't support APIs, so we need to automate the web.

In omnifocus, you can add a task by pressing the 'c' key, which brings up a dialog. We can "hook that", by setting a breakpoint on global keypress events.

From there, we get into a closure that has an interesting object. Copy that to global scope.

### Screen Size Previews

https://www.duplichecker.com/screen-resolution-simulator.php#

### Open graph preview Facebook

https://developers.facebook.com/tools/debug/

### Web Site Preview Debugger

https://metatags.io/

### Kindle Cloud Reader

I own **lots** of kindle books, and it's annoying I can't access them the way I want. I took a look at Kindle Cloud Reader to see if there was a way to get my Kindle Books as HTML.

This was pretty challenging, here's what I found:

The cloud reader keeps an iframe containing a subset of the book. You can use jquery to extract the content of the iFrame, **BUT** only a subset of the book is in memory.

If you look in the network panel, you can see individual fragments being downloaded, which is triggered by clicking next or previous page after a few pages. The fragments are used to load/maintain the fragments.

In theory if we can download all fragments you can load the whole book into the iFrame. This was much easier said then done as the code was obfuscicated, and that broke lots of the normal chrome debugging tools.

I found a a global logging object, I connected it to console.log to see what developers see.

> KindleDebug.log = console.log

I then spent a bunch of time try to figure out where the fragments were getting selected. It was super hard due to the anti-debugging measures. Finally I found:

> loadNextPages()
> loadFragmentsForRange()

I realized I can change the position range for loadFragmentsForRange(). Changing it didn't always result in more content in the iFrame, so I needed a way to automate it. In theory I could change the obfucated source code, but Chrome's workspace/local copy wasn't working (not sure why), so I used a logpoint (a breakpoint that logs) to modify the fragment range. With this, it worked!

Hooray.

## Fly out TOC

I started by trying to create this myself, but as with most "build" vs "buy", you're better off stealing and buying. Looks like this exists in:

### CSS

- Foundation - called [magellon](https://get.foundation/sites/docs/magellan.html)
- Bootstrap - called [scroll spy](https://getbootstrap.com/docs/4.4/components/scrollspy/)

### Javascript Reverse Engineering Fly out TOC

Looks like the CSS needs to have the data setup correctly. I found some javascript to do this in [hackmd](https://github.com/hackmdio/codimd/search?q=generateToc&unscoped_q=generateToc), and started putzing with it. Looks like that gets me the DOM in the form I need.

## CSS - Styling a web page low level abstraction.

CSS is stying for the web. CSS is very complex. I recommend using a higher level framework like Bootstrap in general, however abstractions are leaky so you also need to understand some core CSS concepts.

### CSS selectors

I always forget these, but it matters as that's how you select elements in jquery

A full [summary](https://www.w3schools.com/cssref/css_selectors.asp), below are some I often use.

- \$(.class)
- \$(#id)
- \$(element) #e.g. h1

When nesting selectors here are the [operators](https://techbrij.com/css-selector-adjacent-child-sibling)

- space - descendant at any level
- > - immediate descendant
- - - Adjacent (e.g. sibling)
- ~ - Not Adjacent (e.g. not sibling)

## Bootstrap - A higher level abstraction over css.

If you're using styles directly, you're probably doing it wrong. Bootstrap is designed to handle different operations at different view ports, very helpful.
For example, you can hide an element if you're not on an extra large screen.

## Other resources
