---
layout: post
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/notes/private_web_site.md)_

I'm really enjoying keeping my ideas on the internet where I can see them on my phone, but not all the ideas are ready to be shared, so I'd like to able to keep them private, and restrict them to a subset of people.

I use a static blog generator, jekyll, which means any webserver can host my blog anywhere.

Azure supports a 1 step securing your website with AD, so I'll try using that. Here's the plan:

[markdown/git] -jekyll -> [local html] - azure deploy -> [azure secured website]

The steps:

    * Deploy Azure Blog
    * Use Azure AD
    * Limit to specific users.
