from collections import defaultdict
from typing import Dict, Callable, List
from dataclasses import dataclass
import copy
from pysrc.passages import *
from browser import document, window, html
from functools import partial


@dataclass
class DivPassage:
    output:str
    allow_back:bool =False

def click_on_game_link(passage_functor, runner):
    def inner(e):
        runner.prev = runner.current
        runner.run(passage_functor)
        print (passage_functor)
    return inner

class HtmlRenderer:
    def __init__(self, div_id,header_func):
        self.div_id = div_id
        new_div =  html.DIV(f"id:{div_id} Bound to HTMLRender")
        new_div["class"] = "border"
        self.render_div(new_div)
        self.header_func = header_func
        self.prev=None
        self.current = None


    def render_div(self, div):
        css_selector =  f"#{self.div_id}"
        print(css_selector)
        # replace-with needs to reset the id - sigh
        window.jQuery(css_selector).replaceWith(f"<div id='{self.div_id}'>Replaced</div>")
        document[self.div_id] <= div

    def run(self, passage_func:Passage):
        self.current=passage_func
        passage = passage_func()
        htmlPassage = self.PassageToDiv(passage)
        output = html.DIV()
        output <= html.DIV(self.header_func())
        output <= htmlPassage.output
        if (htmlPassage.allow_back):
            output <= html.DIV(self.makeLink("Back",self.prev))
        print (output)
        self.render_div(output)

    def makeLink(self,text,passage_functor):
        span =  html.SPAN(f" {text} ")
        span["class"]= "border border-primary"
        span.bind("click", click_on_game_link(passage_functor, self))
        return span

    def PassageToDiv(self, passage:Passage)->DivPassage:
        output = html.DIV()
        allow_back = False
        for element in passage:
            if isinstance(element, Allow_Back):
                allow_back = True
                continue

            if isinstance(element, str):
                output <= html.SPAN(element)
                continue
            if isinstance(element, TL):
                alink = html.A(f' {element.Text} ')
                output <= self.makeLink(element.Text,element.PassageCreator)
                continue
            if callable(element):
                function_name = element.__name__
                text_link = f"{function_name.replace('_',' ')}"
                if text_link.startswith(' '):
                    text_link = text_link[1:]
                output <= self.makeLink(text_link,element)
                continue
            else:
                print(element)
                raise Exception(f"Unknown element type {type(element)}")

        return DivPassage(output, allow_back)






