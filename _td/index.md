# Igor's Technical Diary

## Projects

- Major Research Areas and Musing
  - [Cloud first applications](notes/cloud-first-applications.md)
  - [Machine Learning](notes/machine-learning.md)
  - [Security](notes/better-security-design.md)
  - [Data Systems](notes/data-systems.md)
  - [In Real Life](notes/irl.md)
  - [Design and Architecture](notes/design.md)
  - [How to be an iOS only developer](notes/ios-nomad.md)
  - [Hacking the web for fun and profit](notes/hack-web.md)
- Minor Tips
  - [VLC Player](notes/vlc_player.md)
  - [Pandas](notes/pandas-tutorial.md)
  - [iOS Usage](notes/ios.md)
  - [Mosh](notes/mosh.md)
  - [USB Tech](notes/usbtech.md)
  - [Visual Vocabulary](notes/visual-vocabulary.md)
- Complete Projects
  - [Ring Video Downloader](notes/ring-video-download.md)
  - [Extract message history on OSX](notes/dump_imessage_history.md)
- In Progress Projects
  - [Deploy a private web site](notes/private_web_site.md)
  - [Windows Virtual Desktop](notes/virtual-desktops.md)
  - [Alexa Skill](notes/alexa-skill.md)
  - [ManageMe](https://github.com/idvorkin/manage-me)

## Awesome Lists

<!--
Not using prettier ignore gaurds as vimtoc gets confused here.
-->
<!-- vim-markdown-toc GFM -->

- [Markdown](#markdown)
- [VIM](#vim)
- [C Sharp](#c-sharp)
- [Java](#java)
- [Python](#python)
- [Typescript](#typescript)
- [Apple](#apple)
- [Home Automation](#home-automation)
- [Powershell](#powershell)
- [Text manipulation tools](#text-manipulation-tools)
  - [jq](#jq)
- [Cool shell tools](#cool-shell-tools)
- [Natural Language Processing](#natural-language-processing)
- [Azure One Liners](#azure-one-liners)
  - [Deploy webapp via git checkin](#deploy-webapp-via-git-checkin)
- [git](#git)
- [GitHub](#github)
- [SSH](#ssh)
- [TMUX](#tmux)
- [Random 1-liners](#random-1-liners)
- [App Launchers](#app-launchers)
- [Chrome extensions](#chrome-extensions)
- [Web tools (http)](#web-tools-http)
  - [http-prompt](#http-prompt)
  - [httpie](#httpie)
  - [Link Checkers](#link-checkers)
- [Video Manipulation Tools](#video-manipulation-tools)
- [Linters and formatters](#linters-and-formatters)
- [Switching between Unix and DOS file ending](#switching-between-unix-and-dos-file-ending)
- [Spelling](#spelling)
- [Web scripting](#web-scripting)
- [Programming Helpers](#programming-helpers)
  - [howdoi](#howdoi)
- [PlantUML alternatives](#plantuml-alternatives)
- [PlantUML](#plantuml)
  - [PlantUML Tools](#plantuml-tools)
  - [PlantUML in Markdown](#plantuml-in-markdown)
  - [Quirks](#quirks)
- [Windows Managers](#windows-managers)
- [CLI Screen Recoding](#cli-screen-recoding)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc -->

### Markdown

- Typora
- Visual Studio Code
- Macdown

### VIM

- Denite
- Fugitive

### C Sharp

### Java

- Lambok

### Python

- Hug: Python API generator
- Httpie: wget replacement
- Pendulum: The best datetime library (better then arrow).
- PipEnv - Finally sane dependency management for python!
- [Datalore](https://datalore.io/) - Jetbrain's version of Jupyter
- [Requests](http://docs.python-requests.org/en/master/) Http requests for humans
- [Requests-HTML](https://github.com/kennethreitz/requests-html) Web Parsing for humans
- [Scapy](https://scrapy.org/) Web crawling for humans.
- [Records](https://github.com/kennethreitz/records) Raw SQL for humans
- [Delegator](https://github.com/kennethreitz/delegator.py) Sub process for humans
- Pylinkvalidator - Crawl a web site for errors (great for web testing)

### Typescript

- [Quick Type](https://quicktype.io/?l=cs&r=json2csharp) Create classes from JSON

### Apple

- Copy files **without** iTunes - [CopyTrans Manager](https://www.copytrans.net/copytransmanager/)

### Home Automation

- Bridge from HomeKit to Wink - [Homebridge-wink3](https://github.com/sibartlett/homebridge-wink3)

### Powershell

### Text manipulation tools

- XPath and HtmlAgilityPack
- Regexp + VIM
- Beautiful soup

#### jq

jq is the JavaScript equivalent of regexp
I'm very enamored with it!

By default it colorizes:

    cat x.json | jq

It has funny escaping syntax - so I'll list out some recipes. Notice the specific of dots open brackets and quote types. They matter.
Select every object in the array and string interpolates out object elements of name defaultHostName and appServicePlanId

    cat x.json | jq '.[] | "\(.defaultHostName) \(.appServicePlanId) "'

Read the Algolia key from my secretBox

    cat ~/gits/igor2/secretBox.json | jq '.AlgoliaKey'

List AWS lightsail properties

    saws> aws lightsail get-instances  | jq '.instances[] | .name, .state.name, .publicIpAddress'
    "Amazon_Linux-1GB-Oregon-1"
    "running"
    "54.190.183.299"

### Cool shell tools

Decent blog posts:

    https://remysharp.com/2018/08/23/cli-improved

- Tig - TUI git like git GUI/gitk (Try tig status)
- Mosh - A better ssh
- w3m - Text based web browser
- fzf - Fuzzy file finder (Try C-R and C-T)
- Rg - RipGrep (like ag)
- [linuxbrew](http://linuxbrew.sh/) - Brew for Linux
- Ngrok - Pipe ports to the internet web site (great for local host development on iOS)
- [Bat](https://github.com/sharkdp/bat) - cat but with paging/git integration.
- Pretty ping - Graphical Ping
- glances - Prettier Top
- iftop - Network based top based on network connection
- nethogs - Network based top based on process
- [fd](https://github.com/sharkdp/fd) - Better find/recurse. (fd "regexp")

### Natural Language Processing

- Rant - a cool c# human [language generator](http://berkin.me/rant/)
- Rhymebrain -
- Tranquil
- [Sentiment Analysis](notes/sentiment_analysis.md)

### Azure One Liners

#### Deploy webapp via git checkin

https://docs.microsoft.com/en-us/azure/app-service/deploy-local-git

1. Create the git credentials to deploy which gives a new git repository.
2. Add a git remote
3. Push to the git remote

### git

npx add-gitignore - update gitignore files

Find when text is [deleted](https://stackoverflow.com/questions/12591247/find-when-line-was-deleted/43463653):

```
# ignore the path if you don't know it.
git log -c -S'missingtext' /path/to/file
```

[Diff so fancy](https://github.com/so-fancy/diff-so-fancy) - a very nice diff

My original [git tricks](https://ig2600.blogspot.com/2014/10/cool-tools-git-helpers.html) from 2014 :)

[Git stats](https://github.com/arzzen/git-quick-stats)

### GitHub

- Serve HTML files directly from GitHub: https://rawgit.com/idvorkin/linqpadsnippets/master/js/DetectBackButton.html
- Keyboard shortcuts: https://help.github.com/articles/using-keyboard-shortcuts/
- Grip - Local renders of GHFM https://github.com/joeyespo/grip
- hub a better git client that understands everything comes from github

### SSH

Exit the ssh session (very helpful when stuck in a nested tmux session.

    <enter> ~ .

Get help on the in built console

    <enter>  ~ ?

List forwarded ports

    <enter>  ~ #

Connect on 8889 will get redirected to 8888 on the remote_host.

    # Connections on 4444 will get redirected to 8888 on the remote_host.
    ssh -N -L localhost:8888:localhost:4444 remote_user@remote_host

Use a tool to auto re-connect (MOSH should do this, but it's been flaky for me of late)

    autossh -M 0 server

For my memory here are the many ports I forward, which you can also configure in your [ssh config](https://github.com/idvorkin/Settings/blob/master/shared/ssh_config)

```
# jupyter
ssh -N -L localhost:8888:localhost:8888 lightsail

# jekyll
ssh -N -L localhost:4000:localhost:4000 lightsail

# jekyll live reload
ssh -N -L localhost:35729:localhost:35729 lightsail

# grip
ssh -N -L localhost:6419:localhost:6419 lightsail
```

### TMUX

This is so hard for me to remember:

Install tmuxp to re-create sessions.
Look at my config to see how to setup vi mode
Look at tmux plugin manager

https://gist.github.com/MohamedAlaa/2961058

- C-A w - See all windows and sessions.
- C-A \$ - rename session
- C-A , - rename windows
- C-A % - split left right
- C-A " - split top bottom
- C-A q - show pane #
- C-A <arrow> navigate panes
- C-A ? - list shortcuts (then search using / )
- C-A swap-window -t -1 -- Move window to the left
- C-A swap-window -t 0 -- Move window to the front
- C-A x - kill-pane

Tmux command line

Re-attach to current session

    tmux attach

Force resize to current terminal size while reattaching

    tmux attach -d

### Random 1-liners

Clean up dead MOSH instances

    kill $(ps --no-headers --sort=start_time -C mosh-server -o pid | head -n -1)

zsh path append

    path+="/my/new/path"

### App Launchers

- Alfred on OSX
- WoX on Windows + (switcheroo to switch windows) [win - app name]

### Chrome extensions

- Hibernate unused tabs [The great suspender](https://chrome.google.com/webstore/detail/the-great-suspender/klbibkeccnjlkjkiokjodocebajanakg?hl=en)
- Close unused tabs [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall?hl=en)
- Vim based web [Vimium](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en)
- Vim in any text box [Wasavi](https://chrome.google.com/webstore/detail/wasavi/dgogifpkoilgiofhhhodbodcfgomelhe)
- Speed up YouTube playback via keyboard shortcut [YouTube playback speed control](https://chrome.google.com/webstore/detail/youtube-playback-speed-co/hdannnflhlmdablckfkjpleikpphncik)
- Fail to load dinosaur - Not an extension but you can play a little game with the dinosaur by pressing <space> on the chrome dinosaur
- Custom searchh engines are cool. You can use them for search sites you frequently use. For example my github repo and my blog:

  ghtd: https://github.com/search?l=&q=%s+user%3Aidvorkin&type=Code&s=indexed
  ig: https://www.idvork.in/index.html?q=%s

### Web tools (http)

#### http-prompt

An interactive [http prompt](http://http-prompt.com/)

#### httpie

httpie is like wget and curl, but easier to use.

Here's an example of sending content to a web hook which would send a message to chime. Notice -pHBhb prints request response, and Content is a JSON field.

    http -pHBhb POST https://hooks.chime.aws/incomingwebhooks/botaddress -- Content=We love PMs

#### Link Checkers

You'd think there would be a slew of these, but all the ones I tried weren't great (can't limit recurse depth, don't group errors, etc). I'm using [bcl](https://github.com/stevenvachon/broken-link-checker) right now, but would love a good alternative.

Using BLC I crawl my website using (-r recurse ; -o group output; -e skip external):

        blc http://idvork.in/d -roe

### Video Manipulation Tools

Decent cross plat video editors.

- [OpenShot](https://www.openshot.org/) - Video editor with good splicing.
- [Lossless cutting](https://github.com/mifi/lossless-cut) - A tool to make lossless cuts.

ffmpeg recipes:

Convert video formats

    ffmpeg -i in.mov -qscale 0 -out.mp4

Trimming

https://superuser.com/questions/138331/using-ffmpeg-to-cut-up-video As other people mentioned, putting -ss before (much faster) or after (more accurate) the -i makes a big difference. The section "Fast And Accurate Seeking" on the ffmpeg seek page tells you how to get both, and I have used it, and it makes a big difference. Basically you put -ss before AND after the -i, just make sure to leave enough time before where you want to start cutting to have another key frame. Example: If you want to make a 1-minute clip, from 9min0sec to 10min 0sec in Video.mp4, you could do it both quickly and accurately using:

    ffmpeg -ss 00:08:00 -i Video.mp4 -ss 00:01:00 -t 00:01:00 -c copy VideoClip.mp4

The first -ss seeks fast to (approximately) 8min0sec, and then the second -ss seeks accurately to 9min0sec, and the -t 00:01:00 takes out a 1min0sec clip. -c copy doesn't re-transcode so faster, but has problems since needs key frames.

    ffmpeg -ss 00:08:00 -i $infile -ss 00:01:00 -t 00:01:00 -c copy $outfile

Video To Gif on iOS

On github, it's common to share an inline view of a [repro](https://github.com/mzlogin/vim-markdown-toc/issues/62). A great way to do that is to make a gif of the issue. To do that on iOS you need to do do a screen recording, and then save that to a gif. I used GifMaker, seems good engouh.

### Linters and formatters

You know what sucks less then coding standards? Arguing about coding standards. Nothing pains me more then arguing about formatting (and other minutia). As such I love having lint failures being build breaks and including formatting on save. Even better when you have [opinionated](https://stackoverflow.com/questions/802050/what-is-opinionated-software) formatters that don't have options. Sure standards suck, but they suck much less then arguing.

- Front End Stuff - [Prettier](https://prettier.io)
- Python - [Black](https://github.com/ambv/black)

### Switching between Unix and DOS file ending

(https://stackoverflow.com/questions/2466959/git-removing-carriage-returns-from-source-controlled-files)
On windows, when you switch between windows and WSL, you can get your line endings messed up in git.

To have git honor settings in the existing files set:

In: `~.gitconfig` set:

    core.autocrlf=input
    core.safecrlf=false

Sometimes your repository gets screwed up and needs to be fixed. In that case, erase all files, and re checkout.

    #!/bin/sh
    # remove local tree
    git ls-files -z | xargs -0 rm
    # checkout with proper crlf
    git checkout .

Also, can set a single file in vim by settings `set ff=unix`

### Spelling

Command line spelling. Ispell has nicer word highlighting, but aspell is supposed to have better spelling correction.

aspell
ispell

(Bragging - I fixed aspell highlighting in WSL)
https://github.com/GNUAspell/aspell/issues/590
https://github.com/Homebrew/homebrew-core/pull/48163

### Web scripting

I like to watch YouTube (engineering documentaries) before bed, and need a sleep timer. JS will let you close a windows you opened, so this script opens a new window to watch YouTube in for an hour.

```
// Open in another window so I have perms to close it
var customWindow = window.open('https://youtube.com', '_blank', '');
// Close tab in 2 hours
setTimeout(()=>customWindow.close(),1000*60*120)

```

### Programming Helpers

#### howdoi

A quick [tool](https://github.com/gleitz/howdoi) to show you how to 'spell' your task in language of choice.

    > howdoi do time to minutes in python

    import datetime as DT
    t1 = DT.datetime.strptime('00:05:36.0100000', '%H:%M:%S.%f0')
    t2 = DT.datetime(1900,1,1)

    print((t1-t2).total_seconds() / 60.0)

### PlantUML alternatives

Huh, turns out there are lots (for UML and graphicing, etc). Read the list here, I haven't played with them yet:

https://hackmd.io/features#UML-Diagrams

### PlantUML

#### PlantUML Tools

- [PlantText](https://www.planttext.com/) Interactive editor with vi-keybindings, but needs a manual refresh
- [LiveUML](https://liveuml.com/) - Interactive editor with auto-refresh
- VS Code has a great plugin for PlantUML
- Vim has a PlantUML preview in ASCII

#### PlantUML in Markdown

You can't directly render PlantUML in Markdown, but you can render images, and get PlantUML to load content from file. E.g:

    http://www.plantuml.com/plantuml/proxy?idx=0&format=svg&src=**URL_with_uml_file**&cache_buster=**increment_to_avoid_caching**

Store your PlantUML file somewhere - e.g.

    [https://raw.github.com/idvorkin/techdiary/master/sample_diagrams.puml](https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml)

Then render it like an image e.g.

    ![UML rendered](http://www.plantuml.com/plantuml/proxy?idx=0&format=svg&src=https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml&c=1)

![UML rendered](http://www.plantuml.com/plantuml/proxy?idx=0&format=svg&c=4&src=https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml)

#### Quirks

- GitHub caches, so increment the c parameter
- PlantUML doesn't support https (really??) so the PlantUML server URL needs to be **http** (not https).
- The image URL uses http, and VS Code preview doesn't allow loading things over http by default, so click that 'insecure content' button to allow rendering in unsafe mode (ugh)

### Windows Managers

Tools that let you re-tile

- OSX - Magnets
- Windows - Windows Power Toys - [FancyZones](https://github.com/microsoft/PowerToys)

### CLI Screen Recoding

OK, this is a 2 putter: First run [asciinema](https://github.com/asciinema/asciinema), then [svgterm](https://github.com/marionebl/svg-term-cli)

```
asciinema rec foo.cast
# records till you hit C-D  (curious how that works)
cat foo.cast | svg-term --out foo.svg
# Copy out your svg file
```

![inamged image](https://raw.githubusercontent.com/idvorkin/techdiary/master/images/demo-cli-screen-recording.svg?sanitize=true)

_(Note, to include an svg from raw.githubusercontent.com/blah.svg you'll need to add blah.svg?sanatize=true)_

### Other Resources

Good list of [tools](https://github.com/Kikobeats/awesome-cli/blob/master/README.md)
