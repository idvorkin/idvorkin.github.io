#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';

async function fetchAmazonImage(asin) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log(`Fetching ${asin}...`);
    await page.goto(`https://www.amazon.com/dp/${asin}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Wait a bit for images to load
    await page.waitForTimeout(3000);

    // Try multiple selectors for product images
    const selectors = [
      '#landingImage',
      '#imgBlkFront',
      '.a-dynamic-image',
      '#imageBlock img',
      '[data-a-image-name="landingImage"]'
    ];

    let imageUrl = null;

    for (const selector of selectors) {
      try {
        const img = page.locator(selector).first();
        if (await img.count() > 0) {
          const src = await img.getAttribute('src');
          if (src && !src.includes('data:image') && src.includes('amazon')) {
            // Clean up the URL - remove size parameters to get high-res
            imageUrl = src.split('._')[0] + '._AC_SL1500_.jpg';
            console.log(`  Found image via ${selector}: ${imageUrl.substring(0, 80)}...`);
            break;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    await browser.close();
    return imageUrl;
  } catch (error) {
    console.error(`  Error fetching ${asin}: ${error.message}`);
    await browser.close();
    return null;
  }
}

async function main() {
  const asins = process.argv.slice(2);

  if (asins.length === 0) {
    console.error('Usage: node fetch-amazon-images.mjs ASIN1 ASIN2 ...');
    process.exit(1);
  }

  console.log(`Fetching images for ${asins.length} ASINs...\n`);

  // Load existing overrides
  const overridesPath = '_data/asin-image-overrides.json';
  let overrides = {};
  try {
    overrides = JSON.parse(readFileSync(overridesPath, 'utf-8'));
  } catch (e) {
    console.log('No existing overrides file found, creating new one');
  }

  // Fetch each ASIN
  for (const asin of asins) {
    const imageUrl = await fetchAmazonImage(asin);
    if (imageUrl) {
      overrides[asin] = imageUrl;
      console.log(`  ✓ Added override for ${asin}\n`);
    } else {
      console.log(`  ✗ Could not find image for ${asin}\n`);
    }

    // Be nice to Amazon - wait between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Save overrides
  writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  console.log(`\n✓ Updated ${overridesPath}`);
  console.log(`Total overrides: ${Object.keys(overrides).length}`);
}

main().catch(console.error);
