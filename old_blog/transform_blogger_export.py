#!python3
# Remove line too long
# pep8: disable=E501

import os
from typing import List, TypeVar
from bs4 import BeautifulSoup
import jsonpickle  # json encoder doesn't encode dataclasses nicely, jsonpickle does the trick
from dataclasses import dataclass
import typer
from dateutil import parser
from urllib.parse import urlparse
app = typer.Typer()

print_error = False


def printjson(out):

    jsonpickle.set_encoder_options("json", ensure_ascii=False)
    # can't prettier ignore to avoid it getting re-written by git checkin scripts
    # because it will no longer be json -- grr
    # print ('<!-- prettier-ignore-start -->')
    # print ('<!-- prettier-ignore-end -->')
    print(jsonpickle.encode(out, indent=4))


file_path = "old_blog/ig66-export-02-22-2021.xml"

T = TypeVar('T')  # Any type.
def flatten_lol(lol:List[List[T]])->List[T]:
    def flatten_lol_iter(lol):
        for l in lol:
            for i in l:
                yield i
    return list(flatten_lol_iter(lol))

@dataclass
class BlogPost:
    title: str
    url: str
    published: str
    excerpt: str
    thumbnail: str
    content: str
    tags: []
    def __str__(self):
        return f"{self.title} {self.url} {self.published} {self.excerpt} {self.thumbnail} {self.content} {self.tags}"

# copied from BBL
def clean_title(title):
    # Jekyll makes an ugly title
    # title='\n  INSECURITY AND IMPOSTER SYNDROME \n'
    return title.replace("\n  ", "").replace(" \n", "")

def path_to_blog_entry(path)->List[BlogPost]:
    def get_meta_content(property, default_value=""):
        meta_tag = soup.find("meta", property=property)
        return str(meta_tag["content"]) if meta_tag else default_value

    if not path.endswith(".html"):
        return []
    if path.endswith("index.html"):
        return []
    with open(path, "r", encoding="utf-8") as f:
        contents = f.read()
        soup = BeautifulSoup(contents, features="html.parser")
        pageTitle = soup.title.string if soup.title else None
        canonicalTag = soup.find("link", rel="canonical")
        canonicalUrl = canonicalTag["href"] if canonicalTag else None
        relative_url = urlparse(canonicalUrl).path if canonicalUrl else None
        isCompletePage = pageTitle and canonicalUrl
        pageTitle = clean_title(pageTitle)

        # <meta property="og:description" content="Coaching is like midwifery">

         # <meta property="og:image" content="https://github.com/idvorkin/blob/raw/master/ig66/580/montage.jpg" />
        description = get_meta_content("og:description", "...")
        image = get_meta_content("og:image","")
        date = get_meta_content("date", "")
        keywords = get_meta_content("keywords", "")
        datetime_clean = parser.parse(date).strftime("%Y-%m-%dT%H:%M:%S")
        tags = [t.strip() for t in keywords.split(",")]
        return [BlogPost(title=pageTitle, url=relative_url, published=datetime_clean, excerpt=description, content="",  thumbnail=image, tags=tags)]

def get_new_blog_entries():
    ig66_collection_dir = "_site/ig66/"
    post_entries = []

    paths = [ig66_collection_dir+f for f in os.listdir(ig66_collection_dir)]
    posts = [path_to_blog_entry(p) for p in paths]
    flat = flatten_lol(posts)
    flat.sort(key=lambda x: x.published)
    return flat

def get_post_entries_xml():
    post_entries = []
    with open(file_path, "r", encoding="utf-8") as f:
        contents = f.read()
        soup = BeautifulSoup(contents, features="xml")
        entries = soup.find_all("entry")
        for entry in entries:
            categories = entry.find_all("category")
            # <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#post"/>
            # entries := [post|setting|comment|etc], only interested in posts.
            for c in categories:
                if "kind#post" in c["term"]:
                    post_entries += [entry]
    return post_entries


def thumbnail_for_entry(e):
    # <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://1.bp.blogspot.com/-YZgvziaVcLs/X59gt8X8K-I/AAAAAAAE9SQ/XgnXtO3ZFlo_bmj6sO25xeg5DwmS9JllQCPcBGAsYHg/s72-c/IMG_0658.JPG" height="72" width="72"/>
    thumbnails = [l for l in e.find_all("media:thumbnail")]
    if len(thumbnails) != 1:
        # Won't have a thumbnail if there is no image in the post, totally fine
        # print (f"!{len(thumbnails)} thumbnails for : {e.id.contents[0]}") # something fishy
        return ""
    thumbnail = str(thumbnails[0]["url"])
    return thumbnail


def excerpt_for_content(content):
    paragraphs = content.split("\n")

    # return first good paragraph
    out_paragraphs=[]
    min_excerpt_len = 200
    excerpt = ""

    for p in paragraphs:
        p = p.strip(" ")
        isWhiteSpace = len(p.strip("_").strip("*")) == 0
        if isWhiteSpace:
            continue

        isItalicsLine = p.startswith("_") and p.endswith("_")  # usually just a note
        if isItalicsLine:
            continue

        excerpt += p
        out_paragraphs += [p]

        if len(excerpt) > min_excerpt_len:
            break

    return "\n\n".join(out_paragraphs)


