#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "amazon-paapi5",
#     "python-dotenv",
#     "rich",
# ]
# ///

"""
Amazon Product API using amazon-paapi5 library
"""

import os
from dotenv import load_dotenv
from rich.console import Console
from amazon_paapi5 import AmazonApi

load_dotenv()
console = Console()

# Configuration
ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")

# Initialize
console.print("[bold]Amazon Product API Test - amazon-paapi5 library[/bold]\n")
console.print(f"Access Key: {ACCESS_KEY[:10]}...")
console.print(f"Partner Tag: {PARTNER_TAG}\n")

try:
    # Initialize the API client
    amazon = AmazonApi(ACCESS_KEY, SECRET_KEY, PARTNER_TAG, "US")
    console.print("[green]✓ API client initialized[/green]\n")

    # Test 1: Get single item
    console.print("[yellow]Test 1: Getting single item (B0050R67U0)...[/yellow]")
    result = amazon.item_lookup("B0050R67U0")

    if result:
        console.print("[green]Success![/green]")
        console.print(
            f"Title: {result.item_info.title.display_value if result.item_info and result.item_info.title else 'N/A'}"
        )

        # Get price
        if result.offers and result.offers.listings:
            price = result.offers.listings[0].price
            if price:
                console.print(f"Price: {price.display_amount}")
    else:
        console.print("[red]No result[/red]")

except Exception as e:
    console.print(f"[red]Error: {type(e).__name__}: {e}[/red]")

    # Try alternative approach
    console.print("\n[yellow]Trying alternative initialization...[/yellow]")

    try:
        from amazon_paapi5.api import AmazonApi as AmazonApi2

        # Try with different initialization
        amazon2 = AmazonApi2(
            access_key=ACCESS_KEY,
            access_secret=SECRET_KEY,
            partner_tag=PARTNER_TAG,
            country="US",
            throttling=1.0,  # 1 second between requests
        )

        console.print("[green]✓ Alternative API client initialized[/green]\n")

        # Try search
        console.print("[yellow]Searching for 'laptop'...[/yellow]")
        search_result = amazon2.search_items(keywords="laptop", item_count=3)

        if search_result and hasattr(search_result, "items"):
            console.print(f"[green]Found {len(search_result.items)} items[/green]")
            for item in search_result.items[:3]:
                console.print(
                    f"\n{item.asin}: {item.item_info.title.display_value[:60]}..."
                )

    except Exception as e2:
        console.print(f"[red]Alternative error: {type(e2).__name__}: {e2}[/red]")
