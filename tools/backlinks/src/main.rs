// back-links.json from a built site: a port of `build_back_links.py build`
// that writes the same bytes. Run it from the source checkout (markdown paths
// and `git log` are relative to it):
//
//   backlinks --site _site --output back-links.json [--base-url URL]
//             [--topics topics.json] [--rules topic_rules.json]
//             [--threshold-minutes 60]
//
// Every quirk of the Python is kept on purpose, because the output must stay
// byte-identical: the `endswith` deny list, redirects resolved once per pass
// (three passes on outgoing links, two on incoming), insertion-ordered
// incoming links, doc_size counted in characters, and the 60-minute rule that
// keeps an existing file's last_modified.

use chrono::{DateTime, FixedOffset, SecondsFormat, Utc};
use html5ever::driver::{self, ParseOpts};
use html5ever::tendril::TendrilSink;
use html5ever::tree_builder::TreeBuilderOpts;
use indexmap::IndexMap;
use rayon::prelude::*;
use regex::Regex;
use scraper::{Html, HtmlTreeSink, Node};
use serde_json::{json, Map, Value};
use std::collections::{HashMap, HashSet};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{env, fs};

type Res<T> = Result<T, String>;

struct Page {
    url: String,
    title: String,
    description: String,
    file_path: String,
    outgoing_links: Vec<String>,
    incoming_links: Vec<String>,
    markdown_path: String,
    doc_size: usize,
    last_modified: String,
    front_matter_tags: Vec<String>,
    topics: Vec<String>,
}

enum Parsed {
    Skip,
    Redirect { url: String, to: String },
    Page(Page),
}

struct Rule {
    slug: String,
    words: HashSet<String>,
    tags: HashSet<String>,
    not_tags: HashSet<String>,
}

struct Args {
    site: PathBuf,
    output: PathBuf,
    base_url: Option<String>,
    topics: PathBuf,
    rules: PathBuf,
    threshold_minutes: f64,
}

fn parse_args() -> Res<Args> {
    let mut a = Args {
        site: "_site".into(),
        output: "back-links.json".into(),
        base_url: None,
        topics: "topics.json".into(),
        rules: "topic_rules.json".into(),
        threshold_minutes: 60.0,
    };
    let mut it = env::args().skip(1);
    while let Some(flag) = it.next() {
        let mut val = || it.next().ok_or(format!("{flag} needs a value"));
        match flag.as_str() {
            "--site" => a.site = val()?.into(),
            "--output" => a.output = val()?.into(),
            "--base-url" => a.base_url = Some(val()?),
            "--topics" => a.topics = val()?.into(),
            "--rules" => a.rules = val()?.into(),
            "--threshold-minutes" => {
                a.threshold_minutes = val()?.parse().map_err(|e| format!("{e}"))?
            }
            _ => return Err(format!("unknown argument {flag} (see the top of main.rs)")),
        }
    }
    Ok(a)
}

// ---- jekyll_config ----------------------------------------------------------

fn is_allow_incoming(file_path: &str) -> bool {
    !["404.html", "all.html", "toc.html", "index.html", "tags.html"]
        .iter()
        .any(|d| file_path.ends_with(d))
}

fn is_allow_outgoing(path: &str) -> bool {
    if path == "/" {
        return false;
    }
    if ["/ig66", "/random", "/tags", "/about", "/linkedin", "/td"].contains(&path) {
        return false;
    }
    if path.starts_with("/published-chop-logs/") || path.starts_with("/zz-chop-logs/") {
        return false;
    }
    path.starts_with('/')
}

struct UrlStrip {
    localhost: Regex,
    any_host: Regex,
    base_url: Option<String>,
}

impl UrlStrip {
    fn new(base_url: Option<String>) -> Self {
        UrlStrip {
            localhost: Regex::new(r"http://localhost(:\d+)?").unwrap(),
            any_host: Regex::new(r"http://0\.0\.0\.0(:\d+)?").unwrap(),
            base_url,
        }
    }
    // backlinks.sh patches the BASE_URL strip in right after the https one.
    fn site_relative(&self, url: &str) -> String {
        let url = self.localhost.replace_all(url, "");
        let url = self.any_host.replace_all(&url, "");
        let mut url = url.replace("https://idvork.in", "");
        if let Some(b) = &self.base_url {
            url = url.replace(b.as_str(), "");
        }
        url.replace("http://idvork.in", "")
    }
}

