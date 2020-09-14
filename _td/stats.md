---
layout: post
no-render-title: true
title: Statistics
---

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Philosophy](#philosophy)
    - [Frequentist](#frequentist)
    - [Bayes](#bayes)
    - [Computer Based](#computer-based)
    - [Twenty First Century](#twenty-first-century)
- [Sample vs Population](#sample-vs-population)
    - [Inferential Statistics](#inferential-statistics)
    - [Confidence Interval](#confidence-interval)
    - [P-Values](#p-values)
- [Types of Error](#types-of-error)
    - [Type 1 vs Type 2](#type-1-vs-type-2)
    - [Precision vs Recall](#precision-vs-recall)
    - [Accuracy vs Precision](#accuracy-vs-precision)
- [Multi Arm Bandits](#multi-arm-bandits)
    - [Explore vs Exploit](#explore-vs-exploit)
    - [Episilon Greedy](#episilon-greedy)
    - [Soft Max](#soft-max)
- [Measures](#measures)
- [Robust Statistics](#robust-statistics)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Philosophy

### Frequentist

### Bayes

### Computer Based

### Twenty First Century

## Sample vs Population

### Inferential Statistics

Inferential statistics use a random sample to draw conclusions about the population. Typically, it is not practical to obtain data from every member of a population. Instead, we collect a random sample from a small proportion of the population. From the sample, statistical procedures can infer the likely properties of the population.

For example, it is impractical to measure the height of every adult woman, but you can measure the heights of a random sample and use that information to make generalizations about the heights of all women. For example, a confidence interval provides a range that the population mean height is likely to fall in.

### Confidence Interval

This is the simplest in laymens terms
http://www.bandolier.org.uk/painres/download/whatis/What_are_Conf_Inter.pdf

https://blog.minitab.com/blog/adventures-in-statistics-2/understanding-hypothesis-tests-significance-levels-alpha-and-p-values-in-statistics
https://web.ma.utexas.edu/users/mks/statmistakes/overviewfreqCI.html

### P-Values

https://statisticsbyjim.com/hypothesis-testing/interpreting-p-values/
https://statisticsbyjim.com/hypothesis-testing/p-value-tips-false-positives-misleading-results/

**RANT:** P-Values are confusing because they answer an easy question, not the one you want, and are phrased in super confusing terms. P-Values are much like the story of the man looking for his keys under a street lamp. A woman comes to him and asks if she can help find the keys, and where the man lost him. The man answer's over there. The woman says, over there - well why are you looking under the street light!? The man responds, well because it's dark over there.

You want to know the probability the metric change is caused by our treatment. Aka not a false positive (Type 1 error).

But the P-Value is the probability that for **this sample of the population**, the metric change could be caused by the control as opposed to treatment. (The effect being caused by the control is called the null hypothesis)

\*Along these lines, you can think of P values as probabilities that you can multiply. For example, if two independent studies both have P values of 0.05, you can multiply them to obtain a probability of 0.0025. If you use this approach, you can’t cherry pick the best studies. You need to include all studies in a series of relevant studies whether they are significant or not.

One P value multiplied by another P value equals a smaller P value.
You should consider results from a study in conjunction with other similar studies. It is extremely unlikely that a single study can prove that the alternative hypothesis is true with any confidence. So, don’t expect it to!\*

How does Amazon's WebLab tool handle this?

How does Facebook Deltoid tool handle this?

## Types of Error

### Type 1 vs Type 2

- Type 1 = False Positives
- Type 2 = False Negative

### Precision vs Recall

In [ML](machine-learning), we talk about precision and recall:

- **Precision (Exactness)** - Likely hood a result is a true positive. TP / (TP + FP). % of things you say are true, are actually true.

- **Recall (Completeness)** - Likely a true positive. TP / (TP + FN). % of true things you identify in the entire space

### Accuracy vs Precision

In measurement we talk about accuracy and precision

Imagine a target on a bullseye, and firing multiple bullets:

- Accuracy = How close to the bullseye are the bullets. Arguably this is diffence of median from bullseye
- Precision = How must variance is the "spray" of bullets. Arguably this is the standard deviation.

## Multi Arm Bandits

### Explore vs Exploit

### Episilon Greedy

### Soft Max

## Measures

## Robust Statistics

## Other Resources

- Bandit Algorithoms
- Computer Age Statistical Infrence
- Python for Data Analysis
- R CookBook
- Python Data Science Handbook
- Think Stats
