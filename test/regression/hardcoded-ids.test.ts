/**
 * Regression test to ensure no hard-coded user IDs remain in the codebase
 * This test prevents the reintroduction of hard-coded user/traveler IDs
 */

import { execSync } from 'child_process';
import path from 'path';

describe('Hard-coded ID Regression Tests', () => {
  const webSrcPath = path.join(__dirname, '../../apps/web/src');
  
  test('should not contain hard-coded user IDs in TypeScript files', () => {
    try {
      // Search for hard-coded user ID patterns in web source files
      const result = execSync(
        `grep -r "const userId = [0-9]\\+\\|userId: [0-9]\\+\\|travelerId: [0-9]\\+" ${webSrcPath} --include="*.tsx" --include="*.ts" || true`,
        { encoding: 'utf-8' }
      );
      
      if (result.trim()) {
        const violations = result.trim().split('\n').filter(line => {
          // Filter out acceptable patterns (like test files or type definitions)
          return !line.includes('test') && 
                 !line.includes('spec') && 
                 !line.includes('.d.ts') &&
                 !line.includes('// TODO: Get from match data'); // Allow TODO comments for traveler IDs from match data
        });
        
        if (violations.length > 0) {
          fail(`Found hard-coded user IDs that should use auth context:\n${violations.join('\n')}`);
        }
      }
    } catch (error) {
      // If grep finds nothing, it exits with code 1, which is what we want
      if (error.status !== 1) {
        throw error;
      }
    }
  });

  test('should not contain demo user ID comments', () => {
    try {
      const result = execSync(
        `grep -r "demo.*user\\|Demo user ID\\|test.*user" ${webSrcPath} --include="*.tsx" --include="*.ts" -i || true`,
        { encoding: 'utf-8' }
      );
      
      if (result.trim()) {
        const violations = result.trim().split('\n').filter(line => {
          return !line.includes('test') && 
                 !line.includes('spec') &&
                 !line.includes('@testing-library/user-event'); // Allow testing library imports
        });
        
        if (violations.length > 0) {
          fail(`Found demo user ID comments that should be replaced with auth context:\n${violations.join('\n')}`);
        }
      }
    } catch (error) {
      if (error.status !== 1) {
        throw error;
      }
    }
  });

  test('critical components should use useAuth hook', () => {
    const criticalComponents = [
      'pages/Dashboard.tsx',
      'pages/DisputeList.tsx', 
      'pages/DisputeNew.tsx',
      'pages/DisputeDetail.tsx',
      'pages/TravelerTrips.tsx',
      'pages/MatchRequests.tsx',
      'pages/DashboardMatches.tsx'
    ];

    criticalComponents.forEach(componentPath => {
      try {
        const result = execSync(
          `grep -l "useAuth" ${webSrcPath}/${componentPath}`,
          { encoding: 'utf-8' }
        );
        
        expect(result.trim()).toBeTruthy();
      } catch (error) {
        fail(`Critical component ${componentPath} should import and use useAuth hook`);
      }
    });
  });

  test('components should not have const userId = 1 patterns', () => {
    try {
      const result = execSync(
        `grep -r "const userId = 1" ${webSrcPath} --include="*.tsx" --include="*.ts" || true`,
        { encoding: 'utf-8' }
      );
      
      if (result.trim()) {
        fail(`Found const userId = 1 patterns that should use auth context:\n${result}`);
      }
    } catch (error) {
      if (error.status !== 1) {
        throw error;
      }
    }
  });

  test('dispute components should have authentication guards', () => {
    const disputeComponents = [
      'pages/DisputeList.tsx',
      'pages/DisputeNew.tsx', 
      'pages/DisputeDetail.tsx'
    ];

    disputeComponents.forEach(componentPath => {
      try {
        const result = execSync(
          `grep -l "isAuthenticated\\|login" ${webSrcPath}/${componentPath}`,
          { encoding: 'utf-8' }
        );
        
        expect(result.trim()).toBeTruthy();
      } catch (error) {
        fail(`Dispute component ${componentPath} should have authentication guards`);
      }
    });
  });
});

describe('Authentication Integration Tests', () => {
  test('AuthRoutes module should be properly imported in App.tsx', () => {
    const appPath = path.join(__dirname, '../../apps/web/src/App.tsx');
    
    try {
      const result = execSync(
        `grep "AuthRoutes" ${appPath}`,
        { encoding: 'utf-8' }
      );
      
      expect(result).toContain('import { AuthRoutes }');
      expect(result).toContain('<AuthRoutes');
    } catch (error) {
      fail('App.tsx should import and use AuthRoutes module');
    }
  });

  test('password reset API endpoints should exist', () => {
    const authControllerPath = path.join(__dirname, '../../apps/api/src/features/auth/controllers/auth-prisma.controller.ts');
    
    try {
      const result = execSync(
        `grep -E "forgotPassword|resetPassword" ${authControllerPath}`,
        { encoding: 'utf-8' }
      );
      
      expect(result).toContain('forgotPassword');
      expect(result).toContain('resetPassword');
    } catch (error) {
      fail('Auth controller should have forgotPassword and resetPassword methods');
    }
  });
});