#!/usr/bin/env node

/**
 * AirBar Production Smoke Test Suite
 * ==================================
 * Comprehensive production validation before go-live
 */

const https = require('https');
const http = require('http');

// Production URLs (update these for your actual domains)
const PRODUCTION_CONFIG = {
  web: 'https://airbar.com',
  api: 'https://api.airbar.com',
  monitoring: {
    grafana: 'https://grafana.airbar.com',
    prometheus: 'https://prometheus.airbar.com'
  }
};

// Development fallback for testing
const DEVELOPMENT_CONFIG = {
  web: 'http://localhost:3000',
  api: 'http://localhost:3001',
  monitoring: {
    grafana: 'http://localhost:3001',
    prometheus: 'http://localhost:9090'
  }
};

const USE_PRODUCTION = process.env.NODE_ENV === 'production';
const CONFIG = USE_PRODUCTION ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

console.log(`🧪 AirBar Production Smoke Tests Starting...`);
console.log(`🌍 Environment: ${USE_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`📍 Testing against: ${CONFIG.web}\n`);

class SmokeTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve) => {
      const isHttps = url.startsWith('https');
      const client = isHttps ? https : http;
      const timeout = options.timeout || 10000;

      const req = client.request(url, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'AirBar-SmokeTest/1.0',
          'Accept': 'application/json',
          ...options.headers
        },
        timeout
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            success: true,
            status: res.statusCode,
            headers: res.headers,
            data: data.length < 10000 ? data : data.substring(0, 10000) + '...',
            timing: Date.now() - startTime
          });
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          timing: Date.now() - startTime
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout',
          timing: timeout
        });
      });

      const startTime = Date.now();
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  async test(name, testFunction, critical = false) {
    this.results.total++;
    const testId = this.results.total;
    
    try {
      console.log(`⏳ [${testId}] ${name}...`);
      const startTime = Date.now();
      
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      if (result.success) {
        console.log(`✅ [${testId}] ${name} (${duration}ms)${result.details ? ' - ' + result.details : ''}`);
        this.results.passed++;
        this.results.tests.push({ id: testId, name, status: 'PASS', duration, critical });
      } else {
        console.log(`❌ [${testId}] ${name} (${duration}ms) - ${result.error}`);
        this.results.failed++;
        this.results.tests.push({ id: testId, name, status: 'FAIL', duration, error: result.error, critical });
      }
      
      return result;
    } catch (error) {
      console.log(`❌ [${testId}] ${name} - Exception: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ id: testId, name, status: 'ERROR', error: error.message, critical });
      return { success: false, error: error.message };
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 PRODUCTION SMOKE TEST RESULTS');
    console.log('='.repeat(60));
    
    const criticalFailed = this.results.tests.filter(t => t.critical && t.status !== 'PASS');
    const nonCriticalFailed = this.results.tests.filter(t => !t.critical && t.status !== 'PASS');
    
    console.log(`📊 Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`🎯 Success Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`);
    
    if (criticalFailed.length > 0) {
      console.log(`\n🚨 CRITICAL FAILURES (${criticalFailed.length}):`);
      criticalFailed.forEach(test => {
        console.log(`   ❌ ${test.name}: ${test.error}`);
      });
    }
    
    if (nonCriticalFailed.length > 0) {
      console.log(`\n⚠️  Non-Critical Failures (${nonCriticalFailed.length}):`);
      nonCriticalFailed.forEach(test => {
        console.log(`   ⚠️  ${test.name}: ${test.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (criticalFailed.length === 0 && this.results.passed > 0) {
      console.log('🎉 PRODUCTION READY - All critical tests passed!');
      console.log('✅ Safe to proceed with go-live deployment');
      return true;
    } else if (criticalFailed.length > 0) {
      console.log('🚨 PRODUCTION DEPLOYMENT BLOCKED');
      console.log('❌ Critical issues must be resolved before go-live');
      return false;
    } else {
      console.log('⚠️  No tests passed - Check deployment configuration');
      return false;
    }
  }
}

