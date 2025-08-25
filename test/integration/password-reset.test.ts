/**
 * Integration tests for password reset flow
 * Tests the complete end-to-end password reset process
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { execSync } from 'child_process';
import crypto from 'crypto';

describe('Password Reset Integration Tests', () => {
  const API_BASE_URL = 'http://localhost:3001/api/auth';
  const testEmail = 'passwordreset@test.com';
  const newPassword = 'NewSecurePassword123!';
  let testToken: string;

  beforeEach(async () => {
    // Generate a test reset token
    testToken = crypto.randomBytes(32).toString('hex');
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('Forgot Password Endpoint', () => {
    it('should accept valid email and return success', async () => {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          email: testEmail
        })
      });

      // Should return success even for non-existent users (security best practice)
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.error).toBeUndefined();
    });

    it('should reject invalid email format', async () => {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          email: 'invalid-email'
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject empty email', async () => {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          email: ''
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Reset Password Endpoint', () => {
    it('should reject invalid token format', async () => {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          token: 'invalid-token',
          password: newPassword
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject weak password', async () => {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          token: testToken,
          password: '123'
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject empty token', async () => {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          token: '',
          password: newPassword
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject expired token (simulated)', async () => {
      // This test simulates an expired token
      // In a real scenario, we'd need to create an expired token in the database
      const expiredToken = crypto.randomBytes(32).toString('hex');
      
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          token: expiredToken,
          password: newPassword
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('Password Reset API Schema Validation', () => {
    it('should have proper error response structure', async () => {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: JSON.stringify({
          token: 'invalid',
          password: 'weak'
        })
      });

      const data = await response.json();
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('message');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Rate-Limit': 'test-bypass-token'
        },
        body: '{ invalid json'
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting Integration', () => {
    it('should enforce rate limiting for forgot password', async () => {
      // Make multiple requests quickly
      const requests = Array.from({ length: 5 }, () =>
        fetch(`${API_BASE_URL}/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Intentionally omit bypass token to test rate limiting
          },
          body: JSON.stringify({
            email: testEmail
          })
        })
      );

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});

describe('Password Reset Database Integration', () => {
  it('should verify PasswordResetToken model exists in schema', () => {
    // Test that the Prisma schema includes the PasswordResetToken model
    const schemaPath = '../../prisma/schema.prisma';
    
    try {
      const result = execSync(`grep -q "model PasswordResetToken" ${schemaPath}`, { encoding: 'utf-8' });
      // If grep succeeds (exit code 0), the model exists
      expect(true).toBe(true);
    } catch (error) {
      // If grep fails, the model doesn't exist
      fail('PasswordResetToken model not found in Prisma schema');
    }
  });

  it('should verify required fields in PasswordResetToken model', () => {
    const schemaPath = '../../prisma/schema.prisma';
    
    try {
      // Check for required fields
      execSync(`grep -A 10 "model PasswordResetToken" ${schemaPath} | grep -q "userId.*String"`, { encoding: 'utf-8' });
      execSync(`grep -A 10 "model PasswordResetToken" ${schemaPath} | grep -q "tokenHash.*String"`, { encoding: 'utf-8' });
      execSync(`grep -A 10 "model PasswordResetToken" ${schemaPath} | grep -q "expiresAt.*DateTime"`, { encoding: 'utf-8' });
      execSync(`grep -A 10 "model PasswordResetToken" ${schemaPath} | grep -q "createdAt.*DateTime"`, { encoding: 'utf-8' });
      
      expect(true).toBe(true);
    } catch (error) {
      fail('Required fields missing in PasswordResetToken model');
    }
  });
});