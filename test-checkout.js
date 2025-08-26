const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testCheckout() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Testing Checkout page...');
    await page.goto('http://localhost:5173/checkout/123', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait longer for the mock timeout
    await page.waitForTimeout(8000);
    
    // Check if still in loading state
    const hasLoading = await page.locator('text=Preparing secure checkout').count() > 0;
    const hasPaymentForm = await page.locator('text=Complete Your Payment').count() > 0;
    const hasError = await page.locator('text=Something went wrong').count() > 0;
    
    console.log('Has loading state:', hasLoading);
    console.log('Has payment form:', hasPaymentForm);
    console.log('Has error:', hasError);
    
    // Take screenshot
    await page.screenshot({ path: 'checkout-test.png', fullPage: true });
    console.log('Screenshot saved: checkout-test.png');
    
  } catch (error) {
    console.error('Error during checkout test:', error.message);
  }
  
  await browser.close();
}

testCheckout();