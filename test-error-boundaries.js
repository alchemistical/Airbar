const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testErrorBoundaries() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Testing contextual error boundaries...');
    
    // Test 1: Navigate to send-package page (should work now)
    console.log('\n1. Testing send-package page...');
    await page.goto('http://localhost:5173/send-package', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const hasGenericError = await page.locator('text=Something went wrong').count() > 0;
    const hasContextualError = await page.locator('text=Package Form Error').count() > 0;
    const hasWorkingContent = await page.locator('text=Send a Package').count() > 0;
    
    console.log(`  Generic error: ${hasGenericError}`);
    console.log(`  Contextual error: ${hasContextualError}`);
    console.log(`  Working content: ${hasWorkingContent}`);
    
    if (hasWorkingContent) {
      console.log('  ✅ Send Package page loads correctly');
    } else if (hasContextualError) {
      console.log('  ✅ Contextual error boundary working');
    } else {
      console.log('  ❌ Page has issues');
    }
    
    // Test 2: Navigate to checkout page
    console.log('\n2. Testing checkout page...');
    await page.goto('http://localhost:5173/checkout/123', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const checkoutGenericError = await page.locator('text=Something went wrong').count() > 0;
    const checkoutContextualError = await page.locator('text=Payment Processing Error').count() > 0;
    const checkoutWorkingContent = await page.locator('text=Complete Your Payment').count() > 0;
    
    console.log(`  Generic error: ${checkoutGenericError}`);
    console.log(`  Contextual error: ${checkoutContextualError}`);
    console.log(`  Working content: ${checkoutWorkingContent}`);
    
    if (checkoutWorkingContent) {
      console.log('  ✅ Checkout page loads correctly');
    } else if (checkoutContextualError) {
      console.log('  ✅ Contextual error boundary working');
    } else {
      console.log('  ❌ Page has issues');
    }
    
    // Test 3: Navigate to dashboard
    console.log('\n3. Testing dashboard page...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const dashboardGenericError = await page.locator('text=Something went wrong').count() > 0;
    const dashboardContextualError = await page.locator('text=Dashboard Loading Error').count() > 0;
    const dashboardWorkingContent = await page.locator('text=Dashboard').count() > 0;
    
    console.log(`  Generic error: ${dashboardGenericError}`);
    console.log(`  Contextual error: ${dashboardContextualError}`);
    console.log(`  Working content: ${dashboardWorkingContent}`);
    
    if (dashboardWorkingContent) {
      console.log('  ✅ Dashboard page loads correctly');
    } else if (dashboardContextualError) {
      console.log('  ✅ Contextual error boundary working');
    } else {
      console.log('  ❌ Page has issues');
    }
    
    // Test 4: Test a broken route to see if contextual errors show
    console.log('\n4. Testing non-existent route...');
    await page.goto('http://localhost:5173/broken-route', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const notFoundError = await page.locator('text=Page Not Found').count() > 0;
    console.log(`  Shows 404: ${notFoundError}`);
    
    if (notFoundError) {
      console.log('  ✅ 404 handling works');
    }
    
  } catch (error) {
    console.error('Error during boundary test:', error.message);
  }
  
  await browser.close();
}

testErrorBoundaries();