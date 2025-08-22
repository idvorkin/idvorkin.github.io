---
layout: post
no-render-title: true
title: The Case of the Cert Validation Error
permalink: /cert-error
---

Dad the website isn't secure! You're the security expert fix it! Zach, my 10 year old at the time son, runs a web site, and it got an occasional this website is not secure message. I tried to debug, but couldn't get a consistent enough repro to debug, so had to move on. It stayed in this state for 6 months, at which point Zach told me the certificate had expired. Now i had a 100% repro so went to work.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Explain like I'm 10.](#explain-like-im-10)
    - [Phone numbers and phone books (IP and DNS)](#phone-numbers-and-phone-books-ip-and-dns)
    - [But waits, can't a hacker lie about the address? (Certificates and Authorities)](#but-waits-cant-a-hacker-lie-about-the-address-certificates-and-authorities)
    - [The problem](#the-problem)
    - [The solution](#the-solution)
- [Explain like I'm software engineer](#explain-like-im-software-engineer)
    - [The root cause.](#the-root-cause)
    - [The fix](#the-fix)
    - [Why did the 100% repro help?](#why-did-the-100-repro-help)
    - [What was the actual setup.](#what-was-the-actual-setup)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Explain like I'm 10.

This will be targeted at a less technical audience, so expect some simplification that should annoy more technical people.

### Phone numbers and phone books (IP and DNS)

Imagine Zach has a friend named Amelia, and she's got the phone number 206-890-1111.

When you want to call her, you don't enter the phone number every time. You add her phone number to a contact, and then call the name on the contact card.

So lets look at what happens when Zach wants to phone Amelia:

**When Zach and Amelia meet**

- Zach: Hey Amelia, what's your phone number?
- Amelia: 206-890-1111
- Zach: (Creates a contact for Amelia, and assigns the phone number)

**When Zach wants to call Amelia**

- Zach: Hey Siri, call Amelia
- iPhone: (What number does Amelia Have? 206-890-1111)
- iPhone: (Dialing 206-890-1111)
- Zach: Hi Amelia!

Now, lets look at how this works on the internet.

On the internet, phone numbers are called IP Addresses, and they look like 112.143.122.11. To simplify we'll just imagine they are a single number, like 10.

- Zach: I want to go to zacookiegames.com
- Chrome: (Magic)
- Chrome: (Connecting to 10)
- Zach: Sweet - I'm gonna play a fun game.

But, there's some magic required here. How does chrome know the number for zacookiegames? Zach has no one to ask. Turns out, instead of Zach creating a contact, there's a internet phone book called DNS. In it, you can look up that zacookiegames is at 10. So the above becomes.

- Zach: I want to go to zacookiegames.com
- **Chrome: Yo DNS- What number is zacookiegames.com at?**
- **DNS: 10**
- Chrome: (Connecting to 10)
- Zach: Sweet - I'm gonna play a fun game.

Hymn, you think, OK, well how does DNS know? It turns out just like above when Zach meets Amelia, there's a place where the owner of Zacookiegames, tells DNS.

**When Zacookie games is setup**

- Owner of Zacookie games (Dad) - Hey DNS, please set my number to be 10.
- DNS - OK, done. I'll tell others you're at 10.

### But waits, can't a hacker lie about the address? (Certificates and Authorities)

If you're sneaky like a hacker, you might notice, that someone evil could like to DNS.

- Owner of Hacker'r'us - Hey DNS, I own zacookiegames.com - set my number to 89.
- DNS - OK, done. I'll tell others you're at 89.

Now, Hacker'r'us, can setup a fake website, stealing all the traffic from Zacookiegames.com

So what can we do about it?

Turns out there's something that doesn't exist on your phone, someone, like the police, who you can show your ID to, and then they'll give you a piece of paper proving you own the number. So...

- Owner of Zacookie games (Dad) - Hey Police, can I get proof I can show people that I own Zacookie games, and it's at 10.
- Police - OK, can I see your drivers license?
- Dad - Sure!
- Police, OK, here's your proof.

In computer lingo, that proof is called a certificate, and the the police is called the "certificate authority" or CA. Just like people trust the police, people trust the CA too. So now, to stop hackers, here's what chrome actually does.

- Zach: I want to go to zacookiegames.com
- _Chrome: Yo DNS- What number is zacookiegames.com at?_
- _DNS: 10_
- Chrome: He Zacookie - can I see the proof you own 10?
- Zacookiegames: Sure, here's my proof!
- Chrome: Looks good - keep going!
- Chrome: (Connecting to 10)
- Zach: Sweet - I'm gonna play a fun game.

### The problem

Turns out, instead of a single phone number, on the internet stuff breaks so you need more then 1 phone number. In this case, Zacookie phone numbers were, 10,11,12,13, and we got a certificate for 10,11,12,13.

BUT, when we told DNS, we actually told DNS the phone numbers were 10,**110**,12, 13. As a result if the phone number DNS ever gave back was **110**, then we'd connect to **110**, but chrome, would say, hey, you're not 110. Sorry.

- Zach: I want to go to zacookiegames.com
- _Chrome: Yo DNS- What number is zacookiegames.com at?_
- _DNS: 110_
- Chrome: He Zacookie - can I see the proof you own 110?
- Zacookiegames: Sure, here's my proof - (zacookiegames is at 10,11,12,13)!
- Chrome: Whoa, you should only be at 10, 11,12,13.
- Chrome: (ALERT - HACKER in Play).

### The solution

Update DNS record to 10,11,12,13, and then everything started working correctly.

## Explain like I'm software engineer

### The root cause.

The DNS A records should have been configured to 110, 111, 112 and 113, but were actually 110, **11**, 112, 113. As a result, GitHub thought the website was configured incorrectly and would not issue a new certificate, and as a result the old certificate expired.

### The fix

As soon as I set the DNS correctly a new certificate was issued and everything worked correctly.

### Why did the 100% repro help?

Made it clear GitHub wasn't issuing certificates, and then I could debug why. TODO add more technical version.

### What was the actual setup.
