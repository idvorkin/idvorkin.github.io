#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "httpx",
#     "python-dotenv",
#     "click",
#     "rich",
# ]
# ///

"""
Update asins.json with real product data from Amazon Product Advertising API

This script reads the existing asins.json file and updates it with actual
product information from Amazon's API.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, Any
import click
from rich.console import Console
from dotenv import load_dotenv

# Import the Amazon API client from our other script
import sys

sys.path.append(str(Path(__file__).parent))
from amazon_product_api import AmazonProductAPI

console = Console()
load_dotenv()


def load_asins() -> Dict[str, Any]:
    """Load existing ASINs from JSON file"""
    asins_path = Path("_data/asins.json")
    if not asins_path.exists():
        console.print("[red]Error: _data/asins.json not found[/red]")
        return {}

    with open(asins_path, "r") as f:
        return json.load(f)


def save_asins(asins_data: Dict[str, Any]) -> None:
    """Save updated ASINs to JSON file"""
    asins_path = Path("_data/asins.json")
    with open(asins_path, "w") as f:
        json.dump(asins_data, f, indent=2)


@click.command()
@click.option(
    "--dry-run", is_flag=True, help="Show what would be updated without saving"
)
@click.option("--limit", default=0, help="Limit number of ASINs to update (0 = all)")
def update_asins(dry_run: bool, limit: int):
    """Update asins.json with real product data from Amazon API"""

    # Get credentials
    access_key = os.getenv("AMAZON_ACCESS_KEY")
    secret_key = os.getenv("AMAZON_SECRET_KEY")
    partner_tag = os.getenv("AMAZON_PARTNER_TAG")

    if not all([access_key, secret_key, partner_tag]):
        console.print("[red]Error: Missing credentials in .env file[/red]")
        return

    # Load existing ASINs
    asins_data = load_asins()
    if not asins_data:
        return

    # Initialize API client
    api = AmazonProductAPI(access_key, secret_key, partner_tag)

    # Get list of ASINs to update
    asins_to_update = list(asins_data.keys())
    if limit > 0:
        asins_to_update = asins_to_update[:limit]

    console.print(f"[bold]Updating {len(asins_to_update)} ASINs...[/bold]")

    updated_count = 0
    error_count = 0

    # Process ASINs in batches of 10 (API limit)
    batch_size = 10
    for i in range(0, len(asins_to_update), batch_size):
        batch = asins_to_update[i : i + batch_size]

        try:
            # Get items from API
            items = api.get_items(batch)

            # Update each item
            for item in items:
                asin = item.get("ASIN")
                if not asin or asin not in asins_data:
                    continue

                # Extract product info
                title = (
                    item.get("ItemInfo", {})
                    .get("Title", {})
                    .get("DisplayValue", "Unknown Product")
                )

                # Get description from features
                features = (
                    item.get("ItemInfo", {})
                    .get("Features", {})
                    .get("DisplayValues", [])
                )
                description = features[0] if features else "No description available"

                # Get price
                price = "N/A"
                offers = item.get("Offers", {}).get("Listings", [])
                if offers:
                    price = offers[0].get("Price", {}).get("DisplayAmount", "N/A")

                # Get image
                image = (
                    item.get("Images", {})
                    .get("Primary", {})
                    .get("Large", {})
                    .get("URL", "")
                )
                if not image:
                    # Fallback to existing image
                    image = asins_data[asin].get("image", "")

                # Update data
                old_data = asins_data[asin].copy()
                asins_data[asin] = {
                    "title": title,
                    "description": description,
                    "image": image,
                    "price": price,
                    "updated": time.strftime("%Y-%m-%d"),
                }

                # Show what changed
                if old_data != asins_data[asin]:
                    updated_count += 1
                    console.print(f"\n[green]Updated {asin}:[/green]")
                    console.print(f"  Title: {title[:60]}...")
                    console.print(f"  Price: {price}")

        except Exception as e:
            console.print(f"[red]Error processing batch: {e}[/red]")
            error_count += len(batch)

        # Rate limiting - PA API allows 1 request per second
        if i + batch_size < len(asins_to_update):
            time.sleep(1)

    # Summary
    console.print("\n[bold]Summary:[/bold]")
    console.print(f"  Updated: {updated_count}")
    console.print(f"  Errors: {error_count}")
    console.print(f"  Unchanged: {len(asins_to_update) - updated_count - error_count}")

    # Save if not dry run
    if not dry_run and updated_count > 0:
        save_asins(asins_data)
        console.print("\n[green]✓ asins.json updated successfully[/green]")
    elif dry_run:
        console.print("\n[yellow]Dry run - no changes saved[/yellow]")


if __name__ == "__main__":
    update_asins()
