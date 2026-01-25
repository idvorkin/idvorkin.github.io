#!/usr/bin/env python3
"""
Unified ASIN management tool for the blog
Usage: python scripts/manage-asins.py [command] [options]

Commands:
  discover     Find all ASINs in markdown files and add to database
  validate     Fetch product metadata from Amazon (title, price, description)
  check-images Check and fix broken product images
  sync         Run all three commands in sequence

Options:
  --update     Actually save changes (for validate and check-images)
  --fix        Fix broken images with fallbacks (for check-images)
  [ASIN...]    Specific ASINs to validate (for validate command)
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


def find_all_asins(root_dir):
    """Find all ASINs used in markdown files"""
    asins = set()
    # Match the full asin="..." attribute value, which may contain semicolon-separated ASINs
    asin_pattern = re.compile(r'asin="([^"]+)"')

    for path in Path(root_dir).rglob("*.md"):
        if "chop-logs" in str(path) or "node_modules" in str(path):
            continue

        try:
            content = path.read_text()
            matches = asin_pattern.findall(content)
            # Split on semicolons and extract individual ASINs
            for match in matches:
                # Split on semicolon and strip whitespace
                individual_asins = [a.strip() for a in match.split(';') if a.strip()]
                # Validate each is a proper ASIN (10 alphanumeric chars)
                for asin in individual_asins:
                    if re.match(r'^[A-Z0-9]{10}$', asin):
                        asins.add(asin)
        except Exception as e:
            print(f"Error reading {path}: {e}")

    return sorted(asins)


def check_image_url(url):
    """Check if an image URL returns a valid image"""
    if not url:
        return False, "No URL provided"

    try:
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


def fetch_opengraph_data(asin):
    """Fetch OpenGraph data from Amazon product page"""
    url = f"https://www.amazon.com/dp/{asin}"

    try:
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
            content = response.read()

            # Handle potential compression
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


def extract_product_info(og_data, asin):
    """Extract product information from OpenGraph data"""
    if not og_data:
        return None

    # Extract title - remove "Amazon.com: " prefix if present
    title = og_data.get("og:title", "")
    if title.startswith("Amazon.com: "):
        title = title[12:]

    # Clean up title - remove trailing category info
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
    if image_url and not check_image_url(image_url)[0]:
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


def cmd_discover(args):
    """Find all ASINs in markdown files and add to database"""
    root_dir = Path(__file__).parent.parent
    asins_file = root_dir / "_data" / "asins.json"

    # Load existing data
    existing_data = {}
    if asins_file.exists():
        with open(asins_file) as f:
            existing_data = json.load(f)

    # Find all ASINs in use
    all_asins = find_all_asins(root_dir)
    print(f"Found {len(all_asins)} unique ASINs in markdown files")

    # Add any missing ASINs with placeholder data
    updated = False
    for asin in all_asins:
        if asin not in existing_data:
            print(f"Adding placeholder for new ASIN: {asin}")
            existing_data[asin] = {
                "title": f"Product {asin}",
                "description": "Update this with actual product information",
                "image": f"https://images-na.ssl-images-amazon.com/images/P/{asin}.01._SCLZZZZZZZ__SL160_.jpg",
                "updated": time.strftime("%Y-%m-%d"),
            }
            updated = True

    # Save updated data
    if updated:
        with open(asins_file, "w") as f:
            json.dump(existing_data, f, indent=2, sort_keys=True)
        print(f"\nUpdated {asins_file}")
    else:
        print("\nAll ASINs already in database")

    # List ASINs that need manual updates
    placeholders = [
        asin
        for asin, data in existing_data.items()
        if data["title"].startswith("Product ")
    ]

    if placeholders:
        print(f"\nASINs needing metadata update: {len(placeholders)}")
        print("Run 'manage-asins.py validate --update' to fetch product info")


def cmd_validate(args):
    """Fetch product metadata from Amazon"""
    update_mode = "--update" in args
    specific_asins = [arg for arg in args if re.match(r"^[A-Z0-9]{10}$", arg)]

    # Load existing data
    asins_file = Path(__file__).parent.parent / "_data" / "asins.json"
    with open(asins_file) as f:
        asin_data = json.load(f)

    # Determine which ASINs to validate
    if specific_asins:
        asins_to_check = specific_asins
    else:
        # Check all ASINs that need updates
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
                    f"  ✓ Image: {'Valid' if check_image_url(new_info['image'])[0] else 'Using fallback'}"
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


def cmd_check_images(args):
    """Check and fix broken product images"""
    fix_mode = "--fix" in args

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
                fallback_url = f"https://images-na.ssl-images-amazon.com/images/P/{asin}.01._SCLZZZZZZZ__SL160_.jpg"
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


def cmd_sync(args):
    """Run all commands in sequence"""
    print("=== Step 1: Discover ASINs ===")
    cmd_discover(args)
    print("\n" + "=" * 50 + "\n")

    print("=== Step 2: Validate ASINs ===")
    cmd_validate(["--update"] if "--update" in args else [])
    print("\n" + "=" * 50 + "\n")

    print("=== Step 3: Check Images ===")
    cmd_check_images(["--fix"] if "--fix" in args or "--update" in args else [])


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ["-h", "--help"]:
        print(__doc__)
        sys.exit(0)

    command = sys.argv[1]
    args = sys.argv[2:]

    commands = {
        "discover": cmd_discover,
        "validate": cmd_validate,
        "check-images": cmd_check_images,
        "sync": cmd_sync,
    }

    if command in commands:
        commands[command](args)
    else:
        print(f"Unknown command: {command}")
        print("Run with --help for usage information")
        sys.exit(1)


if __name__ == "__main__":
    main()
