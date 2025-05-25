#!/usr/bin/env python3
from datetime import datetime
from typing import Optional
import typer

app = typer.Typer()


@app.command()
def printZachAge(dateoffset: Optional[datetime] = typer.Argument(None)) -> None:
    """
    A little tool to help compute Zach's age in week for my family journal
    http://ig66.blogspot.com

    """
    if not dateoffset:
        dateoffset = datetime.now()

    zachBirthday = datetime(2010, 4, 22)
    age = dateoffset - zachBirthday
    print("Zach Age")
    print(f"{int(round(age.days / 7))} weeks")

    print(f"Age in weeks:{round(age.days / 7):d}")
    print(f"Age in years:{round(age.days / 365):d}")
    print(f"Age in months:{round(age.days / 30):d}")
    print(f"Age in days:{round(age.days / 1):d}")


if __name__ == "__main__":
    app()
