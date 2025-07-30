#!/usr/bin/env python3
"""
Check if ASIN images in _data/asins.json are valid
Usage: python scripts/check-asin-images.py [--fix]

This script validates image URLs and can automatically fix broken ones.
"""

import json
import sys
import urllib.request
from pathlib import Path


def check_image_url(url):
    """Check if an image URL returns a valid image"""
    if not url:
        return False, "No URL provided"

    try:
        # Simple HEAD request to check if image exists
        request = urllib.request.Request(url, method="HEAD")
        request.add_header("User-Agent", "Mozilla/5.0 (compatible; ImageValidator/1.0)")

        with urllib.request.urlopen(request, timeout=5) as response:
            status = response.status
            content_type = response.headers.get("Content-Type", "")
            content_length = int(response.headers.get("Content-Length", 0))

            if status != 200:
                return False, f"HTTP {status}"

            if not content_type.startswith("image/"):
                return False, f"Not an image: {content_type}"

            # Check for 1x1 tracking pixels
            if content_length < 100:
                return False, f"Too small: {content_length} bytes"

            return True, "OK"

    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}"
    except urllib.error.URLError as e:
        return False, f"Network error: {str(e)[:50]}"
    except Exception as e:
        return False, f"Error: {type(e).__name__}"


def get_fallback_image_url(asin):
    """Get the standard Amazon fallback image URL"""
    return f"https://images-na.ssl-images-amazon.com/images/P/{asin}.01._SCLZZZZZZZ__SL160_.jpg"


def main():
    fix_mode = "--fix" in sys.argv

    # Load ASIN data
    asins_file = Path(__file__).parent.parent / "_data" / "asins.json"
    with open(asins_file) as f:
        asin_data = json.load(f)

    print(f"Checking {len(asin_data)} products...")
    if fix_mode:
        print("(Fix mode: will update broken image URLs)")
    print()

    # Track results
    total = len(asin_data)
    valid = 0
    fixed = 0
    broken = []

    # Check each ASIN
    for asin, data in sorted(asin_data.items()):
        current_url = data.get("image", "")
        is_valid, status = check_image_url(current_url)

        if is_valid:
            print(f"✓ {asin}: {data.get('title', 'Unknown')[:40]}... - Image OK")
            valid += 1
        else:
            print(f"✗ {asin}: {data.get('title', 'Unknown')[:40]}... - {status}")

            if fix_mode:
                # Try the fallback URL
                fallback_url = get_fallback_image_url(asin)
                fallback_valid, fallback_status = check_image_url(fallback_url)

                if fallback_valid:
                    data["image"] = fallback_url
                    print("  → Fixed with fallback URL")
                    fixed += 1
                else:
                    print(f"  → Fallback also failed: {fallback_status}")
                    broken.append((asin, data.get("title", "Unknown")))
            else:
                broken.append((asin, data.get("title", "Unknown")))

    # Save if in fix mode
    if fix_mode and fixed > 0:
        with open(asins_file, "w") as f:
            json.dump(asin_data, f, indent=2, sort_keys=True)
        print(f"\nUpdated {asins_file}")

    # Summary
    print("\nSummary:")
    print(f"  Total products: {total}")
    print(f"  Valid images: {valid}")
    if fix_mode:
        print(f"  Fixed: {fixed}")
    print(f"  Still broken: {len(broken)}")

    if broken:
        print("\nProducts with broken images:")
        for asin, title in broken[:10]:  # Show first 10
            print(f"  - {asin}: {title[:50]}...")
        if len(broken) > 10:
            print(f"  ... and {len(broken) - 10} more")

    if not fix_mode and len(broken) > 0:
        print("\nRun with --fix to attempt automatic fixes")


if __name__ == "__main__":
    main()
