const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function analyzeHomepageCTAs() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Analyzing homepage CTAs...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Find all buttons and links
    const buttons = await page.locator('button, a[href]').all();
    
    console.log('Found CTAs on homepage:');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      try {
        const text = await button.textContent();
        const href = await button.getAttribute('href');
        const tag = await button.evaluate(el => el.tagName);
        
        if (text && text.trim()) {
          console.log(`${i + 1}. ${tag}: "${text.trim()}" ${href ? `→ ${href}` : '(no href)'}`);
        }
      } catch (e) {
        // Skip buttons that can't be accessed
      }
    }
    
    // Test the main CTA button
    console.log('\nTesting main CTAs...');
    
    // Look for common CTA patterns
    const ctaSelectors = [
      'button:has-text("Start Shipping")',
      'a:has-text("Start Shipping")', 
      'button:has-text("Get Quote")',
      'a:has-text("Get Quote")',
      '[data-testid="cta-start-shipping"]',
      '[data-testid="cta-get-quote"]'
    ];
    
    for (const selector of ctaSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`Found ${elements.length} element(s) with selector: ${selector}`);
          for (const element of elements) {
            const text = await element.textContent();
            const href = await element.getAttribute('href');
            console.log(`  Text: "${text?.trim()}" ${href ? `→ ${href}` : '(button, no href)'}`);
          }
        }
      } catch (e) {
        // Selector not supported or no matches
      }
    }
    
  } catch (error) {
    console.error('Error analyzing homepage:', error.message);
  }
  
  await browser.close();
}

analyzeHomepageCTAs();