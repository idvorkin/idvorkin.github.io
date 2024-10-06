---
layout: post
title: The Mystery of the google ads
permalink: /adblocker-trojan
---

Out of the blue I started seeing ads in my google search. They were especially prominent due to the fact they were white, and I use a back background. It was caused by a trojan running in my chrome extension, which I suspect was installed by a name-jacked NPM plugin.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Impact and blast radius](#impact-and-blast-radius)
    - [Did happen when ...](#did-happen-when-)
    - [Did not happen  when ...](#did-not-happen--when-)
- [Detection](#detection)
    - [Debugging](#debugging)
- [Mitigation](#mitigation)
- [Root Causing and hypothesis](#root-causing-and-hypothesis)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Impact and blast radius

Out of the blue I started seeing ads in my google search. They were especially prominent due to the fact they were white, and I use a back background

### Did happen when ...

- In private mode
- Disabling plugins
- Close and reboot chrome

### Did not happen when ...

- Using edge
- Using another user profile in chrome

## Detection

### Debugging

- I inspected the page, and saw the ads were in an iframe, being loaded from bing.com
- The iframe was from `findsingl.com`, but I could find no results for that.
- I went to the network tab, and observed network requests
- I enabled 'path','host' and 'initiator', to see where someone was doing an odd call
- I saw a network request from a chrome extension (recall disabled), to `reppoflag.net`
- Searching the web, I found [reppoflag was a trojan, associated with ad blockers](https://support.google.com/chrome/thread/75968285/trojan-warning-reppoflag-net?hl=en)
- The 'initiator' field allowed me to click and see which code was making the request
- I saw a "GUID", which I'm not sure how I determined was the extension

## Mitigation

- I uninstalled all plugins (though will likely re-install some of them)
- Everything was good.
- Now, I wonder if other things are compromised.

## Root Causing and hypothesis

I'm not sure this happened, but my guess:

- I had a common chrome extension installed (uBlock)
- I installed and ran a brand jacked NPM package (e.g npx run browser-pack, instead of npx run web-browser-pack).
- The package modified the extension on disk (I didn't verify, just guessing :( )
- When my web page ran, the malicious extension ran, and loaded ads.

More details from [Malware can edit the chrome binary, or extensions, with a loader](https://www.microsoft.com/security/blog/2020/12/10/widespread-malware-campaign-seeks-to-silently-inject-ads-into-search-results-affects-multiple-browsers/):

_We call this family of browser modifiers Adrozek. If not detected and blocked, Adrozek adds browser extensions, modifies a specific DLL per target browser, and changes browser settings to insert additional, unauthorized ads into web pages, often on top of legitimate ads from search engines. The intended effect is for users, searching for certain keywords, to inadvertently click on these malware-inserted ads, which lead to affiliated pages. The attackers earn through affiliate advertising programs, which pay by amount of traffic referred to sponsored affiliated pages._

_The malware makes changes to certain browser extensions. On Google Chrome, the malware typically modifies “Chrome Media Router”, one of the browser’s default extensions, but we have seen it use different extensions._

_The malware also tampers with certain browser DLLs. For instance, on Microsoft Edge, it modifies MsEdge.dll to turn off security controls that are crucial for detecting any changes in the Secure Preferences file._

While web searches mentioned [ad blockers were compromised](https://www.imperva.com/blog/the-ad-blocker-that-injects-ads/), there was no evidence that [uBlock](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en) was.

I wondered if something edited the uBlock extension on disk. Turns out NPM packages are "brand jacked" by making [NPM extension](https://blog.sonatype.com/open-source-attacks-on-the-rise-top-8-malicious-packages-found-in-npm) with a similar name.

_These mimicked the legitimate NodeJS-based database libraries, including jdb and db-json, but downloaded the malicious njRAT aka Bladabindi onto the user’s system._

Here's a deep dive into how sophisticated the [attack can be](https://blog.sonatype.com/bladabindi-njrat-rat-in-jdb.js-npm-malware).
