// Build stats dashboard: renders build-stats.json (made by build_stats.py) into #build-stats.
// Vanilla JS + hand-drawn SVG, no dependencies. Used by /build-stats and the Lavish mockup.
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

  function sumBuckets(row, acct) {
    const keys = acct === "all" ? ACCOUNTS.map((a) => a.key) : [acct];
    const out = Object.fromEntries(FIELDS.map((f) => [f, 0]));
    for (const k of keys) for (const f of FIELDS) out[f] += (row[k] || {})[f] || 0;
    return out;
  }

  // Monthly rows -> periods (1 or 2 months each), each carrying per-account sums.
  function periods(data, span, months) {
    let rows = data.months;
    if (months !== "all") rows = rows.slice(-Number(months));
    const out = [];
    for (const r of rows) {
      const [y, m] = r.month.split("-").map(Number);
      const key = span === 2 ? `${y}-${Math.floor((m - 1) / 2)}` : r.month;
      let p = out[out.length - 1];
      if (!p || p.key !== key) {
        p = { key, label: monthLabel(r.month), months: [] };
        for (const a of ACCOUNTS) p[a.key] = Object.fromEntries(FIELDS.map((f) => [f, 0]));
        out.push(p);
      }
      if (span === 2 && p.months.length === 1) p.label += "–" + MONTHS[m - 1];
      p.months.push(r.month);
      for (const a of ACCOUNTS) for (const f of FIELDS) p[a.key][f] += (r[a.key] || {})[f] || 0;
    }
    return out;
  }

  function headline(data, acct) {
    const rows = data.months;
    const cur = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    const all = rows.reduce(
      (t, r) => {
        const s = sumBuckets(r, acct);
        for (const f of FIELDS) t[f] += s[f];
        return t;
      },
      Object.fromEntries(FIELDS.map((f) => [f, 0]))
    );
    const c = sumBuckets(cur, acct);
    const p = prev ? sumBuckets(prev, acct) : null;
    // Pace the partial current month to a full month so "vs last month" is fair.
    const now = new Date();
    const dim = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).getDate();
    const isCurrent = cur.month === now.toISOString().slice(0, 7);
    const pace = isCurrent ? dim / now.getUTCDate() : 1;
    const delta = (f) => (p && p[f] ? Math.round(((c[f] * pace) / p[f] - 1) * 100) : null);
    const aiShare = (() => {
      const ai = sumBuckets(cur, "idvorkin-ai-tools").prs;
      const tot = sumBuckets(cur, "all").prs;
      return tot ? Math.round((ai / tot) * 100) : 0;
    })();
    const tile = (big, label, d, title) =>
      el("div", { class: "bst-tile", title: title || "" }, [
        el("div", { class: "bst-big", text: big }),
        el("div", { class: "bst-label", text: label }),
        d == null
          ? null
          : el("div", {
              class: "bst-delta " + (d >= 0 ? "up" : "down"),
              text: `${d >= 0 ? "▲" : "▼"} ${Math.abs(d)}% vs ${monthLabel(prev.month)}${isCurrent ? " (paced)" : ""}`,
            }),
      ]);
    return el("div", { class: "bst-headline" }, [
      el("div", { class: "bst-hero" }, [
        el("div", { class: "bst-hero-k", text: `${monthLabel(cur.month)}${isCurrent ? " so far" : ""}` }),
        el("div", { class: "bst-hero-v" }, [
          el("strong", { text: full(c.prs) }),
          " PRs merged, ",
          el("strong", { text: fmt(c.additions + c.deletions) }),
          " lines changed",
        ]),
        acct === "all"
          ? el("div", { class: "bst-hero-s", text: `${aiShare}% of this month's PRs came from the agent account` })
          : null,
      ]),
      el("div", { class: "bst-tiles" }, [
        tile(full(c.prs), "PRs this month", delta("prs")),
        tile("+" + fmt(c.additions), "lines added", delta("additions"), full(c.additions)),
        tile("−" + fmt(c.deletions), "lines deleted", delta("deletions"), full(c.deletions)),
        tile(full(c.commits), "commits", delta("commits")),
        tile(full(all.prs), `PRs since ${rows[0].month.slice(0, 4)}`, null),
        tile(fmt(all.additions + all.deletions), "lines changed, all time", null, full(all.additions + all.deletions)),
      ]),
    ]);
  }

  function heatmap(data, acct) {
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
      const n = acct === "all" ? Object.values(day).reduce((a, b) => a + b, 0) : day[acct] || 0;
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
      class: "bst-heat",
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
      svg.append(
        el("rect", { x, y, width: cell, height: cell, rx: 2, class: `bst-l${level(c.n)}` }, [
          el("title", { text: `${c.n} contribution${c.n === 1 ? "" : "s"} on ${c.key}` }),
        ])
      );
    });
    ["Mon", "Wed", "Fri"].forEach((d, i) =>
      svg.append(el("text", { x: 0, y: top + (1 + i * 2) * (cell + gap) + 9, class: "bst-axis", text: d }))
    );
    const legend = el("div", { class: "bst-legend" }, [
      "Less",
      ...[0, 1, 2, 3, 4].map((l) => el("span", { class: `bst-sw bst-l${l}` })),
      "More",
    ]);
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: `${full(total)} contributions in the last year` }),
      (() => {
        // On narrow screens the year scrolls sideways; start at the recent end like GitHub.
        const wrap = el("div", { class: "bst-heat-wrap" }, svg);
        requestAnimationFrame(() => (wrap.scrollLeft = wrap.scrollWidth));
        return wrap;
      })(),
      el("div", { class: "bst-heat-foot" }, [
        el("span", { class: "bst-muted", text: "Contribution = a merged PR or a default-branch commit." }),
        legend,
      ]),
    ]);
  }

  // Stacked bars of one field per period, split by account.
  function stackedBars(ps, field, acct, title) {
    const accts = acct === "all" ? ACCOUNTS : ACCOUNTS.filter((a) => a.key === acct);
    const W = 460, H = 220, padL = 34, padB = 20, padT = 8;
    const totals = ps.map((p) => accts.reduce((t, a) => t + p[a.key][field], 0));
    const max = Math.max(1, ...totals);
    const bw = (W - padL) / ps.length;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "bst-chart", role: "img", "aria-label": title });
    const y = (v) => H - padB - (v / max) * (H - padB - padT);
    [0, 0.5, 1].forEach((f) => {
      const v = Math.round(max * f);
      svg.append(el("line", { x1: padL, x2: W, y1: y(v), y2: y(v), class: "bst-grid" }));
      svg.append(el("text", { x: padL - 6, y: y(v) + 4, class: "bst-axis", "text-anchor": "end", text: fmt(v) }));
    });
    const every = Math.ceil(ps.length / 6);
    ps.forEach((p, i) => {
      let base = 0;
      const x = padL + i * bw + bw * 0.15;
      const g = el("g", { class: "bst-bar" }, [
        el("title", {
          text: `${p.label}: ` + accts.map((a) => `${a.label} ${full(p[a.key][field])}`).join(" · "),
        }),
      ]);
      for (const a of accts) {
        const v = p[a.key][field];
        if (!v) continue;
        g.append(el("rect", { x, width: bw * 0.7, y: y(base + v), height: y(base) - y(base + v), fill: a.color, rx: 1.5 }));
        base += v;
      }
      svg.append(g);
      if (i % every === 0)
        svg.append(el("text", { x: x + bw * 0.35, y: H - 6, class: "bst-axis", "text-anchor": "middle", text: p.label.split("–")[0] }));
    });
    return el("section", { class: "bst-card" }, [el("h3", { class: "bst-h", text: title }), svg]);
  }

  // Lines added above the axis, deleted below.
  function diverging(ps, acct) {
    const W = 960, H = 220, padL = 44, padB = 20;
    const vals = ps.map((p) => {
      const keys = acct === "all" ? ACCOUNTS.map((a) => a.key) : [acct];
      return keys.reduce((t, k) => ({ add: t.add + p[k].additions, del: t.del + p[k].deletions }), { add: 0, del: 0 });
    });
    const max = Math.max(1, ...vals.map((v) => Math.max(v.add, v.del)));
    const mid = (H - padB) / 2 + 4;
    const half = mid - 8;
    const bw = (W - padL) / ps.length;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "bst-chart", role: "img", "aria-label": "Lines added and deleted" });
    svg.append(el("line", { x1: padL, x2: W, y1: mid, y2: mid, class: "bst-zero" }));
    svg.append(el("text", { x: padL - 6, y: mid - half + 4, class: "bst-axis", "text-anchor": "end", text: "+" + fmt(max) }));
    svg.append(el("text", { x: padL - 6, y: mid + half + 4, class: "bst-axis", "text-anchor": "end", text: "−" + fmt(max) }));
    const every = Math.ceil(ps.length / 12);
    vals.forEach((v, i) => {
      const x = padL + i * bw + bw * 0.15, w = bw * 0.7;
      const ha = (v.add / max) * half, hd = (v.del / max) * half;
      svg.append(
        el("g", { class: "bst-bar" }, [
          el("title", { text: `${ps[i].label}: +${full(v.add)} / −${full(v.del)}` }),
          el("rect", { x, width: w, y: mid - ha, height: ha, class: "bst-add", rx: 1.5 }),
          el("rect", { x, width: w, y: mid, height: hd, class: "bst-del", rx: 1.5 }),
        ])
      );
      if (i % every === 0)
        svg.append(el("text", { x: x + w / 2, y: H - 4, class: "bst-axis", "text-anchor": "middle", text: ps[i].label.split("–")[0] }));
    });
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h" }, [
        "Lines changed ",
        el("span", { class: "bst-key bst-add-t", text: "+ added" }),
        " ",
        el("span", { class: "bst-key bst-del-t", text: "− deleted" }),
      ]),
      svg,
    ]);
  }

  function topRepos(data) {
    const rows = data.repos.slice().sort((a, b) => b.lines_30d - a.lines_30d || b.lines - a.lines).slice(0, 10);
    const max = Math.max(1, ...rows.map((r) => r.lines_30d));
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: "Top repos, last 30 days" }),
      el("table", { class: "bst-table" }, [
        el("thead", {}, el("tr", {}, ["Repo", "PRs", "Lines", ""].map((h) => el("th", { text: h })))),
        el(
          "tbody",
          {},
          rows.map((r) => {
            const [owner, name] = r.repo.split("/");
            return el("tr", {}, [
              el("td", {}, [
                el("a", { href: `https://github.com/${r.repo}`, class: "bst-repo" }, [
                  el("span", { class: "bst-owner", text: owner + "/" }),
                  name,
                ]),
                r.language ? el("span", { class: "bst-lang", text: r.language }) : null,
              ]),
              el("td", { class: "bst-num", text: full(r.prs_30d) }),
              el("td", { class: "bst-num", text: fmt(r.lines_30d) }),
              el("td", { class: "bst-spark" }, el("span", { style: `width:${(r.lines_30d / max) * 100}%` })),
            ]);
          })
        ),
      ]),
    ]);
  }

  function accountSplit(data) {
    const tot = Object.fromEntries(ACCOUNTS.map((a) => [a.key, 0]));
    for (const r of data.months) for (const a of ACCOUNTS) tot[a.key] += (r[a.key] || {}).prs || 0;
    const sum = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
    return el("section", { class: "bst-card" }, [
      el("h3", { class: "bst-h", text: "Who merged the PRs (all time)" }),
      el(
        "div",
        { class: "bst-split" },
        ACCOUNTS.map((a) => el("span", { style: `width:${(tot[a.key] / sum) * 100}%;background:${a.color}`, title: `${a.label}: ${full(tot[a.key])}` }))
      ),
      el(
        "ul",
        { class: "bst-split-key" },
        ACCOUNTS.map((a) =>
          el("li", {}, [
            el("span", { class: "bst-dot", style: `background:${a.color}` }),
            el("strong", { text: a.label }),
            ` ${a.sub} · ${full(tot[a.key])} PRs (${Math.round((tot[a.key] / sum) * 100)}%)`,
          ])
        )
      ),
    ]);
  }

  function seg(name, options, value, onPick) {
    return el(
      "div",
      { class: "bst-seg", role: "group", "aria-label": name },
      options.map(([v, label]) =>
        el("button", { type: "button", class: v === value ? "on" : "", "aria-pressed": String(v === value), onclick: () => onPick(v), text: label })
      )
    );
  }

  function render(root, data, state) {
    const ps = periods(data, state.span, state.months);
    const draw = () => render(root, data, state);
    root.replaceChildren(
      el("div", { class: "bst-controls" }, [
        seg("Account", [["all", "All accounts"], ...ACCOUNTS.slice(0, 2).map((a) => [a.key, a.label])], state.acct, (v) => ((state.acct = v), draw())),
        seg("Bucket", [[1, "Monthly"], [2, "2-month"]], state.span, (v) => ((state.span = v), draw())),
        seg("Range", [["12", "12 mo"], ["24", "24 mo"], ["all", "All"]], state.months, (v) => ((state.months = v), draw())),
      ]),
      headline(data, state.acct),
      heatmap(data, state.acct),
      el("div", { class: "bst-grid2" }, [
        stackedBars(ps, "prs", state.acct, "Merged PRs"),
        stackedBars(ps, "commits", state.acct, "Commits"),
      ]),
      diverging(ps, state.acct),
      el("div", { class: "bst-grid2" }, [topRepos(data), accountSplit(data)]),
      el("details", { class: "bst-notes" }, [
        el("summary", { text: `What's counted · data as of ${data.generated_at.slice(0, 10)}` }),
        el("ul", {}, [
          ...data.notes.map((n) => el("li", { text: n })),
          el("li", {
            text: `Excluded: ${full(data.excluded.bot_prs)} bot PRs, ${full(data.excluded.non_default_base_prs)} PRs into non-default branches, ${fmt(data.excluded.generated_lines)} lockfile/generated lines.`,
          }),
        ]),
      ]),
    );
  }

  window.renderBuildStats = function (root, data) {
    root.classList.add("bst-root");
    render(root, data, { acct: "all", span: 1, months: "24" });
  };

  const auto = document.getElementById("build-stats");
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
