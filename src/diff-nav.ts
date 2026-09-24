// ABOUTME: Walks a reader through a list of changes: floating "change 3 of 12" control, n/p j/k keys,
// ABOUTME: visited tracking and a clickable change map on the right edge. Knows nothing about how changes are found.

export type ChangeKind = "added" | "removed" | "changed";
export type Change = { el: HTMLElement; kind: ChangeKind };

const COLORS: Record<ChangeKind, string> = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" };

const STYLE = `
#rd-nav{position:fixed;right:20px;bottom:20px;z-index:1001;display:flex;align-items:center;gap:6px;background:#24292f;color:#fff;border-radius:8px;padding:6px 8px;font:600 13px/1.2 system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25)}
#rd-nav button{background:#444c56;color:#fff;border:0;border-radius:5px;padding:5px 10px;font:inherit;cursor:pointer;min-width:36px}
#rd-nav button:hover{background:#57606a}
#rd-nav .rd-count{min-width:9.5em;text-align:center}
#rd-nav .rd-seen-count{display:block;font-weight:400;font-size:11px;opacity:.8}
#rd-nav .rd-keys{font-weight:400;font-size:11px;opacity:.6}
#rd-map{position:fixed;right:0;top:100px;bottom:16px;width:12px;z-index:1000;background:rgba(175,184,193,.25)}
#rd-map .rd-tick{position:absolute;left:1px;right:1px;min-height:3px;border-radius:1px;cursor:pointer;opacity:.55}
#rd-map .rd-tick.rd-tick-seen{opacity:.2}
#rd-map .rd-tick.rd-tick-current{opacity:1;left:-3px;box-shadow:0 0 0 1px #fff}
.rd-flash{animation:rd-flash 1.2s ease-out}
@keyframes rd-flash{0%{box-shadow:0 0 0 4px #0969da}100%{box-shadow:0 0 0 4px rgba(9,105,218,0)}}
@media (max-width:600px){
  #rd-nav{left:0;right:0;bottom:0;border-radius:0;justify-content:space-between;padding:8px 10px}
  #rd-nav button{padding:8px 14px}
  #rd-nav .rd-keys{display:none}
  #rd-map{bottom:52px;width:8px}
}
`;

export type ChangeNav = { go: (i: number) => void; next: () => void; prev: () => void; dispose: () => void };

/** Attach navigation over `changes` (in page order). Call dispose() to remove every trace. */
export function attachChangeNav(changes: Change[], doc: Document = document): ChangeNav {
  const win = doc.defaultView as Window;
  const seen = new Set<number>();
  let current = -1;

  if (!doc.getElementById("rd-nav-style")) {
    const s = doc.createElement("style");
    s.id = "rd-nav-style";
    s.textContent = STYLE;
    doc.head.appendChild(s);
  }

  const nav = doc.createElement("div");
  nav.id = "rd-nav";
  nav.innerHTML =
    '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button>' +
    '<span class="rd-count"></span>' +
    '<button type="button" data-rd="next" title="Next change (n / j)">›</button>' +
    '<span class="rd-keys">n/p</span>';
  const count = nav.querySelector(".rd-count") as HTMLElement;

  const map = doc.createElement("div");
  map.id = "rd-map";
  const ticks = changes.map((c, i) => {
    const t = doc.createElement("div");
    t.className = "rd-tick";
    t.style.background = COLORS[c.kind];
    t.title = `${c.kind} — change ${i + 1}`;
    t.onclick = () => go(i);
    map.appendChild(t);
    return t;
  });

  function layoutMap() {
    const height = Math.max(doc.documentElement.scrollHeight, 1);
    changes.forEach((c, i) => {
      const r = c.el.getBoundingClientRect();
      ticks[i].style.top = `${((r.top + win.scrollY) / height) * 100}%`;
      ticks[i].style.height = `${(r.height / height) * 100}%`;
    });
  }

  function render() {
    const n = changes.length;
    const pos = current < 0 ? `${n} change${n === 1 ? "" : "s"}` : `change ${current + 1} of ${n}`;
    const seenText = seen.size === n ? `all ${n} seen ✓` : `${seen.size} of ${n} seen`;
    count.innerHTML = `${pos}<span class="rd-seen-count">${seenText}</span>`;
    ticks.forEach((t, i) => {
      t.classList.toggle("rd-tick-seen", seen.has(i) && i !== current);
      t.classList.toggle("rd-tick-current", i === current);
    });
  }

  function go(i: number) {
    if (!changes.length) return;
    current = ((i % changes.length) + changes.length) % changes.length;
    const el = changes[current].el;
    seen.add(current);
    const top = el.getBoundingClientRect().top + win.scrollY - win.innerHeight / 3;
    win.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    el.classList.remove("rd-flash");
    void el.offsetWidth; // restart the animation when revisiting
    el.classList.add("rd-flash");
    render();
  }
  const next = () => go(current + 1);
  const prev = () => go(current < 0 ? changes.length - 1 : current - 1);

  nav.addEventListener("click", (e) => {
    const which = (e.target as HTMLElement).closest("button")?.dataset.rd;
    if (which === "next") next();
    if (which === "prev") prev();
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t?.closest?.("input, textarea, select, [contenteditable]")) return;
    if (e.key === "n" || e.key === "j") next();
    else if (e.key === "p" || e.key === "k") prev();
    else return;
    e.preventDefault();
  };

  doc.addEventListener("keydown", onKey);
  win.addEventListener("resize", layoutMap);
  doc.body.append(nav, map);
  layoutMap();
  // Images and fonts settle after the first layout; re-place the ticks once they have.
  const relayout = win.setTimeout(layoutMap, 1500);
  render();

  return {
    go,
    next,
    prev,
    dispose() {
      doc.removeEventListener("keydown", onKey);
      win.removeEventListener("resize", layoutMap);
      win.clearTimeout(relayout);
      nav.remove();
      map.remove();
    },
  };
}
