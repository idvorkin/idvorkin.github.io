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
- [Data](#data)
    - [Church encoding](#church-encoding)
    - [Church Pairs](#church-pairs)
    - [2.3 Symbolic Data](#23-symbolic-data)
    - [Object Oriented vs Functional](#object-oriented-vs-functional)
    - [Lazy vs Eager](#lazy-vs-eager)
    - [Type Systems](#type-systems)
    - [Code as Data](#code-as-data)
- [Modern learning using an excellent tutor.](#modern-learning-using-an-excellent-tutor)
    - [Scheme vs Lisp vs Racket](#scheme-vs-lisp-vs-racket)
- [Language Eveolution](#language-eveolution)
- [Meta programming](#meta-programming)
    - [Homoiconicity](#homoiconicity)
    - [LISP Macros](#lisp-macros)
    - [LISP Macros vs C Macros](#lisp-macros-vs-c-macros)
    - [Macros vs Reflection](#macros-vs-reflection)

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

The things:

1/ Everything is an expression (aka a function call that returns something)
2/ The only syntax is prefix notion

This is in contrast to procedural languages which contain statements and think of "functions/sub routines as special".

This corresonds to the models of computation:

1/ The teuring machine

* You interact with a a machine that has variables
* You can set and read variables
* You can do math
* You get language specific control statements
* You can call sub routines

2/ Lambada calculus

* Everything is a function/expression
* Assignment is a function
* Iteration is a function
* Condition is a function

Harder on brain, but more consistent

---

LISP is prefix notion, (funciton args), the upside of this is you enver have to guess operator precedence. Everythign is consistent, makes self editting much easier.

Having everything in prefix notion makes it very consistent and easy to write code, just a bit tough on the brain.

### Why cons, car, cadr

In Lisp, `cons`, `car`, and `cadr` are fundamental functions for list manipulation. In a sane world, they'd have been called make-pair, head, tail

The names `cons`, `car`, and `cadr` come from the historical development of Lisp. Lisp was originally implemented on the IBM 704 computer in the late 1950s. The 704 had an instruction called `CONS` (short for "construct") that was used to create data structures in memory. Similarly, `CAR` and `CDR` stood for "Contents of the Address part of Register" and "Contents of the Decrement part of Register," respectively. These were machine instructions on the IBM 704 that allowed access to different parts of a memory word, which Lisp repurposed for list manipulation.

The terms `car` and `cdr` were retained in Lisp to refer to the first and rest of a cons cell. Over time, as Lisp evolved, additional shorthand functions were created by combining `car` and `cdr` in various ways. These names stuck and became a part of the Lisp family of languages' common vernacular, despite their somewhat cryptic appearance to newcomers.




## Recurssion

### Basis in lambda calculus

### Tail recurusssion

* A way to implement recurussion, but with O(1) space


## Data

### Church encoding

If all you have is substitution, how do you get stuff done?

* Whole Numbers
    * Zero
    * 1: Next(Zero)
    * 2: Next(Next(Zero))
* Booleans ->
* Pairs -> See below
* Lists
    * {} ()
    * {1} (Pair 1 ())
    * {1 2} (Pair 2 (Pair 1 ()))
* Maybes ->

* Recurssion
* Only subsititutions

### Church Pairs

How to create pairs using only substitution.  Aka w/o storage. Except, there has to be storage. The storage is the closure of the parent function

https://xuanji.appspot.com/isicp/2-1-data.html

```scheme
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
    def dispatch(m):
        if m == "head":
           return x
        elif m == "tail":
            return y
        else:
            raise Exception("un supported method")
    return dispatch

def head(pair):
    return pair("head")

def tail(pair):
    return pair("tail")

p1 = make_pair(1,2)
head(p1) # => 1
tail(p2) # => 2
```

Think about that more, that's creating an object at runtime. With a bit of sugar that's could very easily by a class/object sugar

```python
class Pair:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def head(self):
        return self.x

    def tail(self):
        return self.y

p1 = Pair(1,2)
p1.head() # => 1
p1.tail() # => 2
```


### 2.3 Symbolic Data

[Symbolic Data](https://xuanji.appspot.com/isicp/2-3-symbolic.html)

```scheme
(define x 1)
(define y 2)

(list x y) ; => (1 2)

(display "Wait what if i I wanted the actual symbols x and y")

'(x y) ; => (x y)
'(list x y) ; => (list x y)
(list x 'y) ; => (list 1 y)



```

### Object Oriented vs Functional

(object class arg1 arg2)

As long as that first object is a funciton you can do anything. What's the difference object.function, is really just (function.object) - yup that's interesting obseragion on on OO.

So long as syntax is always (function arg1, arg2 arg3), if (method, object, arg arg) - isn't that interseting

### Lazy vs Eager

### Type Systems

### Code as Data

Hymogophony? What if you can edit the source code just as easily as you can edit any other data? To do that parse trees can be much simpler when using prefix notion.

## Modern learning using an excellent tutor.

How to learn when you don't know everything. Books are linear.


Really concepts are a dag. so where ever you end, you probably need eveything... And that'st he beter way to go. Ideally the book has this linear aspect to it. The problem with books is.

The problemw ith the interjnnet


The book

The Internet

The Choose your own adventure


### Scheme vs Lisp vs Racket

## Language Eveolution

* Lisp  (list procssing)
   *  -> Scheme -> Racket
* Algol (procedural)
   * C, Pascal
   *

## Meta programming

### Homoiconicity

Treat code as any other data structure, you can see the length of a code segment

### LISP Macros

https://www.greghendershott.com/fear-of-macros/

### LISP Macros vs C Macros

C Macros are just text substitution, they can't do anything that you can't do with text substitution. By contrast lisp macros allow you to make changes to the parse tree. Here's a  good idea of what you can do with lisp macros

### Macros vs Reflection

Reflection lets you operate at runtime, while macros change the code at compile time. Compile time is more efficient, but can be less powerful

