from collections import defaultdict
from typing import Dict, Callable, List
from dataclasses import dataclass
import copy


# Twee has a Passage class, which represents a single passage.
# Lets model that with python lists,

class Allow_Back: pass

# Text and Link
@dataclass
class TL():
    Text:str
    PassageCreator:callable

Passage =[]
