#!/usr/bin/env python3
"""
Update ASINs in _data/asins.json
Usage: python scripts/update-asins.py

This script finds all ASIN references in the codebase and ensures they're in asins.json
"""

import json
import re
from pathlib import Path


def find_all_asins(root_dir):
    """Find all ASINs used in markdown files"""
    asins = set()
    asin_pattern = re.compile(r'asin="([A-Z0-9]{10})"')

    for path in Path(root_dir).rglob("*.md"):
        if "chop-logs" in str(path) or "node_modules" in str(path):
            continue

        try:
            content = path.read_text()
            matches = asin_pattern.findall(content)
            asins.update(matches)
        except Exception as e:
            print(f"Error reading {path}: {e}")

    return sorted(asins)


def main():
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
                "updated": "2024-01-29",
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
        print(f"\nASINs needing manual update: {', '.join(placeholders)}")
        print("\nTo update manually, edit _data/asins.json or visit:")
        for asin in placeholders[:3]:  # Show first 3
            print(f"  https://amazon.com/dp/{asin}")


if __name__ == "__main__":
    main()
