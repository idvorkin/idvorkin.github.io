---
layout: post
title: Accessing Google Photos
permalink: /google-photos
---

I like having a blog, but honestly it's faster to write it in google photos as that has a better WYSWIG viewer. But, I don't get features like search, or previews, which matters to me. I also don't trust Google not to break photos in the future. Of course exporting is a PITA, here are some hacks to export and make it into my blog format. NOTE: There is an API to extract photos, but it doesn't include the text (which I like to have, as recall WYSWIG editor)

# Download the album page

Shells are weird, might want to shortcut it. Use follow if shortcutting.

    export ALBUM_URL="https://shorturl.at/hjLX0"
    http --follow $ALBUM_URL >  album.html

# Extract the text content

Oddly, the page is pretty dynamic, got to find the text in a script block

    cat album.html | pup 'script:contains("AF_initDataCallback(")' | grep AF_init > data1

Bleah, need to figure out a clean way to paarse this ... Yuk.
Then need to parse the json slug with the dictionary that has keys like: 99218341.

          99218341: [
            [
              1,
              [
                "Last but not least there was a risk of snow, which made the family uncomfortable to drive on the highway. At first that had me grumpy... But then I remembered the most important lesson of all.\n\nPut the needs of your family ahead of your own, you can always do something with them later when they're comfortable\n\nHave a great weekend - and we'll see you next week!",
              ],
            ],
          ],
          101428965: [0, "vdhvk94a06vv00000000004a"],

Thinking, maybe the best way to do that is non greedy grep ... Lets think through that ..

<https://github.com/idvorkin/idvorkin.github.io/blob/master/dump_google_album.py?plain=1#L25>

# Extract the photos

    prettier album.html > pretty.album.html
    cat pretty.album.html | grep 'https.*usercontet'

# Extract the title

Slopp doppy

    cat pretty.album.html| grep ' - Google Photos'

# References

- iMessage Analysis in pandas: <https://github.com/yortos/imessage-analysis>
- python example: <https://github.com/mattrajca/pymessage-lite/blob/master/imessage.py>
