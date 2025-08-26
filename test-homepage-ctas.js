const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testHomepageCTAs() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen to console messages for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 Console Error:', msg.text());
    }
  });
  
  try {
    console.log('Testing homepage CTAs...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Test the main "Start Shipping" button
    console.log('\n1. Testing "Start Shipping" button...');
    const startShippingButtons = await page.locator('button:has-text("Start Shipping")').all();
    console.log(`Found ${startShippingButtons.length} "Start Shipping" buttons`);
    
    if (startShippingButtons.length > 0) {
      // Click the first one
      await startShippingButtons[0].click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const hasError = await page.locator('text=Something went wrong').count() > 0;
      const hasPageNotFound = await page.locator('text=Page Not Found').count() > 0;
      const hasContent = await page.locator('main').count() > 0;
      
      console.log(`  Result: URL=${currentUrl}, Error=${hasError}, NotFound=${hasPageNotFound}, HasContent=${hasContent}`);
      
      if (currentUrl.includes('send-package')) {
        console.log('✅ "Start Shipping" works correctly!');
      } else {
        console.log('❌ "Start Shipping" went to wrong page');
      }
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(2000);
    }
    
    // Test "Get Quote" button
    console.log('\n2. Testing "Get Quote" button...');
    const getQuoteButtons = await page.locator('button:has-text("Get Quote")').all();
    console.log(`Found ${getQuoteButtons.length} "Get Quote" buttons`);
    
    if (getQuoteButtons.length > 0) {
      await getQuoteButtons[0].click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const hasError = await page.locator('text=Something went wrong').count() > 0;
      const hasPageNotFound = await page.locator('text=Page Not Found').count() > 0;
      
      console.log(`  Result: URL=${currentUrl}, Error=${hasError}, NotFound=${hasPageNotFound}`);
      
      // Go back
      await page.goBack();  
      await page.waitForTimeout(2000);
    }
    
    // Test role switching
    console.log('\n3. Testing role switching...');
    
    // Look for traveler toggle
    const travelerButton = page.locator('button:has-text("I\'m traveling")');
    const travelerCount = await travelerButton.count();
    
    if (travelerCount > 0) {
      console.log('Found traveler toggle button');
      await travelerButton.first().click();
      await page.waitForTimeout(1000);
      
      // Now test the "Post Your Trip" or similar button
      const postTripButtons = await page.locator('button:has-text("Post Your Trip")').all();
      console.log(`Found ${postTripButtons.length} "Post Your Trip" buttons after role switch`);
      
      if (postTripButtons.length > 0) {
        await postTripButtons[0].click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`  Traveler CTA result: URL=${currentUrl}`);
        
        if (currentUrl.includes('add-trip')) {
          console.log('✅ Traveler "Post Your Trip" works correctly!');
        } else {
          console.log('❌ Traveler "Post Your Trip" went to wrong page');
        }
      }
    } else {
      console.log('No traveler toggle found');
    }
    
  } catch (error) {
    console.error('Error during homepage CTA test:', error.message);
  }
  
  await browser.close();
}

testHomepageCTAs();