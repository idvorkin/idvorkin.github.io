---
layout: post
no-render-title: true
title: Security Notes
---

I used to do security in a former life, and here are some musings on the topic, which will eventually be dissected into various essays. For now it’ll be confusing as I’m brain dumping to various audiences with various knowledge (end users, architects, CEOs, designers)

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/better-security-design.md)_

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Good Security](#good-security)
    - [Single Sign On: One account to rule them all.](#single-sign-on-one-account-to-rule-them-all)
    - [Great design: Microsoft Authenticator](#great-design-microsoft-authenticator)
    - [Great design: Whatsapp add accounts](#great-design-whatsapp-add-accounts)
    - [Git tools, personal access tokens](#git-tools-personal-access-tokens)
    - [Googles OTP reset codes](#googles-otp-reset-codes)
    - [Password managers](#password-managers)
    - [Multi Factor Authentication](#multi-factor-authentication)
    - [Full Device Encryption (Bitlocker, TPM, Truecrypt)](#full-device-encryption-bitlocker-tpm-truecrypt)
    - [Public Key sign in via SSH](#public-key-sign-in-via-ssh)
    - [Live sign in for windows](#live-sign-in-for-windows)
    - [Single Payment System: Paypal, Amazon, Google Express](#single-payment-system-paypal-amazon-google-express)
- [Bad Security](#bad-security)
    - [E-mail password resets](#e-mail-password-resets)
    - [SMS Password reset tools weakness](#sms-password-reset-tools-weakness)
- [Funny](#funny)
    - [Can’t unlock the door w/Amazon Alexa](#cant-unlock-the-door-wamazon-alexa)
- [Security Assessments](#security-assessments)
    - [Threat Modeling](#threat-modeling)
    - [STRIDE](#stride)
    - [Trust Boundaries](#trust-boundaries)
    - [Data flow diagrams](#data-flow-diagrams)
    - [Automated Code reviews](#automated-code-reviews)
    - [Manual Code reviews](#manual-code-reviews)
    - [Penetration testing](#penetration-testing)
    - [Compliance vs Security](#compliance-vs-security)
    - [Social engineering](#social-engineering)
    - [Physical security.](#physical-security)
    - [The dirty little secret of security reviews](#the-dirty-little-secret-of-security-reviews)
- [Uncategorized](#uncategorized)
    - [Security from first principles socratic method:](#security-from-first-principles-socratic-method)
    - [Apple Pay](#apple-pay)
    - [Chip and PIN and tap in rest of world](#chip-and-pin-and-tap-in-rest-of-world)
    - [Credit card vs Debit Card security](#credit-card-vs-debit-card-security)
    - [Account vs Identity](#account-vs-identity)
    - [The end of privacy](#the-end-of-privacy)
    - [ICloud vs OneDrive: Why do I need to login](#icloud-vs-onedrive-why-do-i-need-to-login)
    - [YubiKey: Proof of human](#yubikey-proof-of-human)
    - [RSA Secure ID](#rsa-secure-id)
    - [Secure Boot](#secure-boot)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

### Good Security

We’ve made lots of stride in the security world, here are some of the ideas that have really stood out.

#### Single Sign On: One account to rule them all.

Perhaps better articulated as a small number of accounts to run them all.

Single sign in allows users to use a single account to login into many web sites, which means you don’t need to great a new account for every product you use.

Google, Facebook, Twitter, and Microsoft have excellent single sign on solutions.

**SSO vs Identity**
Sign can be orthogonal to identity. For example, multiple SSO services can provide the same identity. For example, FB can be configured to provide a google e-mail identity, just as google does. Users can register multiple SSO services for the same identity - which is ideal in the case of service providers avoiding dependence on a single SSO provider.

**Why doesn’t everyone use SSO?**
I suspect a few things, many of which I disagree with.

- Dependent on a SSO providers: Transient downtime, out of business.

If the SSO provider is down, users can’t login - this is a unfixable experience.

Far worse, if a SSO provider goes out of business, and they are the only identity of the users in the service’s system, the service team will need to have an emergency scramble to re-create user accounts. This would be a nightmare scenario as it can be very difficult to contact all users.

- Cheaper to run your own AuthN system then build SSO

I believe this belief is an outdated myth. In the past, before the standardization of OAUTH, and the excellent libraries that support it, using OATH is significantly cheaper to implement.

Moreover, when you look at the total cost of password system ownership, like secure password storage, password resets, and security leaks, I believe rolling your own AuthN system very quickly becomes the higher cost solution.

#### Great design: Microsoft Authenticator

The best authenticator application I’ve seen is Microsoft’s for iOS. In this solution, when you a user logs into a service with Microsoft SSO on any device, they are presented with a 2 digit number on the device accessing the service, **and** a notification pops up on the user’s mobile device to open Microsoft Authenticator.

On the users mobile device, in Microsoft Authenticator, a choice of 2 digit numbers are presented. When the user clicks on the matching 2 digit number the users is logged into the service.

This flow is even better on the iPhone, where the 2 digit number is presented on the watch where the user can enter the number directly.

Notice, the user completes the sign on flow cross device without needing to return to the source application.

**Why don’t more authenticators use this model?**

I’m not sure, I suspect a few things:

- Architects don’t think of pushing the boundaries in their auth systems.
- It ties the authN to the authenticator app.
  This sounds odd, but the auth model where you can enter a 6 digit number allows the SSO provider to use multiple transport channels to provide the 6 digit number (e.g. SMS, E-mail, etc)

#### Great design: Whatsapp add accounts

What's app lets you add a windows account by displaying a QR code and having you scan it into your phone. This is awesome since you don't need to know/enter a password

#### Git tools, personal access tokens

#### Googles OTP reset codes

#### Password managers

I use 1Password and it's fantastic. I have strong passwords for all my sites, an also use it for 1 time codes. It syncs to all my devices, and even has a watch app.

#### Multi Factor Authentication

#### Full Device Encryption (Bitlocker, TPM, Truecrypt)

#### Public Key sign in via SSH

#### Live sign in for windows

#### Single Payment System: Paypal, Amazon, Google Express

### Bad Security

#### E-mail password resets

You can have the strongest password in the world, but then a user can hit password reset, and if they have control of your e-mail, they can change you password sheesh.

#### SMS Password reset tools weakness

You may think SMS passwords are strong security, a second factor even. However, SMS is easily attackable using a [Sting Ray](https://en.wikipedia.org/wiki/Stingray_phone_tracker).

### Funny

#### Can’t unlock the door w/Amazon Alexa

### Security Assessments

#### Threat Modeling

The security of your system is a function of the capabilities of the attacker. For example, if your attacker profile is a techno-peasant, you're likely safe with a computer password. If your attacker has you and your device and can compel you take action, there isn't much you can do. Like wise if the attacker has kernel mode access to the machine you're running on you're screwed.

#### STRIDE

I grew up doing security at Microsoft, and at the heart of their assessment model was the acronym STRIDE, see more [here](https://docs.microsoft).

- **S**poofing - Pretending to be a user. Defeating Authentication.
- **T**ampering - Changing data (at rest or in transit). Defeating Integrity Protection
- **R**epudiation - Claiming something happened that didn't. Defeating Non Repudiation
- **I**information disclosure - Leak dates. Defeating Confidentiality
- **D**enial of service - Losing access to the system. Defeating Availability.
- **E**scalation of privilege - Gaining access to stuff you should be able to. Defeating Authorization.

#### Trust Boundaries

#### Data flow diagrams

#### Automated Code reviews

#### Manual Code reviews

#### Penetration testing

#### Compliance vs Security

#### Social engineering

#### Physical security.

#### The dirty little secret of security reviews

Going through a security review process is the way to validate security. However, as soon as the review is complete, security starts to drift, security holes start to appear, and there are no safe guards to ensure the security of the system isn't compromised.

### Uncategorized

#### Security from first principles socratic method:

A great ["first principles" implementation](https://web.mit.edu/kerberos/www/dialogue.html?fbclid=IwAR38MBHzKJZzMrO1P_NLpTyV1G6GYjrxYUBXIJsTitw_q4_QM4EpiLpo4Y8).

#### Apple Pay

#### Chip and PIN and tap in rest of world

#### Credit card vs Debit Card security

#### Account vs Identity

#### The end of privacy

#### ICloud vs OneDrive: Why do I need to login

#### YubiKey: Proof of human

#### RSA Secure ID

#### Secure Boot
