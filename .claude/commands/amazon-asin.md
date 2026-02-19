---
description: "Add Amazon product links with affiliate tracking and cached metadata"
allowed-tools: ["Bash", "Read", "Edit", "Write"]
---

# Amazon Product Links (Affiliate)

## Why We Use the ASIN System

- **Performance**: Pre-fetches product metadata (title, image, price) so pages load fast
- **Resilience**: Caches data in `_data/asins.json` so broken Amazon links don't break the blog
- **Affiliate revenue**: All links automatically include `?tag=ighe-20` affiliate parameter
- **Graceful degradation**: JavaScript fallback shows "View on Amazon" button if images break

## Usage

Single product:

```liquid
{% include amazon.html asin="B0D54JZTHY" %}
```

Multiple products (semicolon-separated):

```liquid
{% include amazon.html asin="B0D54JZTHY;B01JA6HG88;B0FGN9GC2G" %}
```

## After Adding New ASINs

```bash
# Discover new ASINs and fetch product metadata
python3 scripts/manage-asins.py sync --update

# Or just validate specific ASINs
python3 scripts/manage-asins.py validate B0D54JZTHY --update
```

## How the System Works

- Scans markdown files for `asin="..."` patterns
- Fetches product data from Amazon OpenGraph metadata
- Stores in `_data/asins.json` for Jekyll to read
- Validates images (rejects 1x1 tracking pixels)
- Pre-commit hook warns about placeholders

For troubleshooting broken images, see `scripts/README.md`.
