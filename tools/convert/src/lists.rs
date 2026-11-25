//! zola/lists.py's mark(): kramdown's per-item list looseness as marker
//! comments. Same scan, same edits, applied in the same (insertion) order.

use crate::pyre::{cidx, g, lstrip, pylen, rstrip, strip};
use crate::re;
use indexmap::IndexMap;

re!(
    LIST,
    new_match,
    r"( {0,3})([-*+]|\d{1,9}[.)])([ \t]+|\z)(.*)\z"
);
re!(HR, new_match, r" {0,3}([-*_])(\s*\1){2,}\s*\z");
re!(FENCE, new_match, r"\s*(`{3,}|~{3,})");
const T: &str = "<!--zp-t-->";
const L: &str = "<!--zp-l-->";
const ESC: &str = "escape";
const PARA: &str = "paragraph";
const DROP: &str = "drop";
const BREAK: &str = "<break>";
const AFTER: &str = "<after>";
const INLINE: &str = "<!--zp-i-->";
const SETX: &str = "setext:";
re!(
    TAIL_COMMENT,
    new_match,
    r"(\s*</[a-zA-Z]\w*>)\s+(<!--.*-->)\s*\z"
);
const TAIL: &str = "<tail>";
const SPAN: &[&str] = &[
    "a", "abbr", "acronym", "b", "big", "bdo", "br", "button", "cite", "code", "del", "dfn", "em",
    "i", "img", "input", "ins", "kbd", "label", "mark", "option", "q", "rb", "rbc", "rp", "rt",
    "rtc", "ruby", "samp", "select", "small", "span", "strong", "sub", "sup", "tt", "u", "var",
    "textarea",
];
const NOHEAD: &str = "<!--zp-nohead-->";
re!(CODE, r"(`+).*?\1");
re!(
    DELIM,
    new_match,
    r"\s*\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*\z"
);
re!(OPEN_TAG, new_match, r" {0,3}<([a-zA-Z][\w-]*)(?=[\s/>]|\z)");
re!(
    CLOSED_TAG,
    new_match,
    r" {0,3}<([a-zA-Z][\w-]*)\b[^>]*>.*</\1>\s*\z"
);
re!(
    LONE_TAG,
    new_match,
    r" {0,3}</?([a-zA-Z][\w-]*)\b[^>]*>\s*\z"
);
re!(INDENTED_COMMENT, new_match, r" {1,3}<!--.*-->\s*\z");
re!(DD, new_match, r":\s+\S");
re!(BACKSLASH_ANY, r"\\.");
re!(ITEM_HEAD, new_match, r"\s*([-*+]|\d+[.)])[ \t]*");
re!(BULLET, new_match, r"(\s*)[-*+]");
re!(ESC_RE, new_match, r"(\s*\d*)(\S)");
re!(
    GENERIC,
    new_full,
    r"(.*?)(\s*(?:\{[#:][^}]*\})?(?:  +|\\)?)"
);

fn in_span(tag: &str) -> bool {
    SPAN.contains(&tag.to_lowercase().as_str())
}

fn cells(s: &str) -> usize {
    let t = BACKSLASH_ANY.sub(strip(s), |_| "xx".into());
    let t = CODE.sub(&t, |m| "x".repeat(pylen(g(m, 0))));
    if !t.contains('|') {
        return 0;
    }
    let t = t.strip_prefix('|').unwrap_or(&t);
    let t = t.strip_suffix('|').unwrap_or(t);
    t.matches('|').count() + 1
}

fn indented(s: &str) -> bool {
    s.starts_with("    ") || s.starts_with('\t')
}

fn table(text: &[String], k: usize) -> usize {
    let t = lstrip(&text[k]);
    if indented(&text[k]) {
        return 0;
    }
    if ["#", "<", ">", "```", "~~~"]
        .iter()
        .any(|p| t.starts_with(p))
        || LIST.is_match(t)
    {
        return 0;
    }
    let mut e = k;
    while e < text.len() && !strip(&text[e]).is_empty() {
        if cells(&text[e]) == 0 {
            return 0;
        }
        e += 1;
    }
    if (e - k >= 2 && DELIM.is_match(&text[k + 1])) || DELIM.is_match(&text[k]) {
        return 0;
    }
    e - k
}

fn lead(text: &[String], k: usize) -> bool {
    k + 2 < text.len()
        && DELIM.is_match(&text[k])
        && text[k].contains('|')
        && cells(&text[k + 1]) != 0
        && !DELIM.is_match(&text[k + 1])
        && DELIM.is_match(&text[k + 2])
}

