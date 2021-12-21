#!python3
# Remove line too long
# pep8: disable=E501

from bs4 import BeautifulSoup
import jsonpickle  # json encoder doesn't encode dataclasses nicely, jsonpickle does the trick
from dataclasses import dataclass
import typer
app = typer.Typer()

print_error = False


def printjson(out):

    jsonpickle.set_encoder_options("json", ensure_ascii=False)
    # can't prettier ignore to avoid it getting re-written by git checkin scripts
    # because it will no longer be json -- grr
    # print ('<!-- prettier-ignore-start -->')
    # print ('<!-- prettier-ignore-end -->')
    print(jsonpickle.encode(out, indent=4))


file_path = "ig66-export-02-22-2021.xml"


@dataclass
class BlogPost:
    title: str
    url: str
    published: str
    excerpt: str
    thumbnail: str
    content: str
    tags: []


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
def export_to_json():
    # 2 step select many
    list_list_posts = [xml_entry_to_post(p)
             for p in get_post_entries_xml()]

    posts = [p for p in (lp for lp in list_list_posts)]

    printjson(posts)


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
    <thr:total>0</thr:total>
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
