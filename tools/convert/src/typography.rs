//! zola/typography.py: kramdown 2's smart quotes and typographic symbols,
//! applied to Markdown text. Same rules, same order; see the Python for why.

use crate::pyre::{g, strip, Caps, Re};
use crate::re;

// re.A: \w, \d, \s and \b are ASCII in these, spelled out by hand.
// SQ_PUNCT (typography.py) then (?!\.\.)\B, under re.A. \B: both sides alike, so after "_" (a word
// char) a word char follows, after any other punctuation none does.
const PUNCT_NB: &str =
    r##"(?:_[A-Za-z0-9_]|[!"#$%'()*+,\-./:;<=>?@\[\\\]^`{|}~](?!\.\.)(?![A-Za-z0-9_]))"##;
const SQ_CLOSE: &str = r##"[^ \\\t\r\n\[{(\-]"##;
const AW: &str = "[A-Za-z0-9_]"; // ASCII \w
const ANS: &str = "[^ \\t\\n\\r\\x0B\\x0C]"; // ASCII \S

fn lq(q: &str) -> &'static str {
    if q == "'" {
        "\u{2018}"
    } else {
        "\u{201C}"
    }
}
fn rq(q: &str) -> &'static str {
    if q == "'" {
        "\u{2019}"
    } else {
        "\u{201D}"
    }
}

type Rep = fn(&Caps) -> String;
type Rule = (Re, Rep);

static RULES: std::sync::LazyLock<Vec<Rule>> = std::sync::LazyLock::new(|| {
    let r: Vec<(String, Rep)> = vec![
        (format!(r#"(["'])(?=[_*]{{1,2}}{ANS})"#), |m| {
            lq(g(m, 1)).into()
        }),
        // \B after a punctuation char: the next char is no ASCII word char.
        (format!(r#"(["'])(?={PUNCT_NB})"#), |m| rq(g(m, 1)).into()),
        (r#"([ \t\r\n]?)"'(?=[A-Za-z0-9_])"#.into(), |m| {
            format!("{}\u{201C}\u{2018}", g(m, 1))
        }),
        (r#"([ \t\r\n]?)'"(?=[A-Za-z0-9_])"#.into(), |m| {
            format!("{}\u{2018}\u{201C}", g(m, 1))
        }),
        (r#"([ \t\r\n]?)'(?=\d\ds)"#.into(), |m| {
            format!("{}\u{2019}", g(m, 1))
        }),
        (r#"([ \t\r\n])(["'])(?=[A-Za-z0-9_])"#.into(), |m| {
            format!("{}{}", g(m, 1), lq(g(m, 2)))
        }),
        (format!(r#"({SQ_CLOSE})(["'])"#), |m| {
            format!("{}{}", g(m, 1), rq(g(m, 2)))
        }),
        // re.M|re.A: s\b is s then no ASCII word char.
        (format!(r#"(?m)(["'])(?=[ \t\r\n]|s(?!{AW})|$)"#), |m| {
            rq(g(m, 1)).into()
        }),
        (r#"(?s)(.?)'"#.into(), |m| format!("{}\u{2018}", g(m, 1))),
        (r#"(?s)(.?)""#.into(), |m| format!("{}\u{201C}", g(m, 1))),
    ];
    r.into_iter().map(|(p, f)| (Re::new_at(&p), f)).collect()
});

fn sym(s: &str) -> &'static str {
    match s {
        "---" => "\u{2014}",
        "--" => "\u{2013}",
        "..." => "\u{2026}",
        "\\<<" => "<<",
        "\\>>" => ">>",
        "<< " => "\u{AB}\u{A0}", // kramdown's &laquo;&nbsp;
        " >>" => "\u{A0}\u{BB}",
        "<<" => "\u{AB}",
        ">>" => "\u{BB}",
        _ => unreachable!(),
    }
}

