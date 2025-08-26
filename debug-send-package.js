const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function debugSendPackage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 Console Error:', msg.text());
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log('🔴 Page Error:', error.message);
    console.log('Stack:', error.stack);
  });
  
  try {
    console.log('Debugging Send Package page with error capture...');
    await page.goto('http://localhost:5173/send-package', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // Wait for potential errors to surface
    await page.waitForTimeout(5000);
    
    // Check what's actually rendered
    const title = await page.title();
    console.log('Page title:', title);
    
    const hasError = await page.locator('text=Something went wrong').count() > 0;
    console.log('Has error boundary:', hasError);
    
    if (hasError) {
      // Click on error details to expand
      await page.locator('summary:has-text("Error details")').click();
      await page.waitForTimeout(1000);
      
      const errorText = await page.locator('details').textContent();
      console.log('Error details:', errorText);
    }
    
    // Check if there are any network failures
    const responses = [];
    page.on('response', response => {
      if (!response.ok()) {
        responses.push(`${response.status()} ${response.url()}`);
      }
    });
    
    if (responses.length > 0) {
      console.log('Failed network requests:', responses);
    }
    
  } catch (error) {
    console.error('Error during debugging:', error.message);
  }
  
  await browser.close();
}

debugSendPackage();