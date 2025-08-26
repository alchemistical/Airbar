const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testSendPackage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Testing Send Package page...');
    await page.goto('http://localhost:5173/send-package', { waitUntil: 'networkidle' });
    
    // Wait and take screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'send-package-test.png', fullPage: true });
    
    // Check if error boundary is shown
    const hasError = await page.locator('text=Something went wrong').count() > 0;
    const hasSuccess = await page.locator('text=Send Package (Test)').count() > 0;
    
    console.log('Has error:', hasError);
    console.log('Has success content:', hasSuccess);
    
    if (hasError) {
      // Try to get error details
      const errorDetails = await page.locator('details').textContent();
      console.log('Error details:', errorDetails);
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  }
  
  await browser.close();
}

testSendPackage();