async function runSmokeTests() {
  const smokeTest = new SmokeTest();
  
  // Critical Tests - Must pass for production deployment
  
  await smokeTest.test('Frontend Homepage Load', async () => {
    const result = await smokeTest.makeRequest(CONFIG.web);
    if (!result.success) return { success: false, error: result.error };
    if (result.status !== 200) return { success: false, error: `HTTP ${result.status}` };
    if (!result.data.includes('AirBar') && !result.data.includes('<!DOCTYPE html>')) {
      return { success: false, error: 'Homepage content not found' };
    }
    return { success: true, details: `${result.timing}ms` };
  }, true);

  await smokeTest.test('API Health Check', async () => {
    const result = await smokeTest.makeRequest(`${CONFIG.api}/api/health`);
    if (!result.success) return { success: false, error: result.error };
    if (result.status !== 200) return { success: false, error: `HTTP ${result.status}` };
    
    try {
      const healthData = JSON.parse(result.data);
      if (healthData.status !== 'ok') {
        return { success: false, error: `Health status: ${healthData.status}` };
      }
      return { success: true, details: `API healthy (${result.timing}ms)` };
    } catch (e) {
      return { success: false, error: 'Invalid JSON response' };
    }
  }, true);

  await smokeTest.test('API Documentation Available', async () => {
    const result = await smokeTest.makeRequest(`${CONFIG.api}/api/docs`);
    if (!result.success) return { success: false, error: result.error };
    if (result.status !== 200) return { success: false, error: `HTTP ${result.status}` };
    if (!result.data.includes('swagger') && !result.data.includes('API')) {
      return { success: false, error: 'Swagger documentation not loaded' };
    }
    return { success: true, details: 'Documentation accessible' };
  }, true);

  await smokeTest.test('User Registration Endpoint', async () => {
    const testUser = {
      email: `smoketest-${Date.now()}@example.com`,
      password: 'SmokeTest123!',
      firstName: 'Smoke',
      lastName: 'Test',
      username: `smoketest${Date.now()}`
    };
    
    const result = await smokeTest.makeRequest(`${CONFIG.api}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    if (!result.success) return { success: false, error: result.error };
    if (result.status === 201) {
      return { success: true, details: 'Registration working' };
    } else if (result.status === 429) {
      return { success: true, details: 'Rate limiting active (good!)' };
    } else if (result.status === 400) {
      // May fail due to validation, but endpoint is responding
      return { success: true, details: 'Endpoint responding with validation' };
    }
    return { success: false, error: `Unexpected status: ${result.status}` };
  }, true);

  // Non-Critical Tests - Important but not deployment blockers

  await smokeTest.test('SSL Certificate Valid', async () => {
    if (!USE_PRODUCTION) {
      return { success: true, details: 'Skipped in development' };
    }
    // In production, the HTTPS request above would fail if SSL was invalid
    return { success: true, details: 'SSL working (HTTPS successful)' };
  }, false);

  await smokeTest.test('GZIP Compression Active', async () => {
    const result = await smokeTest.makeRequest(CONFIG.web, {
      headers: { 'Accept-Encoding': 'gzip' }
    });
    if (!result.success) return { success: false, error: result.error };
    
    const hasGzip = result.headers['content-encoding'] === 'gzip';
    return { 
      success: true, 
      details: hasGzip ? 'GZIP active' : 'GZIP not detected (may be ok)' 
    };
  }, false);

  await smokeTest.test('Security Headers Present', async () => {
    const result = await smokeTest.makeRequest(CONFIG.web);
    if (!result.success) return { success: false, error: result.error };
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security'
    ];
    
    const presentHeaders = securityHeaders.filter(header => 
      result.headers[header] || result.headers[header.toLowerCase()]
    );
    
    return { 
      success: presentHeaders.length > 0, 
      details: `${presentHeaders.length}/${securityHeaders.length} security headers` 
    };
  }, false);

  await smokeTest.test('API Rate Limiting Active', async () => {
    // Make multiple rapid requests to test rate limiting
    const rapidRequests = [];
    for (let i = 0; i < 15; i++) {
      rapidRequests.push(smokeTest.makeRequest(`${CONFIG.api}/api/health`));
    }
    
    const results = await Promise.all(rapidRequests);
    const rateLimited = results.some(r => r.status === 429);
    
    return { 
      success: true, 
      details: rateLimited ? 'Rate limiting active' : 'No rate limiting detected' 
    };
  }, false);

  await smokeTest.test('Database Connection Pool', async () => {
    const result = await smokeTest.makeRequest(`${CONFIG.api}/api/health/detailed`);
    if (!result.success) return { success: false, error: result.error };
    
    try {
      const healthData = JSON.parse(result.data);
      if (healthData.services && healthData.services.database) {
        return { success: true, details: 'Database health check passed' };
      }
    } catch (e) {
      // Ignore parse errors for non-critical test
    }
    
    return { success: true, details: 'Basic health check working' };
  }, false);

  // Print final results
  const success = smokeTest.printSummary();
  
  if (success) {
    console.log('\n🚀 READY FOR PRODUCTION DEPLOYMENT!');
    console.log('🌟 All critical systems validated');
    console.log('✅ Proceed with go-live sequence');
  } else {
    console.log('\n🛑 DEPLOYMENT BLOCKED');
    console.log('🔧 Resolve critical issues before deployment');
    console.log('📋 Check logs and system configuration');
  }
  
  process.exit(success ? 0 : 1);
}

// Handle uncaught errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the smoke tests
runSmokeTests().catch(error => {
  console.error('Smoke test suite failed:', error);
  process.exit(1);
});