fn block_start(s: &str) -> bool {
    let t = lstrip(s);
    t.is_empty()
        || ["#", "```", "~~~", ">", "|", "<", "{%", "{{<inc", "$$"]
            .iter()
            .any(|p| t.starts_with(p))
        || LIST.is_match(lstrip(s))
        || HR.is_match(s)
        || indented(s)
}

fn kind(marker: &str) -> &'static str {
    // `marker in "-*+"`: a substring test; the marker is one of them or digits.
    if "-*+".contains(marker) {
        "ul"
    } else {
        "ol"
    }
}

#[derive(Hash, PartialEq, Eq, Clone, Copy)]
enum Key {
    Line(usize),
    Bullet(usize),
}

#[derive(Clone)]
enum Edit {
    S(String),
    Table(Option<usize>, usize),
    Dl(String),
}

type Edits = IndexMap<Key, Edit>;

fn set(edits: &mut Edits, k: usize, v: &str) {
    edits.insert(Key::Line(k), Edit::S(v.to_string()));
}

fn blank(s: &str) -> bool {
    strip(s).is_empty()
}

fn expandtabs4(s: &str) -> usize {
    let mut col = 0;
    for c in s.chars() {
        if c == '\t' {
            col += 4 - col % 4;
        } else {
            col += 1;
        }
    }
    col
}

struct Item {
    ci: usize,
    rows: Vec<(usize, String)>,
    setext: bool,
}

