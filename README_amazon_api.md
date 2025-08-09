# Amazon Product Advertising API Client

A Python script to interact with Amazon's Product Advertising API v5.

## Setup

1. Install uv (if not already installed):

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Get your Amazon API credentials:

   - Go to https://affiliate-program.amazon.com/
   - Navigate to Tools > Product Advertising API
   - Generate or view your credentials

3. Run the setup command:
   ```bash
   uv run amazon_product_api.py setup
   ```

## Usage

### Search for products:

```bash
uv run amazon_product_api.py search "laptop"
uv run amazon_product_api.py search "python programming books" --count 10
```

### Get details for a specific product:

```bash
uv run amazon_product_api.py get-item B08N5WRWNW
```

## Environment Variables

The script uses these environment variables (stored in `.env`):

- `AMAZON_ACCESS_KEY`: Your API access key
- `AMAZON_SECRET_KEY`: Your API secret key
- `AMAZON_PARTNER_TAG`: Your Amazon Associate ID

## Features

- Search products by keywords
- Get detailed information for specific ASINs
- AWS Signature V4 authentication
- Rich terminal output with tables and formatting
- Simple CLI interface

## Security

- Never commit your `.env` file
- Keep your API credentials secure
- The `.env` file is already in `.gitignore`
