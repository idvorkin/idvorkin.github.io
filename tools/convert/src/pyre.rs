//! Python's `re` and `str` semantics, on PCRE2.
//!
//! PCRE2 is a backtracking engine like Python's sre: same leftmost-first
//! alternation, same greedy/lazy order, lookbehind that sees before the
//! start offset, and `\G` for Python's `pattern.match(s, pos)`. The bundled
//! copy is linked statically (build.sh sets PCRE2_SYS_STATIC=1), and every
//! pattern opens with (*LF) so only "\n" is a newline, as in Python.
//! pcre.rs matches without PCRE2's per-call UTF-8 scan.
//!
//! Patterns are written as in the Python, with these rewrites done here:
//! `\s` / `\S` become Python's whitespace set (str.isspace, which includes
//! \x1c-\x1f), `\w` becomes [\p{L}\p{N}_] (str.isalnum() or "_"), `\d`
//! becomes \p{Nd}, and `\b` / `\B` are expanded against that `\w`. A bare
//! `$` outside (?m) is refused (write `\z` on a line); `\Z` must be `\z`.
//! re.A patterns spell their ASCII classes out at the call site.
//!
//! A match error (match or JIT stack limit) panics; lib.rs turns the panic
//! into RuntimeError and convert.py redoes that page in Python.

use crate::pcre::Code;

const PY_SPACE: &str = r"\t\n\x0B\x0C\r\x1C-\x1F \x{85}\x{A0}\x{1680}\x{2000}-\x{200A}\x{2028}\x{2029}\x{202F}\x{205F}\x{3000}";
const PY_WORD: &str = r"\p{L}\p{N}_";

/// Python's str.isspace().
pub fn is_space(c: char) -> bool {
    matches!(c, '\t' | '\n' | '\x0B' | '\x0C' | '\r' | '\x1C'..='\x1F' | ' ' | '\u{85}' | '\u{A0}'
        | '\u{1680}' | '\u{2000}'..='\u{200A}' | '\u{2028}' | '\u{2029}' | '\u{202F}' | '\u{205F}' | '\u{3000}')
}

pub fn strip(s: &str) -> &str {
    s.trim_matches(is_space)
}
pub fn lstrip(s: &str) -> &str {
    s.trim_start_matches(is_space)
}
pub fn rstrip(s: &str) -> &str {
    s.trim_end_matches(is_space)
}
/// len() of a Python str: code points.
pub fn pylen(s: &str) -> usize {
    s.chars().count()
}
/// Byte offset of code point n (or the end).
pub fn cidx(s: &str, n: usize) -> usize {
    s.char_indices().nth(n).map_or(s.len(), |(i, _)| i)
}

fn translate(p: &str) -> String {
    let mut out = String::with_capacity(p.len() + 16);
    out.push_str("(*LF)");
    let mut in_class = false;
    let multiline = p.contains("(?m") || p.contains("(?sm") || p.contains("(?im");
    let mut it = p.chars().peekable();
    while let Some(c) = it.next() {
        if c == '\\' {
            let n = it.next().expect("trailing backslash");
            match (n, in_class) {
                ('s', false) => out.push_str(&format!("[{PY_SPACE}]")),
                ('s', true) => out.push_str(PY_SPACE),
                ('S', false) => out.push_str(&format!("[^{PY_SPACE}]")),
                ('w', false) => out.push_str(&format!("[{PY_WORD}]")),
                ('w', true) => out.push_str(PY_WORD),
                ('d', _) => out.push_str(r"\p{Nd}"),
                ('b', false) => out.push_str(&format!(
                    "(?:(?<=[{PY_WORD}])(?![{PY_WORD}])|(?<![{PY_WORD}])(?=[{PY_WORD}]))"
                )),
                ('B', false) => out.push_str(&format!(
                    "(?:(?<=[{PY_WORD}])(?=[{PY_WORD}])|(?<![{PY_WORD}])(?![{PY_WORD}]))"
                )),
                ('S', true) | ('W', _) | ('D', _) | ('b', true) | ('B', true) | ('Z', _) => {
                    panic!("pattern {p:?}: spell \\{n} out by hand")
                }
                _ => {
                    out.push('\\');
                    out.push(n);
                }
            }
            continue;
        }
        if in_class {
            if c == ']' {
                in_class = false;
            }
        } else if c == '[' {
            in_class = true;
            out.push(c);
            // A leading ] or ^] is a literal in Python and PCRE2 alike.
            if it.peek() == Some(&'^') {
                out.push(it.next().unwrap());
            }
            if it.peek() == Some(&']') {
                out.push_str("\\]");
                it.next();
            }
            continue;
        }
        if c == '$' && !multiline && !in_class {
            // Python's $ also matches before a final "\n": write \z (on a
            // line) or use (?m), so the choice is made on purpose.
            panic!("pattern {p:?}: bare $ outside (?m)");
        }
        out.push(c);
    }
    out
}

