---
layout: post
title: Structure And Design of Computer Programs
permalink: /sicp
redirect_from:
- /wizard-book
- /lisp
---

LISP, and SICP


<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [SICP](#sicp)
- [Racket: Modern Lisp](#racket-modern-lisp)
- [VIM Integration](#vim-integration)
    - [Formatter](#formatter)
    - [Conjure School](#conjure-school)
- [FAQ](#faq)
    - [Why different then other languages?](#why-different-then-other-languages)
    - [Why is everything recurression?](#why-is-everything-recurression)
    - [Why all those wonkey brackets?](#why-all-those-wonkey-brackets)
    - [Why cons, car, cadr](#why-cons-car-cadr)
- [Recurssion](#recurssion)
    - [Basis in lambda calculus](#basis-in-lambda-calculus)
    - [Tail recurusssion](#tail-recurusssion)
- [Understanding pairs](#understanding-pairs)
    - [Procedural pairs](#procedural-pairs)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## SICP

Cool interactive version: [Nice Version](https://xuanji.appspot.com/isicp)

## Racket: Modern Lisp


## VIM Integration

### Formatter

* Setup NeoFormat with raco format

### Conjure School


Cool interactive editor

* \ee -> execute the current inner form
* \er -> execute the current outer form
* \eb -> execute the entire buffer

## FAQ

### Why different then other languages?

It starts with assumption all you need is lambda calculus, e.g just functions, eg.g. just expressions. There are no statemetns.

Interestingly if you can pass in functions, then you can have functions to do the equivalent of statements in other programming languages


### Why is everything recurression?

Actuall, it's more fundamental, it's that everything is na expression, and if everything is an expression, the only looping has to be recurssion


### Why all those wonkey brackets?

LISP is prefix notion, (funciton args), the upside of this is you enver have to guess operator precedence. Everythign is consistent, makes self editting much easier.

### Why cons, car, cadr

In Lisp, `cons`, `car`, and `cadr` are fundamental functions for list manipulation. In a sane world, they'd have been called make-pair, head, tail

The names `cons`, `car`, and `cadr` come from the historical development of Lisp. Lisp was originally implemented on the IBM 704 computer in the late 1950s. The 704 had an instruction called `CONS` (short for "construct") that was used to create data structures in memory. Similarly, `CAR` and `CDR` stood for "Contents of the Address part of Register" and "Contents of the Decrement part of Register," respectively. These were machine instructions on the IBM 704 that allowed access to different parts of a memory word, which Lisp repurposed for list manipulation.

The terms `car` and `cdr` were retained in Lisp to refer to the first and rest of a cons cell. Over time, as Lisp evolved, additional shorthand functions were created by combining `car` and `cdr` in various ways. These names stuck and became a part of the Lisp family of languages' common vernacular, despite their somewhat cryptic appearance to newcomers.


## Recurssion

### Basis in lambda calculus

### Tail recurusssion

* A way to implement recurussion, but with O(1) space


## Understanding pairs

### Procedural pairs

How to create pairs using only substitution.  That's a lie, there is in fact storage, it's just using the closure of the parent function for storage

https://xuanji.appspot.com/isicp/2-1-data.html

```lisp
(define (make_pair x y)
  (define (dispatch m)
    (cond ((= m 0) x)
          ((= m 1) y)
          (else (error "Argument not 0 or 1 -- CONS" m))))
  dispatch)

(define (head pair) (pair 0))

(define (tail pair) (pair 1))
```
or in python
```python
def make_pair(x, y):
    def pick_element(m):
        if m == "head":
            return x
        elif m == "tail":
            return y
        else:
            raise Exception("Argument not 0 or 1 -- CONS")
    return pick_element

def head(pair):
    return pair("head")

def tail(pair):
    return pair("tail")
```
