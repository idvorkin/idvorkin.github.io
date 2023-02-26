---
layout: post
title: Accessing Google Photos
permalink: /google-photos
---

I like having a blog, but honestly it's faster to write it in google photos as that has a better WYSWIG viewer. But, I don't get features like search, or previews, which matters to me. I also don't trust Google not to break photos in the future. Of course exporting is a PITA, here are some hacks to export and make it into my blog format. NOTE: There is an API to extrat photos, but it doesn't include the text (which I like to have, as recall WYSWIG editor)

# Download the album page

Shells are weird, might want to shortcut it. Use follow if shortcutting.

    export ALBUM_URL="https://shorturl.at/hjLX0"
    http --follow $ALBUM_URL >  album.html

# Extract the content

Oddly, the page is pretty dynamic, got to find the text in a script block

    cat album.html | pup 'script:contains("AF_initDataCallback(")' | grep AF_init > data

# References

- iMessage Analyis in pandas: <https://github.com/yortos/imessage-analysis>
- python example: <https://github.com/mattrajca/pymessage-lite/blob/master/imessage.py>