pub struct Re(Code);

/// One match's groups, as byte offsets into the subject.
pub struct Caps<'t> {
    s: &'t str,
    locs: Vec<Option<(usize, usize)>>,
}

#[derive(Clone, Copy)]
pub struct M<'t> {
    s: &'t str,
    a: usize,
    b: usize,
}

impl<'t> M<'t> {
    pub fn start(&self) -> usize {
        self.a
    }
    pub fn end(&self) -> usize {
        self.b
    }
    pub fn as_str(&self) -> &'t str {
        &self.s[self.a..self.b]
    }
}

impl<'t> Caps<'t> {
    pub fn get(&self, i: usize) -> Option<M<'t>> {
        self.locs
            .get(i)
            .copied()
            .flatten()
            .map(|(a, b)| M { s: self.s, a, b })
    }
    pub fn len(&self) -> usize {
        self.locs.len()
    }
}

impl Re {
    pub fn new(p: &str) -> Re {
        let t = translate(p);
        Re(Code::new(&t).unwrap_or_else(|e| panic!("bad pattern {p:?} ({t:?}): {e}")))
    }
    /// re.match on a whole string (anchored at 0).
    pub fn new_match(p: &str) -> Re {
        Re::new(&format!(r"\A(?:{p})"))
    }
    /// re.fullmatch.
    pub fn new_full(p: &str) -> Re {
        Re::new(&format!(r"\A(?:{p})\z"))
    }
    /// pattern.match(s, pos): anchored at pos, lookbehind sees before it.
    pub fn new_at(p: &str) -> Re {
        Re::new(&format!(r"\G(?:{p})"))
    }

