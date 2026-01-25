#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.8"
# dependencies = []
# ///
"""
Check _data/asins.json for placeholder product data that needs validation.

This pre-commit hook warns when ASINs have placeholder titles like "Product B07ZWK2TQT"
or generic descriptions like "Update this with actual product information".

To fix: run `python3 scripts/manage-asins.py validate --update`
"""

import json
import sys
from pathlib import Path


def check_asin_placeholders():
    """Check for placeholder ASINs and warn if found."""
    asins_file = Path("_data/asins.json")

    if not asins_file.exists():
        print("⚠️  _data/asins.json not found")
        return 0

    with open(asins_file) as f:
        asin_data = json.load(f)

    # Find placeholders
    placeholders = []
    generic_descriptions = []

    for asin, data in asin_data.items():
        title = data.get("title", "")
        description = data.get("description", "")

        if title.startswith("Product "):
            placeholders.append(asin)
        elif description == "Update this with actual product information":
            generic_descriptions.append(asin)

    if not placeholders and not generic_descriptions:
        print("✅ All ASINs have valid product metadata")
        return 0

    # Print warnings
    print("⚠️  ASIN validation warnings:\n")

    if placeholders:
        print(f"   {len(placeholders)} ASIN(s) with placeholder titles:")
        for asin in placeholders[:5]:  # Show first 5
            print(f"     • {asin}: {asin_data[asin]['title']}")
        if len(placeholders) > 5:
            print(f"     ... and {len(placeholders) - 5} more")
        print()

    if generic_descriptions:
        print(f"   {len(generic_descriptions)} ASIN(s) with generic descriptions:")
        for asin in generic_descriptions[:5]:  # Show first 5
            title = asin_data[asin].get("title", "Unknown")[:50]
            print(f"     • {asin}: {title}...")
        if len(generic_descriptions) > 5:
            print(f"     ... and {len(generic_descriptions) - 5} more")
        print()

    print("   To fetch product metadata:")
    print("   → python3 scripts/manage-asins.py validate --update")
    print()

    # Warning only - don't fail the commit
    return 0


if __name__ == "__main__":
    sys.exit(check_asin_placeholders())
