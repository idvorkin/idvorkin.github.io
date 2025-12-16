#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "httpx",
#     "python-dotenv",
#     "click",
#     "rich",
#     "boto3",
#     "requests-aws4auth",
# ]
# ///

"""
Amazon Product Advertising API v5 Client

This script provides a simple interface to search and get product details
from Amazon's Product Advertising API v5.

Usage:
    python amazon_product_api.py search "laptop"
    python amazon_product_api.py get-item B08N5WRWNW
"""

import os
import json
from typing import Dict, Any, List
import requests
from requests_aws4auth import AWS4Auth
import click
from rich.console import Console
from rich.table import Table
from rich import print as rprint
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

console = Console()


class AmazonProductAPI:
    """Client for Amazon Product Advertising API v5"""

    def __init__(
        self,
        access_key: str,
        secret_key: str,
        partner_tag: str,
        region: str = "us-east-1",
    ):
        self.access_key = access_key
        self.secret_key = secret_key
        self.partner_tag = partner_tag
        self.region = region
        self.host = "webservices.amazon.com"
        self.service = "ProductAdvertisingAPI"

        # Create AWS4Auth instance
        self.auth = AWS4Auth(
            access_key,
            secret_key,
            region,
            self.service,
            include_hdrs=["content-encoding", "host", "x-amz-date", "x-amz-target"],
        )

    def _make_request(self, operation: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Make authenticated request to PA API"""

        # Prepare headers
        headers = {
            "content-type": "application/json; charset=UTF-8",
            "content-encoding": "amz-1.0",
            "x-amz-target": f"com.amazon.paapi5.v1.ProductAdvertisingAPIv1.{operation}",
        }

        # Add partner tag to payload
        payload["PartnerTag"] = self.partner_tag
        payload["PartnerType"] = "Associates"
        payload["Marketplace"] = "www.amazon.com"

        payload_str = json.dumps(payload)

        # Make request
        url = f"https://{self.host}/paapi5/{operation.lower()}"

        response = requests.post(url, auth=self.auth, headers=headers, data=payload_str)

        if response.status_code == 429:
            console.print(
                "[yellow]Rate limited. Please wait before making another request.[/yellow]"
            )
            return {"rate_limited": True}
        elif response.status_code != 200:
            console.print(f"[red]Error: {response.status_code}[/red]")
            try:
                error_data = response.json()
                if "Errors" in error_data:
                    for error in error_data["Errors"]:
                        console.print(
                            f"[red]- {error.get('Code', 'Unknown')}: {error.get('Message', 'No message')}[/red]"
                        )
                else:
                    console.print(f"[red]Response: {response.text}[/red]")
            except Exception:
                console.print(f"[red]Response: {response.text}[/red]")
            return {}

        return response.json()

    def search_items(self, keywords: str, item_count: int = 10) -> List[Dict[str, Any]]:
        """Search for items by keywords"""

        payload = {
            "Keywords": keywords,
            "ItemCount": item_count,
            "Resources": [
                "Images.Primary.Large",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "Offers.Listings.Price",
                "ItemInfo.ByLineInfo",
            ],
        }

        result = self._make_request("SearchItems", payload)

        if "SearchResult" in result and "Items" in result["SearchResult"]:
            return result["SearchResult"]["Items"]
        return []

    def get_items(self, item_ids: List[str]) -> List[Dict[str, Any]]:
        """Get details for specific items"""

        payload = {
            "ItemIds": item_ids,
            "Resources": [
                "Images.Primary.Large",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "ItemInfo.ProductInfo",
                "ItemInfo.TechnicalInfo",
                "Offers.Listings.Price",
                "ItemInfo.ByLineInfo",
            ],
        }

        result = self._make_request("GetItems", payload)

        if "ItemsResult" in result and "Items" in result["ItemsResult"]:
            return result["ItemsResult"]["Items"]
        return []


@click.group()
def cli():
    """Amazon Product Advertising API CLI"""
    pass


@cli.command()
@click.argument("keywords")
@click.option("--count", default=5, help="Number of items to return")
def search(keywords: str, count: int):
    """Search for products by keywords"""

    # Get credentials from environment
    access_key = os.getenv("AMAZON_ACCESS_KEY")
    secret_key = os.getenv("AMAZON_SECRET_KEY")
    partner_tag = os.getenv("AMAZON_PARTNER_TAG")

    if not all([access_key, secret_key, partner_tag]):
        console.print(
            "[red]Error: Missing credentials. Please set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_PARTNER_TAG environment variables.[/red]"
        )
        return

    api = AmazonProductAPI(access_key, secret_key, partner_tag)

    with console.status(f"Searching for '{keywords}'..."):
        items = api.search_items(keywords, count)

    if not items:
        console.print("[yellow]No items found.[/yellow]")
        return

    # Create table
    table = Table(title=f"Search Results for '{keywords}'")
    table.add_column("ASIN", style="cyan")
    table.add_column("Title", style="green")
    table.add_column("Price", style="yellow")
    table.add_column("Brand", style="blue")

    for item in items:
        asin = item.get("ASIN", "N/A")
        title = (
            item.get("ItemInfo", {}).get("Title", {}).get("DisplayValue", "N/A")[:50]
            + "..."
        )

        # Get price
        price = "N/A"
        offers = item.get("Offers", {}).get("Listings", [])
        if offers:
            price = offers[0].get("Price", {}).get("DisplayAmount", "N/A")

        # Get brand
        brand = (
            item.get("ItemInfo", {})
            .get("ByLineInfo", {})
            .get("Brand", {})
            .get("DisplayValue", "N/A")
        )

        table.add_row(asin, title, price, brand)

    console.print(table)


@cli.command()
@click.argument("asin")
def get_item(asin: str):
    """Get details for a specific item by ASIN"""

    # Get credentials from environment
    access_key = os.getenv("AMAZON_ACCESS_KEY")
    secret_key = os.getenv("AMAZON_SECRET_KEY")
    partner_tag = os.getenv("AMAZON_PARTNER_TAG")

    if not all([access_key, secret_key, partner_tag]):
        console.print(
            "[red]Error: Missing credentials. Please set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_PARTNER_TAG environment variables.[/red]"
        )
        return

    api = AmazonProductAPI(access_key, secret_key, partner_tag)

    with console.status(f"Getting details for {asin}..."):
        items = api.get_items([asin])

    if not items:
        console.print("[yellow]Item not found.[/yellow]")
        return

    item = items[0]

    # Display item details
    rprint(f"\n[bold cyan]ASIN:[/bold cyan] {item.get('ASIN', 'N/A')}")
    rprint(
        f"[bold green]Title:[/bold green] {item.get('ItemInfo', {}).get('Title', {}).get('DisplayValue', 'N/A')}"
    )

    # Brand
    brand = (
        item.get("ItemInfo", {})
        .get("ByLineInfo", {})
        .get("Brand", {})
        .get("DisplayValue", "N/A")
    )
    rprint(f"[bold blue]Brand:[/bold blue] {brand}")

    # Price
    offers = item.get("Offers", {}).get("Listings", [])
    if offers:
        price = offers[0].get("Price", {}).get("DisplayAmount", "N/A")
        rprint(f"[bold yellow]Price:[/bold yellow] {price}")

    # Features
    features = item.get("ItemInfo", {}).get("Features", {}).get("DisplayValues", [])
    if features:
        rprint("\n[bold]Features:[/bold]")
        for feature in features[:5]:  # Show first 5 features
            rprint(f"  • {feature}")

    # Image
    image = item.get("Images", {}).get("Primary", {}).get("Large", {}).get("URL", "")
    if image:
        rprint(f"\n[bold]Image URL:[/bold] {image}")

    # Product URL
    detail_page = item.get("DetailPageURL", "")
    if detail_page:
        rprint(f"\n[bold]Product URL:[/bold] {detail_page}")


@cli.command()
def setup():
    """Setup credentials for Amazon Product API"""

    console.print("[bold]Amazon Product Advertising API Setup[/bold]\n")
    console.print("You'll need to get these from your Amazon Associates account:")
    console.print("1. Go to https://affiliate-program.amazon.com/")
    console.print("2. Navigate to Tools > Product Advertising API")
    console.print("3. Generate or view your credentials\n")

    access_key = click.prompt("Enter your Access Key")
    secret_key = click.prompt("Enter your Secret Key", hide_input=True)
    partner_tag = click.prompt("Enter your Partner Tag (Associate ID)")

    # Create .env file
    env_content = f"""# Amazon Product Advertising API Credentials
AMAZON_ACCESS_KEY={access_key}
AMAZON_SECRET_KEY={secret_key}
AMAZON_PARTNER_TAG={partner_tag}
"""

    with open(".env", "w") as f:
        f.write(env_content)

    console.print("\n[green]✓ Credentials saved to .env file[/green]")
    console.print(
        "[yellow]Note: Add .env to your .gitignore file to avoid committing credentials[/yellow]"
    )


if __name__ == "__main__":
    cli()