fn clean_title(t: &str) -> String {
    t.replace("\n  ", "").replace(" \n", "")
}

// ---- parse_page -------------------------------------------------------------

fn attr<'a>(el: &'a scraper::node::Element, name: &str) -> Option<&'a str> {
    // lxml keys attributes by their written name, so `xlink:href` is not `href`.
    el.attrs
        .iter()
        .find(|(q, _)| q.ns.is_empty() && q.prefix.is_none() && &*q.local == name)
        .map(|(_, v)| &**v)
}

// BeautifulSoup's Tag.string: the lone child's string, recursing, else None.
fn bs_string(node: ego_tree::NodeRef<Node>) -> Option<String> {
    let mut children = node.children();
    let only = children.next()?;
    if children.next().is_some() {
        return None;
    }
    match only.value() {
        Node::Text(t) => Some(t.to_string()),
        Node::Comment(c) => Some(c.to_string()),
        Node::Element(_) => bs_string(only),
        _ => None,
    }
}

// Python's len() after universal-newline reading: chars, with \r\n as one.
fn py_text_len(s: &str) -> usize {
    s.chars().count() - s.matches("\r\n").count()
}

fn parse_page(path: &Path, label: &str, strip: &UrlStrip) -> Res<Parsed> {
    if !is_allow_incoming(label) {
        return Ok(Parsed::Skip);
    }
    let contents =
        fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
    let opts = ParseOpts {
        // lxml parses <noscript> content as markup; html5ever does only with
        // scripting off.
        tree_builder: TreeBuilderOpts { scripting_enabled: false, ..Default::default() },
        ..Default::default()
    };
    let doc: Html =
        driver::parse_document(HtmlTreeSink::new(Html::new_document()), opts).one(contents.as_str());

    let mut title: Option<String> = None;
    let mut seen_title = false;
    let (mut og_title, mut canonical, mut og_desc, mut md_path, mut keywords) =
        (None, None, None, None, None);
    let mut links = Vec::new();
    for node in doc.tree.root().descendants() {
        let Node::Element(el) = node.value() else { continue };
        match el.name() {
            "title" if !seen_title => {
                seen_title = true;
                title = bs_string(node);
            }
            "meta" => {
                let content = || -> Res<String> {
                    attr(el, "content")
                        .map(str::to_string)
                        .ok_or(format!("{label}: <meta> without content"))
                };
                match attr(el, "property") {
                    Some("og:title") if og_title.is_none() => og_title = Some(content()?),
                    Some("og:description") if og_desc.is_none() => og_desc = Some(content()?),
                    Some("markdown-path") if md_path.is_none() => md_path = Some(content()?),
                    Some("keywords") if keywords.is_none() => keywords = Some(content()?),
                    _ => {}
                }
            }
            "link" if canonical.is_none() => {
                if let Some(rel) = attr(el, "rel") {
                    if rel == "canonical" || rel.split_ascii_whitespace().any(|r| r == "canonical") {
                        canonical = Some(
                            attr(el, "href")
                                .ok_or(format!("{label}: canonical <link> without href"))?
                                .to_string(),
                        );
                    }
                }
            }
            "a" => {
                if let Some(href) = attr(el, "href") {
                    let nav = attr(el, "class")
                        .is_some_and(|c| c.split_ascii_whitespace().any(|c| c == "nav-item"));
                    if !nav {
                        links.push(href.to_string());
                    }
                }
            }
            _ => {}
        }
    }

    let page_title = og_title.or(title).unwrap_or_default();
    let canonical = canonical.unwrap_or_default();
    if page_title.is_empty() || canonical.is_empty() {
        return Ok(Parsed::Skip);
    }
    let url = strip.site_relative(&canonical);
    if page_title.starts_with("Redirecting") {
        let src = label.replace("_site/", "/").replace(".html", "");
        return Ok(Parsed::Redirect { url: src, to: url });
    }

    let outgoing_links = links
        .into_iter()
        .filter(|l| is_allow_outgoing(l))
        .filter(|l| l != "/tags" && !l.starts_with("/tags#"))
        .map(|l| l.split('#').next().unwrap().to_string())
        .collect();
    let len = py_text_len(&contents);
    let front_matter_tags = keywords
        .unwrap_or_default()
        .split(',')
        .filter(|t| !t.trim().is_empty())
        .map(str::to_string)
        .collect();
    Ok(Parsed::Page(Page {
        url,
        title: clean_title(&page_title),
        description: og_desc.unwrap_or_else(|| "...".into()),
        file_path: label.to_string(),
        outgoing_links,
        incoming_links: vec![],
        markdown_path: md_path.unwrap_or_default(),
        doc_size: len - len % 1000,
        last_modified: String::new(),
        front_matter_tags,
        topics: vec![],
    }))
}