    pub fn caps_at<'t>(&self, s: &'t str, pos: usize) -> Option<Caps<'t>> {
        let mut locs = Vec::new();
        let hit = self
            .0
            .exec(s, pos, &mut locs)
            .unwrap_or_else(|e| panic!("regex {:?}: {e}", self.0.pattern()));
        hit.then_some(Caps { s, locs })
    }
    pub fn caps<'t>(&self, s: &'t str) -> Option<Caps<'t>> {
        self.caps_at(s, 0)
    }
    pub fn find_at(&self, s: &str, pos: usize) -> Option<(usize, usize)> {
        self.caps_at(s, pos).map(|c| {
            let m = c.get(0).unwrap();
            (m.start(), m.end())
        })
    }
    pub fn is_match(&self, s: &str) -> bool {
        self.find_at(s, 0).is_some()
    }

    /// Every match, as Python's finditer yields them.
    pub fn each<'t>(&self, s: &'t str, mut f: impl FnMut(&Caps<'t>)) {
        let mut pos = 0;
        let mut empty_at: Option<usize> = None;
        while pos <= s.len() {
            let Some(c) = self.caps_at(s, pos) else { break };
            let m = c.get(0).unwrap();
            if m.start() == m.end() && empty_at == Some(m.start()) {
                // ponytail: Python retries at the same spot for a non-empty
                // match; no pattern here can match both ways at one spot.
                match s[pos..].chars().next() {
                    Some(ch) => {
                        pos += ch.len_utf8();
                        continue;
                    }
                    None => break,
                }
            }
            f(&c);
            empty_at = (m.start() == m.end()).then_some(m.end());
            pos = m.end();
        }
    }

    /// re.subn with a function replacement.
    pub fn subn(&self, s: &str, mut f: impl FnMut(&Caps) -> String) -> (String, usize) {
        let mut out = String::with_capacity(s.len());
        let mut last = 0;
        let mut n = 0;
        self.each(s, |c| {
            let m = c.get(0).unwrap();
            out.push_str(&s[last..m.start()]);
            out.push_str(&f(c));
            last = m.end();
            n += 1;
        });
        out.push_str(&s[last..]);
        (out, n)
    }
    pub fn sub(&self, s: &str, f: impl FnMut(&Caps) -> String) -> String {
        self.subn(s, f).0
    }
    /// re.sub with a template of \N group references, \n and \\.
    pub fn sub_t(&self, s: &str, t: &str) -> String {
        self.subn_t(s, t).0
    }
    pub fn subn_t(&self, s: &str, t: &str) -> (String, usize) {
        self.subn(s, |c| expand(c, t))
    }
    pub fn sub_count(&self, s: &str, t: &str, count: usize) -> String {
        let mut out = String::with_capacity(s.len());
        let mut last = 0;
        let mut n = 0;
        self.each(s, |c| {
            if n >= count {
                return;
            }
            let m = c.get(0).unwrap();
            out.push_str(&s[last..m.start()]);
            out.push_str(&expand(c, t));
            last = m.end();
            n += 1;
        });
        out.push_str(&s[last..]);
        out
    }
    pub fn count(&self, s: &str) -> usize {
        // No pattern counted here can match empty (see each()).
        let (mut n, mut pos) = (0, 0);
        while let Some((a, b)) = self.find_at(s, pos) {
            assert!(b > a, "count: empty match");
            n += 1;
            pos = b;
        }
        n
    }
    /// re.split with the pattern's groups kept (none of the callers' groups
    /// can sit out a match, which Python would give as None).
    pub fn split_keep(&self, s: &str) -> Vec<String> {
        let mut out = Vec::new();
        let mut last = 0;
        self.each(s, |c| {
            let m = c.get(0).unwrap();
            out.push(s[last..m.start()].to_string());
            for i in 1..c.len() {
                out.push(c.get(i).map_or("", |x| x.as_str()).to_string());
            }
            last = m.end();
        });
        out.push(s[last..].to_string());
        out
    }
}

/// Python re template expansion for \1..\9, \n and \\ (all these use).
fn expand(c: &Caps, t: &str) -> String {
    let mut out = String::new();
    let mut it = t.chars();
    while let Some(ch) = it.next() {
        if ch != '\\' {
            out.push(ch);
            continue;
        }
        match it.next() {
            Some(d @ '1'..='9') => out.push_str(g(c, d.to_digit(10).unwrap() as usize)),
            Some('\\') => out.push('\\'),
            Some('n') => out.push('\n'),
            o => panic!("template {t:?}: unsupported escape {o:?}"),
        }
    }
    out
}

pub fn g<'a>(c: &Caps<'a>, i: usize) -> &'a str {
    c.get(i).map_or("", |m| m.as_str())
}

/// A literal for a pattern: ASCII punctuation escaped (PCRE2 reads any
/// escaped non-alphanumeric ASCII char as itself).
pub fn escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        if c.is_ascii() && !c.is_ascii_alphanumeric() {
            out.push('\\');
        }
        out.push(c);
    }
    out
}

#[macro_export]
macro_rules! re {
    ($name:ident, $kind:ident, $p:expr) => {
        static $name: std::sync::LazyLock<$crate::pyre::Re> =
            std::sync::LazyLock::new(|| $crate::pyre::Re::$kind($p));
    };
    ($name:ident, $p:expr) => {
        static $name: std::sync::LazyLock<$crate::pyre::Re> =
            std::sync::LazyLock::new(|| $crate::pyre::Re::new($p));
    };
}
