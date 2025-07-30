import { test, expect } from '@playwright/test';

test.describe('Dev Info Banner', () => {
  test('should display branch and port info on dev server', async ({ page }) => {
    await page.goto('http://localhost:4001');
    
    // Wait for the dev-info banner
    const banner = await page.locator('#dev-info-banner');
    await expect(banner).toBeVisible();
    
    // Check the banner background color
    const bannerStyles = await banner.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    console.log('Banner background color:', bannerStyles.backgroundColor);
    console.log('Banner text color:', bannerStyles.color);
    
    // Check the code elements styling
    const codeElements = await page.locator('#dev-info-banner code').all();
    console.log(`Found ${codeElements.length} code elements`);
    
    for (let i = 0; i < codeElements.length; i++) {
      const codeElement = codeElements[i];
      const text = await codeElement.textContent();
      const styles = await codeElement.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      
      console.log(`Code element ${i + 1}: "${text}"`);
      console.log(`  Background: ${styles.backgroundColor}`);
      console.log(`  Color: ${styles.color}`);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'dev-banner-test.png' });
  });
});