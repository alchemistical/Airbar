const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function analyzeRoleSwitching() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Analyzing role switching on homepage...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Look for role-related buttons and text
    const roleTexts = [
      "I want to send",
      "I'm traveling",
      "sender",
      "traveler",
      "Sender",
      "Traveler",
      "Post Your Trip"
    ];
    
    console.log('Searching for role-related elements...');
    for (const text of roleTexts) {
      const elements = await page.locator(`text="${text}"`).all();
      if (elements.length > 0) {
        console.log(`Found "${text}": ${elements.length} elements`);
        
        // Try clicking the first one
        try {
          await elements[0].click();
          await page.waitForTimeout(1000);
          console.log(`  Clicked "${text}" successfully`);
          
          // Check if page changed or content updated
          const currentUrl = page.url();
          console.log(`  Current URL: ${currentUrl}`);
          
          // Look for "Post Your Trip" after role switch
          const postTripElements = await page.locator('text="Post Your Trip"').all();
          if (postTripElements.length > 0) {
            console.log(`  ✅ Found "Post Your Trip" button after clicking "${text}"!`);
          }
          
        } catch (e) {
          console.log(`  Could not click "${text}": ${e.message.slice(0, 100)}`);
        }
      }
    }
    
    // Check the main content areas
    console.log('\nChecking for role-specific content...');
    const currentHtml = await page.content();
    
    if (currentHtml.includes('Post Your Trip')) {
      console.log('✅ Contains "Post Your Trip" content');
    }
    if (currentHtml.includes('Start Shipping')) {
      console.log('✅ Contains "Start Shipping" content');  
    }
    
  } catch (error) {
    console.error('Error analyzing role switching:', error.message);
  }
  
  await browser.close();
}

analyzeRoleSwitching();