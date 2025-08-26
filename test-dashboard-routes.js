const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');

async function testDashboardRoutes() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const routes = [
    { path: '/dashboard/traveler', name: 'dashboard-traveler' },
    { path: '/dashboard/sender', name: 'dashboard-sender' },
    { path: '/dashboard/profile', name: 'dashboard-profile' }
  ];
  
  for (const route of routes) {
    try {
      console.log(`Testing ${route.name}...`);
      await page.goto(`http://localhost:5173${route.path}`, { 
        waitUntil: 'networkidle', 
        timeout: 10000 
      });
      
      await page.waitForTimeout(2000);
      
      const hasError = await page.locator('text=Something went wrong').count() > 0;
      const hasPageNotFound = await page.locator('text=Page Not Found').count() > 0;
      const hasContent = await page.locator('main').count() > 0;
      
      console.log(`${route.name} - Has error: ${hasError}, Page not found: ${hasPageNotFound}, Has content: ${hasContent}`);
      
      // Take screenshot
      await page.screenshot({ path: `${route.name}-test.png`, fullPage: true });
      
    } catch (error) {
      console.error(`Error testing ${route.name}:`, error.message);
    }
  }
  
  await browser.close();
}

testDashboardRoutes();