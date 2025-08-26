const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function comprehensiveHomepageTest() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = [];
  
  try {
    console.log('=== Comprehensive Homepage CTA Test ===\n');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Test 1: Start Shipping (Sender mode)
    console.log('1. Testing "Start Shipping" in sender mode...');
    const startShippingButtons = await page.locator('button:has-text("Start Shipping")').all();
    if (startShippingButtons.length > 0) {
      await startShippingButtons[0].click();
      await page.waitForTimeout(2000);
      const url = page.url();
      results.push({
        test: 'Start Shipping (Sender)',
        success: url.includes('send-package'),
        url: url
      });
      await page.goBack();
      await page.waitForTimeout(1000);
    }
    
    // Test 2: Switch to traveler mode
    console.log('2. Testing role switch to traveler...');
    const travelerButtons = await page.locator('button:has-text("I\'m traveling")').all();
    if (travelerButtons.length > 0) {
      await travelerButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Test 3: Post Your Trip (Traveler mode)
      console.log('3. Testing "Post Your Trip" in traveler mode...');
      const postTripButtons = await page.locator('button:has-text("Post Your Trip")').all();
      if (postTripButtons.length > 0) {
        await postTripButtons[0].click();
        await page.waitForTimeout(2000);
        const url = page.url();
        results.push({
          test: 'Post Your Trip (Traveler)',
          success: url.includes('add-trip'),
          url: url
        });
        await page.goBack();
        await page.waitForTimeout(1000);
      } else {
        results.push({
          test: 'Post Your Trip (Traveler)',
          success: false,
          url: 'Button not found'
        });
      }
    }
    
    // Test 4: Get Quote form
    console.log('4. Testing Get Quote form...');
    await page.fill('input[placeholder*="From"]', 'NYC');
    await page.fill('input[placeholder*="To"]', 'LA');
    await page.fill('input[placeholder*="Item value"]', '50');
    
    const getQuoteButton = page.locator('button:has-text("Get Quote")');
    await getQuoteButton.click();
    await page.waitForTimeout(2000);
    const quoteUrl = page.url();
    results.push({
      test: 'Get Quote Form',
      success: quoteUrl.includes('send-package') && quoteUrl.includes('origin='),
      url: quoteUrl
    });
    
  } catch (error) {
    console.error('Error during comprehensive test:', error.message);
  }
  
  await browser.close();
  
  // Print results
  console.log('\n=== Test Results ===');
  let passCount = 0;
  for (const result of results) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.test}`);
    console.log(`    URL: ${result.url}`);
    if (result.success) passCount++;
  }
  
  console.log(`\nSummary: ${passCount}/${results.length} tests passed`);
  
  if (passCount === results.length) {
    console.log('🎉 All homepage CTAs are working correctly!');
  } else {
    console.log('⚠️  Some CTAs need attention');
  }
}

comprehensiveHomepageTest();