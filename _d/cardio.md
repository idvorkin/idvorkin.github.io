---
layout: post
title: "Cardio: Building capacity, zone by zone"
permalink: /cardio
redirect_from:
  - /zone2
alias:
  - /zone2
tags:
  - health
---

Cardio capacity is a wide base of easy work under a peak of hard work. Most of the minutes go to zone 2, the easy cardio I can hold for an hour, and a few go to the top zones. Every source gives a different heart rate for each zone: for zone 2, three common formulas put the ceiling almost 20 beats apart for the same person. Here are the split, the formulas, a calculator that runs them for all five zones, the test that settles the disagreement, and the markers that say whether the training is working.

{% include ai-slop.html percent="90" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Base and peak](#base-and-peak)
- [Five zones, three formulas](#five-zones-three-formulas)
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

A wider base holds up a taller peak, and the goal is the area of the whole triangle. So most of the week is easy and a little is hard:

- **Zones 1–2 build the base.** Attia [suggests](https://peterattiamd.com/exercising-for-longevity-peter-on-zone-2-and-zone-5-training/) about 2 hours of zone 2 a week to start and 3–4 ideally, with zone 1 for warm-ups and recovery.
- **Zone 3 is the grey zone.** Harder than base work, too easy to move the peak. Little time goes here.
- **Zones 4–5 build the peak.** The classic dose is [4 × 4](https://pubmed.ncbi.nlm.nih.gov/17414804/): four minutes at 90–95% of max, three minutes easy between. In the trial it raised VO2 max more than the same work at 70% or 85% of max.

Elite endurance athletes [land on the same shape](https://pubmed.ncbi.nlm.nih.gov/20861519/): about 80% of sessions easy, 20% hard. That count is sessions, not minutes, in people training 10 to 13 times a week; for me it's a shape to aim at, not a quota.

Zone 2's ceiling is the effort where lactate starts piling up faster than the muscles clear it, around 2 mmol/L in fit people. Without a lactate meter I need a proxy: heart rate, or talking.

## Five zones, three formulas

Watches cut max heart rate into [five zones](https://www8.garmin.com/manuals/webhelp/forerunner245/EN-US/GUID-A8716C0B-B267-4C42-B45F-B9C7928BCA19.html) of 10% each, from 50–60% up to 90–100%. Zone 2 is 60–70%. The formulas disagree on what those percentages are of:

- **Percent of max.** The watch bands as they are. Max is estimated from age: [Tanaka](https://pubmed.ncbi.nlm.nih.gov/11153730/) is 208 − 0.7 × age, which replaced 220 − age because the old one reads low for older adults. A max you measured beats both.
- **[Maffetone](https://philmaffetone.com/180-formula/).** A zone 2 ceiling only: 180 − age. Subtract 5 if you're just starting or coming back. Add 5 if you've trained consistently for more than two years and are still improving. No max needed.
- **Karvonen.** Applies the bands to the reserve, the gap between resting and max: zone 2 is resting + 60–70% × (max − resting). It lands above percent of max by the unused share of resting heart rate: 0.3 × resting at the zone 2 ceiling, shrinking to nothing at max.

## Calculator

Put in your numbers. Leave measured max blank to use Tanaka.

<style>
.z2-calc{border:1px solid rgba(128,128,128,.4);border-radius:8px;padding:12px;margin:1em 0;max-width:640px}
.z2-calc *{box-sizing:border-box}
.z2-inputs{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}
.z2-inputs label{display:block;font-size:.85rem;font-weight:600;margin:0}
.z2-inputs input{display:block;width:100%;font-size:16px;padding:6px 8px;margin-top:4px;border:1px solid rgba(128,128,128,.6);border-radius:6px}
.z2-hint{font-size:.75rem;opacity:.75;margin:6px 0 0}
.z2-label{font-size:.8rem;font-weight:700;margin:14px 0 0;text-transform:uppercase;letter-spacing:.04em;opacity:.8}
.z2-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px}
.z2-card{border-radius:6px;padding:8px 4px;text-align:center;min-width:0}
.z2-card-a{background:rgba(66,133,244,.16)}
.z2-card-b{background:rgba(52,168,83,.16)}
.z2-card-c{background:rgba(244,160,0,.2)}
.z2-name{font-size:.8rem;font-weight:600}
.z2-num{font-size:1.9rem;font-weight:700;line-height:1.15}
.z2-sub{font-size:.72rem;opacity:.8;overflow-wrap:anywhere}
.z2-out{margin:12px 0 0;font-weight:600}
.z2-zones{width:100%;border-collapse:collapse;margin:6px 0 0;font-size:.82rem;font-variant-numeric:tabular-nums}
.z2-zones th,.z2-zones td{padding:5px 4px;text-align:center;border:0;border-bottom:1px solid rgba(128,128,128,.25)}
.z2-zones th{font-size:.72rem;font-weight:600}
.z2-zones th:first-child,.z2-zones td:first-child{text-align:left}
.z2-zones td small{display:block;font-size:.68rem;opacity:.75}
.z2-zones .z2-hero td{background:rgba(52,168,83,.16);font-weight:700}
.z2-zones td.z2-wide{color:#b3261e !important;font-weight:700}
.z2-talk{margin:10px 0 0;font-size:.85rem}
.z2-warn{margin:6px 0 0;font-size:.8rem;color:#b3261e}
</style>
<div class="z2-calc" id="z2-calc">
<div class="z2-inputs">
<label>Age<input id="z2-age" type="number" inputmode="numeric" min="17" max="100" value="48"></label>
<label>Resting HR<input id="z2-rest" type="number" inputmode="numeric" min="30" max="110" value="60"></label>
<label>Measured max HR (optional)<input id="z2-max" type="number" inputmode="numeric" min="100" max="230" placeholder="blank = Tanaka"></label>
<label>Years of steady training<input id="z2-years" type="number" inputmode="decimal" min="0" max="80" step="0.5" value="1"></label>
</div>
<p class="z2-hint">This calculator's cut-offs for Maffetone's categories: under 1 year → −5 · 1 to 2 → 0 · over 2 → +5</p>
<p class="z2-label">Zone 2 ceiling</p>
<div class="z2-cards">
<div class="z2-card z2-card-a"><div class="z2-name">% of max</div><div class="z2-num" id="z2-pct">–</div><div class="z2-sub" id="z2-pct-sub"></div></div>
<div class="z2-card z2-card-b"><div class="z2-name">Maffetone</div><div class="z2-num" id="z2-maf">–</div><div class="z2-sub" id="z2-maf-sub"></div></div>
<div class="z2-card z2-card-c"><div class="z2-name">Karvonen</div><div class="z2-num" id="z2-kar">–</div><div class="z2-sub" id="z2-kar-sub"></div></div>
</div>
<p class="z2-out" id="z2-out"></p>
<p class="z2-label">All five zones, bpm</p>
<table class="z2-zones">
<thead><tr><th>Zone</th><th>% of max</th><th>Karvonen</th><th>Maffetone</th><th>Gap</th></tr></thead>
<tbody id="z2-zones-body"></tbody>
</table>
<p class="z2-talk">Talk test: full sentences, but strained. Easy chat means go harder; pausing for breath means back off.</p>
<p class="z2-warn" id="z2-warn"></p>
</div>
<script>
(function () {
  function el(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat(el(id).value); return isFinite(v) ? v : null; }
  var zones = [[1, "Warm-up", 0.5, 0.6], [2, "Base", 0.6, 0.7], [3, "Grey zone", 0.7, 0.8], [4, "Threshold", 0.8, 0.9], [5, "Peak", 0.9, 1]];
  function range(b) { return b ? Math.round(b.lo) + "–" + Math.round(b.hi) : "–"; }
  function calc() {
    var age = num("z2-age"), rest = num("z2-rest"), meas = num("z2-max"), yrs = num("z2-years");
    var warn = [], z2 = {}, rows = [];
    if (age === null || age < 17 || age > 100) {
      warn.push("Enter an age from 17 to 100.");
    } else {
      var max = Math.round(208 - 0.7 * age), src = "Tanaka";
      if (meas !== null) {
        if (meas >= 100 && meas <= 230) { max = Math.round(meas); src = "measured"; }
        else { warn.push("Measured max ignored: expected 100 to 230."); }
      }
      var okRest = rest !== null && rest >= 30 && rest < max;
      if (!okRest) warn.push("Karvonen needs a resting HR from 30 up to your max.");
      var adj = yrs === null ? 0 : yrs < 1 ? -5 : yrs > 2 ? 5 : 0;
      var maf = 180 - age + adj;
      rows = zones.map(function (z) {
        var pct = { lo: z[2] * max, hi: z[3] * max };
        var kar = okRest ? { lo: rest + z[2] * (max - rest), hi: rest + z[3] * (max - rest) } : null;
        var mf = z[0] === 2 ? { lo: maf - 10, hi: maf } : null;
        var tops = [pct, kar, mf].filter(Boolean).map(function (b) { return Math.round(b.hi); });
        return { z: z, pct: pct, kar: kar, maf: mf, gap: tops.length > 1 ? Math.max.apply(null, tops) - Math.min.apply(null, tops) : null };
      });
      z2.pct = { b: rows[1].pct, sub: "60–70% of " + max + " (" + src + ")" };
      z2.maf = { b: rows[1].maf, sub: "180 − age" + (adj ? (adj > 0 ? " + 5" : " − 5") : "") };
      if (okRest) z2.kar = { b: rows[1].kar, sub: "60–70% of reserve (" + (max - rest) + ")" };
    }
    var his = [];
    ["pct", "maf", "kar"].forEach(function (n) {
      var c = z2[n];
      el("z2-" + n).textContent = c ? Math.round(c.b.hi) : "–";
      el("z2-" + n + "-sub").textContent = c ? range(c.b) + " bpm · " + c.sub : "";
      if (c) his.push(Math.round(c.b.hi));
    });
    el("z2-zones-body").innerHTML = rows.map(function (r) {
      var gap = r.gap === null ? "–" : r.gap;
      return '<tr' + (r.z[0] === 2 ? ' class="z2-hero"' : "") + "><td>" + r.z[0] + "<small>" + r.z[1] + "</small></td><td>" + range(r.pct) +
        "</td><td>" + range(r.kar) + "</td><td>" + range(r.maf) + '</td><td class="' + (r.gap > 5 ? "z2-wide" : "") + '">' + gap + "</td></tr>";
    }).join("");
    his.sort(function (a, b) { return a - b; });
    el("z2-out").textContent = his.length
      ? "Zone 2 ceilings: " + his[0] + "–" + his[his.length - 1] + " bpm. Start near " + his[Math.floor((his.length - 1) / 2)] + ", then let the talk test decide."
      : "";
    el("z2-warn").textContent = warn.join(" ");
  }
  ["z2-age", "z2-rest", "z2-max", "z2-years"].forEach(function (id) { el(id).addEventListener("input", calc); });
  calc();
})();
</script>

The big number on each card is that formula's zone 2 ceiling. In the table, gap is how far apart the methods' ceilings are in each zone, red when it's more than 5 beats. Karvonen adds the unused share of resting heart rate, so the methods disagree most in the easy zones, where most of the training happens, and agree at max. The zone names are the watch bands; the talk test decides where my real zone 2 ends.

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
- [Heart rate zone calculations](https://www8.garmin.com/manuals/webhelp/forerunner245/EN-US/GUID-A8716C0B-B267-4C42-B45F-B9C7928BCA19.html), Garmin: the five 10% bands the calculator uses, applied to reserve for Karvonen.
- [Exercising for longevity: zone 2 and zone 5 training](https://peterattiamd.com/exercising-for-longevity-peter-on-zone-2-and-zone-5-training/), Peter Attia: weekly zone 2 hours.
- [Aerobic high-intensity intervals improve VO2max more than moderate training](https://pubmed.ncbi.nlm.nih.gov/17414804/), Helgerud et al., 2007: the 4 × 4.
- [What is best practice for training intensity and duration distribution in endurance athletes?](https://pubmed.ncbi.nlm.nih.gov/20861519/), Seiler, 2010: the 80/20 split.
