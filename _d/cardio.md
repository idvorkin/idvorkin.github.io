---
layout: post
title: "Cardio: Zone 2 by the numbers"
permalink: /cardio
redirect_from:
  - /zone2
alias:
  - /zone2
tags:
  - health
---

Zone 2 is the easy cardio I can hold for an hour, and every source gives me a different heart rate for it. Three common formulas put the ceiling almost 20 beats apart for the same person. Here are the formulas, a calculator to run them on your own numbers, the test that settles the disagreement, and the markers that say whether the training is working.

{% include ai-slop.html percent="90" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Base and peak](#base-and-peak)
- [Three formulas for the ceiling](#three-formulas-for-the-ceiling)
- [Calculator](#calculator)
- [The talk test settles it](#the-talk-test-settles-it)
- [Markers to watch](#markers-to-watch)
- [Sources](#sources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Base and peak

Peter Attia draws cardio fitness as a [triangle](https://peterattiamd.com/a-better-way-to-think-about-zone-2/):

- **The base** is how long I can keep doing submaximal work. Volume builds it: lots of easy minutes.
- **The peak** is VO2 max, the most oxygen I can use going all out. A few hard intervals build it.

A wider base holds up a taller peak, and the goal is the area of the whole triangle. Zone 2 is base work. Its ceiling is the effort where lactate starts piling up faster than the muscles clear it, around 2 mmol/L in fit people. Without a lactate meter I need a proxy: heart rate, or talking.

## Three formulas for the ceiling

- **Percent of max.** Watches call 60–70% of max heart rate zone 2. Max is estimated from age: [Tanaka](https://pubmed.ncbi.nlm.nih.gov/11153730/) is 208 − 0.7 × age, which replaced 220 − age because the old one reads low for older adults. A max you measured beats both.
- **[Maffetone](https://philmaffetone.com/180-formula/).** 180 − age. Subtract 5 if you're just starting or coming back. Add 5 if you've trained consistently for more than two years and are still improving. No max needed.
- **Karvonen.** Uses the reserve, the gap between resting and max: resting + 60–70% × (max − resting). It always lands above percent of max, by 0.3 × resting heart rate at the ceiling.

## Calculator

Put in your numbers. Leave measured max blank to use Tanaka.

<style>
.z2-calc{border:1px solid rgba(128,128,128,.4);border-radius:8px;padding:12px;margin:1em 0;max-width:640px}
.z2-calc *{box-sizing:border-box}
.z2-inputs{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}
.z2-inputs label{display:block;font-size:.85rem;font-weight:600;margin:0}
.z2-inputs input{display:block;width:100%;font-size:16px;padding:6px 8px;margin-top:4px;border:1px solid rgba(128,128,128,.6);border-radius:6px}
.z2-hint{font-size:.75rem;opacity:.75;margin:6px 0 0}
.z2-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}
.z2-card{border-radius:6px;padding:8px 4px;text-align:center;min-width:0}
.z2-card-a{background:rgba(66,133,244,.16)}
.z2-card-b{background:rgba(52,168,83,.16)}
.z2-card-c{background:rgba(244,160,0,.2)}
.z2-name{font-size:.8rem;font-weight:600}
.z2-num{font-size:1.9rem;font-weight:700;line-height:1.15}
.z2-sub{font-size:.72rem;opacity:.8;overflow-wrap:anywhere}
.z2-chart{margin-top:14px}
.z2-row{display:flex;align-items:center;gap:6px;margin:4px 0}
.z2-row span{flex:0 0 5.2em;font-size:.72rem}
.z2-track{position:relative;flex:1;height:14px;background:rgba(128,128,128,.15);border-radius:7px;overflow:hidden}
.z2-bar{position:absolute;top:0;height:100%;border-radius:7px}
.z2-bar-a{background:rgb(66,133,244)}
.z2-bar-b{background:rgb(52,168,83)}
.z2-bar-c{background:rgb(244,160,0)}
.z2-axis{display:flex;justify-content:space-between;font-size:.7rem;opacity:.75;margin-left:calc(5.2em + 6px)}
.z2-out{margin:12px 0 0;font-weight:600}
.z2-talk{margin:6px 0 0;font-size:.85rem}
.z2-warn{margin:6px 0 0;font-size:.8rem;color:#b3261e}
</style>
<div class="z2-calc" id="z2-calc">
<div class="z2-inputs">
<label>Age<input id="z2-age" type="number" inputmode="numeric" min="17" max="100" value="48"></label>
<label>Resting HR<input id="z2-rest" type="number" inputmode="numeric" min="30" max="110" value="60"></label>
<label>Measured max HR (optional)<input id="z2-max" type="number" inputmode="numeric" min="100" max="230" placeholder="blank = Tanaka"></label>
<label>Years of steady training<input id="z2-years" type="number" inputmode="decimal" min="0" max="80" step="0.5" value="1"></label>
</div>
<p class="z2-hint">Maffetone adjustment from years: under 1 → −5 · 1 to 2 → 0 · over 2 → +5</p>
<div class="z2-cards">
<div class="z2-card z2-card-a"><div class="z2-name">% of max</div><div class="z2-num" id="z2-pct">–</div><div class="z2-sub" id="z2-pct-sub"></div></div>
<div class="z2-card z2-card-b"><div class="z2-name">Maffetone</div><div class="z2-num" id="z2-maf">–</div><div class="z2-sub" id="z2-maf-sub"></div></div>
<div class="z2-card z2-card-c"><div class="z2-name">Karvonen</div><div class="z2-num" id="z2-kar">–</div><div class="z2-sub" id="z2-kar-sub"></div></div>
</div>
<div class="z2-chart" aria-hidden="true">
<div class="z2-row"><span>% of max</span><div class="z2-track"><div class="z2-bar z2-bar-a" id="z2-pct-bar"></div></div></div>
<div class="z2-row"><span>Maffetone</span><div class="z2-track"><div class="z2-bar z2-bar-b" id="z2-maf-bar"></div></div></div>
<div class="z2-row"><span>Karvonen</span><div class="z2-track"><div class="z2-bar z2-bar-c" id="z2-kar-bar"></div></div></div>
<div class="z2-axis"><span id="z2-axis-lo"></span><span>bpm</span><span id="z2-axis-hi"></span></div>
</div>
<p class="z2-out" id="z2-out"></p>
<p class="z2-talk">Talk test: full sentences, but strained. Easy chat means go harder; pausing for breath means back off.</p>
<p class="z2-warn" id="z2-warn"></p>
</div>
<script>
(function () {
  function el(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat(el(id).value); return isFinite(v) ? v : null; }
  var names = ["pct", "maf", "kar"];
  function calc() {
    var age = num("z2-age"), rest = num("z2-rest"), meas = num("z2-max"), yrs = num("z2-years");
    var warn = [], bands = {};
    if (age === null || age < 17 || age > 100) {
      warn.push("Enter an age from 17 to 100.");
    } else {
      var max = Math.round(208 - 0.7 * age), src = "Tanaka";
      if (meas !== null) {
        if (meas >= 100 && meas <= 230) { max = Math.round(meas); src = "measured"; }
        else { warn.push("Measured max ignored: expected 100 to 230."); }
      }
      bands.pct = { lo: 0.6 * max, hi: 0.7 * max, sub: "60–70% of " + max + " (" + src + ")" };
      var adj = yrs === null ? 0 : yrs < 1 ? -5 : yrs > 2 ? 5 : 0;
      var maf = 180 - age + adj;
      bands.maf = { lo: maf - 10, hi: maf, sub: "180 − age" + (adj ? (adj > 0 ? " + 5" : " − 5") : "") };
      if (rest === null || rest < 30 || rest >= max) {
        warn.push("Karvonen needs a resting HR from 30 up to your max.");
      } else {
        var reserve = max - rest;
        bands.kar = { lo: rest + 0.6 * reserve, hi: rest + 0.7 * reserve, sub: "60–70% of reserve (" + reserve + ")" };
      }
    }
    var his = [], lows = [];
    names.forEach(function (n) { if (bands[n]) { his.push(Math.round(bands[n].hi)); lows.push(bands[n].lo); } });
    var axisLo = lows.length ? Math.floor((Math.min.apply(null, lows) - 10) / 10) * 10 : 0;
    var axisHi = his.length ? Math.ceil((Math.max.apply(null, his) + 10) / 10) * 10 : 0;
    names.forEach(function (n) {
      var b = bands[n], bar = el("z2-" + n + "-bar");
      el("z2-" + n).textContent = b ? Math.round(b.hi) : "–";
      el("z2-" + n + "-sub").textContent = b ? Math.round(b.lo) + "–" + Math.round(b.hi) + " bpm · " + b.sub : "";
      bar.style.left = b ? (100 * (b.lo - axisLo) / (axisHi - axisLo)) + "%" : "0";
      bar.style.width = b ? (100 * (b.hi - b.lo) / (axisHi - axisLo)) + "%" : "0";
    });
    el("z2-axis-lo").textContent = his.length ? axisLo : "";
    el("z2-axis-hi").textContent = his.length ? axisHi : "";
    his.sort(function (a, b) { return a - b; });
    el("z2-out").textContent = his.length
      ? "Ceilings: " + his[0] + "–" + his[his.length - 1] + " bpm. Start near " + his[Math.floor((his.length - 1) / 2)] + ", then let the talk test decide."
      : "";
    el("z2-warn").textContent = warn.join(" ");
  }
  ["z2-age", "z2-rest", "z2-max", "z2-years"].forEach(function (id) { el(id).addEventListener("input", calc); });
  calc();
})();
</script>

The big number on each card is that formula's ceiling. The bars show each band on one scale; Maffetone gives only a ceiling, so its bar is the ten beats under it.

## The talk test settles it

Attia and Iñigo San Millán [agree on the check](https://peterattiamd.com/how-to-find-your-zone-2-without-using-a-lactate-meter/) when there's no lactate meter:

- **In zone 2:** I can speak in full sentences, but I'd rather not, and whoever is listening can tell I'm exercising.
- **Too easy:** I can chat without effort.
- **Too hard:** I pause mid-sentence to breathe.

Attia's team coaches most patients by the talk test, because fitness trackers' heart rate zones are too inconsistent between people and between kinds of exercise.

So heart rate is where I start, and talking is how I correct:

1. Take the middle ceiling from the calculator.
2. Hold it for ten minutes.
3. Say a full sentence out loud.
4. Move 5 beats up or down, and repeat until the sentence comes out strained but whole.

That heart rate is the ceiling, on that machine, for now. It moves as the base grows, so the test is worth repeating every few months.

## Markers to watch

| What     | Marker                        | How to read it                                                                        |
| -------- | ----------------------------- | ------------------------------------------------------------------------------------- |
| Base     | Heart rate at a fixed level   | Same machine, same level, same duration. A lower average over months is a wider base. |
| Base     | Resting heart rate            | Same time each morning. Watch the trend, not the day.                                 |
| Peak     | VO2 max                       | A watch estimate is fine for the trend. A lab test gives the real number.             |
| Recovery | Heart rate drop in one minute | Stop after a hard effort, read it at the stop and 60 seconds later. Bigger is better. |

Why these earn a spot:

- **VO2 max** tracks how long people live. In a [study of 122,000 treadmill tests](https://pubmed.ncbi.nlm.nih.gov/30646252/), moving from the bottom quarter of fitness to merely below average went with [about half the risk of dying](https://peterattiamd.com/how-does-vo2-max-correlate-with-longevity/) from any cause.
- **One-minute recovery** of 12 beats or less [predicted higher mortality](https://pubmed.ncbi.nlm.nih.gov/10536127/) in a six-year follow-up of 2,428 adults.
- **Heart rate at a fixed level** is the cheap version of a lactate test: the same work costing fewer beats means the base grew.

Where cardio sits in the bigger plan: [my last year on earth](/last-year).

## Sources

- [A better way to think about Zone 2](https://peterattiamd.com/a-better-way-to-think-about-zone-2/), Peter Attia: the base and peak triangle, and the talk test.
- [How to find your Zone 2 without using a lactate meter](https://peterattiamd.com/how-to-find-your-zone-2-without-using-a-lactate-meter/), a clip from [The Drive #201](https://www.youtube.com/watch?v=-6PDBVRkCKc) with Iñigo San Millán.
- [The MAF 180 Formula](https://philmaffetone.com/180-formula/), Phil Maffetone.
- [Age-predicted maximal heart rate revisited](https://pubmed.ncbi.nlm.nih.gov/11153730/), Tanaka et al., 2001.
- [The effects of training on heart rate](https://pubmed.ncbi.nlm.nih.gov/13470504/), Karvonen et al., 1957.
