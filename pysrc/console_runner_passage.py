from typing import Dict, Callable, List
from dataclasses import dataclass
import copy
from passages import TP, Passage, PassageFactory, GetHeader


@dataclass
class ConsolePassage:
    output: str
    links: Dict[str, Callable]
    allow_back: bool = False


class ConsoleRender:
    def __init__(self, header: GetHeader):
        self.get_header = header

    def _get_user_choice(self, _choices, allow_back):
        choices = copy.copy(_choices)
        input_prompt = ""
        if allow_back:
            input_prompt = "   Enter a number or 'b' to go back:"
            choices["b"] = True
        else:
            input_prompt = "   Enter a number:"
        while True:
            choice = input(input_prompt)
            if choice not in choices:
                print(f"[{choice}] is not a valid choice try again")
                continue
            return choice

    def run(self, passage_func: PassageFactory):
        passage = passage_func()
        prev: List[Passage] = [passage]
        while True:
            consolePassage = PassageToConsole(passage)
            print(self.get_header())
            print(consolePassage.output)
            if len(consolePassage.links) == 0 and not consolePassage.allow_back:
                print("Game over!")
                return
            choice = self._get_user_choice(
                consolePassage.links, consolePassage.allow_back
            )
            if choice == "b":
                passage = prev.pop()
                continue
            prev += [passage]
            passage = consolePassage.links[choice]()


# Passage
# Link
# This should be in  ConsoleRender


def PassageToConsole(passage: Passage) -> ConsolePassage:
    output = ""
    link_id = 0
    links = {}
    allow_back = False
    for element in passage:
        is_allow_back = (type(element) is type) and element.__name__ == "Allow_Back"
        if is_allow_back:
            allow_back = True
            continue

        if isinstance(element, str):
            output += element
            continue
        if isinstance(element, TP):
            text_link = element.Text
            output += f" [{text_link}({link_id})] "
            links[str(link_id)] = element.PassageFactory
            link_id += 1
            continue
        if callable(element):
            function_name = element.__name__
            text_link = f"{function_name.replace('_', ' ')}"
            if text_link.startswith(" "):
                text_link = text_link[1:]
            output += f" [{text_link}({link_id})] "
            links[str(link_id)] = element
            link_id += 1
            continue
        else:
            print(element)
            raise Exception(f"Unknown element type {type(element)}")

    return ConsolePassage(output, links, allow_back)