re!(SYM_RE, r"---|--|\.\.\.|\\<<|\\>>|<< |<<| >>|>>");
static QUOTE_START: std::sync::LazyLock<Re> = std::sync::LazyLock::new(|| {
    Re::new(&format!(
        r#"(?ms)(?<!\\)(?:["'](?=[_*]{{1,2}}{ANS})|["'](?={PUNCT_NB})|[ \t\r\n]?"'(?={AW})|[ \t\r\n]?'"(?={AW})|[ \t\r\n]?'(?=[0-9][0-9]s)|[ \t\r\n]["'](?={AW})|{SQ_CLOSE}["']|["'](?=[ \t\r\n]|s(?!{AW})|$)|.?'|.?")"#
    ))
});
re!(
    SKIP,
    concat!(
        r#"(?s)(?P<esc>\\[\\`*_{}\[\]()#+\-.!"'<>|~^])"#,
        r#"|(?P<code>(?P<ticks>`+).+?(?<!`)\k<ticks>(?!`))"#,
        r#"|(?P<img>!\[(?:[^\]\\]|\\.)*\]\([^)]*\))"#,
        r#"|(?P<dest>\]\((?:[^()\s]|\([^()]*\))*(?:\s+"[^"]*")?\))"#,
        r#"|(?P<auto><(?:https?|mailto|ftp):[^>\s]*>)"#,
        r#"|(?P<tag></?[A-Za-z][^>]*>|<!--.*?-->)"#,
        r#"|(?P<attr>\{[#:][^}\n]*\})"#,
        r#"|(?P<inc>\{\{<inc \d+ />\}\})"#,
        r#"|(?P<raw>\{%-?\s*(?:raw|endraw)\s*-?%\})"#,
        r#"|(?P<emph>\*+|(?<![A-Za-z0-9])_+|_+(?![A-Za-z0-9])|!?\[|\])"#
    )
);

/// _quote_start's memo: [pos, match].
type Last = (Option<usize>, Option<(usize, usize)>);

fn quote_start(s: &str, i: usize, last: &mut Last) -> Option<(usize, usize)> {
    if let (Some(pos), m) = *last {
        if pos <= i && m.is_none_or(|m| m.0 >= i) {
            return m;
        }
    }
    let m = QUOTE_START.find_at(s, i);
    *last = (Some(i), m);
    m
}

fn text(s: &str, start: usize, end: usize, last: &mut Last, out: &mut String) {
    let mut i = start;
    while i < end {
        let mq = quote_start(s, i, last).filter(|m| m.0 < end);
        let ms = SYM_RE.find_at(&s[..end], i);
        if mq.is_none() && ms.is_none() {
            break;
        }
        if let Some(q) = mq.filter(|q| ms.is_none_or(|ms| q.0 <= ms.0)) {
            let mut hit = None;
            for (rx, f) in RULES.iter() {
                if let Some(c) = rx.caps_at(s, q.0) {
                    let e = c.get(0).unwrap().end();
                    if q.0 < e && e <= end {
                        hit = Some((e, f(&c)));
                        break;
                    }
                }
            }
            match hit {
                None => {
                    let next = q.0 + s[q.0..].chars().next().unwrap().len_utf8();
                    out.push_str(&s[i..next]);
                    i = next;
                }
                Some((e, rep)) => {
                    out.push_str(&s[i..q.0]);
                    out.push_str(&rep);
                    i = e;
                }
            }
        } else {
            let (a, b) = ms.unwrap();
            out.push_str(&s[i..a]);
            out.push_str(sym(&s[a..b]));
            i = b;
        }
    }
    out.push_str(&s[i..end]);
}

fn line_spans(t: &str, out: &mut String) {
    let mut last: Last = (None, None);
    let mut i = 0;
    SKIP.each(t, |m| {
        let m0 = m.get(0).unwrap();
        text(t, i, m0.start(), &mut last, out);
        out.push_str(m0.as_str());
        i = m0.end();
    });
    text(t, i, t.len(), &mut last, out);
}

re!(
    VERBATIM,
    new_match,
    r"\s*\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*\z|\s{0,3}([-*_])(\s*\2){2,}\s*\z"
);
re!(SETEXT, new_match, r"\s{0,3}(=+|-+)\s*\z");
re!(DASHES, new_full, r"\s{0,3}--?\s*");
re!(
    BLOCK_HTML,
    new_match,
    concat!(
        r"(?i)\s{0,3}(?:<(?:script|pre|style|textarea)(?![\p{L}\p{N}_])|<!--|<\?|<![A-Za-z]|<!\[CDATA\[",
        r"|</?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|/?>|\z)",
        r"|</?[A-Za-z][A-Za-z0-9-]*(?:\s+[^>]*)?/?>\s*\z)"
    )
);
re!(END_SCRIPT, r"(?i)</(script|pre|style|textarea)>");
re!(END_COMMENT, r"-->");
re!(END_PI, r"\?>");
re!(END_DECL, r">");
re!(END_CDATA, r"\]\]>");
re!(
    START_SCRIPT,
    new_match,
    r"(?i)\s{0,3}<(script|pre|style|textarea)(\s|>|\z)"
);
re!(START_COMMENT, new_match, r"\s{0,3}<!--");
re!(START_PI, new_match, r"\s{0,3}<\?");
re!(START_DECL, new_match, r"\s{0,3}<![A-Za-z]");
re!(START_CDATA, new_match, r"\s{0,3}<!\[CDATA\[");
re!(
    LIST_ITEM,
    new_match,
    r"\s{0,3}(?:[-*+]|\d{1,9}[.)])(?:\s|\z)"
);
re!(FENCE, new_match, r"\s{0,3}(`{3,}|~{3,})");

