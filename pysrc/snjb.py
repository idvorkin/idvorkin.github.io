#!python3 snjb.py

try:
    # Bleh, handle the brython package problem
    # Brython is slower then CLI, so do it in this order.
    from pysrc.passages import TP, Allow_Back
except ModuleNotFoundError:
    from passages import TP, Allow_Back


import random
from dataclasses import dataclass

item_to_price = {
    'sword':10,
    'apple':20,
    'bat':15,
}

@dataclass
class Game:
    gold:int = 0

game = Game()

def buy_if_can_afford(item):
    def inner():
        display = [Allow_Back()]
        if game.gold >= item_to_price[item]:
            game.gold -= item_to_price[item]
            display += [f"Congrats - you have an {item}!"]
        else:
            display += [f"You can't afford {item}!"]
        return display
    
    return inner
        


def _game_over():
    return ["Game Over"]

def _mine_for_gold():
    gold_peices = random.randint(5,100)
    game.gold += gold_peices
    return [Allow_Back(),f"Congrats you found {gold_peices} gold!"]


def _fight():
    return ["There's no one to fight. Either goto ", _the_start, "or", _the_store, "or", _game_over]

def _the_start():
    return ["Welcome to the game. \n\n Goto ", _the_store, "or", _fight,
    "or", _game_over, "or the **other**", TP("Blue Store",_the_store),
    "or ", _mine_for_gold, TP("WZAAUP",_mine_for_gold)]

def _the_store():
    passage =  [Allow_Back(),"Welcome to the store,  you can buy"]
    for s in item_to_price.keys():
        passage += ["\n\n",TP(f"{s}",buy_if_can_afford(s))]

    return passage

def header():
    return f"_Gold_:**{game.gold}**"
