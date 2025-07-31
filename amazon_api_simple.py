#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "python-amazon-paapi",
#     "python-dotenv",
#     "rich",
# ]
# ///

"""
Simple Amazon Product API client using python-amazon-paapi library
"""

import os
from dotenv import load_dotenv
from amazon_paapi import AmazonApi
from rich.console import Console
from rich.table import Table

load_dotenv()
console = Console()

# Get credentials
ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")
COUNTRY = "US"  # Can be US, UK, DE, FR, JP, etc.

# Debug credentials
console.print("[dim]Using credentials:[/dim]")
console.print(f"[dim]Access Key: {ACCESS_KEY}[/dim]")
console.print(
    f"[dim]Secret Key: {'*' * 20}...{SECRET_KEY[-4:] if SECRET_KEY else 'None'}[/dim]"
)
console.print(f"[dim]Partner Tag: {PARTNER_TAG}[/dim]")

# Initialize API
try:
    amazon = AmazonApi(ACCESS_KEY, SECRET_KEY, PARTNER_TAG, COUNTRY)
    console.print("[green]✓ API initialized successfully[/green]")
except Exception as e:
    console.print(f"[red]Error initializing API: {e}[/red]")
    exit(1)

# Test with one of your ASINs
console.print(
    "\n[bold]Testing with ASIN: B0050R67U0 (MagicFiber Microfiber Cleaning Cloth)[/bold]"
)

try:
    # Get single item
    items = amazon.get_items("B0050R67U0")

    if items:
        item = items[0]
        console.print("\n[green]Success! Found item:[/green]")
        console.print(f"Title: {item.item_info.title.display_value}")

        # Get price if available
        if item.offers and item.offers.listings:
            price = item.offers.listings[0].price.display_amount
            console.print(f"Price: {price}")

        # Get primary image
        if item.images and item.images.primary:
            console.print(f"Image: {item.images.primary.large.url}")

        # Get brand
        if item.item_info.by_line_info:
            brand = item.item_info.by_line_info.brand.display_value
            console.print(f"Brand: {brand}")

        console.print(f"URL: {item.detail_page_url}")
    else:
        console.print("[yellow]No items found[/yellow]")

except Exception as e:
    console.print(f"[red]Error: {e}[/red]")

# Test search
console.print("\n[bold]Testing search for 'laptop':[/bold]")

try:
    search_result = amazon.search_items(keywords="laptop", item_count=3)

    if search_result and search_result.items:
        # Create table
        table = Table(title="Search Results")
        table.add_column("ASIN", style="cyan")
        table.add_column("Title", style="green")
        table.add_column("Price", style="yellow")

        for item in search_result.items[:3]:  # Show first 3
            asin = item.asin
            title = item.item_info.title.display_value[:50] + "..."

            price = "N/A"
            if item.offers and item.offers.listings:
                price = item.offers.listings[0].price.display_amount

            table.add_row(asin, title, price)

        console.print(table)
    else:
        console.print("[yellow]No search results[/yellow]")

except Exception as e:
    console.print(f"[red]Search error: {e}[/red]")

# Test multiple ASINs from your list
console.print("\n[bold]Testing multiple ASINs from your list:[/bold]")

test_asins = ["B0050R67U0", "B073XS3CHW", "B0737N6LWX"]
try:
    items = amazon.get_items(test_asins)

    for item in items:
        console.print(f"\n{item.asin}: {item.item_info.title.display_value[:60]}...")
        if item.offers and item.offers.listings:
            console.print(f"  Price: {item.offers.listings[0].price.display_amount}")

except Exception as e:
    console.print(f"[red]Batch error: {e}[/red]")