def content_for_entry(p):
    from html import unescape

    # import html2markdown
    import html2text

    converter = html2text.HTML2Text()
    converter.ignore_links = True
    converter.ignore_images = True
    converter.body_width = 0

    content = converter.handle(unescape(str(p.content.contents[0])))
    return content

def xml_entry_to_post(xml):
    p = xml
    # <category scheme="http://www.blogger.com/atom/ns#" term="zach_week"/>
    # <title type="text">Family Journal 550AZ:Halloween 2020, Tori Super party!!!</title>
    if len(p.title.contents) == 0:
        if print_error:
            print(f"!No title for id: {p.id.contents[0]}")  # something fishy
        return []

    # <link rel="alternate" type="text/html" href="https://ig66.blogspot.com/2020/11/family-journal-550azhalloween-2020-tori.html" title="Family Journal 550AZ:Halloween 2020, Tori Super party!!!"/>
    urls = [l for l in p.find_all("link") if l["rel"] == "alternate"]
    if len(urls) != 1:
        if print_error:
            print(f"!{len(urls)} URL for : {p.id.contents[0]}")  # something fishy
        return []
    url = urls[0]

    content = content_for_entry(p)
    # <published>2020-11-01T17:31:00.004-08:00</published>
    return [BlogPost(
        title=str(p.title.contents[0]),
        url=str(url["href"]),
        published=str(p.published.contents[0]),
        excerpt=excerpt_for_content(content),
        content="",  # content,
        thumbnail=thumbnail_for_entry(p),
        tags=[],
    )]


@app.command()
def dump_new_blog():
    posts = get_new_blog_entries()
    printjson(posts)

def get_old_blog_entries():
    lol_posts = [xml_entry_to_post(p)
             for p in get_post_entries_xml()]
    return flatten_lol(lol_posts)

@app.command()
def export_old_blog():
    printjson(get_old_blog_entries())

@app.command()
def export_all():
    # 2 step select many
    printjson(flatten_lol([get_old_blog_entries(),get_new_blog_entries()]))


@app.command()
def test_parse_ns():
    x = """
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="https://www.blogger.com/styles/atom.css" type="text/css"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:openSearch="http://a9.com/-/spec/opensearchrss/1.0/" xmlns:gd="http://schemas.google.com/g/2005" xmlns:thr="http://purl.org/syndication/thread/1.0" xmlns:georss="http://www.georss.org/georss">
  <entry>
    <id>tag:blogger.com,1999:blog-7534692.post-5410419333668577185</id>
    <published>2020-11-29T08:26:00.004-08:00</published>
    <updated>2020-11-29T08:26:44.611-08:00</updated>
    <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#post"/>
    <category scheme="http://www.blogger.com/atom/ns#" term="zach_week"/>
    <title type="text">Family Journal 553AZ: Happy Corona Virus Thanksgiving</title>
    <content type="html">empty</content>
    <link rel="replies" type="application/atom+xml" href="https://ig66.blogspot.com/feeds/5410419333668577185/comments/default" title="Post Comments"/>
    <link rel="replies" type="text/html" href="https://www.blogger.com/comment.g?blogID=7534692&amp;postID=5410419333668577185" title="0 Comments"/>
    <link rel="edit" type="application/atom+xml" href="https://www.blogger.com/feeds/7534692/posts/default/5410419333668577185"/>
    <link rel="self" type="application/atom+xml" href="https://www.blogger.com/feeds/7534692/posts/default/5410419333668577185"/>
    <link rel="alternate" type="text/html" href="https://ig66.blogspot.com/2020/11/family-journal-553az-happy-corona-virus.html" title="Family Journal 553AZ: Happy Corona Virus Thanksgiving"/>
    <author>
      <name>Igor Dvorkin</name>
      <uri>https://www.blogger.com/profile/17453525620159973147</uri>
      <email>noreply@blogger.com</email>
      <gd:image rel="http://schemas.google.com/g/2005#thumbnail" width="35" height="35" src="//www.blogger.com/img/blogger_logo_round_35.png"/>
    </author>
    <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://1.bp.blogspot.com/-rdffiY212i0/X8PK9CkhPtI/AAAAAAAE_Ng/_vNVzBgl8xo6DfwKqmvh4clPB48fSzDzACPcBGAsYHg/s72-c/IMG_0376.HEIC" height="72" width="72"/>
    <the:total>0</the:total>
  </entry>
</feed>
    """
    soup = BeautifulSoup(x, features="xml")
    entry = soup.find_all("entry")[0]
    print(entry.find_all("media:thumbnail"))
    thumbnails = [l for l in entry.find_all("media:thumbnail")]
    print("from list")
    print(thumbnails)
    print("from parse")
    print(thumbnail_for_entry(entry))



if __name__ == "__main__":
    app()
