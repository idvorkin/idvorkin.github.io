from collections import defaultdict
from typing import Dict, Callable, List, NewType, Callable, TypeVar
from dataclasses import dataclass
import copy


# Twee has a Passage class, which represents a single passage.
# Lets model that with python lists,

class Allow_Back: pass

# Text and Link
@dataclass
class TP():
    def  __init__(self, text, passageCreator):
        self.Text = text
        self.PassageCreator = passageCreator

Passage = NewType('Passage',List)
#PassageFactory = TypeVar("PassageFactory",List[List[str], Passage])
PassageFactory = Callable[[], Passage]