// ---- topics -----------------------------------------------------------------

fn load_rules(path: &Path) -> Res<Vec<Rule>> {
    let text = fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
    let v: Value = serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?;
    let obj = v.as_object().ok_or("topic rules: not an object")?;
    let set = |r: &Value, k: &str| -> HashSet<String> {
        r.get(k).and_then(Value::as_str).unwrap_or("").split_whitespace().map(str::to_string).collect()
    };
    // Sorted by slug, so the topics come out sorted as Python's do.
    let mut rules: Vec<Rule> = obj
        .iter()
        .map(|(slug, r)| Rule {
            slug: slug.clone(),
            words: set(r, "words"),
            tags: set(r, "tags"),
            not_tags: set(r, "not_tags"),
        })
        .collect();
    rules.sort_by(|a, b| a.slug.cmp(&b.slug));
    Ok(rules)
}

fn normalize_tag(tag: &str) -> String {
    tag.trim().to_lowercase().split_whitespace().collect::<Vec<_>>().join("-")
}

fn topics_for_tags<'a>(tags: impl Iterator<Item = &'a String>, rules: &[Rule]) -> Vec<String> {
    let normalized: HashSet<String> = tags.map(|t| normalize_tag(t)).collect();
    let matches = |r: &Rule, tag: &String| {
        !r.not_tags.contains(tag) && (r.tags.contains(tag) || tag.split('-').any(|w| r.words.contains(w)))
    };
    rules
        .iter()
        .filter(|r| normalized.iter().any(|t| matches(r, t)))
        .map(|r| r.slug.clone())
        .collect()
}

fn load_post_tags(path: &Path) -> Vec<(String, Vec<String>)> {
    let parsed = fs::read_to_string(path)
        .map_err(|e| e.to_string())
        .and_then(|t| serde_json::from_str::<Value>(&t).map_err(|e| e.to_string()))
        .and_then(|v| match v.get("posts").and_then(Value::as_object) {
            Some(posts) => posts
                .iter()
                .map(|(url, post)| {
                    let post = post.as_object().ok_or("post is not an object")?;
                    let tags = match post.get("tags") {
                        None => vec![],
                        Some(t) => t
                            .as_array()
                            .ok_or("tags is not a list")?
                            .iter()
                            .map(|x| x.as_str().map(str::to_string).ok_or("tag is not a string"))
                            .collect::<Result<_, _>>()?,
                    };
                    Ok((url.clone(), tags))
                })
                .collect::<Result<Vec<_>, &str>>()
                .map_err(str::to_string),
            None => Err("no posts".into()),
        });
    parsed.unwrap_or_else(|e| {
        println!("WARNING: no topics.json tags for random topics ({}): {e}", path.display());
        vec![]
    })
}

// ---- LinkBuilder ------------------------------------------------------------

struct LinkBuilder {
    incoming_links: IndexMap<String, Vec<String>>,
    redirects: HashMap<String, String>,
    pages: HashMap<String, Page>,
    post_tags: Vec<(String, Vec<String>)>,
    rules: Vec<Rule>,
}

impl LinkBuilder {
    fn update(&mut self, parsed: Parsed) {
        match parsed {
            Parsed::Skip => {}
            Parsed::Redirect { url, to } => {
                self.redirects.insert(url, to);
            }
            Parsed::Page(page) => {
                if page.url != "/changelog" {
                    for link in &page.outgoing_links {
                        let clean = link.split('#').next().unwrap().to_string();
                        self.incoming_links.entry(clean).or_default().push(page.url.clone());
                    }
                }
                self.pages.insert(page.url.clone(), page);
            }
        }
    }

