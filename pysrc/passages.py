from typing import List, Callable, Union
from dataclasses import dataclass


# Twee has a Passage class, which represents a single passage.
# Lets model that with python lists,


class Allow_Back:
    pass


# Text and Link
@dataclass
class TP:
    def __init__(self, text: str, passageFactory: "PassageFactory"):
        self.Text = text
        self.PassageFactory = passageFactory


PassageFactory = Callable[[], "Passage"]
Passage = List[Union[str, PassageFactory, TP, Callable[[], Allow_Back]]]
GetHeader = Callable[[], str]