#[derive(Clone, Copy, PartialEq)]
enum End {
    Script,
    Comment,
    Pi,
    Decl,
    Cdata,
    Blank,
}

fn end_re(e: End) -> &'static Re {
    match e {
        End::Script => &END_SCRIPT,
        End::Comment => &END_COMMENT,
        End::Pi => &END_PI,
        End::Decl => &END_DECL,
        End::Cdata => &END_CDATA,
        End::Blank => unreachable!(),
    }
}

fn start_kind(line: &str) -> Option<End> {
    [
        (End::Script, &*START_SCRIPT),
        (End::Comment, &*START_COMMENT),
        (End::Pi, &*START_PI),
        (End::Decl, &*START_DECL),
        (End::Cdata, &*START_CDATA),
    ]
    .into_iter()
    .find(|(_, rx)| rx.is_match(line))
    .map(|(k, _)| k)
}

pub fn apply(md: &str) -> String {
    let mut out: Vec<String> = Vec::new();
    let mut para: Vec<&str> = Vec::new();
    let mut end: Option<End> = None;
    let (mut in_code, mut in_list) = (false, false);
    let mut fence: Option<String> = None;
    let mut prev_blank = true;

    fn flush(para: &mut Vec<&str>, out: &mut Vec<String>) {
        if !para.is_empty() {
            let mut s = String::new();
            line_spans(&para.join("\n"), &mut s);
            out.push(s);
            para.clear();
        }
    }

    for line in md.split('\n') {
        let blank = strip(line).is_empty();
        if let Some(f) = &fence {
            out.push(line.to_string());
            let t = strip(line);
            let fc = f.chars().next().unwrap();
            if t.starts_with(f.as_str()) && t.trim_matches(fc).is_empty() {
                fence = None;
            }
            continue;
        }
        if let Some(e) = end {
            out.push(line.to_string());
            if (e == End::Blank && blank) || (e != End::Blank && end_re(e).is_match(line)) {
                end = None;
            }
            prev_blank = blank;
            continue;
        }
        if in_code {
            if blank || line.starts_with("    ") || line.starts_with('\t') {
                out.push(line.to_string());
                prev_blank = blank;
                continue;
            }
            in_code = false;
        }
        if blank {
            flush(&mut para, &mut out);
            out.push(line.to_string());
            prev_blank = true;
            continue;
        }
        if let Some(c) = FENCE.caps(line) {
            flush(&mut para, &mut out);
            fence = Some(g(&c, 1).to_string());
            out.push(line.to_string());
            continue;
        }
        let indented = line.starts_with("    ") || line.starts_with('\t');
        if indented && prev_blank && para.is_empty() && !in_list {
            flush(&mut para, &mut out);
            in_code = true;
            out.push(line.to_string());
            prev_blank = false;
            continue;
        }
        if !indented {
            in_list = LIST_ITEM.is_match(line) || (in_list && !prev_blank);
        }
        let kind = start_kind(line);
        if kind.is_some() || (BLOCK_HTML.is_match(line) && para.is_empty()) {
            flush(&mut para, &mut out);
            out.push(line.to_string());
            // line[line.find("<") + 2:], in code points. Every kind needs a "<".
            let p = line.find('<').unwrap();
            let skip = line[p + 1..].chars().next().map_or(0, char::len_utf8);
            let rest = &line[p + 1 + skip..];
            match kind {
                Some(k) if end_re(k).is_match(rest) => {}
                _ => end = Some(kind.unwrap_or(End::Blank)),
            }
            prev_blank = false;
            continue;
        }
        if (VERBATIM.is_match(line) && !(prev_blank && DASHES.is_match(line)))
            || (SETEXT.is_match(line) && !prev_blank)
        {
            flush(&mut para, &mut out);
            out.push(line.to_string());
            prev_blank = false;
            continue;
        }
        para.push(line);
        prev_blank = false;
    }
    flush(&mut para, &mut out);
    out.join("\n")
}