    fn canonicalize_outgoing_pages(&mut self) {
        for page in self.pages.values_mut() {
            let mut v: Vec<String> = page
                .outgoing_links
                .iter()
                .map(|l| self.redirects.get(l).unwrap_or(l).clone())
                .collect();
            v.sort();
            v.dedup();
            page.outgoing_links = v;
        }
    }

    fn assign_topics(&mut self) {
        let mut post_tags: HashMap<&str, Vec<String>> = HashMap::new();
        for (url, tags) in &self.post_tags {
            let key = self.redirects.get(url).unwrap_or(url);
            post_tags.entry(key).or_default().extend(tags.iter().cloned());
        }
        for page in self.pages.values_mut() {
            let extra = post_tags.get(page.url.as_str()).map(Vec::as_slice).unwrap_or(&[]);
            page.topics = topics_for_tags(page.front_matter_tags.iter().chain(extra), &self.rules);
        }
    }

    fn compress(&mut self) {
        self.assign_topics();
        self.canonicalize_outgoing_pages();
        let links: Vec<String> = self.incoming_links.keys().cloned().collect();
        for link in links {
            let Some(canonical) = self.redirects.get(&link).cloned() else { continue };
            let moved = self.incoming_links.get(&link).cloned().unwrap_or_default();
            self.incoming_links.entry(canonical).or_default().extend(moved);
            self.incoming_links.shift_remove(&link);
        }
        self.incoming_links.shift_remove("/tags");
        for v in self.incoming_links.values_mut() {
            v.retain(|u| u != "/tags");
            v.sort();
            v.dedup();
        }
        // Python rebuilds the dict sorted by lowercased key; the next pass
        // walks it in that order.
        self.incoming_links.sort_by(|a, _, b, _| a.to_lowercase().cmp(&b.to_lowercase()));
        for (link, v) in &self.incoming_links {
            if let Some(p) = self.pages.get_mut(link) {
                p.incoming_links = v.clone();
            }
        }
    }
}

// ---- last_modified ----------------------------------------------------------

fn now_iso() -> String {
    Utc::now().to_rfc3339_opts(SecondsFormat::Micros, false)
}

// `git log -1 --format=%cd --date=iso` ("2026-11-24 10:00:00 -0800") as
// Python's datetime.isoformat() ("2026-11-24T10:00:00-08:00").
fn git_date_iso(s: &str) -> Option<String> {
    DateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S %z")
        .ok()
        .map(|d| d.to_rfc3339_opts(SecondsFormat::Secs, false))
}

fn last_modified(path: &str) -> Option<String> {
    if path.is_empty() || !Path::new(path).exists() {
        return None;
    }
    let out = Command::new("git")
        .args(["log", "-1", "--format=%cd", "--date=iso", "--", path])
        .output();
    let date = match out {
        Ok(o) if o.status.success() => git_date_iso(String::from_utf8_lossy(&o.stdout).trim()),
        _ => None,
    };
    if date.is_none() {
        println!("Using current time for: {path}");
    }
    Some(date.unwrap_or_else(now_iso))
}

fn parse_iso(s: &str) -> Option<DateTime<FixedOffset>> {
    DateTime::parse_from_rfc3339(s).ok()
}

// ---- main -------------------------------------------------------------------

fn write_atomic(path: &Path, bytes: &[u8]) -> Res<()> {
    let dir = path.parent().filter(|d| !d.as_os_str().is_empty()).unwrap_or(Path::new("."));
    let name = path.file_name().ok_or("bad output path")?.to_string_lossy();
    let tmp = dir.join(format!(".{name}.{}.tmp", std::process::id()));
    let result = (|| -> std::io::Result<()> {
        let mut f = fs::File::create(&tmp)?;
        f.write_all(bytes)?;
        f.sync_all()?;
        fs::rename(&tmp, path)
    })();
    result.map_err(|e| {
        let _ = fs::remove_file(&tmp);
        format!("{}: {e}", path.display())
    })
}