fn scan(lines: &[String], idx: &[usize], edits: &mut Edits, start: usize) {
    let n = lines.len();
    let mut i = start;
    let mut fence: Option<String> = None;
    while i < n {
        let line = &lines[i];
        let f = FENCE.caps(line);
        if let Some(fe) = &fence {
            if let Some(f) = &f {
                let g1 = g(f, 1);
                if g1.chars().next() == fe.chars().next() && pylen(g1) >= pylen(fe) {
                    fence = None;
                }
            }
            i += 1;
            continue;
        }
        if let Some(f) = f {
            fence = Some(g(&f, 1).to_string());
            i += 1;
            continue;
        }
        if let Some(tag) = OPEN_TAG.caps(line) {
            if !in_span(g(&tag, 1)) && i > 0 && !blank(&lines[i - 1]) && !block_start(&lines[i - 1])
            {
                set(edits, idx[i], BREAK);
            }
        }
        if let Some(closed) = CLOSED_TAG.caps(line) {
            if !in_span(g(&closed, 1))
                && i + 1 < n
                && !blank(&lines[i + 1])
                && !lstrip(&lines[i + 1]).starts_with('<')
            {
                let prev = match edits.get(&Key::Line(idx[i])) {
                    None => String::new(),
                    Some(Edit::S(s)) => s.clone(),
                    // str + tuple: a TypeError in Python, which fails the page.
                    Some(_) => panic!("lists: AFTER on a tuple edit"),
                };
                set(edits, idx[i], &(prev + AFTER));
            }
        }
        if let Some(lone) = LONE_TAG.caps(line) {
            if in_span(g(&lone, 1)) && (i == 0 || blank(&lines[i - 1])) {
                set(edits, idx[i], INLINE);
                i += 1;
                continue;
            }
        }
        if lstrip(line).starts_with('<') {
            if INDENTED_COMMENT.is_match(line) {
                set(edits, idx[i], PARA);
            } else if lstrip(line).starts_with("<!--") {
                while i < n && !lines[i].contains("-->") {
                    i += 1;
                }
            } else {
                while i < n && !blank(&lines[i]) {
                    i += 1;
                }
                if TAIL_COMMENT.is_match(&lines[i - 1]) {
                    set(edits, idx[i - 1], TAIL);
                }
            }
            i += 1;
            continue;
        }
        let top = i == 0 || blank(&lines[i - 1]);
        if top && lead(lines, i) {
            set(edits, idx[i], DROP);
            i += 1;
            continue;
        }
        if top && table(lines, i) != 0 {
            edits.insert(Key::Line(idx[i]), Edit::Table(None, cells(line)));
            i += table(lines, i);
            continue;
        }
        let m = LIST.caps(line);
        if let Some(m) = &m {
            if g(m, 3).is_empty() && top {
                set(edits, idx[i], ESC);
                i += 1;
                continue;
            }
        }
        let Some(m) = m else {
            i += 1;
            continue;
        };
        if HR.is_match(line) {
            i += 1;
            continue;
        }
        let k0 = kind(g(&m, 2));
        let m2 = g(&m, 2).to_string();
        let mut items: Vec<Item> = Vec::new();
        let mut j = i;
        let mut last_blank = false;
        while j < n {
            let s = &lines[j];
            let mm = LIST.caps(s);
            let new_item = mm.as_ref().is_some_and(|mm| {
                !g(mm, 3).is_empty()
                    && !HR.is_match(s)
                    && kind(g(mm, 2)) == k0
                    && (items.is_empty() || pylen(g(mm, 1)) < items.last().unwrap().ci)
            });
            if new_item {
                let mm = mm.as_ref().unwrap();
                let sp = if !g(mm, 4).is_empty() {
                    expandtabs4(g(mm, 3))
                } else {
                    1
                };
                let ci =
                    pylen(g(mm, 1)) + pylen(g(mm, 2)) + if (1..=4).contains(&sp) { sp } else { 1 };
                items.push(Item {
                    ci,
                    rows: vec![(j, g(mm, 4).to_string())],
                    setext: false,
                });
                if k0 == "ul" && g(mm, 2) != m2 {
                    edits.insert(Key::Bullet(idx[j]), Edit::S(m2.clone()));
                }
                last_blank = false;
            } else if items.is_empty() {
                break;
            } else if mm
                .as_ref()
                .is_some_and(|mm| g(mm, 3).is_empty() && g(mm, 2) == "-")
                && !last_blank
                && items.last().unwrap().rows.len() == 1
            {
                let it = items.last_mut().unwrap();
                it.rows.push((j, "-".into()));
                it.setext = true;
                let first = idx[it.rows[0].0];
                set(edits, idx[j], &format!("{SETX}{first}"));
            } else if blank(s) {
                items.last_mut().unwrap().rows.push((j, String::new()));
                last_blank = true;
            } else if s.len() - s.trim_start_matches(' ').len() >= items.last().unwrap().ci {
                let ci = items.last().unwrap().ci;
                items
                    .last_mut()
                    .unwrap()
                    .rows
                    .push((j, s[ci..].to_string()));
                last_blank = false;
            } else if !last_blank && !block_start(s) && !LIST.is_match(s) {
                items
                    .last_mut()
                    .unwrap()
                    .rows
                    .push((j, strip(s).to_string()));
            } else {
                break;
            }
            j += 1;
        }
        let mut earlier = false;
        let count = items.len();
        for (k, it) in items.iter().enumerate() {
            let rows = &it.rows;
            let text: Vec<String> = rows.iter().map(|r| r.1.clone()).collect();
            let sub_idx: Vec<usize> = rows.iter().map(|r| idx[r.0]).collect();
            let mut dds = 0;
            while 1 + dds < text.len() && DD.is_match(&text[1 + dds]) {
                dds += 1;
            }
            if dds > 0 && !blank(&text[0]) && !block_start(&text[0]) {
                let mut dl = format!("<dl><dt>{}</dt>", strip(&text[0]));
                for x in &text[1..1 + dds] {
                    dl.push_str(&format!("<dd>{}</dd>", strip(&x[cidx(x, 1)..])));
                }
                edits.insert(Key::Line(idx[rows[0].0]), Edit::Dl(dl + "</dl>"));
                for r in &rows[1..1 + dds] {
                    set(edits, idx[r.0], DROP);
                }
                earlier = true;
                scan(&text, &sub_idx, edits, 1 + dds);
                continue;
            }
            let tbl = table(&text, 0);
            if tbl != 0 {
                edits.insert(
                    Key::Line(idx[rows[0].0]),
                    Edit::Table(Some(it.ci), cells(&text[0])),
                );
            }
            let first_p = !blank(&text[0]) && !block_start(&text[0]) && tbl == 0 && !it.setext;
            let mut e = 1;
            while e < text.len() && !blank(&text[e]) && !block_start(&text[e]) {
                e += 1;
            }
            let rest = &text[e.min(text.len())..];
            let has_more = !rest.is_empty();
            let next_blank = has_more && blank(&rest[0]);
            let only_blank_after = has_more && rest.iter().all(|x| blank(x));
            let last = k == count - 1;
            let a = !has_more || !next_blank || (last && only_blank_after);
            let b = !last || count == 1 || earlier;
            let bare = first_p && a && b;
            if first_p {
                set(edits, idx[rows[0].0], if bare { T } else { L });
            }
            if !first_p || bare {
                earlier = true;
            }
            scan(&text, &sub_idx, edits, 1);
        }
        i = j.max(i + 1);
    }
}

