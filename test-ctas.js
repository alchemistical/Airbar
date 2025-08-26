const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testCTAs() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const ctasToTest = [
    {
      page: 'homepage',
      url: 'http://localhost:5173/',
      ctas: [
        { text: 'Start Shipping', expected: '/send-package' },
        { text: 'Get Quote', expected: '/send-package' }
      ]
    },
    {
      page: 'dashboard', 
      url: 'http://localhost:5173/dashboard',
      ctas: [
        { text: 'Send Package', expected: '/send-package' },
        { text: 'Browse Travelers', expected: '/matches/discovery' },
        { text: 'Track Package', expected: '/tracking' }
      ]
    },
    {
      page: 'matches',
      url: 'http://localhost:5173/matches', 
      ctas: [
        { text: 'Send Package', expected: '/send-package' },
        { text: 'View Details', expected: null }, // Dynamic, just check it doesn't error
        { text: 'Open Chat', expected: null }
      ]
    }
  ];

  const results = [];
  
  for (const pageTest of ctasToTest) {
    console.log(`\nTesting ${pageTest.page}...`);
    
    try {
      await page.goto(pageTest.url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(2000);
      
      for (const cta of pageTest.ctas) {
        try {
          console.log(`  Testing CTA: "${cta.text}"`);
          
          // Find and click the CTA
          const button = page.locator(`text="${cta.text}"`).first();
          const buttonCount = await button.count();
          
          if (buttonCount === 0) {
            results.push({
              page: pageTest.page,
              cta: cta.text,
              status: 'NOT_FOUND',
              message: 'Button not found on page'
            });
            continue;
          }
          
          // Click and check destination
          await button.click();
          await page.waitForTimeout(1500);
          
          const currentUrl = page.url();
          const hasError = await page.locator('text=Something went wrong').count() > 0;
          const hasPageNotFound = await page.locator('text=Page Not Found').count() > 0;
          
          let status = 'SUCCESS';
          let message = `Navigated to: ${currentUrl}`;
          
          if (hasError) {
            status = 'ERROR';
            message = 'Page shows error boundary';
          } else if (hasPageNotFound && !currentUrl.includes('dashboard')) {
            status = 'NOT_FOUND'; 
            message = 'Page not found error';
          } else if (cta.expected && !currentUrl.includes(cta.expected)) {
            status = 'WRONG_DESTINATION';
            message = `Expected ${cta.expected}, got ${currentUrl}`;
          }
          
          results.push({
            page: pageTest.page,
            cta: cta.text,
            status: status,
            message: message,
            url: currentUrl
          });
          
          // Go back for next test
          await page.goBack();
          await page.waitForTimeout(1000);
          
        } catch (error) {
          results.push({
            page: pageTest.page,
            cta: cta.text,
            status: 'ERROR',
            message: `Test failed: ${error.message}`
          });
        }
      }
    } catch (error) {
      console.error(`Failed to test ${pageTest.page}:`, error.message);
    }
  }
  
  await browser.close();
  
  // Print results
  console.log('\n=== CTA Test Results ===');
  for (const result of results) {
    const statusEmoji = {
      'SUCCESS': '✅',
      'ERROR': '❌', 
      'NOT_FOUND': '🔍',
      'WRONG_DESTINATION': '⚠️'
    };
    
    console.log(`${statusEmoji[result.status]} ${result.page} - "${result.cta}": ${result.message}`);
  }
  
  const failedTests = results.filter(r => r.status !== 'SUCCESS');
  console.log(`\nSummary: ${results.length - failedTests.length}/${results.length} CTAs working`);
  
  return results;
}

testCTAs().catch(console.error);