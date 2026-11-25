//! zola/convert.py's fix_markdown_py and the functions it calls, ported one
//! for one: toc_links, kramdown_fences, split_fences, kramdownisms (with
//! raw_html_blocks, kramdown_tables, closes_block, span_ial), kramdown_em,
//! absolutize (with Python's urljoin), html_block_lines and place_tokens.
//! convert.py has the reasons for each rule; this file only follows it.

use crate::pyre::{g, lstrip, pylen, rstrip, strip, Re};
use crate::{lists, re, typography};
use indexmap::IndexMap;
use std::collections::HashMap;
use std::sync::{LazyLock, Mutex};

#[derive(Clone, Debug)]
pub enum Note {
    N(i64),
    List(Vec<String>),
}

/// The page's report notes, in the order Python's dict would hold them.
#[derive(Default)]
pub struct Notes(pub IndexMap<String, Note>);

impl Notes {
    fn add(&mut self, k: &str, by: i64) {
        let e = self.0.entry(k.to_string()).or_insert(Note::N(0));
        match e {
            Note::N(n) => *n += by,
            Note::List(_) => panic!("note {k}: not a count"),
        }
    }
    fn set(&mut self, k: &str, v: i64) {
        self.0.insert(k.to_string(), Note::N(v));
    }
    fn push(&mut self, k: &str, v: String) {
        let e = self.0.entry(k.to_string()).or_insert(Note::List(vec![]));
        match e {
            Note::List(l) => l.push(v),
            Note::N(_) => panic!("note {k}: not a list"),
        }
    }
}

pub struct Inc {
    pub raw: String,
    pub text: String,
    pub inline: bool,
    pub markdown: bool,
}

// ---- toc_links ----
re!(
    TOC_BLOCK,
    r"(?s)<!-- vim-markdown-toc-start -->.*?<!-- vim-markdown-toc-end -->"
);
re!(TOC_ENTRY, r"(?m)^(\s*[-*+] \[)(.*)(\]\(#[^)\s]*\))[ \t]*$");
re!(TOC_INNER, r"\[([^\[\]]*)\]\([^()\s]*\)");

fn toc_links(body: &str, notes: &mut Notes) -> String {
    TOC_BLOCK.sub(body, |b| {
        TOC_ENTRY.sub(g(b, 0), |m| {
            let (text, n) = TOC_INNER.subn_t(g(m, 2), "\\1");
            notes.add("toc_inner_links", n as i64);
            format!("{}{}{}", g(m, 1), text, g(m, 3))
        })
    })
}

// ---- kramdown_fences ----
re!(
    FENCE_SPAN,
    r"(?ms)^ {0,3}```(\S+[ \t]+\S[^`\n]*)\n(.*?)\n {0,3}```[ \t]*$"
);

fn escape_noquote(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}
fn escape_quote(s: &str) -> String {
    escape_noquote(s)
        .replace('"', "&quot;")
        .replace('\'', "&#x27;")
}