pub fn mark(text: &str) -> String {
    let mut lines: Vec<Option<String>> = text.split('\n').map(|s| Some(s.to_string())).collect();
    let owned: Vec<String> = lines.iter().map(|x| x.clone().unwrap()).collect();
    let mut edits = Edits::new();
    let all: Vec<usize> = (0..owned.len()).collect();
    scan(&owned, &all, &mut edits, 0);
    let get = |lines: &Vec<Option<String>>, k: usize| -> String {
        lines[k].clone().expect("lists: edit on a dropped line")
    };
    for (key, mk) in edits.iter() {
        match (key, mk) {
            (Key::Line(k), Edit::S(s)) if s.starts_with(SETX) => {
                let item = get(&lines, s[SETX.len()..].parse::<usize>().unwrap());
                let head = ITEM_HEAD
                    .caps(&item)
                    .expect("lists: setext item has no marker");
                let w = pylen(g(&head, 0));
                let cur = get(&lines, *k);
                lines[*k] = Some(" ".repeat(w) + strip(&cur));
            }
            (Key::Bullet(k), Edit::S(mk)) => {
                let ln = get(&lines, *k);
                let out = match BULLET.caps(&ln) {
                    Some(c) => {
                        let e = c.get(0).unwrap().end();
                        format!("{}{}{}", g(&c, 1), mk, &ln[e..])
                    }
                    None => ln,
                };
                lines[*k] = Some(out);
            }
            (Key::Bullet(_), _) => unreachable!(),
            (Key::Line(k), Edit::Dl(html)) => {
                let cur = get(&lines, *k);
                let head = ITEM_HEAD.caps(&cur).expect("lists: dl item has no marker");
                let ci = pylen(g(&head, 0));
                lines[*k] = Some(format!("{}{}", &cur[..cidx(&cur, ci)], html));
            }
            (Key::Line(k), Edit::Table(ci0, ncells)) => {
                let line = get(&lines, *k);
                let ci = ci0.map(|_| {
                    let head = ITEM_HEAD
                        .caps(&line)
                        .expect("lists: table item has no marker");
                    pylen(g(&head, 0))
                });
                let lead_ws = &line[..line.len() - lstrip(&line).len()];
                let (ind, head, row) = match ci {
                    Some(ci) => {
                        let b = cidx(&line, ci);
                        (" ".repeat(ci), line[..b].to_string(), line[b..].to_string())
                    }
                    None => (
                        lead_ws.to_string(),
                        lead_ws.to_string(),
                        lstrip(&line).to_string(),
                    ),
                };
                let delim = format!("| {} |", vec!["---"; *ncells].join(" | "));
                let h = if ci.is_some() {
                    format!("{} ", rstrip(&head))
                } else {
                    head
                };
                lines[*k] = Some(format!("{h}{NOHEAD}\n{ind}{row}\n{ind}{delim}"));
            }
            (Key::Line(k), Edit::S(mk)) => {
                let k = *k;
                let mk = mk.as_str();
                if mk == BREAK || mk == AFTER || mk == "<break><after>" {
                    let cur = get(&lines, k);
                    lines[k] = Some(format!(
                        "{}{}{}",
                        if mk.contains(BREAK) { "\n" } else { "" },
                        cur,
                        if mk.contains(AFTER) { "\n" } else { "" }
                    ));
                } else if mk == TAIL {
                    let cur = get(&lines, k);
                    lines[k] = Some(TAIL_COMMENT.sub_t(&cur, "\\1\n\n<p>\\2</p>"));
                } else if mk == INLINE {
                    let cur = get(&lines, k);
                    lines[k] = Some(format!("{}{}", rstrip(&cur), INLINE));
                } else if mk == DROP {
                    lines[k] = None;
                } else if mk == PARA {
                    let cur = get(&lines, k);
                    lines[k] = Some(format!("<p>{}</p>", strip(&cur)));
                } else if mk == ESC {
                    let cur = get(&lines, k);
                    lines[k] = Some(ESC_RE.sub_t(&cur, "\\1\\\\\\2"));
                } else {
                    let cur = get(&lines, k);
                    let m = GENERIC.caps(&cur).unwrap();
                    lines[k] = Some(format!("{}{}{}", g(&m, 1), mk, g(&m, 2)));
                }
            }
        }
    }
    lines.into_iter().flatten().collect::<Vec<_>>().join("\n")
}
