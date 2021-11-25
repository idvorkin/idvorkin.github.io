from icecream import ic 
from collections import defaultdict
from typing import Dict, Callable, List
from dataclasses import dataclass
import copy


# Twee has a Passage class, which represents a single passage.
# Lets model that with python lists, 


class Allow_Back: pass

Passage = List[any]

@dataclass
class ConsolePassage:
    output:str
    links:Dict[str, Callable]
    allow_back:bool =False

class ConsoleRender():
    def _get_user_choice(self, _choices, allow_back):
        choices = copy.copy(_choices)
        input_prompt = ""
        if allow_back:
            input_prompt = "   Enter a number or 'b' to go back:"
            choices["b"] = True
        else:
            input_prompt = "   Enter a number:"
        while True:
            choice = input (input_prompt)
            if not choice in choices:
                print(f"[{choice}] is not a valid choice try again")
            return choice

    def run(self, passage:Passage):
        prev = passage
        while (True):
            consolePassage = PassageToConsole(passage)
            print(consolePassage.output)
            if len(consolePassage.links) == 0 and not consolePassage.allow_back:
                print ("Game over!")
                return
            choice = self._get_user_choice(consolePassage.links, consolePassage.allow_back)
            if choice == 'b':
                passage = prev
                break
            prev = passage
            passage = consolePassage.links[choice]()

        

# Passage
# Link
# This should be in  ConsoleRender

def PassageToConsole(passage:Passage)->ConsolePassage:
    output = ""
    link_id = 0
    links={}
    allow_back = False
    for element in passage:
        if isinstance(element, Allow_Back):
            allow_back = True
            continue
            
        if isinstance(element, str):
            output += element 
            continue
        if isinstance(element, TL):
            text_link = element.Text
            output  += f' [{text_link}({link_id})] '
            links[str(link_id)]=element.PassageCreator
            link_id += 1
            continue
        if callable(element):
            function_name = element.__name__
            text_link = f"{function_name.replace('_',' ')}"
            if text_link.startswith(' '):
                text_link = text_link[1:]
            output  += f' [{text_link}({link_id})] '
            links[str(link_id)]=element
            link_id += 1
            continue

            
    return ConsolePassage(output, links, allow_back)


# Text and Link
@dataclass
class TL():
    Text:str
    PassageCreator:callable

def _game_over():
    return ["Game Over"]

def _fight():
    return ["There's no one to fight. Either goto ", _the_start, "or", _the_store, "or", _game_over]
    
def _the_start():
    return ["Welcome to the game. \nGoto ", _the_store, "or", _fight, 
    "or", _game_over, "or the other", TL("Blue Store",_the_store)]

def _the_store():
    return [Allow_Back(),"Welcome to the store, nothing to buy"]

ConsoleRender().run(_the_start())
