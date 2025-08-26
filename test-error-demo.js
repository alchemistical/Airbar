const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testErrorDemo() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 Console Error:', msg.text());
    }
  });
  
  try {
    console.log('Testing error boundary demo page...');
    await page.goto('http://localhost:5173/error-demo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Check if demo page loaded
    const hasDemoTitle = await page.locator('text=Contextual Error Boundary Demo').count() > 0;
    console.log(`Demo page loaded: ${hasDemoTitle}`);
    
    if (!hasDemoTitle) {
      console.log('❌ Demo page failed to load');
      return;
    }
    
    // Test triggering a Send Package error
    console.log('\n1. Testing Send Package error boundary...');
    const sendPackageButton = page.locator('button:has-text("Trigger Package Error")').first();
    await sendPackageButton.click();
    await page.waitForTimeout(2000);
    
    const hasPackageError = await page.locator('text=Package Form Error').count() > 0;
    const hasPackageIcon = await page.locator('.text-blue-500').count() > 0; // Package icon
    console.log(`Package error boundary triggered: ${hasPackageError}`);
    
    // Reset and test Checkout error
    console.log('\n2. Testing Checkout error boundary...');
    await page.locator('button:has-text("Reset")').first().click();
    await page.waitForTimeout(1000);
    
    const checkoutButton = page.locator('button:has-text("Trigger Payment Error")').first();
    await checkoutButton.click();
    await page.waitForTimeout(2000);
    
    const hasCheckoutError = await page.locator('text=Payment Processing Error').count() > 0;
    console.log(`Checkout error boundary triggered: ${hasCheckoutError}`);
    
    // Test Dashboard error
    console.log('\n3. Testing Dashboard error boundary...');
    await page.locator('button:has-text("Reset")').nth(1).click();
    await page.waitForTimeout(1000);
    
    const dashboardButton = page.locator('button:has-text("Trigger Dashboard Error")').first();
    await dashboardButton.click();
    await page.waitForTimeout(2000);
    
    const hasDashboardError = await page.locator('text=Dashboard Loading Error').count() > 0;
    console.log(`Dashboard error boundary triggered: ${hasDashboardError}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'error-boundary-demo.png', fullPage: true });
    console.log('\n📸 Screenshot saved: error-boundary-demo.png');
    
    // Summary
    const allWorking = hasPackageError && hasCheckoutError && hasDashboardError;
    if (allWorking) {
      console.log('\n🎉 All contextual error boundaries working perfectly!');
    } else {
      console.log('\n⚠️  Some error boundaries may need attention');
    }
    
  } catch (error) {
    console.error('Error during demo test:', error.message);
  }
  
  await browser.close();
}

testErrorDemo();