fn run() -> Res<()> {
    let args = parse_args()?;
    let strip = UrlStrip::new(args.base_url.clone());
    let site = args.site.to_string_lossy().trim_end_matches('/').to_string();

    // os.listdir order for _site, _site/td, _site/d: the last file wins when
    // two pages claim one URL.
    let mut files = Vec::new();
    for (dir, label) in [("", "_site"), ("/td", "_site/td"), ("/d", "_site/d")] {
        let d = format!("{site}{dir}");
        for e in fs::read_dir(&d).map_err(|e| format!("{d}: {e}"))? {
            let name = e.map_err(|e| e.to_string())?.file_name().to_string_lossy().to_string();
            if name.ends_with(".html") {
                files.push((PathBuf::from(format!("{d}/{name}")), format!("{label}/{name}")));
            }
        }
    }
    let parsed: Vec<Parsed> = files
        .par_iter()
        .map(|(p, label)| parse_page(p, label, &strip))
        .collect::<Res<_>>()?;

    let mut lb = LinkBuilder {
        incoming_links: IndexMap::new(),
        redirects: HashMap::new(),
        pages: HashMap::new(),
        post_tags: load_post_tags(&args.topics),
        rules: load_rules(&args.rules)?,
    };
    for p in parsed {
        lb.update(p);
    }

    let mut md: Vec<&str> = lb.pages.values().map(|p| p.markdown_path.as_str()).collect();
    md.sort_unstable();
    md.dedup();
    let dates: HashMap<String, String> = md
        .par_iter()
        .filter_map(|p| last_modified(p).map(|d| (p.to_string(), d)))
        .collect();
    for page in lb.pages.values_mut() {
        if let Some(d) = dates.get(&page.markdown_path) {
            page.last_modified = d.clone();
        }
    }

    // Keep an existing file's date when the new one is within the threshold.
    let existing: Option<Value> = fs::read_to_string(&args.output)
        .ok()
        .and_then(|t| serde_json::from_str(&t).ok());
    if let Some(info) = existing.as_ref().and_then(|v| v.get("url_info")).and_then(Value::as_object) {
        for (url, page) in lb.pages.iter_mut() {
            let Some(old) = info.get(url).and_then(|p| p.get("last_modified")).and_then(Value::as_str) else {
                continue;
            };
            if old.is_empty() || page.last_modified.is_empty() {
                continue;
            }
            if let (Some(o), Some(n)) = (parse_iso(old), parse_iso(&page.last_modified)) {
                let minutes = (n - o).num_microseconds().unwrap_or(i64::MAX).unsigned_abs() as f64 / 60e6;
                if minutes < args.threshold_minutes {
                    page.last_modified = old.to_string();
                }
            }
        }
    }

    lb.canonicalize_outgoing_pages();
    lb.compress();
    lb.compress(); // print_json compresses again

    let redirects: Map<String, Value> =
        lb.redirects.iter().map(|(k, v)| (k.clone(), Value::from(v.as_str()))).collect();
    let url_info: Map<String, Value> = lb
        .pages
        .values()
        .map(|p| {
            (
                p.url.clone(),
                json!({
                    "url": p.url, "title": p.title, "description": p.description,
                    "file_path": p.file_path, "outgoing_links": p.outgoing_links,
                    "incoming_links": p.incoming_links, "redirect_url": "",
                    "markdown_path": p.markdown_path, "doc_size": p.doc_size,
                    "last_modified": p.last_modified, "topics": p.topics,
                }),
            )
        })
        .collect();
    let out = json!({ "redirects": redirects, "url_info": url_info });

    let mut buf = Vec::new();
    let fmt = serde_json::ser::PrettyFormatter::with_indent(b"    ");
    let mut ser = serde_json::Serializer::with_formatter(&mut buf, fmt);
    serde::Serialize::serialize(&out, &mut ser).map_err(|e| e.to_string())?;
    write_atomic(&args.output, &buf)?;
    println!(
        "wrote {}: {} pages, {} redirects",
        args.output.display(),
        lb.pages.len(),
        lb.redirects.len()
    );
    Ok(())
}

fn main() {
    if let Err(e) = run() {
        eprintln!("backlinks: {e}");
        std::process::exit(1);
    }
}
