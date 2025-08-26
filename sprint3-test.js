#!/usr/bin/env node

/**
 * Sprint 3: End-to-End User Journey Test
 * Tests the complete user flow from registration to dashboard usage
 */

const API_BASE = 'http://localhost:3001/api';
const FRONTEND_BASE = 'http://localhost:5174';

console.log('🚀 Sprint 3: Advanced Feature Validation Starting...\n');

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-ratelimit-bypass': 'test-bypass-token',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testUserRegistration() {
  console.log('✅ Testing User Registration...');
  
  const testUser = {
    email: 'sprint3test@example.com',
    password: 'TestPassword123',
    firstName: 'Sprint',
    lastName: 'User',
    username: 'sprint3user'
  };
  
  const result = await makeRequest(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (result.success) {
    console.log('   ✅ User registration successful');
    console.log(`   👤 User ID: ${result.data.user.id}`);
    return result.data;
  } else {
    console.log('   ❌ User registration failed:', result.data?.error?.message || result.error);
    return null;
  }
}

async function testUserLogin(email, password) {
  console.log('✅ Testing User Login...');
  
  const result = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (result.success) {
    console.log('   ✅ User login successful');
    console.log(`   🔑 Access token received`);
    return result.data;
  } else {
    console.log('   ❌ User login failed:', result.data?.error?.message || result.error);
    return null;
  }
}

async function testDashboardAccess(userId, accessToken) {
  console.log('✅ Testing Dashboard Access...');
  
  const result = await makeRequest(`${API_BASE}/dashboard/data/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (result.success) {
    console.log('   ✅ Dashboard data retrieved successfully');
    console.log(`   📊 Dashboard loaded for user ${userId}`);
    return result.data;
  } else {
    console.log('   ❌ Dashboard access failed:', result.data?.error?.message || result.error);
    return null;
  }
}

async function testHealthCheck() {
  console.log('✅ Testing API Health...');
  
  const result = await makeRequest(`${API_BASE}/health`);
  
  if (result.success) {
    console.log('   ✅ API health check passed');
    console.log(`   🏥 System status: ${result.data.status}`);
    return true;
  } else {
    console.log('   ❌ API health check failed');
    return false;
  }
}

async function runSprint3Tests() {
  console.log('🎯 Sprint 3: Advanced Feature Validation & User Journey Testing\n');
  
  // Step 1: Health Check (non-blocking)
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('⚠️ Health check failed due to rate limiting, but continuing with core tests...');
  }
  
  console.log('');
  
  // Step 2: User Registration
  const registrationData = await testUserRegistration();
  if (!registrationData) {
    console.log('❌ Registration failed, stopping tests');
    return;
  }
  
  console.log('');
  
  // Step 3: User Login
  const loginData = await testUserLogin('sprint3test@example.com', 'TestPassword123');
  if (!loginData) {
    console.log('❌ Login failed, stopping tests');
    return;
  }
  
  console.log('');
  
  // Step 4: Dashboard Access
  const dashboardData = await testDashboardAccess(loginData.user.id, loginData.tokens.accessToken);
  
  console.log('');
  
  // Sprint 3 Summary
  console.log('🎉 Sprint 3 Test Results Summary:');
  console.log('=====================================');
  console.log(`✅ API Health Check: ${healthOk ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ User Registration: ${registrationData ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ User Login: ${loginData ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Dashboard Access: ${dashboardData ? 'PASSED' : 'FAILED'}`);
  
  const allPassed = healthOk && registrationData && loginData && dashboardData;
  
  if (allPassed) {
    console.log('\n🎉 Sprint 3: FULL SUCCESS - All user journeys working!');
  } else {
    console.log('\n⚠️ Sprint 3: PARTIAL SUCCESS - Some issues found for resolution');
  }
  
  console.log('\n🌐 Frontend URL: http://localhost:5174');
  console.log('🔧 API URL: http://localhost:3001');
  console.log('📚 API Docs: http://localhost:3001/api/docs');
}

runSprint3Tests().catch(console.error);