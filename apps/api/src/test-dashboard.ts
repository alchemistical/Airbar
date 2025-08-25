// Simple test script to test dashboard service with Prisma
import { dashboardService } from './features/dashboard/services/dashboard.service';

async function testDashboard() {
  try {
    console.log('🔍 Testing dashboard service with Prisma...');
    
    // Test with a mock UUID
    const testUserId = 'clyxbw8l50000u0x8j5r8dm2y';
    
    console.log('Testing getMetrics...');
    const metrics = await dashboardService.getMetrics(testUserId);
    console.log('✅ Metrics received:', metrics);
    
    console.log('Testing getDashboardData...');
    const data = await dashboardService.getDashboardData(testUserId);
    console.log('✅ Dashboard data received:', data);
    
    console.log('🎉 Dashboard service test completed successfully!');
    
  } catch (error) {
    console.error('❌ Dashboard service test failed:', error);
    console.error('Error details:', error.message);
  }
  
  process.exit(0);
}

testDashboard();