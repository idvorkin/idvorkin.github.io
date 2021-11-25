#!python3 snjb.py

# Bleh, handle the brython package problem
try:
    from passages import TL, Allow_Back
except ModuleNotFoundError:
    print("Trying loading again with pysrc - YUKKY")
    from pysrc.passages import TL, Allow_Back


import random
from dataclasses import dataclass

@dataclass
class Game:
     gold:int = 0

game = Game()

def header():
    return "You have"

def _game_over():
    return ["Game Over"]

def _mine_for_gold():
    gold_peices = random.randint(1,5)
    game.gold += gold_peices
    return [Allow_Back(),f"Congrats you found {gold_peices} gold!"]


def _fight():
    return ["There's no one to fight. Either goto ", _the_start, "or", _the_store, "or", _game_over]

def _the_start():
    return ["Welcome to the game. \nGoto ", _the_store, "or", _fight,
    "or", _game_over, "or the other", TL("Blue Store",_the_store),
    "or ", _mine_for_gold]

def _the_store():
    return [Allow_Back(),"Welcome to the store, nothing to buy"]

def header():
    return f"Gold:{game.gold}\n"
