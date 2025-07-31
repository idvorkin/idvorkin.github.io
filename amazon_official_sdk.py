#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "paapi5-python-sdk @ git+https://github.com/amzn/paapi5-python-sdk.git",
#     "python-dotenv",
#     "rich",
# ]
# ///

"""
Amazon Product API using official SDK
"""

import os
from dotenv import load_dotenv
from rich.console import Console

# Import from the official SDK
from paapi5_python_sdk.api.default_api import DefaultApi
from paapi5_python_sdk.models.get_items_request import GetItemsRequest
from paapi5_python_sdk.models.partner_type import PartnerType
from paapi5_python_sdk.rest import ApiException

load_dotenv()
console = Console()

# Configuration
ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")
HOST = "webservices.amazon.com"
REGION = "us-east-1"

# Initialize the API
default_api = DefaultApi(
    access_key=ACCESS_KEY, secret_key=SECRET_KEY, host=HOST, region=REGION
)


def get_items_example():
    """Example of getting items by ASIN"""

    # Request for B0050R67U0 (MagicFiber Microfiber Cleaning Cloth)
    get_items_request = GetItemsRequest(
        partner_tag=PARTNER_TAG,
        partner_type=PartnerType.ASSOCIATES,
        marketplace="www.amazon.com",
        item_ids=["B0050R67U0", "B073XS3CHW"],  # Testing 2 ASINs
        resources=[
            "ItemInfo.Title",
            "Offers.Listings.Price",
            "Images.Primary.Large",
            "ItemInfo.ByLineInfo",
            "ItemInfo.Features",
        ],
    )

    try:
        # Sending the request
        console.print("[yellow]Sending GetItems request...[/yellow]")
        response = default_api.get_items(get_items_request)

        if response.items_result and response.items_result.items:
            console.print(
                f"[green]Success! Found {len(response.items_result.items)} items[/green]\n"
            )

            for item in response.items_result.items:
                console.print(f"[bold]ASIN:[/bold] {item.asin}")

                # Title
                if item.item_info and item.item_info.title:
                    console.print(
                        f"[bold]Title:[/bold] {item.item_info.title.display_value}"
                    )

                # Price
                if (
                    item.offers
                    and item.offers.listings
                    and len(item.offers.listings) > 0
                ):
                    listing = item.offers.listings[0]
                    if listing.price:
                        console.print(
                            f"[bold]Price:[/bold] {listing.price.display_amount}"
                        )

                # Brand
                if (
                    item.item_info
                    and item.item_info.by_line_info
                    and item.item_info.by_line_info.brand
                ):
                    console.print(
                        f"[bold]Brand:[/bold] {item.item_info.by_line_info.brand.display_value}"
                    )

                # Image
                if item.images and item.images.primary and item.images.primary.large:
                    console.print(
                        f"[bold]Image:[/bold] {item.images.primary.large.url}"
                    )

                # URL
                if item.detail_page_url:
                    console.print(f"[bold]URL:[/bold] {item.detail_page_url}")

                console.print()
        else:
            console.print("[red]No items found in response[/red]")

    except ApiException as exception:
        console.print(f"[red]Error: {exception.status}[/red]")
        console.print(f"[red]Error Response: {exception.body}[/red]")
        console.print(f"[red]Headers: {exception.headers}[/red]")
    except Exception as exception:
        console.print(f"[red]Exception: {exception}[/red]")


if __name__ == "__main__":
    console.print("[bold]Amazon Product Advertising API - Official SDK Test[/bold]\n")
    console.print(f"Access Key: {ACCESS_KEY[:10]}...")
    console.print(f"Partner Tag: {PARTNER_TAG}\n")

    get_items_example()
