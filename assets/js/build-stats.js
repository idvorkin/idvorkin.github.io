// Build stats dashboard: renders build-stats.json (made by build_stats.py) into #build-stats-app.
// Vanilla JS + hand-drawn SVG, no dependencies. Used by /build-stats and the Lavish mockup.
//
// Group by Month / Quarter / Half-year sets the bucket size for the charts and the
// default headline (the current bucket, paced against the previous one of the same
// size). Click (or Enter/Space on) a bar, or click a heatmap square, to focus the
// headline, heatmap and top repos on that bucket; shift-click extends it into a
// range. The selection lives in the URL hash (#m=2026-09 or #m=2026-07..2026-09).
(function () {
  "use strict";

  const ACCOUNTS = [
    { key: "idvorkin", label: "idvorkin", sub: "Igor", color: "var(--bst-igor)" },
    { key: "idvorkin-ai-tools", label: "idvorkin-ai-tools", sub: "agents", color: "var(--bst-ai)" },
    { key: "others", label: "others", sub: "contributors", color: "var(--bst-other)" },
  ];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const FIELDS = ["prs", "additions", "deletions", "files", "commits"];
  const SVGNS = "http://www.w3.org/2000/svg";

  const fmt = (n) => {
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
    if (a >= 1e4) return Math.round(n / 1e3) + "k";
    if (a >= 1e3) return (n / 1e3).toFixed(1) + "k";
    return String(n);
  };
  const full = (n) => n.toLocaleString("en-US");
  const el = (tag, attrs = {}, kids = []) => {
    const isSvg = ["svg", "g", "rect", "line", "text", "path", "title"].includes(tag);
    const node = isSvg ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const kid of [].concat(kids)) if (kid != null) node.append(kid);
    return node;
  };
  const monthLabel = (key) => {
    const [y, m] = key.split("-").map(Number);
    return `${MONTHS[m - 1]} ${String(y).slice(2)}`;
  };
  const longMonth = (key) => {
    const [y, m] = key.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  };
  const addMonths = (key, n) => {
    const [y, m] = key.split("-").map(Number);
    const t = y * 12 + (m - 1) + n;
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
  };
  const monthSpan = (from, to) => {
    const out = [];
    for (let k = from; k <= to; k = addMonths(k, 1)) out.push(k);
    return out;
  };
  const daysInMonth = (key) => {
    const [y, m] = key.split("-").map(Number);
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
  };
  const nowMonth = () => new Date().toISOString().slice(0, 7);
  // Calendar buckets: span 1 = month, 3 = quarter (Q1 = Jan–Mar), 6 = half (H1/H2).
  const GROUPS = [[1, "Month", "month"], [3, "Quarter", "quarter"], [6, "Half-year", "half"]];
  const bucketOf = (key, span) => {
    const [y, m] = key.split("-").map(Number);
    const from = `${y}-${String(Math.floor((m - 1) / span) * span + 1).padStart(2, "0")}`;
    return { from, to: addMonths(from, span - 1) };
  };
  const acctKeys = (acct) => (acct === "all" ? ACCOUNTS.map((a) => a.key) : [acct]);

  // "Q3 2026" / "H1 2026" for a calendar quarter or half, else null.
  function bucketName(sel, yearDigits) {
    const [fy, fm] = sel.from.split("-").map(Number);
    const [ty, tm] = sel.to.split("-").map(Number);
    const y = String(fy).slice(-yearDigits);
    if (fy !== ty) return null;
    if (tm - fm === 2 && fm % 3 === 1) return `Q${(fm + 2) / 3} ${y}`;
    if (tm - fm === 5 && fm % 6 === 1) return `H${(fm + 5) / 6} ${y}`;
    return null;
  }
  // Short label for chart axes and "vs …": "Oct 26", "Q3 26", "H1 26".
  const shortLabel = (sel) => (sel.from === sel.to ? monthLabel(sel.from) : bucketName(sel, 2));

  function selLabel(sel) {
    if (sel.from === sel.to) return longMonth(sel.from);
    const named = bucketName(sel, 4);
    if (named) return named;
    const [fy, fm] = sel.from.split("-").map(Number);
    const [ty, tm] = sel.to.split("-").map(Number);
    return fy === ty
      ? `${MONTHS[fm - 1]}–${MONTHS[tm - 1]} ${fy}`
      : `${longMonth(sel.from)} – ${longMonth(sel.to)}`;
  }

  // ---- URL hash: #m=2026-09 or #m=2026-01..2026-06 -------------------------------
  function readHash(data) {
    const m = /(?:^|[#&])m=(\d{4}-\d{2})(?:\.\.(\d{4}-\d{2}))?/.exec(location.hash);
    if (!m) return null;
    const first = data.months[0].month;
    const last = data.months[data.months.length - 1].month;
    let [from, to] = [m[1], m[2] || m[1]];
    if (from > to) [from, to] = [to, from];
    if (to < first || from > last) return null;
    // The current quarter/half runs past the last month of data; allow up to year end.
    const end = `${last.slice(0, 4)}-12`;
    return { from: from < first ? first : from, to: to > end ? end : to };
  }
  function writeHash(sel) {
    const h = sel ? `#m=${sel.from}${sel.to !== sel.from ? ".." + sel.to : ""}` : "";
    if (h === location.hash || (!h && !location.hash)) return;
    history.replaceState(null, "", location.pathname + location.search + h);
  }

  // ---- aggregation ---------------------------------------------------------------
  const zeroRow = () => Object.fromEntries(FIELDS.map((f) => [f, 0]));
  function sumBuckets(row, acct) {
    const out = zeroRow();
    if (!row) return out;
    for (const k of acctKeys(acct)) for (const f of FIELDS) out[f] += (row[k] || {})[f] || 0;
    return out;
  }
  function sumMonths(data, months, acct) {
    const want = new Set(months);
    const out = zeroRow();
    for (const r of data.months) {
      if (!want.has(r.month)) continue;
      const s = sumBuckets(r, acct);
      for (const f of FIELDS) out[f] += s[f];
    }
    return out;
  }
  function contributions(data, months, acct) {
    const want = new Set(months);
    let total = 0, active = 0;
    for (const [d, v] of Object.entries(data.days)) {
      if (!want.has(d.slice(0, 7))) continue;
      const n = acctKeys(acct).reduce((t, k) => t + (v[k] || 0), 0);
      total += n;
      if (n) active++;
    }
    return { total, active };
  }

  // First month on screen: the range's first month, pulled back to its bucket start so
  // the oldest bar is a whole quarter/half rather than a stub.
  function rangeStart(data, span, range) {
    const rows = range === "all" ? data.months : data.months.slice(-Number(range));
    return bucketOf(rows[0].month, span).from;
  }

  // Monthly rows -> calendar buckets of `span` months, each carrying per-account sums.
  // p.from/p.to are the full bucket bounds (the current one may end in the future);
  // p.months are the months that have data.
  function periods(data, span, range) {
    const start = rangeStart(data, span, range);
    const out = [];
    for (const r of data.months) {
      if (r.month < start) continue;
      const b = bucketOf(r.month, span);
      let p = out[out.length - 1];
      if (!p || p.from !== b.from) {
        p = { ...b, label: shortLabel(b), months: [] };
        for (const a of ACCOUNTS) p[a.key] = zeroRow();
        out.push(p);
      }
      p.months.push(r.month);
      for (const a of ACCOUNTS) for (const f of FIELDS) p[a.key][f] += (r[a.key] || {})[f] || 0;
    }
    return out;
  }
  const inSel = (sel, months) => !!sel && months[0] >= sel.from && months[months.length - 1] <= sel.to;

  // ---- headline ------------------------------------------------------------------
  function tile(big, label, d, title) {
    return el("div", { class: "bst-tile", title: title || null }, [
      el("div", { class: "bst-big", text: big }),
      el("div", { class: "bst-label", text: label }),
      d ? el("div", { class: "bst-delta " + (d.pct >= 0 ? "up" : "down"), text: `${d.pct >= 0 ? "▲" : "▼"} ${Math.abs(d.pct)}% vs ${d.vs}${d.paced ? " (paced)" : ""}` }) : null,
    ]);
  }

  function headline(data, state) {
    const rows = data.months;
    const first = rows[0].month;
    const unit = GROUPS.find((g) => g[0] === state.span)[2];
    // No selection: the bucket (month/quarter/half) holding the latest data.
    const sel = state.sel || bucketOf(rows[rows.length - 1].month, state.span);
    const months = monthSpan(sel.from, sel.to);
    const n = months.length;
    // Compare against the bucket of the same size just before it.
    const prev = { from: addMonths(sel.from, -n), to: addMonths(sel.from, -1) };
    const prevMonths = monthSpan(prev.from, prev.to);
    const c = sumMonths(data, months, state.acct);
    const p = prev.from >= first ? sumMonths(data, prevMonths, state.acct) : null;
    // Pace a selection that contains today (a partial month/quarter/half) to its full length.
    const now = nowMonth();
    const isCurrent = sel.from <= now && now <= sel.to;
    const totalDays = months.reduce((t, m) => t + daysInMonth(m), 0);
    const elapsed = months.filter((m) => m < now).reduce((t, m) => t + daysInMonth(m), 0) + new Date().getUTCDate();
    const pace = isCurrent ? totalDays / elapsed : 1;
    const vs = shortLabel(prev) || "prior " + n + " mo";
    const delta = (f) => (p && p[f] ? { pct: Math.round(((c[f] * pace) / p[f] - 1) * 100), vs, paced: isCurrent } : null);
    const curContrib = contributions(data, months, state.acct);
    const prevContrib = p ? contributions(data, prevMonths, state.acct) : null;
    const aiPrs = sumMonths(data, months, "idvorkin-ai-tools").prs;
    const allPrs = sumMonths(data, months, "all").prs;
    const aiShare = allPrs ? Math.round((aiPrs / allPrs) * 100) : 0;
    const heroK = `${selLabel(sel)}${isCurrent ? " so far" : ""}`;

    let tiles;
    if (state.sel) {
      const cd = prevContrib && prevContrib.total ? { pct: Math.round(((curContrib.total * pace) / prevContrib.total - 1) * 100), vs, paced: isCurrent } : null;
      tiles = [
        tile(full(c.prs), "PRs merged", delta("prs")),
        tile("+" + fmt(c.additions), "lines added", delta("additions"), full(c.additions)),
        tile("−" + fmt(c.deletions), "lines deleted", delta("deletions"), full(c.deletions)),
        tile(full(c.commits), "commits", delta("commits")),
        tile(full(curContrib.total), "contributions", cd),
        tile(`${curContrib.active}/${isCurrent ? elapsed : totalDays}`, "active days"),
      ];
    } else {
      const all = sumMonths(data, rows.map((r) => r.month), state.acct);
      tiles = [
        tile(full(c.prs), `PRs this ${unit}`, delta("prs")),
        tile("+" + fmt(c.additions), "lines added", delta("additions"), full(c.additions)),
        tile("−" + fmt(c.deletions), "lines deleted", delta("deletions"), full(c.deletions)),
        tile(full(c.commits), "commits", delta("commits")),
        tile(full(all.prs), `PRs since ${first.slice(0, 4)}`),
        tile(fmt(all.additions + all.deletions), "lines changed, all time", null, full(all.additions + all.deletions)),
      ];
    }
    return el("div", { class: "bst-headline", "aria-live": "polite" }, [
      el("div", { class: "bst-hero" }, [
        el("div", { class: "bst-hero-k", text: heroK }),
        el("div", { class: "bst-hero-v" }, [
          el("strong", { text: full(c.prs) }),
          " PRs merged, ",
          el("strong", { text: fmt(c.additions + c.deletions) }),
          " lines changed",
        ]),
        state.acct === "all" && allPrs
          ? el("div", { class: "bst-hero-s", text: `${aiShare}% of ${state.sel ? "these" : `this ${unit}'s`} PRs came from the agent account` })
          : null,
      ]),
      el("div", { class: "bst-tiles" }, tiles),
    ]);
  }

  // ---- heatmap -------------------------------------------------------------------
  function heatmap(data, state, pick) {
    const cell = 11, gap = 3, weeks = 53;
    const end = new Date();
    end.setUTCHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (weeks - 1) * 7 - end.getUTCDay());
    const counts = [];
    let total = 0;
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const day = data.days[key] || {};
      const n = acctKeys(state.acct).reduce((t, k) => t + (day[k] || 0), 0);
      total += n;
      counts.push({ key, n, dow: d.getUTCDay(), date: new Date(d) });
    }
    const nonzero = counts.map((c) => c.n).filter((n) => n > 0).sort((a, b) => a - b);
    const q = (p) => nonzero[Math.floor(p * (nonzero.length - 1))] || 1;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    const level = (n) => (n === 0 ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4);
    const left = 28, top = 16;
    const svg = el("svg", {
      viewBox: `0 0 ${left + weeks * (cell + gap)} ${top + 7 * (cell + gap)}`,
      class: "bst-heat" + (state.sel ? " has-sel" : ""),
      role: "img",
      "aria-label": `${total} contributions in the last year`,
    });
    let lastMonth = -1;
    counts.forEach((c, i) => {
      const w = Math.floor(i / 7);
      const x = left + w * (cell + gap), y = top + c.dow * (cell + gap);
      if (c.dow === 0 && c.date.getUTCMonth() !== lastMonth && c.date.getUTCDate() <= 7) {
        lastMonth = c.date.getUTCMonth();
        svg.append(el("text", { x, y: 10, class: "bst-axis", text: MONTHS[lastMonth] }));
      }
      const month = c.key.slice(0, 7);
      const on = inSel(state.sel, [month]);
      svg.append(
        el("rect", {
          x, y, width: cell, height: cell, rx: 2,
          class: `bst-l${level(c.n)}${on ? " sel" : ""}`,
          "data-month": month,
          onclick: (e) => pick(bucketOf(month, state.span), e.shiftKey),
        }, [el("title", { text: `${c.n} contribution${c.n === 1 ? "" : "s"} on ${c.key} · click to show ${selLabel(bucketOf(month, state.span))}` })])
      );
    });
    ["Mon", "Wed", "Fri"].forEach((d, i) =>
      svg.append(el("text", { x: 0, y: top + (1 + i * 2) * (cell + gap) + 9, class: "bst-axis", text: d }))
    );
    const wrap = el("div", { class: "bst-heat-wrap" }, svg);
    // On narrow screens the year scrolls sideways; start at the recent end like GitHub.
    requestAnimationFrame(() => (wrap.scrollLeft = wrap.scrollWidth));
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: `${full(total)} contributions in the last year` }),
      wrap,
      el("div", { class: "bst-heat-foot" }, [
        el("span", { class: "bst-muted", text: "Contribution = a merged PR or a default-branch commit. Click a square to show its period." }),
        el("div", { class: "bst-legend" }, ["Less", ...[0, 1, 2, 3, 4].map((l) => el("span", { class: `bst-sw bst-l${l}` })), "More"]),
      ]),
    ]);
  }

  // ---- bar charts ----------------------------------------------------------------
  // Each chart is one tab stop; arrow keys move between bars, Enter/Space selects.
  function barKeys(e) {
    const bars = [...e.currentTarget.querySelectorAll(".bst-bar")];
    const i = bars.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight") j = Math.min(bars.length - 1, i + 1);
    else if (e.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = bars.length - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      bars[i].dispatchEvent(new MouseEvent("click", { shiftKey: e.shiftKey }));
      return;
    }
    if (j == null) return;
    e.preventDefault();
    bars[i].setAttribute("tabindex", "-1");
    bars[j].setAttribute("tabindex", "0");
    bars[j].focus();
  }
  function barGroup(ps, i, state, pick, title, kids) {
    const p = ps[i];
    const on = inSel(state.sel, p.months);
    const focusIdx = (() => {
      const s = ps.findIndex((q) => inSel(state.sel, q.months));
      return s >= 0 ? s : ps.length - 1;
    })();
    return el("g", {
      class: "bst-bar" + (on ? " sel" : ""),
      role: "button",
      tabindex: i === focusIdx ? "0" : "-1",
      "aria-pressed": String(on),
      "aria-label": `${title}. Press Enter to show this period.`,
      "data-months": p.months.join(","),
      onclick: (e) => pick(p, e.shiftKey),
    }, [el("title", { text: title }), ...kids]);
  }
  function chartSvg(W, H, label, sel) {
    return el("svg", { viewBox: `0 0 ${W} ${H}`, class: "bst-chart" + (sel ? " has-sel" : ""), role: "group", "aria-label": label, onkeydown: barKeys });
  }

  function stackedBars(ps, field, state, pick, title) {
    const accts = state.acct === "all" ? ACCOUNTS : ACCOUNTS.filter((a) => a.key === state.acct);
    const W = 460, H = 220, padL = 34, padB = 20, padT = 8;
    const totals = ps.map((p) => accts.reduce((t, a) => t + p[a.key][field], 0));
    const max = Math.max(1, ...totals);
    const bw = (W - padL) / ps.length;
    const svg = chartSvg(W, H, `${title} per period; arrow keys move, Enter selects`, state.sel);
    const y = (v) => H - padB - (v / max) * (H - padB - padT);
    [0, 0.5, 1].forEach((f) => {
      const v = Math.round(max * f);
      svg.append(el("line", { x1: padL, x2: W, y1: y(v), y2: y(v), class: "bst-grid" }));
      svg.append(el("text", { x: padL - 6, y: y(v) + 4, class: "bst-axis", "text-anchor": "end", text: fmt(v) }));
    });
    const every = Math.ceil(ps.length / 6);
    ps.forEach((p, i) => {
      let base = 0;
      const x = padL + i * bw;
      const kids = [el("rect", { x, y: padT, width: bw, height: H - padB - padT, class: "bst-hit" })];
      for (const a of accts) {
        const v = p[a.key][field];
        if (!v) continue;
        kids.push(el("rect", { x: x + bw * 0.15, width: bw * 0.7, y: y(base + v), height: y(base) - y(base + v), fill: a.color, rx: 1.5 }));
        base += v;
      }
      const tip = `${p.label}: ${full(totals[i])} ${title.toLowerCase()}` + (accts.length > 1 ? " (" + accts.map((a) => `${a.label} ${full(p[a.key][field])}`).join(", ") + ")" : "");
      svg.append(barGroup(ps, i, state, pick, tip, kids));
      if (i % every === 0)
        svg.append(el("text", { x: x + bw / 2, y: H - 6, class: "bst-axis", "text-anchor": "middle", text: p.label }));
    });
    return el("section", { class: "bst-card" }, [el("h3", { class: "bst-h", text: title }), svg]);
  }

  // Lines added above the axis, deleted below.
  function diverging(ps, state, pick) {
    const W = 960, H = 220, padL = 44, padB = 20;
    const vals = ps.map((p) => acctKeys(state.acct).reduce((t, k) => ({ add: t.add + p[k].additions, del: t.del + p[k].deletions }), { add: 0, del: 0 }));
    const max = Math.max(1, ...vals.map((v) => Math.max(v.add, v.del)));
    const mid = (H - padB) / 2 + 4;
    const half = mid - 8;
    const bw = (W - padL) / ps.length;
    const svg = chartSvg(W, H, "Lines added and deleted per period; arrow keys move, Enter selects", state.sel);
    svg.append(el("line", { x1: padL, x2: W, y1: mid, y2: mid, class: "bst-zero" }));
    svg.append(el("text", { x: padL - 6, y: mid - half + 4, class: "bst-axis", "text-anchor": "end", text: "+" + fmt(max) }));
    svg.append(el("text", { x: padL - 6, y: mid + half + 4, class: "bst-axis", "text-anchor": "end", text: "−" + fmt(max) }));
    const every = Math.ceil(ps.length / 12);
    vals.forEach((v, i) => {
      const x = padL + i * bw, w = bw * 0.7;
      const ha = (v.add / max) * half, hd = (v.del / max) * half;
      svg.append(barGroup(ps, i, state, pick, `${ps[i].label}: +${full(v.add)} / −${full(v.del)} lines`, [
        el("rect", { x, y: mid - half, width: bw, height: half * 2, class: "bst-hit" }),
        el("rect", { x: x + bw * 0.15, width: w, y: mid - ha, height: ha, class: "bst-add", rx: 1.5 }),
        el("rect", { x: x + bw * 0.15, width: w, y: mid, height: hd, class: "bst-del", rx: 1.5 }),
      ]));
      if (i % every === 0)
        svg.append(el("text", { x: x + bw / 2, y: H - 4, class: "bst-axis", "text-anchor": "middle", text: ps[i].label }));
    });
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h" }, ["Lines changed ", el("span", { class: "bst-key bst-add-t", text: "+ added" }), " ", el("span", { class: "bst-key bst-del-t", text: "− deleted" })]),
      svg,
    ]);
  }

  // ---- top repos + split ---------------------------------------------------------
  function topRepos(data, state) {
    const keys = acctKeys(state.acct);
    let rows;
    if (state.sel) {
      const months = monthSpan(state.sel.from, state.sel.to);
      rows = data.repos.map((r) => {
        let prs = 0, lines = 0;
        for (const m of months) for (const k of keys) {
          const v = ((r.m || {})[m] || {})[k];
          if (v) { prs += v[0]; lines += v[1]; }
        }
        return { r, prs, lines };
      });
    } else {
      rows = data.repos.map((r) => {
        let prs = 0, lines = 0;
        for (const k of keys) {
          const v = (r.d30 || {})[k];
          if (v) { prs += v[0]; lines += v[1]; }
        }
        return { r, prs, lines };
      });
    }
    rows = rows.filter((x) => x.prs).sort((a, b) => b.lines - a.lines || b.prs - a.prs).slice(0, 10);
    const max = Math.max(1, ...rows.map((x) => x.lines));
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: `Top repos, ${state.sel ? selLabel(state.sel) : "last 30 days"}` }),
      rows.length
        ? el("table", { class: "bst-table" }, [
            el("thead", {}, el("tr", {}, ["Repo", "PRs", "Lines", ""].map((h) => el("th", { text: h })))),
            el("tbody", {}, rows.map(({ r, prs, lines }) => {
              const [owner, name] = r.repo.split("/");
              return el("tr", {}, [
                el("td", {}, [
                  el("a", { href: `https://github.com/${r.repo}`, class: "bst-repo" }, [el("span", { class: "bst-owner", text: owner + "/" }), name]),
                  r.language ? el("span", { class: "bst-lang", text: r.language }) : null,
                ]),
                el("td", { class: "bst-num", text: full(prs) }),
                el("td", { class: "bst-num", text: fmt(lines) }),
                el("td", { class: "bst-spark" }, el("span", { style: `width:${(lines / max) * 100}%` })),
              ]);
            })),
          ])
        : el("p", { class: "bst-muted", text: "No merged PRs in this period." }),
    ]);
  }

  function accountSplit(data, state) {
    const months = state.sel ? new Set(monthSpan(state.sel.from, state.sel.to)) : null;
    const tot = Object.fromEntries(ACCOUNTS.map((a) => [a.key, 0]));
    for (const r of data.months) {
      if (months && !months.has(r.month)) continue;
      for (const a of ACCOUNTS) tot[a.key] += (r[a.key] || {}).prs || 0;
    }
    const sum = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: `Who merged the PRs (${state.sel ? selLabel(state.sel) : "all time"})` }),
      el("div", { class: "bst-split" }, ACCOUNTS.map((a) => el("span", { style: `width:${(tot[a.key] / sum) * 100}%;background:${a.color}`, title: `${a.label}: ${full(tot[a.key])}` }))),
      el("ul", { class: "bst-split-key" }, ACCOUNTS.map((a) =>
        el("li", {}, [
          el("span", { class: "bst-dot", style: `background:${a.color}` }),
          el("strong", { text: a.label }),
          ` ${a.sub} · ${full(tot[a.key])} PRs (${Math.round((tot[a.key] / sum) * 100)}%)`,
        ])
      )),
    ]);
  }

  // ---- controls ------------------------------------------------------------------
  // A labelled native <select>: compact, and the phone's own picker on iOS.
  function picker(label, ctl, options, value, onChange) {
    const select = el("select", { class: "bst-select", "data-ctl": ctl, onchange: (e) => onChange(e.target.value) },
      options.map(([v, text]) => el("option", { value: v, text })));
    select.value = String(value);
    return el("label", { class: "bst-field" }, [el("span", { class: "bst-field-l", text: label }), select]);
  }

  function render(root, data, state) {
    const draw = () => render(root, data, state);
    const setSel = (sel) => {
      state.sel = sel;
      // Make sure a selection is on screen: widen the range if it starts earlier.
      if (sel && state.range !== "all" && sel.from < rangeStart(data, state.span, state.range)) state.range = "all";
      writeHash(sel);
      draw();
    };
    const pick = (b, extend) => {
      const s = { from: b.from, to: b.to };
      if (extend && state.sel) {
        setSel({ from: s.from < state.sel.from ? s.from : state.sel.from, to: s.to > state.sel.to ? s.to : state.sel.to });
      } else if (state.sel && state.sel.from === s.from && state.sel.to === s.to) {
        setSel(null);
      } else {
        setSel(s);
      }
    };
    const ps = periods(data, state.span, state.range);
    const active = document.activeElement;
    const refocus = active && root.contains(active) && active.dataset ? active.dataset.months || active.dataset.ctl : null;

    root.replaceChildren(
      el("div", { class: "bst-controls" }, [
        el("div", { class: "bst-fields" }, [
          picker("Group by", "group", GROUPS.map(([v, label]) => [v, label]), state.span, (v) => {
            state.span = Number(v);
            // Keep a selection, widened to whole buckets of the new size.
            if (state.sel) setSel({ from: bucketOf(state.sel.from, state.span).from, to: bucketOf(state.sel.to, state.span).to });
            else draw();
          }),
          picker("Range", "range", [["12", "Last 12 mo"], ["24", "Last 24 mo"], ["all", "All time"]], state.range, (v) => ((state.range = v), draw())),
          picker("Account", "acct", [["all", "All"], ...ACCOUNTS.slice(0, 2).map((a) => [a.key, a.label])], state.acct, (v) => ((state.acct = v), draw())),
        ]),
        state.sel
          ? el("button", { type: "button", class: "bst-chip", "data-ctl": "chip", "aria-label": `Showing ${selLabel(state.sel)}. Reset to the default view.`, onclick: () => setSel(null) }, [
              "Showing: ", el("strong", { text: selLabel(state.sel) }), el("span", { class: "bst-chip-x", text: " · reset ✕" }),
            ])
          : el("span", { class: "bst-hint", text: "Click a bar or square to focus on that period" }),
      ]),
      headline(data, state),
      heatmap(data, state, pick),
      el("div", { class: "bst-grid2" }, [stackedBars(ps, "prs", state, pick, "Merged PRs"), stackedBars(ps, "commits", state, pick, "Commits")]),
      diverging(ps, state, pick),
      el("div", { class: "bst-grid2" }, [topRepos(data, state), accountSplit(data, state)]),
      el("details", { class: "bst-notes" }, [
        el("summary", { text: `What's counted · data as of ${data.generated_at.slice(0, 10)}` }),
        el("ul", {}, [
          ...data.notes.map((n) => el("li", { text: n })),
          el("li", { text: `Excluded: ${full(data.excluded.bot_prs)} bot PRs, ${full(data.excluded.non_default_base_prs)} PRs into non-default branches, ${fmt(data.excluded.generated_lines)} lockfile/generated lines.` }),
        ]),
      ]),
    );
    // Keep keyboard focus on the same bar (first chart that has it) across re-renders.
    if (refocus) {
      const sel = root.querySelector(`[data-ctl="${refocus}"]`) || root.querySelector(`.bst-bar[data-months="${refocus}"]`);
      (sel || root.querySelector(".bst-bar[tabindex='0']"))?.focus();
    }
  }

  window.renderBuildStats = function (root, data) {
    root.classList.add("bst-root");
    const state = { acct: "all", span: 1, range: "24", sel: null };
    const fromHash = () => {
      state.sel = readHash(data);
      if (state.sel && state.range !== "all" && state.sel.from < rangeStart(data, state.span, state.range)) state.range = "all";
    };
    fromHash();
    window.addEventListener("hashchange", () => (fromHash(), render(root, data, state)));
    render(root, data, state);
  };

  const auto = document.getElementById("build-stats-app");
  if (auto && auto.dataset.src) {
    fetch(auto.dataset.src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => window.renderBuildStats(auto, d))
      .catch((e) => (auto.textContent = `Couldn't load ${auto.dataset.src}: ${e.message}`));
  }
})();
