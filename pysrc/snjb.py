#!python3 snjb.py

try:
    # Bleh, brython has wonky import semantics, you can't adjust the path
    # therefore if in brython, search in pysrc (hardcoded for my jekyll site)
    # ALSO: Brython is **way** slower then CLI, so import from there first.
    from pysrc.passages import TP, Allow_Back, PassageFactory, Passage
except ModuleNotFoundError:
    from passages import TP, Allow_Back, PassageFactory, Passage

import random
from dataclasses import dataclass

item_to_price = {
    "sword": 10,
    "apple": 20,
    "bat": 15,
}


@dataclass
class Game:
    gold: int = 0
    level: str = "n00b"


game = Game()


def buy_if_can_afford(item: str) -> PassageFactory:
    def inner() -> Passage:
        passage: Passage = [Allow_Back]
        if game.gold >= item_to_price[item]:
            game.gold -= item_to_price[item]
            passage += [f"Congrats - you have an {item}!"]
        else:
            passage += [f"You can't afford {item}!"]
        return passage

    return inner


def the_end() -> Passage:
    return ["This is the end"]


def mine_for_gold() -> Passage:
    gold_pieces = random.randint(5, 100)
    game.gold += gold_pieces
    return [Allow_Back, f"Congrats you found {gold_pieces} gold!"]


def fight() -> Passage:
    return [
        "There's no one to fight. Either goto ",
        start_game,
        "or",
        the_store,
        "or",
        the_end,
    ]


def start_game() -> Passage:
    return [
        "Welcome to the game. \n\n Goto ",
        the_store,
        "or",
        fight,
        "or",
        the_end,
        "or the **other**",
        TP("Blue Store", the_store),
        "or ",
        mine_for_gold,
        TP("WZAAUP", mine_for_gold),
    ]


def the_store() -> Passage:
    passage: Passage = [Allow_Back, "Welcome to the store,  you can buy"]
    for item in item_to_price.keys():
        passage += ["\n\n", TP(f"{item}", buy_if_can_afford(item))]

    return passage


def header():
    return f"**Level**:{game.level} **_Gold_**: {game.gold}**"
