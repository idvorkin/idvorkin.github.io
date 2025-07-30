# ASIN Management Scripts

This directory contains scripts for managing Amazon product ASINs used throughout the blog.

## Unified Tool: manage-asins.py

The recommended way to manage ASINs is using the unified `manage-asins.py` script:

```bash
# Discover new ASINs in markdown files
python scripts/manage-asins.py discover

# Fetch/update product metadata from Amazon
python scripts/manage-asins.py validate --update

# Check and fix broken images
python scripts/manage-asins.py check-images --fix

# Run all three in sequence
python scripts/manage-asins.py sync --update
```

### Commands

- **discover**: Finds all ASINs referenced in markdown files and adds them to `_data/asins.json`
- **validate**: Fetches product metadata (title, price, description) from Amazon
- **check-images**: Verifies product images are loading correctly
- **sync**: Runs all three commands in sequence

### Options

- `--update`: Save changes to the database (for validate command)
- `--fix`: Attempt to fix broken images with fallback URLs (for check-images command)
- `[ASIN...]`: Specific ASINs to validate (e.g., `python scripts/manage-asins.py validate B0D54JZTHY`)

## Legacy Scripts (Deprecated)

The following scripts are kept for backward compatibility but their functionality is now included in `manage-asins.py`:

- `update-asins.py` → Use `manage-asins.py discover`
- `validate-asins.py` → Use `manage-asins.py validate`
- `check-asin-images.py` → Use `manage-asins.py check-images`

## Workflow

1. **When adding new Amazon products to content:**

   ```bash
   # Add product links to your markdown: {% include amazon.html asin="B0D54JZTHY" %}
   # Then run:
   python scripts/manage-asins.py sync --update
   ```

2. **To update product information:**

   ```bash
   python scripts/manage-asins.py validate --update
   ```

3. **To fix broken images:**
   ```bash
   python scripts/manage-asins.py check-images --fix
   ```

## Data Files

- `_data/asins.json`: Main database of product information
- `_data/asin-image-overrides.json`: Manual overrides for broken images

## Notes

- The scripts use a 2-second delay between Amazon requests to avoid rate limiting
- Image validation checks for proper content type and size (>1KB) to avoid tracking pixels
- Fallback images use Amazon's standard product image URL format