fn kramdown_fences(body: &str, notes: &mut Notes) -> String {
    FENCE_SPAN.sub(body, |m| {
        notes.add("fence_as_codespan", 1);
        let code = escape_noquote(&format!("{}\n{}\n", g(m, 1), g(m, 2)));
        format!(r#"<p><code class="language-plaintext highlighter-rouge">{code}</code></p>"#)
    })
}

// ---- split_fences ----
pub fn split_fences(body: &str) -> Vec<(bool, String)> {
    let mut out: Vec<(bool, Vec<&str>)> = vec![];
    let mut buf: Vec<&str> = vec![];
    let mut fence: Option<&str> = None;
    for line in body.split('\n') {
        let s = lstrip(line);
        if fence.is_none() && (s.starts_with("```") || s.starts_with("~~~")) {
            out.push((false, std::mem::take(&mut buf)));
            buf.push(line);
            fence = Some(&s[..3]);
            continue;
        }
        if let Some(f) = fence {
            buf.push(line);
            if s.starts_with(f) {
                out.push((true, std::mem::take(&mut buf)));
                fence = None;
            }
            continue;
        }
        buf.push(line);
    }
    out.push((fence.is_some(), buf));
    out.into_iter()
        .filter(|(_, b)| !b.is_empty())
        .map(|(c, b)| (c, b.join("\n")))
        .collect()
}

// ---- kramdownisms ----
re!(
    MATH,
    r"(?m)(?:(?<=\n\n)|\A)\$\$(.+?)\$\$[ \t]*(?=\n\n|\n?\z)"
);
re!(WIDE_MARKER, r"(?m)^([ \t]*(?:[-*+]|\d+\.))[ \t]{5,}(?=\S)");
re!(MARKDOWN_ATTR, r#"\s+markdown="(1|block|span)""#);
re!(SPAN_IAL, r"!\[([^\]]*)\]\(([^)\s]+)\)\{:\s*([^}]*?)\s*\}");
re!(IAL_TOK, r#"[\w-]+="[^"]*"|[.#][\w-]+"#);
re!(
    LONE_ELEMENT,
    r"(?m)^(<(canvas|audio|video|[a-z][a-z0-9]*-[a-z0-9-]+)\b[^>]*>)[ \t]*(</\2>)[ \t]*$"
);
re!(
    LONE_IMG,
    r"(?m)(?:(?<=\n\n)|\A)(<img\b[^>\n]*>)[ \t]*(?=\n\n|\n?\z)"
);
re!(IAL_START, new_full, r#"\{:\s*start="?(\d+)"?\s*\}\s*"#);
re!(OL_LINE, new_match, r"\s*\d+\.\s");
re!(DIGITS, r"\d+");
re!(IAL_ANY, new_full, r"\{:.*\}\s*");
re!(CALL_LINE, new_full, r"\{\{<inc (\d+) />\}\}\s*");
re!(
    MD_START,
    new_match,
    r"\s{0,3}([*+-]\s|\d+[.)]\s|#{1,6}\s|>|\|)"
);
re!(
    HTML_LINE,
    new_match,
    r"\s*(</?(div|details|summary|figure|figcaption|section|aside|nav|p|table|center|span|br|hr)\b[^>]*/?>\s*)+\z"
);
re!(CLOSE_ONLY, new_match, r"\s*(</[a-z][a-z0-9]*>\s*)+\z");
re!(CLOSE_TAGS, r"</([a-z][a-z0-9]*)>");
re!(LT_START, new_match, r"\s*<");
re!(
    RAW_BLOCK,
    new_match,
    r"<(div|p|details|table|figure|section|center|aside|nav|blockquote|ul|ol|dl|form|iframe)\b([^>]*)>"
);
re!(
    TABLE_SEP,
    new_match,
    r"\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*\z"
);

static TAG_RES: LazyLock<Mutex<HashMap<String, &'static (Re, Re)>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

/// tag_res: <tag\b and </tag>, compiled once per tag name.
pub fn tag_res(tag: &str) -> &'static (Re, Re) {
    let mut m = TAG_RES.lock().unwrap();
    if let Some(r) = m.get(tag) {
        return r;
    }
    let esc = crate::pyre::escape(tag);
    let r: &'static (Re, Re) = Box::leak(Box::new((
        Re::new(&format!(r"<{esc}\b")),
        Re::new(&format!("</{esc}>")),
    )));
    m.insert(tag.to_string(), r);
    r
}

pub fn block_end(lines: &[String], i: usize, tag: &str) -> usize {
    let (open, close) = tag_res(tag);
    let mut depth: i64 = 0;
    let mut j = i;
    while j < lines.len() {
        depth += open.count(&lines[j]) as i64 - close.count(&lines[j]) as i64;
        if depth <= 0 {
            break;
        }
        j += 1;
    }
    j
}

