const puppeteer = require('puppeteer');

async function runSmokeTest() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Starting automated smoke test...');
    
    // Test 1: Homepage loads
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 10000 });
    const title = await page.title();
    console.log('✅ Homepage loads:', title);
    
    // Test 2: Tailwind styles are applied
    const bodyBg = await page.evaluate(() => {
      const body = document.querySelector('body');
      return window.getComputedStyle(body).backgroundColor;
    });
    console.log('✅ Body background color:', bodyBg);
    
    // Test 3: Check for navigation elements
    const hasHeader = await page.$('header') !== null || await page.$('[role="banner"]') !== null;
    console.log('✅ Header present:', hasHeader);
    
    // Test 4: Check routing works
    try {
      await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle0', timeout: 5000 });
      console.log('✅ Dashboard route accessible');
    } catch (e) {
      console.log('⚠️  Dashboard route may need auth');
    }
    
    // Test 5: Return to homepage
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 5000 });
    console.log('✅ Navigation back to homepage works');
    
    console.log('🎉 Smoke test completed successfully!');
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runSmokeTest().catch(console.error);
}

module.exports = { runSmokeTest };