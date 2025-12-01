from collections import defaultdict
from typing import Dict, Callable, List
from dataclasses import dataclass
import copy
from pysrc.passages import *
from browser import document, window, html, markdown  # type:ignore


@dataclass
class DivPassage:
    output: str
    allow_back: bool = False


def md_to_html(md):
    # https://www.brython.info/static_doc/en/markdown.html
    html, _ = markdown.mark(md)

    # this parser had some spurious paragraphs
    # Only strip starting and trailing ones
    if html.startswith("<p>"):
        html = html[3:]
    if html.endswith("</p>"):
        html = html[:-4]
    if html.endswith("<p></p>"):
        html = html[:-7]

    return html


class HtmlRenderer:
    def __init__(self, div_id, header_factory: GetHeader):
        self.div_id = div_id
        new_div = html.DIV(f"id:{div_id} Bound to HTMLRender")
        new_div["class"] = "border"
        self.render_div(new_div)
        self.header_func = header_factory
        self.passageStack: List[PassageFactory] = []
        self.current: PassageFactory

    def render_div(self, div):
        css_selector = f"#{self.div_id}"
        # Not sure the right way to erase the children of a node
        # Just replace with an identical node with the same ID.
        window.jQuery(css_selector).replaceWith(f"<div id='{self.div_id}'/>")
        document[self.div_id] <= div

    def run(self, passageFactory: PassageFactory):
        self.current = passageFactory
        passage = passageFactory()
        htmlPassage = self.PassageToDiv(passage)
        output = html.DIV()

        # not sure why, but there are spurious paragraphs at the end of the MD, strip, em.
        # Should only do this at the end, maybe via regexp?
        md_as_html = md_to_html(self.header_func())
        header = html.DIV(md_as_html)
        header["class"] = "alert alert-primary"
        output <= header
        output <= htmlPassage.output
        if htmlPassage.allow_back:
            output <= html.DIV()  # give a blank line
            output <= html.DIV(self.makeBackLink(" Go Back"))
        self.render_div(output)

    def makeLink(self, text, passage_functor):
        span = html.A(f" {text} ")
        span.href = "#"
        span.bind("click", self.on_game_link_factory(passage_functor))
        return span

    def makeBackLink(self, text):
        span = html.A(text)
        span.href = "#"
        span.bind("click", self.on_back_button_factory())
        return span

    def PassageToDiv(self, passage: Passage) -> DivPassage:
        output = html.DIV()
        allow_back = False
        for element in passage:
            is_allow_back = (type(element) is type) and element.__name__ == "Allow_Back"
            if is_allow_back:
                allow_back = True
                continue

            if isinstance(element, str):
                output <= html.SPAN(md_to_html(element))
                continue
            if isinstance(element, TP):
                alink = html.A(f" {element.Text} ")
                output <= self.makeLink(element.Text, element.PassageFactory)
                continue
            if callable(element):
                function_name = element.__name__
                text_link = f"{function_name.replace('_',' ')}"
                if text_link.startswith(" "):
                    text_link = text_link[1:]
                output <= self.makeLink(text_link, element)
                continue
            else:
                print(element)
                raise Exception(f"Unknown element type {type(element)}")

        return DivPassage(output, allow_back)

    def on_game_link_factory(self, passageFactory: PassageFactory):
        def on_game_link(e):
            self.passageStack += [self.current]
            self.run(passageFactory)

        return on_game_link

    def on_back_button_factory(self):
        def on_back_button(e):
            prev_element = self.passageStack.pop()
            self.run(prev_element)

        return on_back_button