fn raw_html_blocks(lines: Vec<String>, notes: &mut Notes) -> Vec<String> {
    let mut out = vec![];
    let mut i = 0;
    while i < lines.len() {
        let m = RAW_BLOCK.caps(&lines[i]);
        let Some(m) = m.filter(|m| !g(m, 2).contains("markdown=")) else {
            out.push(lines[i].clone());
            i += 1;
            continue;
        };
        let j = block_end(&lines, i, g(&m, 1));
        let hi = (j + 1).min(lines.len());
        let mut span: Vec<String> = lines[i..hi].to_vec();
        if j < lines.len() && span.iter().any(|x| strip(x).is_empty()) {
            notes.add("raw_html_blocks", 1);
            span.retain(|x| !strip(x).is_empty());
        }
        out.extend(span);
        i = j + 1;
    }
    out
}

fn kramdown_tables(lines: Vec<String>, notes: &mut Notes) -> Vec<String> {
    let mut out = vec![];
    let mut i = 0;
    let pipe = |s: &str| lstrip(s).starts_with('|');
    while i < lines.len() {
        if !pipe(&lines[i]) {
            out.push(lines[i].clone());
            i += 1;
            continue;
        }
        let mut j = i;
        while j < lines.len() && pipe(&lines[j]) {
            j += 1;
        }
        let block = &lines[i..j];
        let rows: Vec<&String> = block.iter().filter(|r| !TABLE_SEP.is_match(r)).collect();
        let seps: Vec<&String> = block.iter().filter(|r| TABLE_SEP.is_match(r)).collect();
        let gfm_ok = block.len() > 1
            && !TABLE_SEP.is_match(&block[0])
            && TABLE_SEP.is_match(&block[1])
            && seps.len() == 1
            && !block[1].contains('+');
        if !seps.is_empty() && !rows.is_empty() && !gfm_ok {
            out.push(rows[0].clone());
            out.push(seps[0].replace('+', "|"));
            out.extend(rows[1..].iter().map(|r| (*r).clone()));
            notes.add("kramdown_tables", 1);
        } else {
            out.extend(block.iter().cloned());
        }
        i = j;
    }
    out
}

