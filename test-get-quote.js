const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testGetQuote() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    if (msg.type() === 'log') {
      console.log('📝 Console Log:', msg.text());
    }
    if (msg.type() === 'error') {
      console.log('🔴 Console Error:', msg.text());
    }
  });
  
  try {
    console.log('Testing Get Quote form...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Fill out the quote form
    console.log('Filling out quote form...');
    
    // Find and fill form fields
    await page.fill('input[placeholder*="From"]', 'New York');
    await page.fill('input[placeholder*="To"]', 'London');
    await page.fill('input[placeholder*="Item value"]', '100');
    
    console.log('Skipping size selection for now...');
    console.log('Form partially filled. Submitting...');
    
    // Submit the form
    const getQuoteButton = page.locator('button:has-text("Get Quote")').last(); // Get the form button
    await getQuoteButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`Result URL: ${currentUrl}`);
    
    if (currentUrl.includes('send-package')) {
      console.log('✅ Get Quote form works correctly!');
      
      // Check if URL has parameters
      if (currentUrl.includes('origin=') || currentUrl.includes('destination=')) {
        console.log('✅ Quote data passed in URL parameters!');
      }
    } else {
      console.log('❌ Get Quote form did not navigate properly');
    }
    
  } catch (error) {
    console.error('Error during Get Quote test:', error.message);
  }
  
  await browser.close();
}

testGetQuote();