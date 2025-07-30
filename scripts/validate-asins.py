#!/usr/bin/env python3
"""
Validate and update ASINs in _data/asins.json using OpenGraph data
Usage: python scripts/validate-asins.py [--update] [ASIN1 ASIN2 ...]

This script fetches OpenGraph metadata from Amazon product pages to validate
and update product information.
"""

import json
import re
import sys
import time
import urllib.request
from pathlib import Path
from html.parser import HTMLParser


class OpenGraphParser(HTMLParser):
    """Parse OpenGraph meta tags from HTML"""

    def __init__(self):
        super().__init__()
        self.og_data = {}

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            attrs_dict = dict(attrs)
            prop = attrs_dict.get("property", "")
            content = attrs_dict.get("content", "")

            if prop.startswith("og:"):
                self.og_data[prop] = content


def fetch_opengraph_data(asin):
    """Fetch OpenGraph data from Amazon product page"""
    url = f"https://www.amazon.com/dp/{asin}"

    try:
        # More complete headers to avoid being blocked
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Cache-Control": "max-age=0",
        }

        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=15) as response:
            # Handle potential compression
            content = response.read()

            # Check if response is gzipped
            if response.headers.get("Content-Encoding") == "gzip":
                import gzip

                content = gzip.decompress(content)

            html = content.decode("utf-8", errors="ignore")

        # Parse OpenGraph data
        parser = OpenGraphParser()
        parser.feed(html)

        # If no OG data found, try to extract from title tag as fallback
        if not parser.og_data.get("og:title"):
            title_match = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
            if title_match:
                parser.og_data["og:title"] = title_match.group(1).strip()

        return parser.og_data

    except urllib.error.HTTPError as e:
        print(f"  HTTP Error {e.code}: {e.reason}")
        return None
    except Exception as e:
        print(f"  Error: {type(e).__name__}: {str(e)[:100]}")
        return None


def validate_image_url(url):
    """Check if an image URL returns a valid image"""
    if not url:
        return False

    try:
        request = urllib.request.Request(url, method="HEAD")
        request.add_header("User-Agent", "Mozilla/5.0")

        with urllib.request.urlopen(request, timeout=5) as response:
            content_type = response.headers.get("Content-Type", "")
            content_length = int(response.headers.get("Content-Length", 0))

            # Check if it's an image and has reasonable size (not a 1x1 pixel)
            is_image = content_type.startswith("image/")
            has_size = content_length > 1000  # At least 1KB

            return is_image and has_size

    except Exception:
        return False


def extract_product_info(og_data, asin):
    """Extract product information from OpenGraph data"""
    if not og_data:
        return None

    # Extract title - remove "Amazon.com: " prefix if present
    title = og_data.get("og:title", "")
    if title.startswith("Amazon.com: "):
        title = title[12:]

    # Clean up title - remove trailing " : Everything Else" etc
    title = re.sub(
        r"\s*:\s*(Everything Else|Electronics|Tools & Home Improvement).*$", "", title
    )

    # Extract price from description
    description = og_data.get("og:description", "")
    price_match = re.search(r"\$[\d,]+\.?\d*", description)
    price = price_match.group(0) if price_match else None

    # Get image URL
    image_url = og_data.get("og:image", "")

    # Validate the image URL
    if image_url and not validate_image_url(image_url):
        print("  Warning: OG image URL invalid, using fallback")
        image_url = f"https://images-na.ssl-images-amazon.com/images/P/{asin}.01._SCLZZZZZZZ__SL160_.jpg"

    return {
        "title": title or f"Product {asin}",
        "description": description[:200]
        if description
        else "View product details on Amazon",
        "image": image_url
        or f"https://images-na.ssl-images-amazon.com/images/P/{asin}.01._SCLZZZZZZZ__SL160_.jpg",
        "price": price,
        "updated": time.strftime("%Y-%m-%d"),
    }


def main():
    # Parse arguments
    update_mode = "--update" in sys.argv
    specific_asins = [
        arg
        for arg in sys.argv[1:]
        if arg != "--update" and re.match(r"^[A-Z0-9]{10}$", arg)
    ]

    # Load existing data
    asins_file = Path(__file__).parent.parent / "_data" / "asins.json"
    with open(asins_file) as f:
        asin_data = json.load(f)

    # Determine which ASINs to validate
    if specific_asins:
        asins_to_check = specific_asins
    else:
        # Check all ASINs that need updates (placeholder titles or old data)
        asins_to_check = [
            asin
            for asin, data in asin_data.items()
            if data.get("title", "").startswith("Product ") or "price" not in data
        ]

    print(f"Validating {len(asins_to_check)} ASINs...")
    if not update_mode:
        print("(Run with --update to save changes)")
    print()

    # Process each ASIN
    updated = 0
    failed = 0

    for i, asin in enumerate(asins_to_check):
        print(f"[{i + 1}/{len(asins_to_check)}] Checking {asin}...")

        # Fetch OpenGraph data
        og_data = fetch_opengraph_data(asin)

        if og_data:
            # Extract product info
            new_info = extract_product_info(og_data, asin)

            if new_info:
                print(f"  ✓ Title: {new_info['title'][:60]}...")
                print(f"  ✓ Price: {new_info.get('price', 'N/A')}")
                print(
                    f"  ✓ Image: {'Valid' if validate_image_url(new_info['image']) else 'Using fallback'}"
                )

                if update_mode:
                    # Preserve any custom fields from existing data
                    existing = asin_data.get(asin, {})
                    existing.update(new_info)
                    asin_data[asin] = existing
                    updated += 1
            else:
                print("  ✗ Failed to extract product info")
                failed += 1
        else:
            print("  ✗ Failed to fetch page")
            failed += 1

        # Rate limiting
        if i < len(asins_to_check) - 1:
            time.sleep(2)  # Be nice to Amazon
        print()

    # Save if in update mode
    if update_mode and updated > 0:
        with open(asins_file, "w") as f:
            json.dump(asin_data, f, indent=2, sort_keys=True)
        print(f"Updated {updated} products in {asins_file}")

    # Summary
    print("\nSummary:")
    print(f"  Checked: {len(asins_to_check)}")
    print(f"  Updated: {updated}")
    print(f"  Failed: {failed}")

    if not update_mode and updated > 0:
        print("\nRun with --update to save changes")


if __name__ == "__main__":
    main()