fn span_ial(m: &crate::pyre::Caps) -> String {
    let mut attrs = vec![];
    IAL_TOK.each(g(m, 3), |t| {
        let tok = g(t, 0);
        if let Some(c) = tok.strip_prefix('.') {
            attrs.push(format!(r#"class="{c}""#));
        } else if let Some(i) = tok.strip_prefix('#') {
            attrs.push(format!(r#"id="{i}""#));
        } else {
            attrs.push(tok.to_string());
        }
    });
    format!(
        r#"<img src="{}" alt="{}" {} />"#,
        g(m, 2),
        escape_quote(g(m, 1)),
        attrs.join(" ")
    )
}

fn closes_block(lines: &[String], i: usize) -> bool {
    if lines[i] != lstrip(&lines[i]) {
        return false;
    }
    let mut j = i;
    while j > 0 && !strip(&lines[j - 1]).is_empty() {
        j -= 1;
    }
    let chunk = lines[j..=i].join("\n");
    let mut tags: Vec<String> = vec![];
    CLOSE_TAGS.each(&lines[i], |c| tags.push(g(c, 1).to_string()));
    tags.iter().all(|t| {
        let (open, close) = tag_res(t);
        open.count(&chunk) == close.count(&chunk)
    }) && LT_START.is_match(&lines[j])
}

fn kramdownisms(text: &str, incs: &[Inc], notes: &mut Notes) -> String {
    let (text, n) = MATH.subn(text, |m| format!("<!--zp-raw-->\\[{}\\]", strip(g(m, 1))));
    if n > 0 {
        notes.set("math_blocks", n as i64);
    }
    let (text, n) = WIDE_MARKER.subn_t(&text, "\\1 ");
    if n > 0 {
        notes.set("wide_list_markers", n as i64);
    }
    let lines = kramdown_tables(
        raw_html_blocks(text.split('\n').map(String::from).collect(), notes),
        notes,
    );
    let text = MARKDOWN_ATTR.sub_t(&lines.join("\n"), "");
    let (text, n) = SPAN_IAL.subn(&text, span_ial);
    if n > 0 {
        notes.add("span_ial", n as i64);
    }
    let text = LONE_ELEMENT.sub_t(&text, "\\1\n\\3\n");
    let text = LONE_IMG.sub_t(&text, "<p>\\1</p>");
    let mut lines: Vec<String> = text.split('\n').map(String::from).collect();
    let mut out: Vec<String> = vec![];
    let inc =
        |c: &crate::pyre::Caps| -> &Inc { &incs[g(c, 1).parse::<usize>().expect("inc number")] };
    for i in 0..lines.len() {
        let line = lines[i].clone();
        if let Some(m) = IAL_START.caps(&line) {
            let start = g(&m, 1).to_string();
            for j in (i + 1)..(i + 4).min(lines.len()) {
                if OL_LINE.is_match(&lines[j]) {
                    lines[j] = DIGITS.sub_count(&lines[j], &start, 1);
                    break;
                }
            }
            notes.push("ial_applied", strip(&line).to_string());
            continue;
        }
        if IAL_ANY.is_match(&line) {
            notes.push("ial_dropped", strip(&line).to_string());
            continue;
        }
        let nxt = if i + 1 < lines.len() {
            lines[i + 1].clone()
        } else {
            String::new()
        };
        if let Some(call) = CALL_LINE.caps(&line) {
            if !strip(&nxt).is_empty() && !CALL_LINE.is_match(&nxt) {
                let it = inc(&call);
                if it.inline
                    && !(MD_START.is_match(&nxt)
                        || lstrip(&nxt).starts_with('<')
                        || it.raw.ends_with('\n'))
                {
                    lines[i + 1] = format!("{} {}", rstrip(&line), nxt);
                    notes.add("joined_img_calls", 1);
                    continue;
                }
                if !it.markdown {
                    out.push(line.clone());
                    out.push(String::new());
                    notes.add("blank_after_call", 1);
                    continue;
                }
            }
        }
        out.push(line.clone());
        if HTML_LINE.is_match(&line)
            && (MD_START.is_match(&nxt)
                || (CLOSE_ONLY.is_match(&line)
                    && !strip(&nxt).is_empty()
                    && !lstrip(&nxt).starts_with('<')
                    && closes_block(&lines, i)))
        {
            out.push(String::new());
            notes.add("blank_after_html", 1);
        }
    }
    out.join("\n")
}

// ---- kramdown_em ----
re!(
    EM_OPEN,
    r"(?<=[A-Za-z0-9])(?<![*\\])\*(?=[!-)+-/:-@\[-`{-~])"
);
re!(PARA_SPLIT, r"(\n[ \t]*\n)");
re!(CODE_SPAN, r"(?s)(`+).+?\1");
re!(EM_CLOSE, r"(?<![*\s\\])\*(?!\*)");

fn kramdown_em(text: &str, notes: &mut Notes) -> String {
    let mut out = String::with_capacity(text.len() + 16);
    for para in PARA_SPLIT.split_keep(text) {
        if !EM_OPEN.is_match(&para) {
            out.push_str(&para);
            continue;
        }
        let mut code = vec![];
        CODE_SPAN.each(&para, |m| {
            let m0 = m.get(0).unwrap();
            code.push((m0.start(), m0.end()));
        });
        let incode = |i: usize| code.iter().any(|&(a, b)| a <= i && i < b);
        let mut open = None;
        EM_OPEN.each(&para, |m| {
            let m0 = m.get(0).unwrap();
            if open.is_none() && !incode(m0.start()) {
                open = Some((m0.start(), m0.end()));
            }
        });
        let mut close = None;
        if let Some((_, e)) = open {
            // para[m.end() + 1:]: the char after "*" is ASCII punctuation.
            let tail = &para[e + 1..];
            let mut pos = 0;
            while let Some((a, b)) = EM_CLOSE.find_at(tail, pos) {
                let i = e + 1 + a;
                if !incode(i) {
                    close = Some(i);
                    break;
                }
                pos = b;
            }
        }
        match (open, close) {
            (Some((s, e)), Some(c)) => {
                out.push_str(&para[..s]);
                out.push_str("<em>");
                out.push_str(&para[e..c]);
                out.push_str("</em>");
                out.push_str(&para[c + 1..]);
                notes.add("kramdown_em", 1);
            }
            _ => out.push_str(&para),
        }
    }
    out
}

// ---- absolutize ----
re!(
    ABS_SPLIT,
    r"(?s)(\{\{<.*?/>\}\}|`+[^`\n]*`+|\{%-?\s*raw\s*-?%\}.*?\{%-?\s*endraw\s*-?%\})"
);
re!(ABS_SKIP, new_match, r"(?i)[a-z][a-z0-9+.-]*:|/|#|\{");
re!(PLACEHOLDER, new_full, r"l\d+");
re!(PLACEHOLDER_LINK, r"\[(l\d+)\]\(\1\)");
re!(LINK_MD, r"(\]\()(\s*<?)([^)\s>]+)");
re!(LINK_REF, r"(?m)^(\s{0,3}\[(?!\^)[^\]]+\]:\s*)(\S+)");
re!(
    LINK_HTML,
    r#"(<[a-zA-Z][^<>]*?\s(?:href|src)=)(["'])([^"']*)\2"#
);
re!(EMPTY_LINK, r"\]\(\s*\)");
re!(SPACED_LINK, r#"\]\(([^()\s"']+(?: [^()\s"']+)+)\)"#);
re!(TILDE, r"(?<![~\\])~(?![~\s])([^~\n]*?[^~\s\\])~(?!~)");

/// urllib.parse.urlsplit (Python 3.12) for a URL with no scheme of its own
/// past the one fix() lets through.
struct Split {
    scheme: String,
    netloc: String,
    path: String,
    query: String,
    fragment: String,
}

fn urlsplit(url: &str, default_scheme: &str) -> Split {
    let url = url.trim_start_matches(|c: char| c <= ' ');
    let mut url: String = url
        .chars()
        .filter(|c| !matches!(c, '\t' | '\r' | '\n'))
        .collect();
    let mut scheme = default_scheme.to_string();
    if let Some(i) = url.find(':') {
        let first = url.chars().next().unwrap();
        if i > 0
            && first.is_ascii_alphabetic()
            && url[..i]
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || "+-.".contains(c))
        {
            scheme = url[..i].to_ascii_lowercase();
            url = url[i + 1..].to_string();
        }
    }
    let mut netloc = String::new();
    if url.starts_with("//") {
        let rest = &url[2..];
        let delim = rest.find(['/', '?', '#']).unwrap_or(rest.len());
        netloc = rest[..delim].to_string();
        url = rest[delim..].to_string();
        // Python validates brackets and NFKC-normalizes non-ASCII netlocs,
        // raising ValueError on some: leave those to it.
        if netloc.contains(['[', ']']) || !netloc.is_ascii() {
            panic!("urlsplit: netloc {netloc:?} needs Python's checks");
        }
    }
    let mut fragment = String::new();
    if let Some((a, b)) = url.split_once('#') {
        fragment = b.to_string();
        url = a.to_string();
    }
    let mut query = String::new();
    if let Some((a, b)) = url.split_once('?') {
        query = b.to_string();
        url = a.to_string();
    }
    Split {
        scheme,
        netloc,
        path: url,
        query,
        fragment,
    }
}

/// urlparse: urlsplit plus ;params off the last segment (https uses them).
fn urlparse(url: &str, default_scheme: &str) -> (Split, String) {
    let mut s = urlsplit(url, default_scheme);
    let mut params = String::new();
    const USES_PARAMS: &[&str] = &[
        "", "ftp", "hdl", "prospero", "http", "imap", "https", "shttp", "rtsp", "rtsps", "rtspu",
        "sip", "sips", "mms", "sftp", "tel",
    ];
    if USES_PARAMS.contains(&s.scheme.as_str()) && s.path.contains(';') {
        let i = if s.path.contains('/') {
            let from = s.path.rfind('/').unwrap();
            s.path[from..].find(';').map(|k| k + from)
        } else {
            s.path.find(';')
        };
        if let Some(i) = i {
            params = s.path[i + 1..].to_string();
            s.path = s.path[..i].to_string();
        }
    }
    (s, params)
}

fn urlunparse(s: &Split, params: &str) -> String {
    let mut url = s.path.clone();
    if !params.is_empty() {
        url = format!("{url};{params}");
    }
    // Python's uses_netloc holds https; urljoin returns early for any scheme
    // but the base's, so no other reaches here.
    const USES_NETLOC: &[&str] = &["", "https"];
    if !s.netloc.is_empty()
        || (!s.scheme.is_empty()
            && USES_NETLOC.contains(&s.scheme.as_str())
            && !url.starts_with("//"))
    {
        if !url.is_empty() && !url.starts_with('/') {
            url = format!("/{url}");
        }
        url = format!("//{}{}", s.netloc, url);
    }
    if !s.scheme.is_empty() {
        url = format!("{}:{}", s.scheme, url);
    }
    if !s.query.is_empty() {
        url = format!("{url}?{}", s.query);
    }
    if !s.fragment.is_empty() {
        url = format!("{url}#{}", s.fragment);
    }
    url
}

/// urllib.parse.urljoin (Python 3.12), for an https base.
pub fn urljoin(base: &str, url: &str) -> String {
    if base.is_empty() {
        return url.to_string();
    }
    if url.is_empty() {
        return base.to_string();
    }
    let (b, bparams) = urlparse(base, "");
    let (mut u, mut params) = urlparse(url, &b.scheme);
    const USES_RELATIVE: &[&str] = &[
        "", "ftp", "http", "gopher", "nntp", "imap", "wais", "file", "https", "shttp", "mms",
        "prospero", "rtsp", "rtsps", "rtspu", "sftp", "svn", "svn+ssh", "ws", "wss",
    ];
    if u.scheme != b.scheme || !USES_RELATIVE.contains(&u.scheme.as_str()) {
        return url.to_string();
    }
    // https uses netloc.
    if !u.netloc.is_empty() {
        return urlunparse(&u, &params);
    }
    u.netloc = b.netloc.clone();
    if u.path.is_empty() && params.is_empty() {
        u.path = b.path.clone();
        params = bparams;
        if u.query.is_empty() {
            u.query = b.query.clone();
        }
        return urlunparse(&u, &params);
    }
    let mut base_parts: Vec<&str> = b.path.split('/').collect();
    if base_parts.last() != Some(&"") {
        base_parts.pop();
    }
    let segments: Vec<String> = if u.path.starts_with('/') {
        u.path.split('/').map(String::from).collect()
    } else {
        let mut s: Vec<String> = base_parts.iter().map(|x| x.to_string()).collect();
        s.extend(u.path.split('/').map(String::from));
        // segments[1:-1] = filter(None, segments[1:-1])
        if s.len() > 2 {
            let last = s.pop().unwrap();
            let first = s.remove(0);
            let mid: Vec<String> = s.into_iter().filter(|x| !x.is_empty()).collect();
            let mut r = vec![first];
            r.extend(mid);
            r.push(last);
            r
        } else {
            s
        }
    };
    let mut resolved: Vec<&str> = vec![];
    for seg in &segments {
        match seg.as_str() {
            ".." => {
                resolved.pop();
            }
            "." => {}
            s => resolved.push(s),
        }
    }
    if matches!(segments.last().map(String::as_str), Some(".") | Some("..")) {
        resolved.push("");
    }
    let p = resolved.join("/");
    u.path = if p.is_empty() { "/".into() } else { p };
    urlunparse(&u, &params)
}

fn absolutize(text: &str, base: &str, notes: &mut Notes) -> String {
    let fix = |url: &str, notes: &mut Notes| -> String {
        if url.is_empty() || ABS_SKIP.is_match(url) || PLACEHOLDER.is_match(url) {
            return url.to_string();
        }
        let joined = urljoin(&format!("https://idvork.in{base}"), url);
        let new = joined
            .strip_prefix("https://idvork.in")
            .unwrap_or(&joined)
            .to_string();
        notes.push("relative_links", format!("{url} -> {new}"));
        new
    };
    let parts = ABS_SPLIT.split_keep(text);
    let mut out = String::with_capacity(text.len() + 16);
    for (i, p) in parts.iter().enumerate() {
        if i % 2 == 1 {
            out.push_str(p);
            continue;
        }
        let seg = PLACEHOLDER_LINK.sub_t(p, "<a href=\"\\1\">\\1</a>");
        let seg = LINK_MD.sub(&seg, |m| {
            format!("{}{}{}", g(m, 1), g(m, 2), fix(g(m, 3), notes))
        });
        let seg = LINK_REF.sub(&seg, |m| format!("{}{}", g(m, 1), fix(g(m, 2), notes)));
        let seg = LINK_HTML.sub(&seg, |m| {
            format!("{}{}{}{}", g(m, 1), g(m, 2), fix(g(m, 3), notes), g(m, 2))
        });
        let seg = EMPTY_LINK.sub_t(&seg, "](#)");
        let seg = SPACED_LINK.sub(&seg, |m| format!("]({})", g(m, 1).replace(' ', "%20")));
        out.push_str(&TILDE.sub_t(&seg, "\\\\~\\1\\\\~"));
    }
    out
}

// ---- html_block_lines ----
re!(SCRIPT_THEN_TAG, r"(</(?:script|style)>)[ \t]*(<[A-Za-z])");
re!(IMG_ALT, r"!\[([^\]`]*)\]");
re!(FENCE_OPEN, new_match, r"\s{0,3}(`{3,}|~{3,})");
re!(
    OPEN_TAG_RUNS_ON,
    new_full,
    r"\s{0,3}<[A-Za-z][\w-]*(\s+[^<>]*)?"
);
re!(
    LONE_INLINE_OPEN,
    new_full,
    r"\s*<(span|a|em|strong|small|b|i|u|sup|sub)(\s[^<>]*)?>\s*"
);
re!(BLOCKISH, new_match, r"\s*(<|#|\||[-*+]\s|\d+[.)]\s)");

fn html_block_lines(body: &str, notes: &mut Notes) -> String {
    let (body, mut n) = SCRIPT_THEN_TAG.subn_t(body, "\\1\n\\2");
    let body = IMG_ALT.sub(&body, |m| format!("![{}]", g(m, 1).replace('\n', " ")));
    let lines: Vec<&str> = body.split('\n').collect();
    let mut out: Vec<String> = vec![];
    let mut i = 0;
    let mut fence: Option<String> = None;
    while i < lines.len() {
        let mut line = lines[i].to_string();
        let f = FENCE_OPEN.caps(lines[i]);
        if let (Some(f), None) = (&f, &fence) {
            fence = Some(g(f, 1).to_string());
        } else if fence
            .as_ref()
            .is_some_and(|fe| strip(lines[i]).starts_with(fe.as_str()))
        {
            fence = None;
        } else if fence.is_none() && OPEN_TAG_RUNS_ON.is_match(lines[i]) {
            let mut j = i + 1;
            while j < lines.len()
                && j - i < 30
                && !lines[j].contains('>')
                && !strip(lines[j]).is_empty()
            {
                j += 1;
            }
            if j < lines.len()
                && lines[j].contains('>')
                && !lines[j].split('>').next().unwrap().contains('<')
            {
                line = lines[i..=j]
                    .iter()
                    .map(|x| strip(x))
                    .collect::<Vec<_>>()
                    .join(" ");
                n += 1;
                i = j;
            }
        }
        out.push(line);
        i += 1;
    }
    for k in 0..out.len() {
        let Some(m) = LONE_INLINE_OPEN.caps(&out[k]) else {
            continue;
        };
        let name = g(&m, 1).to_string();
        let attrs = g(&m, 2).to_string();
        let mut rest = vec![];
        for x in &out[k + 1..] {
            if strip(x).is_empty() {
                break;
            }
            rest.push(x.as_str());
        }
        if !rest.join("\n").contains(&format!("</{name}>")) {
            let tag = format!("<{name}{attrs}></{name}>");
            let prev = if k > 0 { out[k - 1].as_str() } else { "" };
            let joins = !strip(prev).is_empty() && !BLOCKISH.is_match(prev);
            out[k] = if joins { tag } else { format!("<p>{tag}</p>") };
            n += 1;
        }
    }
    if n > 0 {
        notes.set("html_block_lines", n as i64);
    }
    out.join("\n")
}

// ---- place_tokens ----
re!(TOKEN, r"\{\{<inc (\d+) />\}\}");
re!(LIST_PREV, new_match, r"\s*([-*+]|\d+[.)])\s");
re!(BLANK_LINE_IN, r"\n[ \t]*\n");
re!(SCRIPT_BLOCK, r"(?s)<(script|style)\b.*?</\1>");
re!(DEFERRED, r"\x00(\d+)\x00");

fn place_tokens(body: &str, incs: &[Inc], notes: &mut Notes) -> String {
    let mut deferred: Vec<String> = vec![];
    let mut out = TOKEN.sub(body, |m| {
        let m0 = m.get(0).unwrap();
        let inc = &incs[g(m, 1).parse::<usize>().unwrap()];
        let text = inc.text.as_str();
        let line_start = body[..m0.start()].rfind('\n').map_or(0, |p| p + 1);
        let prefix = &body[line_start..m0.start()];
        let line_end = body[m0.end()..].find('\n').map(|p| p + m0.end());
        let rest = &body[m0.end()..line_end.unwrap_or(body.len())];
        let e = line_start.saturating_sub(1);
        let prev = &body[body[..e].rfind('\n').map_or(0, |p| p + 1)..e];
        let alone = inc.inline && strip(prefix).is_empty() && strip(rest).is_empty();
        if alone
            && !strip(prev).is_empty()
            && !["<", "#", "{{<inc", "|"]
                .iter()
                .any(|p| lstrip(prev).starts_with(p))
            && !LIST_PREV.is_match(prev)
        {
            return text.to_string();
        }
        if alone {
            notes.add("inline_paragraphs", 1);
            return format!("<p>{text}</p>");
        }
        if prefix.is_empty() {
            return text.to_string();
        }
        if strip(prefix).is_empty() {
            notes.add("indented_calls", 1);
            return text.replace('\n', &format!("\n{}", " ".repeat(pylen(prefix))));
        }
        if BLANK_LINE_IN.is_match(text) {
            notes.add("block_calls", 1);
            return format!("{}\n\n", rstrip(text));
        }
        notes.add("inline_calls", 1);
        let t = SCRIPT_BLOCK.sub(text, |sm| {
            deferred.push(g(sm, 0).to_string());
            format!("\x00{}\x00", deferred.len() - 1)
        });
        t.replace('\n', " ")
    });
    while let Some(c) = DEFERRED.caps(&out) {
        let m0 = c.get(0).unwrap();
        let (s, e) = (m0.start(), m0.end());
        let k: usize = g(&c, 1).parse().unwrap();
        out = format!("{}{}", &out[..s], &out[e..]);
        let end = out[s..].find("\n\n").map_or(out.len(), |p| p + s);
        out = format!("{}\n\n{}{}", &out[..end], deferred[k], &out[end..]);
    }
    out
}

/// fix_markdown_py.
pub fn fix_markdown(body: &str, base: &str, incs: &mut [Inc], notes: &mut Notes) -> String {
    // Before the fence split: a list item or HTML comment can hold a fence.
    let body = lists::mark(&kramdown_fences(&toc_links(body, notes), notes));
    let mut parts = vec![];
    for (code, chunk) in split_fences(&body) {
        if code {
            parts.push(chunk);
        } else {
            let c = kramdown_em(&kramdownisms(&chunk, incs, notes), notes);
            parts.push(absolutize(&c, base, notes));
        }
    }
    for inc in incs.iter_mut() {
        // An include's Markdown links are relative to the page too.
        let t = absolutize(&inc.text, base, notes);
        inc.text = typography::apply(&html_block_lines(&t, notes));
    }
    // One pass over the whole body, fences included.
    let joined = html_block_lines(&parts.join("\n"), notes);
    place_tokens(&typography::apply(&joined), incs, notes)
}
