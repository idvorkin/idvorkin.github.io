function e(e) {
	const t = `<a href=${e.url}>${e.title}</a>`;
	return `
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`;
}
function t(e) {
	if (0 !== e.length) return e[Math.floor(Math.random() * e.length)];
}
function n(e) {
	let t = e.length,
		n;
	while (0 != t)
		(n = Math.floor(Math.random() * t)), t--, ([e[t], e[n]] = [e[n], e[t]]);
	return e;
}
async function o(e, t) {
	const n = $(e);
	if (1 != n.length) {
		console.log(`append_randomizer_div ${e} not present`);
		return;
	}
	const o = $(await t());
	n.empty().append(o),
		n.click(async (e) => {
			if ("A" != e.target.tagName) {
				const e = $(await t());
				n.empty().append(e);
			}
		});
}
let i = null;
async function l(e) {
	if (null != i) return i;
	const t = (e || window.location.href).includes("https://idvork.in");
	var n =
		"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
	t || (n = "/back-links.json");
	try {
		const e = await fetch(n);
		return (i = (await e.json()).url_info);
	} catch (e) {
		return console.error("Error fetching link info", e), {};
	}
}
async function r(e = "/back-links.json") {
	if ("/test-missing-url-info" === e)
		throw Error("Missing url_info in data structure");
	try {
		return await l(e);
	} catch (e) {
		throw Error("Missing url_info in data structure");
	}
}
async function a() {
	return [
		...Object.entries(await r())
			.map(([e, t]) => ({
				url: e,
				title: t.title || e,
				description: t.description || "",
				doc_size: t.doc_size || 0,
				last_modified: t.last_modified || "",
			}))
			.filter(
				(e) =>
					e.description &&
					"" !== e.description.trim() &&
					e.title &&
					"" !== e.title.trim(),
			),
	].sort((e, t) =>
		e.last_modified && t.last_modified
			? new Date(t.last_modified).getTime() -
				new Date(e.last_modified).getTime()
			: t.doc_size - e.doc_size,
	);
}
async function s(e = "recent-posts") {
	console.log("\uD83D\uDD0D updateRecentPosts function called");
	const t = document.getElementById(e);
	if (
		(console.log(
			"\uD83D\uDD0D recent-posts container element:",
			t ? "found" : "not found",
		),
		!t)
	) {
		console.error(`\u{274C} ${e} container not found in DOM`);
		return;
	}
	try {
		var n;
		console.log("\uD83D\uDD0D Fetching back-links.json...");
		const e = await a();
		console.log(
			"\uD83D\uDD0D Sorted pages, first 5:",
			e.slice(0, 5).map((e) => ({
				url: e.url,
				title: e.title,
				last_modified: e.last_modified,
			})),
		);
		const o =
			((n = ((e, t = 5) => e.slice(0, t))(e)),
			0 === n.length
				? "<p>No recent posts found.</p>"
				: `
    <ul>
      ${n
				.map(
					(e) => `
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0, 100)}${e.description.length > 100 ? "..." : ""}
        </li>
      `,
				)
				.join("")}
    </ul>
  `);
		console.log(
			"\uD83D\uDD0D Updating recent-posts content with HTML",
			o.substring(0, 100) + "...",
		),
			(t.innerHTML = o),
			console.log("✅ Recent posts updated successfully");
	} catch (e) {
		console.error("❌ Error loading recent posts:", e),
			(t.innerHTML =
				"<p>Error loading recent posts. Please try again later.</p>");
	}
}
function c(e) {
	const t = {};
	return (
		e.forEach((e) => {
			if (!e.last_modified) return;
			const n = new Date(e.last_modified),
				o = `${n.toLocaleString("default", { month: "long" })} ${n.getFullYear()}`;
			t[o] || (t[o] = []), t[o].push(e);
		}),
		t
	);
}
function d(e) {
	let t = "";
	return (
		Object.entries(e).forEach(([e, n]) => {
			t += `
      <h3>${e}</h3>
      <ul class="last-modified-list">
        ${n
					.map((e) => {
						const t = new Date(e.last_modified).toLocaleDateString("en-US", {
							day: "numeric",
							month: "short",
						});
						return `
          <li>
            <span class="date-badge">${t}</span>
            <a href="${e.url}">${e.title}</a>
            <p class="description">${e.description.split("\n")[0].substring(0, 150)}${e.description.length > 150 ? "..." : ""}</p>
          </li>
        `;
					})
					.join("")}
      </ul>
    `;
		}),
		t
	);
}
async function u(e = "last-modified-posts", t = 15, n = document) {
	console.log("\uD83D\uDD0D updateRecentPosts function called");
	const o = n.getElementById(e);
	if ((console.log("\uD83D\uDD0D recent-posts container element:", o), !o)) {
		console.error(`\u{274C} ${e} container not found in DOM`);
		return;
	}
	try {
		console.log("\uD83D\uDD0D Fetching back-links.json...");
		const e = await a(),
			i = ((e, t = 15) => {
				if (0 === e.length) return "<p>No modified posts found.</p>";
				let n = e.slice(0, t),
					o = e.slice(t),
					i = d(c(n));
				if (o.length > 0) {
					var l, r;
					i +=
						((l = d(c(o))),
						(r = o.length),
						`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${r} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${l}
      </div>
    </div>
  `);
				}
				return (
					`
    <style>
      .last-modified-list {
        list-style-type: none;
        padding-left: 0;
      }
      .last-modified-list li {
        margin-bottom: 1.5rem;
        position: relative;
      }
      .date-badge {
        display: inline-block;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        margin-right: 0.5rem;
        font-size: 0.8rem;
      }
      .description {
        margin-top: 0.5rem;
        margin-bottom: 0;
        color: #6c757d;
      }
      .remaining-toggle {
        cursor: pointer;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-top: 2rem;
        transition: background-color 0.3s;
      }
      .remaining-toggle:hover {
        background-color: #e9ecef;
      }
      .toggle-icon {
        display: inline-block;
        transition: transform 0.3s;
      }
      .toggle-icon.open {
        transform: rotate(90deg);
      }
    </style>
  ` + i
				);
			})(e, t);
		console.log(
			"\uD83D\uDD0D Updating recent-posts content with HTML",
			i.substring(0, 100) + "...",
		),
			(o.innerHTML = i),
			((
				e = "remaining-posts-toggle",
				t = "remaining-posts-content",
				n = document,
			) => {
				const o = n.getElementById(e);
				if (!o) {
					console.log(`Toggle element with ID ${e} not found`);
					return;
				}
				o.addEventListener("click", function () {
					const e = n.getElementById(t);
					if (!e) {
						console.log(`Content element with ID ${t} not found`);
						return;
					}
					const o = this.querySelector(".toggle-icon");
					"none" === e.style.display
						? ((e.style.display = "block"), o?.classList.add("open"))
						: ((e.style.display = "none"), o?.classList.remove("open"));
				});
			})("remaining-posts-toggle", "remaining-posts-content", n),
			console.log("✅ Recent posts updated successfully");
	} catch (e) {
		console.error("❌ Error loading recent posts:", e),
			(o.innerHTML =
				"<p>Error loading modified posts. Please try again later.</p>");
	}
}
function p(e, t) {
	const n = e.filter((e) => e.url === t)[0];
	if (n) return n;
	const o = t.replace(/^\//, "").replace(/\/$/, "");
	return e.filter((e) => e.url.replace(/^\//, "").replace(/\/$/, "") === o)[0];
}
function f(e) {
	const t = e.filter((e) => e.expanded);
	e.find((e) => "/eulogy" === e.url) ||
		console.log("Eulogy node not found in pages");
	const n = ((e) => {
			const t = [];
			return (
				e.forEach((e) => {
					[...(e.outgoing_links || []), ...(e.incoming_links || [])].forEach(
						(n) => {
							p(h, n) && t.push({ source: e, target: n, value: 1 });
						},
					),
						0 === t.filter((t) => t.source === e).length &&
							"/eulogy" === e.url &&
							console.log(`No valid links found for ${e.url}`);
				}),
				t
			);
		})(t),
		o = n.map((t) => p(e, t.target)).filter((e) => e);
	return { nodes: t.concat(o), links: n };
}
function g(e, t, n) {
	const o = e.outgoing_links.length,
		i = e.expanded ? "-" : `+${o}`,
		l = e.id + " [" + i + "]",
		r = 12 / n;
	t.font = `${r}px Sans-Serif`;
	const a = [t.measureText(l).width, r].map((e) => e + 0.2 * r);
	(t.fillStyle = "rgba(255, 255, 255, 0.8)"),
		t.fillRect(e.x - a[0] / 2, e.y - a[1] / 2, ...a),
		(t.textAlign = "center"),
		(t.textBaseline = "middle"),
		(t.fillStyle = e.color),
		t.fillText(l, e.x, e.y),
		(e.__bckgDimensions = a);
}
function m(e, t, n) {
	n.fillStyle = t;
	const o = e.__bckgDimensions;
	o && n.fillRect(e.x - o[0] / 2, e.y - o[1] / 2, ...o);
}
console.log("Load force graph in TS v 0.9");
let h = [],
	y = null,
	D = null;
function b(t) {
	if (!D) {
		console.log("Cannot center: Graph not initialized");
		return;
	}
	if (!t) {
		console.log("Cannot center: Node is null or undefined");
		return;
	}
	D.centerAt(t.x, t.y, 500),
		D.zoom(8, 500),
		((t) => {
			if (!t) return;
			y = t;
			const n = e(t),
				o = document.getElementById("detail");
			o && (o.innerHTML = n);
		})(t);
}
function v() {
	y
		? y.url
			? window.open(y.url, "_blank")
			: console.log("Active node has no URL")
		: console.log("No active node to go to");
}
function k() {
	h.forEach((e) => {
		e.expanded = !1;
	}),
		y && (y.expanded = !0),
		D &&
			(D.graphData(f(h)),
			y &&
				setTimeout(() => {
					b(y);
				}, 300));
}
async function w() {
	if (!document.getElementById("graph")) {
		console.log("Graph element not found, exiting initialization");
		return;
	}
	window.location.hash.substr(1),
		(h = Object.values(await l()).map((e) => ({
			...e,
			id: e.url,
			expanded: !1,
		})));
	const e = "/" + (window.location.hash ? window.location.hash.substr(1) : ""),
		t = h.map((e) => e.url).includes(e) ? e : "/eulogy";
	if (
		(h.forEach((e) => {
			e.expanded = e.url == t;
		}),
		"undefined" == typeof ForceGraph)
	) {
		console.log("Force Graph not defined, exiting initialization");
		return;
	}
	D = ForceGraph()(document.getElementById("graph"))
		.graphData(f(h))
		.nodeLabel("id")
		.nodeAutoColorBy("group")
		.nodeCanvasObject(g)
		.nodePointerAreaPaint(m)
		.onNodeRightClick((e) => {
			window.open(e.url, "_blank");
		})
		.onNodeClick((e) => {
			(e.expanded = !e.expanded),
				0 == h.filter((e) => e.expanded).length && (e.expanded = !0),
				D.graphData(f(h)),
				setTimeout(() => {
					b(e);
				}, 300);
		});
	const n = p(h, t);
	n ? b(n) : console.log("Initial node not found, cannot center");
	const o = document.getElementById("center_control");
	o
		? o.addEventListener("click", () => {
				y ? b(y) : console.log("No last detail node to center on");
			})
		: console.log("Center control element not found");
	const i = document.getElementById("goto_control");
	i && i.addEventListener("click", v);
	const r = document.getElementById("collapse_control");
	r && r.addEventListener("click", k);
}
"undefined" != typeof window && (window.initializeGraph = w);
const E = {
	iconClass: "header-copy-link",
	tooltipDuration: 2e3,
	domainMapping: { from: "idvork.in/", to: "idvorkin.azurewebsites.net/" },
};
function x(e, t) {
	let n = e;
	return (
		(n = n.replace("localhost:4000/", "idvorkin.azurewebsites.net/")),
		t.domainMapping &&
			(n = n.replace(t.domainMapping.from, t.domainMapping.to)),
		(n = n.replace("#", "/"))
	);
}
async function C(e, t) {
	try {
		const n = window.location.href.split("#")[0],
			o = `${n}#${e}`,
			i = x(o, t);
		await navigator.clipboard.writeText(i),
			console.log(`Copied header link: ${i}`);
	} catch (i) {
		console.error("Failed to copy header link:", i);
		const n = document.createElement("textarea"),
			o = window.location.href.split("#")[0];
		(n.value = x(`${o}#${e}`, t)),
			document.body.appendChild(n),
			n.select(),
			document.execCommand("copy"),
			document.body.removeChild(n);
	}
}
function _(e = {}) {
	const t = { ...E, ...e },
		n = (
			document.getElementById("content-holder") || document.body
		).querySelectorAll("h1, h2, h3, h4, h5, h6");
	n.forEach((e) => {
		!((e, t) => {
			const n = ((e) => {
					if (e.id) return e.id;
					let t = (e.textContent || "")
							.toLowerCase()
							.replace(/[^\w\s-]/g, "")
							.replace(/\s+/g, "-")
							.replace(/-+/g, "-")
							.replace(/^-|-$/g, ""),
						n = t,
						o = 1;
					while (document.getElementById(n)) (n = `${t}-${o}`), o++;
					return (e.id = n), n;
				})(e),
				o = ((e) => {
					const t = document.createElement("span");
					return (
						(t.className = e.iconClass || E.iconClass),
						(t.innerHTML = "\uD83D\uDD17"),
						(t.title = "Copy link to this section"),
						(t.style.cursor = "pointer"),
						(t.style.marginLeft = "0.5rem"),
						(t.style.opacity = "0"),
						(t.style.transition = "opacity 0.2s ease"),
						(t.style.fontSize = "0.8em"),
						(t.style.userSelect = "none"),
						t
					);
				})(t);
			o.addEventListener("click", async (e) => {
				e.preventDefault(),
					e.stopPropagation(),
					await C(n, t),
					((e, t = 2e3) => {
						const n = document.createElement("span");
						(n.textContent = "Copied!"),
							(n.style.position = "absolute"),
							(n.style.backgroundColor = "#333"),
							(n.style.color = "white"),
							(n.style.padding = "4px 8px"),
							(n.style.borderRadius = "4px"),
							(n.style.fontSize = "12px"),
							(n.style.zIndex = "1000"),
							(n.style.marginLeft = "10px"),
							(n.style.marginTop = "-5px"),
							e.parentElement?.appendChild(n),
							setTimeout(() => {
								n.remove();
							}, t);
					})(o, t.tooltipDuration);
			}),
				e.appendChild(o),
				e.addEventListener("mouseenter", () => {
					o.style.opacity = "1";
				}),
				e.addEventListener("mouseleave", () => {
					o.style.opacity = "0";
				});
		})(e, t);
	}),
		console.log(`\u{2705} Initialized copy links for ${n.length} headers`);
}
function L(e = {}) {
	!(() => {
		const e = "header-copy-link-styles";
		if (document.getElementById(e)) return;
		const t = document.createElement("style");
		(t.id = e),
			(t.textContent = `
    .header-copy-link {
      opacity: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease;
      cursor: pointer;
      user-select: none;
      font-size: 0.8em;
      color: #6c757d;
      text-decoration: none;
    }
    
    .header-copy-link:hover {
      color: #007bff;
    }
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
  `),
			document.head.appendChild(t);
	})(),
		"loading" === document.readyState
			? document.addEventListener("DOMContentLoaded", () => {
					_(e);
				})
			: _(e);
}
let T = !0;
function M() {
	const e = $(".ui-toc-dropdown .toc"),
		t = $(".expand-toggle");
	if (0 === e.length || 0 === t.length) {
		console.warn("TOC or toggle elements not found for expand/collapse");
		return;
	}
	T
		? (e.addClass("expand"), t.text("Collapse all"))
		: (e.removeClass("expand"), t.text("Expand all"));
}
function R() {
	const e = $("#right-sidebar"),
		t = $("#main-content");
	e.length > 0 && (e.removeClass(), e.addClass("col-4 pl-0")),
		t.length > 0 && (t.removeClass(), t.addClass("col-8 pr-0"));
	const n = $("#id-ui-toc-dropdown");
	n.length > 0 && (n.removeClass(), n.addClass("d-none"));
}
function P(e, t) {
	const n = $(`#${e}`);
	if (0 === n.length) {
		console.warn(`Target element #${e} not found for TOC generation`);
		return;
	}
	if ((n.html(""), 0 === $("#content-holder").length)) {
		console.warn("Content holder not found for TOC generation");
		return;
	}
	new window.Toc("content-holder", {
		level: 3,
		top: -1,
		class: "toc",
		ulClass: "nav",
		targetId: e,
	}),
		"undefined" === n.text() && n.html("");
	const o = $('<div class="toc-menu"></div'),
		i = $('<a class="expand-toggle" href="#">Collapse all</a>'),
		l = $('<a class="back-to-top" href="#">Top of page</a>'),
		r = $('<a class="go-to-bottom" href="#">Bottom of page</a>'),
		a = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
	M(),
		i.click((e) => {
			e.preventDefault(), e.stopPropagation(), (T = !T), M();
		}),
		l.click((e) => {
			e.preventDefault(), e.stopPropagation(), window.scrollTo(0, 0);
		}),
		r.click((e) => {
			e.preventDefault(),
				e.stopPropagation(),
				window.scrollTo(0, document.body.scrollHeight);
		}),
		a.click((e) => R()),
		o.append(i).append(l).append(r),
		t && o.append(a),
		n.append(o);
}
async function S(t) {
	let n, o, i;
	try {
		if (!t) {
			console.log("No backlinks available");
			return;
		}
		if (!t[(n = new URL(document.URL).pathname)]) {
			console.log(`Page ${n} not found in backlinks`);
			return;
		}
		if (((o = t[n]?.incoming_links), (i = t[n]?.outgoing_links), !o && !i)) {
			console.log(`No backlinks for the page ${n}`);
			return;
		}
	} catch (e) {
		console.log(
			`Error processing links: ${e instanceof Error ? e.message : String(e)}`,
		);
		return;
	}
	const l = $("#links-to-page");
	if (!l || 0 === l.length) {
		console.log("No back_link_location");
		return;
	}
	l.append(`
<ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#incoming" type="button" role="tab" aria-controls="incoming" aria-selected="true">Links to here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#outgoing" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Link from here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#graph" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Graph</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active " id="incoming" role="tabpanel" aria-labelledby="incoming-tab"></div>
  <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab"></div>
  <div class="tab-pane fade" id="graph" role="tabpanel" aria-labelledby="outgoing-tab">
    <span> View the graph for: </span>
  </div>
</div>
`);
	const r = l.find("#incoming");
	var a = (e, n) => Number(t[n].doc_size) - Number(t[e].doc_size);
	if (o)
		for (var s of o.sort(a)) {
			const n = t[s];
			r.append(e(n));
		}
	const c = [];
	for (var s of i) t[s] && c.push(s);
	const d = l.find("#outgoing");
	if (c)
		for (const n of c.sort(a)) {
			const o = t[n];
			d.append(e(o));
		}
	console.log("Added Graph");
	const u = l.find("#graph"),
		p = n.replace(/\//g, "");
	u.append(`<a href='/graph#${p}'>${n} (${p}) </a>`);
}
function I(e, t) {
	const n = e && e.attr ? e.attr("href") : "unknown";
	return `<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`;
}
async function N() {
	S(await l()),
		((e) => {
			if (!e) {
				console.log("No backlinks data available");
				return;
			}
			try {
				const t = $.makeArray($(".summary-link"));
				if (!t || 0 === t.length) {
					console.log("No summary links found");
					return;
				}
				t.forEach((t) => {
					const n = $(t);
					try {
						if (!n || !n.attr) {
							console.log("Invalid link element");
							return;
						}
						console.log(n.attr("href"));
						let t = n.attr("href");
						if (!t) {
							n.html(I(n, "missing href"));
							return;
						}
						if (!e.redirects || !e.url_info) {
							n.html(I(n, "incomplete backLinks data"));
							return;
						}
						if (
							(void 0 != e.redirects[t] && (t = e.redirects[t]),
							void 0 == e.url_info[t])
						) {
							n.html(I(n, "not found in url info"));
							return;
						}
						n.html(
							((e, t) => {
								if (!t) return I(e, "URL info is undefined");
								const n = t.url || "#",
									o = t.title || "Untitled",
									i = t.description || "No description available",
									l = `(From:<a href='${n}'> ${o}</a>)`;
								return `<div>
        <i> ${i}</i> ${l}
    </div>`;
							})(n, e.url_info[t]),
						);
					} catch (e) {
						n && n.html
							? n.html(I(n, e))
							: console.error(
									"Error processing link and unable to display error:",
									e,
								);
					}
				});
			} catch (e) {
				console.error("Error processing summary links:", e);
			}
		})(await O());
}
let z = null;
async function O() {
	try {
		if (null != z) return z;
		const t = window.location.href.includes("https://idvork.in");
		var e = "";
		e = t
			? "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True"
			: "/back-links.json";
		try {
			const t = await $.getJSON(e);
			return (
				t.redirects || (t.redirects = {}),
				t.url_info || (t.url_info = {}),
				(z = t)
			);
		} catch (e) {
			return (
				console.error("Error fetching backlinks JSON:", e),
				{ redirects: {}, url_info: {} }
			);
		}
	} catch (e) {
		return (
			console.error("Error in get_back_links:", e),
			{ redirects: {}, url_info: {} }
		);
	}
}
function A() {
	const e = window.Mousetrap();
	e.bind("s", (e) => void $("#autocomplete-search-box-button").click()),
		e.bind("t", (e) => R()),
		e.bind("p", (e) =>
			(() => {
				let e = window.location.href,
					t = "https://idvork.in",
					n = "http://localhost:4000",
					o = e.includes(t),
					i = e;
				(i = o ? e.replace(t, n) : e.replace(n, t)), (window.location.href = i);
			})(),
		),
		e.bind("a", (e) => (location.href = "/all")),
		e.bind("m", (e) => (location.href = "/toc")),
		e.bind("6", (e) => (location.href = "/ig66"));
	const t = `
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;
	e.bind("?", (e) => alert(t));
}
function B() {
	console.log("\uD83D\uDD04 Replacing List Placeholders in Tables"),
		((e) => {
			Object.entries(e).forEach(([e, t]) => {
				const n =
					"undefined" != typeof $ && $.fn
						? $(`a[href=${e}]`).first()[0]
						: document.querySelector(`a[href="${e}"]`);
				if (!n) return;
				const o = t.cloneNode(!0);
				o.children.length > 0 && o.children[0].remove(),
					n.replaceWith(o),
					t.remove();
			});
		})(
			(() => {
				const e = {};
				return (
					("undefined" != typeof $ && $.fn
						? $("ul").toArray()
						: Array.from(document.querySelectorAll("ul"))
					).forEach((t) => {
						const n = t.firstElementChild;
						if (!n) return;
						const o = n.textContent;
						o &&
							o.startsWith("l") &&
							(isNaN(Number.parseInt(o.substring(1))) || (e[o] = t));
					}),
					e
				);
			})(),
		);
}
function j() {
	$(N),
		$(A),
		"undefined" != typeof $ && $.fn && $.fn.ready
			? $(document).ready(B)
			: "undefined" != typeof document &&
				("loading" === document.readyState
					? document.addEventListener("DOMContentLoaded", B)
					: B()),
		console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),
		((e = "recent-posts", t = document) => {
			console.log("\uD83D\uDD0D initRecentPosts called"),
				"loading" === t.readyState
					? (console.log(
							"\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener",
						),
						t.addEventListener("DOMContentLoaded", () => {
							console.log(
								"\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()",
							),
								s(e);
						}))
					: (console.log(
							"\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately",
						),
						s(e)),
				console.log("\uD83D\uDD0D initRecentPosts completed initial setup");
		})(),
		console.log("✅ Called initRecentPosts from main.ts"),
		document.getElementById("last-modified-posts") &&
			(console.log(
				"\uD83D\uDE80 About to call initRecentAllPosts from main.ts",
			),
			((e = "last-modified-posts", t = document) => {
				console.log("\uD83D\uDD0D initRecentAllPosts called"),
					"loading" === t.readyState
						? (console.log(
								"\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener",
							),
							t.addEventListener("DOMContentLoaded", () => {
								console.log(
									"\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()",
								),
									u(e, 15, t);
							}))
						: (console.log(
								"\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately",
							),
							u(e, 15, t)),
					console.log(
						"\uD83D\uDD0D initRecentAllPosts completed initial setup",
					);
			})(),
			console.log("✅ Called initRecentAllPosts from main.ts")),
		$(() => {
			P("ui-toc", !0), P("ui-toc-affix", !1);
		}),
		L();
}
"undefined" != typeof $ && $.fn && $.fn.ready
	? $(document).ready(j)
	: "undefined" != typeof document &&
		("loading" === document.readyState
			? document.addEventListener("DOMContentLoaded", j)
			: j());
export {
	j as load_globals,
	l as get_link_info,
	n as shuffle,
	t as random_from_list,
	o as append_randomizer_div,
	L as enableHeaderCopyLinks,
};
//# sourceMappingURL=main.js.map
