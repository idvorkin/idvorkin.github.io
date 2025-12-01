---
layout: post
no-render-title: true
title: Accessing iMessage history
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/dump_imessage_history.md)_

# Accessing iMessage history

You'll need to start by taking full disk access for you terminal

Open System Preferences, find the “Security & Privacy” pane, click on the “Privacy” tab, and find the “Full Disk Access” item. Make sure your SQL client and/or terminal are selected.

You'll also need to make sure you've enabled full cloud syncing if your message history is truncated

iMessage -> Preferences -> Imessage -> settings (Apple Id -> Enable Messages is iCloud) , grayed out sync now button.
<https://www.mackungfu.org/HowtomakesureyourMacisusingMessagesiniCloud>

iMessage is just a sqllite file located @

    ~/Library/Messages/chat.db

A nice sqllite cli is litecli (pip install litecli)

    litecli  -e'select  text, date, is_from_me , destination_caller_id, h.id from message m, handle h where m.handle_id = h.ROWID  limit 200 ' chat.db

Dates are in a goofy formab, handle them

    litecli  -e'select  text, datetime(date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime")  as date_uct , is_from_me , destination_caller_id, h.id from message m, handle h where m.handle_id = h.ROWID  limit 10 ' chat.db | tee o1

A decent query (reverse engineering the table formats)

    litecli  -e'select  datetime(date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime")  as date,text,  is_from_me ,  h.id as to_phone  from message m,  chat_message_join cmj, chat_handle_join chj,  handle h where cmj.message_id = m.ROWID  and cmj.chat_id = chj.chat_id  and h.ROWID = chj.handle_id order by date limit 20 ' ~/imessage/chat.db | tee o1

Same query, dump the whole thing.

    litecli  -e'select  datetime(date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime")  as date,text,  is_from_me ,  h.id as to_phone  from message m,  chat_message_join cmj, chat_handle_join chj,  handle h where cmj.message_id = m.ROWID  and cmj.chat_id = chj.chat_id  and h.ROWID = chj.handle_id order by date ' ~/imessage/chat.db > ~/tmp/big_dump.txt

References:

- iMessage Analysis in pandas: <https://github.com/yortos/imessage-analysis>
- python example: <https://github.com/mattrajca/pymessage-lite/blob/master/imessage.py>
