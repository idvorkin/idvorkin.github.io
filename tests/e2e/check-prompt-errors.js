const { chromium } = require('@playwright/test');

async function checkPromptPageErrors() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // Create a new page
  const page = await context.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', message => {
    consoleMessages.push({
      type: message.type(),
      text: message.text(),
      location: message.location()
    });
  });
  
  // Collect errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Navigate to the prompts page
  console.log('Navigating to /prompts page...');
  await page.goto('http://localhost:4000/prompts');
  
  // Wait for any potential errors
  await page.waitForTimeout(2000);
  
  // Log results
  console.log('\nConsole messages:');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type}] ${msg.text}`);
  });
  
  console.log('\nPage errors:');
  if (errors.length > 0) {
    errors.forEach(err => {
      console.log(err);
    });
  } else {
    console.log('No JavaScript errors detected');
  }
  
  // Close browser
  await browser.close();
}

// Run the check
checkPromptPageErrors()
  .catch(error => {
    console.error('Error running test:', error);
    process.exit(1);
  });