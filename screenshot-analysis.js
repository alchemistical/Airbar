const { chromium } = require('./node_modules/.pnpm/playwright@1.55.0/node_modules/playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size for consistent screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  const screenshots = [];
  const baseUrl = 'http://localhost:5173';
  
  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/landing', name: 'landing' },
    { path: '/send-package', name: 'send-package' },
    { path: '/showcase', name: 'component-showcase' },
    { path: '/dashboard', name: 'dashboard' },
    { path: '/matches', name: 'matches' },
    { path: '/matches/discovery', name: 'matches-discovery' },
    { path: '/match-requests', name: 'match-requests' },
    { path: '/parcel-requests', name: 'parcel-requests' },
    { path: '/tracking', name: 'tracking' },
    { path: '/my-parcels', name: 'my-parcels' },
    { path: '/checkout', name: 'checkout' },
    { path: '/disputes', name: 'disputes' },
    { path: '/dashboard/traveler', name: 'dashboard-traveler' },
    { path: '/dashboard/sender', name: 'dashboard-sender' },
    { path: '/dashboard/profile', name: 'dashboard-profile' },
    { path: '/auth/login', name: 'auth-login' },
    { path: '/auth/register', name: 'auth-register' }
  ];
  
  // Create screenshots directory
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }
  
  console.log('Taking screenshots of main pages...');
  
  for (const pageInfo of pages) {
    try {
      console.log(`Taking screenshot of ${pageInfo.name}...`);
      await page.goto(`${baseUrl}${pageInfo.path}`, { waitUntil: 'networkidle' });
      
      // Wait for any lazy-loaded components
      await page.waitForTimeout(2000);
      
      const screenshotPath = path.join(screenshotDir, `${pageInfo.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      screenshots.push({
        name: pageInfo.name,
        path: screenshotPath,
        url: `${baseUrl}${pageInfo.path}`
      });
      
      console.log(`✅ Screenshot saved: ${pageInfo.name}.png`);
    } catch (error) {
      console.log(`❌ Failed to screenshot ${pageInfo.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  
  console.log('\nScreenshots completed!');
  console.log('Files saved in:', screenshotDir);
  
  return screenshots;
}

takeScreenshots().catch(console.error);