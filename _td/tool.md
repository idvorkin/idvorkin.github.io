---
layout: post
title: Igor's Tech, Tricks, and Tools
permalink: /tools
redirect-from:
  - /cli
  - /tool
---

A collection of tips, tricks and pointers of the various tools i use

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Major Research and Project List](#major-research-and-project-list)
- [Modern Unix](#modern-unix)
- [Build your own X](#build-your-own-x)
- [Markdown](#markdown)
- [VIM](#vim)
- [C Sharp](#c-sharp)
- [Java](#java)
- [Python](#python)
- [Typescript](#typescript)
- [Apple](#apple)
- [Home Automation](#home-automation)
- [Text manipulation tools](#text-manipulation-tools)
    - [jq](#jq)
    - [Pup - regexp For HTML](#pup---regexp-for-html)
- [Cool shell tools](#cool-shell-tools)
- [Process Monitoring](#process-monitoring)
- [Natural Language Processing](#natural-language-processing)
- [Azure One Liners](#azure-one-liners)
    - [Deploy webapp via git checkin](#deploy-webapp-via-git-checkin)
- [git](#git)
    - [Colorized Diff - delta](#colorized-diff---delta)
    - [TUI Client - lazygit/tig](#tui-client---lazygittig)
    - [Git Stats](#git-stats)
    - [TUI merge - fac](#tui-merge---fac)
    - [Re-write history](#re-write-history)
- [GitHub](#github)
- [SSH](#ssh)
- [TMUX](#tmux)
- [Random 1-liners](#random-1-liners)
- [App Launchers](#app-launchers)
- [Chrome extensions](#chrome-extensions)
- [Web tools (http)](#web-tools-http)
    - [wuzz](#wuzz)
    - [httplab](#httplab)
    - [httpie](#httpie)
    - [httpprompt](#httpprompt)
    - [Link Checkers](#link-checkers)
    - [brow.sh - Text based web browser](#browsh---text-based-web-browser)
    - [w3m - Text based web browser](#w3m---text-based-web-browser)
- [Video Manipulation Tools](#video-manipulation-tools)
- [Linters and formatters](#linters-and-formatters)
- [Switching between Unix and DOS file ending](#switching-between-unix-and-dos-file-ending)
- [Spelling](#spelling)
- [Web scripting](#web-scripting)
- [Document conversion - Pandoc](#document-conversion---pandoc)
- [Programming Helpers](#programming-helpers)
    - [howdoi](#howdoi)
- [Excalidraw](#excalidraw)
- [PlantUML alternatives](#plantuml-alternatives)
- [D2](#d2)
- [PlantUML](#plantuml)
    - [PlantUML Tools](#plantuml-tools)
    - [PlantUML in Markdown](#plantuml-in-markdown)
    - [Inline plantuml via Gravizo](#inline-plantuml-via-gravizo)
    - [Quirks](#quirks)
- [Windows Managers](#windows-managers)
- [ClI Fun](#cli-fun)
- [CLI Screen Recoding](#cli-screen-recoding)
    - [Show pressed keys](#show-pressed-keys)
- [Docker](#docker)
- [Terminal Info](#terminal-info)
- [OBS](#obs)
- [OSX](#osx)
- [Obsidian](#obsidian)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

### Major Research and Project List

My various [projects and research](/td)

### Modern Unix

Over time, I collected many of the tools below, but now this github project collects them all:

[Modern Unix](https://github.com/ibraheemdev/modern-unix)

### Build your own X

[What I can create, I can not understand](https://github.com/danistefanovic/build-your-own-x)

A very cool index of tutorial to build your own everything

### Markdown

- Typora
- Visual Studio Code
- Macdown

### VIM

- Denite
- Fugitive
- Support [italics in vim in Tmux](https://rsapkf.netlify.com/blog/enabling-italics-vim-tmux)

### C Sharp

### Java

- Lambok

### Python

- [Records](https://github.com/kennethreitz/records) Raw SQL for humans
- [Delegator](https://github.com/kennethreitz/delegator.py) Sub process for humans

Web:

- Httpie: wget replacement
- Beautiful Soup - JQuery like parsing
- Pylinkvalidator - Crawl a web site for errors (great for web testing)
- Hug: Python API generator
- Pendulum: The best datetime library (better then arrow).
- [Requests](https://docs.python-requests.org/en/master/) Http requests for humans
- [Requests-HTML](https://github.com/kennethreitz/requests-html) Web Parsing for humans
- [Scapy](https://scrapy.org/) Web crawling for humans.

Language and Syntax:

- attribs - Clean classes with less boiler plate

Tools:

- PipEnv - Finally sane dependency management for python!
- [Datalore](https://datalore.io/) - Jetbrains's version of Jupyter

CLI:

- typer - Very nice command line too based on type arguments
- rich - Nice TUI output

Debugging:

- [Ice Cream](https://github.com/gruns/icecream) Simpler printf debugging.
- pudb - Python Debugger
- bpython - Python Interpreter (nice GUI, but no VI)
- loguru - Output pretty exception messages with a single type annotation

Examples:

- Parsing a web page, with nice debugging and cli tooling ([Eulogy Parser](https://github.com/idvorkin/idvorkin.github.io/blob/master/eulogy_to_json.py#L5))

Profiling:

- Tuna - Profile viewer <https://github.com/nschloe/tuna>
- importime
  python -X importtime yourfile.py 2> import.log
- Profiling code
  python -mcProfile -o program.prof yourfile.py

### Typescript

- [Quick Type](https://quicktype.io/?l=cs&r=json2csharp) Create classes from JSON

### Apple

- Copy files **without** iTunes - [CopyTrans Manager](https://www.copytrans.net/copytransmanager/)
- Tips and tricks for [iOS](/td/ios)
- How to be an [iPad nomad](/td/ios-nomad)

### Home Automation

- Bridge from HomeKit to Wink - [Homebridge-wink3](https://github.com/sibartlett/homebridge-wink3)

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

#### Pup - regexp For HTML

Combined with sed and xargs you can do some crazy stuff. In this below case I take a webpage that contains a single a element, find its href, replace a X Summary with Text Summary and download it. Woah!

    curl $src  | pup 'a attr{href}' | sed -e "s/ \w\+ Summary/ Text Summary/"  | xargs -I {} wget '{}'

### Cool shell tools

- Mosh - A better ssh (I no longer recommend)
- fzf - Fuzzy file finder (Try C-R and C-T)
- Rg - RipGrep (like ag)
- [linuxbrew](https://linuxbrew.sh/) - Brew for Linux
- Ngrok - Pipe ports to the internet web site (great for local host development on iOS)
- [Bat](https://github.com/sharkdp/bat) - cat but with paging/git integration.
- Pretty ping - Graphical Ping
- [fd](https://github.com/sharkdp/fd) - Better find/recurse. (fd "regexp")
- [jless](https://github.com/PaulJuliusMartinez/jless) A less for json, vim like keybindgs
- [csview](https://github.com/wfxr/csview) A less for csv

### Process Monitoring

- glances - Prettier Top
- iftop - Network based top based on network connection
- nethogs - Network based top based on process
- htop - Works everywhere
- gotop - More graphical

### Natural Language Processing

- Rant - a cool c# human [language generator](https://berkin.me/rant/)
- Rhymebrain -
- Tranquil
- [Sentiment Analysis](/nlp)

### Azure One Liners

#### Deploy webapp via git checkin

<https://docs.microsoft.com/en-us/azure/app-service/deploy-local-git>

1. Create the git credentials to deploy which gives a new git repository.
2. Add a git remote
3. Push to the git remote

### git

npx add-gitignore - update gitignore files

Find when text is [deleted](https://stackoverflow.com/questions/12591247/find-when-line-was-deleted/43463653):

```bash
# ignore the path if you don't know it.
git log -c -S'missingtext' /path/to/file
```

#### Colorized Diff - delta

[Delta](https://github.com/dandavison/delta)

NOTE: Before this I used [Diff so fancy](https://github.com/so-fancy/diff-so-fancy), but Delta looks better.

My original [git tricks](https://ig2600.blogspot.com/2014/10/cool-tools-git-helpers.html) from 2014 :)

#### TUI Client - lazygit/tig

Alternate [TUI to tig](https://github.com/jesseduffield/lazygit)

The TUI clone of git gui - my day to day [git interface](https://jonas.github.io/tig/).

#### Git Stats

[Git stats](https://github.com/arzzen/git-quick-stats)

Or my own favorite, file stat changes in a date range, which I [coded up in zsh](https://github.com/idvorkin/Settings/commit/6271f383995ecd95405c11193213ea5b2da5e083):

```vim
function gstatdaterange() {
    # $1 - start
    # $2 - end
    # can be days ago
    # glogdate '30 days ago' '1 day ago'
    # or absolute dates
    # glogdate '12/01/2020'

    # output all git commits since until, pretty print to just have the commit
    git_output=`git log --since "$1" --until "$2" --pretty="%H"`

    # diff between first commit to last commit, and sort the output by size
    #sort params -k=second column; -t=with delimiter as |; -n=sort as numeric -r sort as reversed
    git diff --stat `echo $git_output | tail -n 1` `echo $git_output | head -n 1` |  sort -k2 -t'|' -n -r
}
```

#### TUI merge - fac

TUI [merge tool](https://github.com/mkchoi212/fac)

#### Re-write history

Go back a few commits, and then make the new commits 1 by 1. Quite simple, just be careful about re-writing history someone else has also edited

    git reset --soft HEAD~[n]
    git commit

### GitHub

- Serve HTML files directly from GitHub: <https://rawgit.com/idvorkin/linqpadsnippets/master/js/DetectBackButton.html>
- Keyboard shortcuts: <https://help.github.com/articles/using-keyboard-shortcuts/>
- Grip - Local renders of GHFM <https://github.com/joeyespo/grip>
- hub a better git client that understands everything comes from github
- [Search all commits by author and day](https://github.com/search?q=user%3Aidvorkin+author-date%3A2020-06-20+author%3Aidvorkin)
- [See diff (w/all changes) between dates](https://github.com/idvorkin/idvorkin.github.io/compare/master@%7B1day%7D...master)
- A cool feature of hub is can open the file/line in github - Pretty helpful when you're working in an editor and on a [file/line](https://github.com/idvorkin/Settings/blob/97e9ea51e4ce4b0ce98123900c07fd76836b7bbf/default_vimrc#L913)

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

```bash
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

<https://gist.github.com/MohamedAlaa/2961058>

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

  ghtd: <https://github.com/search?l=&q=%s+user%3Aidvorkin&type=Code&s=indexed>
  ig: <https://www.idvork.in/index.html?q=%s>

### Web tools (http)

#### wuzz

TUI http [debugger](https://github.com/asciimoo/wuzz)

#### httplab

A TUI [http server](https://github.com/gchaincl/httplab) - The oppositve of wuzz.

#### httpie

[httpie](https://httpie.org/) is like wget and curl, but easier to use.

Here's an example of sending content to a web hook which would send a message to chime. Notice -pHBhb prints request response, and Content is a JSON field.

    http -pHBhb POST https://hooks.chime.aws/incomingwebhooks/botaddress -- Content=We love PMs

#### httpprompt

Graphical httpie with [tab completion](https://github.com/eliangcs/http-prompt). It's actually built on httpie

#### Link Checkers

You'd think there would be a slew of these, but all the ones I tried weren't great (can't limit recurse depth, don't group errors, etc). I'm using [bcl](https://github.com/stevenvachon/broken-link-checker) right now, but would love a good alternative.

Using BLC I crawl my website using (-r recurse ; -o group output; -e skip external):

        blc https://idvork.in/d -roe

#### brow.sh - Text based web browser

This looks [pretty cool](https://www.brow.sh/). I had to run it in a container:

    docker run --rm -it browsh/browsh

The keybindings are desktop-esk, which is too bad as they conflict with my terminal bindings. If you try it C-Q gets you out of it, can also run extensions, so I bet you could run vimium in there. Although, your'e going a little crazy at this point

#### w3m - Text based web browser

A text based browser [better then lynx](http://w3m.sourceforge.net/). But,

### Video Manipulation Tools

Decent cross plat video editors.

- [MoviePy](https://github.com/Zulko/moviepy) - Python based video editor scripts
- [OpenShot](https://www.openshot.org/) - Video editor with good splicing.
- [Lossless cutting](https://github.com/mifi/lossless-cut) - A tool to make lossless cuts.

ffmpeg recipes:

Convert video formats

    ffmpeg -i in.mov -qscale 0 -out.mp4

Trimming

<https://superuser.com/questions/138331/using-ffmpeg-to-cut-up-video> As other people mentioned, putting -ss before (much faster) or after (more accurate) the -i makes a big difference. The section "Fast And Accurate Seeking" on the ffmpeg seek page tells you how to get both, and I have used it, and it makes a big difference. Basically you put -ss before AND after the -i, just make sure to leave enough time before where you want to start cutting to have another key frame. Example: If you want to make a 1-minute clip, from 9min0sec to 10min 0sec in Video.mp4, you could do it both quickly and accurately using:

    ffmpeg -ss 00:08:00 -i Video.mp4 -ss 00:01:00 -t 00:01:00 -c copy VideoClip.mp4

The first -ss seeks fast to (approximately) 8min0sec, and then the second -ss seeks accurately to 9min0sec, and the -t 00:01:00 takes out a 1min0sec clip. -c copy doesn't re-transcode so faster, but has problems since needs key frames.

    ffmpeg -ss 00:08:00 -i $infile -ss 00:01:00 -t 00:01:00 -c copy $outfile

Video To Gif on iOS

On github, it's common to share an inline view of a [repro](https://github.com/mzlogin/vim-markdown-toc/issues/62). A great way to do that is to make a gif of the issue. To do that on iOS you need to do do a screen recording, and then save that to a gif. I used GifMaker, seems good enough.

### Linters and formatters

You know what sucks more then coding standards? Arguing about coding standards. Nothing pains me like arguing about formatting (and other minutia).

As such I love having lint failures part of the build process, being auto-fixed, and failing checkin when ignored. [Opinionated](https://stackoverflow.com/questions/802050/what-is-opinionated-software) formatters are even better as you don't need to spend time arguing about which standard to enforce. And yes, all standards suck, but arguing about standards sucks more.

Formatters I like:

- Front End Stuff - [Prettier](https://prettier.io)
- Python - [Black](https://github.com/ambv/black)

And to ensure they are integrated into your work flow, enforce them with

[lint-staged and husky](https://laurieontech.com/posts/husky/). My using it is [here](https://github.com/idvorkin/LinqPadSnippets/blob/55df7b7d269c727ea121cde211252d81f83e2e68/package.json#L25)

### Switching between Unix and DOS file ending

(<https://stackoverflow.com/questions/2466959/git-removing-carriage-returns-from-source-controlled-files>)
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
<https://github.com/GNUAspell/aspell/issues/590>
<https://github.com/Homebrew/homebrew-core/pull/48163>

### Web scripting

I like to watch YouTube (engineering documentaries) before bed, and need a sleep timer. JS will let you close a windows you opened, so this script opens a new window to watch YouTube in for an hour.

```javascript
// Open in another window so I have perms to close it
var customWindow = window.open("https://youtube.com", "_blank", "");
// Close tab in 2 hours
setTimeout(() => customWindow.close(), 1000 * 60 * 120);
```

### Document conversion - Pandoc

HTML to markdown
pandoc x.html -t gfm-raw_html -f html > lawsofpower.md

### Programming Helpers

#### howdoi

A quick [tool](https://github.com/gleitz/howdoi) to show you how to 'spell' your task in language of choice.

    > howdoi do time to minutes in python

    import datetime as DT
    t1 = DT.datetime.strptime('00:05:36.0100000', '%H:%M:%S.%f0')
    t2 = DT.datetime(1900,1,1)

    print((t1-t2).total_seconds() / 60.0)

### Excalidraw

A great way to draw in a collaborative form see file at (/images/build-workflow.excildraw)

![Build workflow](/images/build-workflow.png "Build Workflow")

### PlantUML alternatives

Huh, turns out there are lots (for UML and graphicing, etc). Read the list here, I haven't played with them yet:

<https://hackmd.io/features#UML-Diagrams>

### D2

Look like a fun alternative language: <https://github.com/terrastruct/d2#install>

### PlantUML

#### PlantUML Tools

- [PlantText](https://www.planttext.com/) Interactive editor with vi-keybindings, but needs a manual refresh
- [LiveUML](https://liveuml.com/) - Interactive editor with auto-refresh
- VS Code has a great plugin for PlantUML
- Vim has a PlantUML preview in ASCII

#### PlantUML in Markdown

You can't directly render PlantUML in Markdown, but you can render images, and get PlantUML to load content from file. E.g:

    https://www.plantuml.com/plantuml/proxy?idx=0&format=svg&src=**URL_with_uml_file**&cache_buster=**increment_to_avoid_caching**

Store your PlantUML file somewhere - e.g.

    [https://raw.github.com/idvorkin/techdiary/master/sample_diagrams.puml](https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml)

Then render it like an image e.g.

    ![UML rendered](https://www.plantuml.com/plantuml/proxy?idx=0&format=svg&src=https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml&c=1)

![UML rendered](https://www.plantuml.com/plantuml/proxy?idx=0&format=svg&c=4&src=https://raw.githubusercontent.com/idvorkin/techdiary/master/sample_diagrams.puml)

#### Inline plantuml via Gravizo

This seems the best approach, using gravizo with inline HTML like this:

```plantuml
<p><img src='https://g.gravizo.com/svg?
@startuml;

actor User;
participant "First Class" as A;
participant "Second Class" as B;
participant "Last Class" as C;

User -> A: DoWork;
activate A;

A -> B: Create Request;
activate B;

B -> C: DoWork;
activate C;

C --> B: WorkDone;
destroy C;

B --> A: Request Created;
deactivate B;

A --> User: Done;
deactivate A;

@enduml
'></p>
```

<p><img src='https://g.gravizo.com/svg?
@startuml;

actor User;
participant "First Class" as A;
participant "Second Class" as B;
participant "Last Class" as C;

User -> A: DoWork;
activate A;

A -> B: Create Request;
activate B;

B -> C: DoWork;
activate C;

C --> B: WorkDone;
destroy C;

B --> A: Request Created;
deactivate B;

A --> User: Done;
deactivate A;

@enduml
'></p>

#### Quirks

- GitHub caches, so increment the c parameter

### Windows Managers

Tools that let you re-tile

- OSX - Rectangle
- Windows - Windows Power Toys - [FancyZones](https://github.com/microsoft/PowerToys)

### ClI Fun

Here's some silly, but fun stuff:

- asciiquarium - fishbowl in the terminal
- cmatrix - the matrix in the terminal
- phraze - Make cartoon characters say stuff (npx run phraze)

### CLI Screen Recoding

OK, this is a 2 putter: First run [asciinema](https://github.com/asciinema/asciinema), then [svgterm](https://github.com/marionebl/svg-term-cli)

```bash
asciinema rec foo.cast
# records till you hit C-D  (curious how that works)
cat foo.cast | svg-term --out foo.svg
# Copy out your svg file
```

_If on iOS then you need to click to open the image in a new tag_

![inamged image](https://raw.githubusercontent.com/idvorkin/techdiary/master/images/demo-cli-screen-recording.svg?sanitize=true)

_(Note, to include an svg from raw.githubusercontent.com/blah.svg you'll need to add blah.svg?sanatize=true)_

#### Show pressed keys

[Carnac](https://github.com/bfritscher/carnac)

### Docker

[Install on Amazon Linux 2](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)

    sudo amazon-linux-extras install docker

Manage via [LazyDocker](https://github.com/jesseduffield/lazydocker)

### Terminal Info

Terminfo, ncurses, OSX, what a mess. You need to add your own terminfos see:

- <https://gist.github.com/bbqtd/a4ac060d6f6b9ea6fe3aabe735aa9d95>

You also want to install the other terminals like xterm256 and tmux

### OBS

Great tool for playing with videos, useful plugins

- iPhone Video Recorder (use a USB cable)
- Stream desk (makes scene control way easier)
- Source Record Plugin (though lots of complaints that it works poorly)

### OSX

{%include summarize-page.html src="/osx" %}

### Obsidian

- [Alfred Plugin](https://github.com/chrisgrieser/shimmering-obsidian#Workflow-Installation)

### Other Resources

List of [tools and programming tips](https://github.com/Kikobeats/awesome-cli)
List of [List of Tools](https://remysharp.com/2018/08/23/cli-improved)
More [lists](https://github.com/agarrharr/awesome-cli-apps)
