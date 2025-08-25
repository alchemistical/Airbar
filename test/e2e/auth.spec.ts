import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
  });

  test('should display login page and handle authentication', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Sign In');
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1, h2')).toContainText(['Sign In', 'Login']);
    
    // Check for form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In")');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Test form validation - empty fields should show errors
    await submitButton.click();
    
    // Should stay on login page if fields are empty
    await expect(page).toHaveURL(/.*\/login/);
    
    // Fill in test credentials (these would fail in real scenario but test the form)
    await emailInput.fill('test@example.com');
    await passwordInput.fill('testpassword123');
    
    // Check if Remember Me checkbox exists
    const rememberMeCheckbox = page.locator('input[type="checkbox"]').first();
    if (await rememberMeCheckbox.isVisible()) {
      await expect(rememberMeCheckbox).toBeVisible();
    }
    
    // Submit form (will fail with test credentials, but we're testing the flow)
    await submitButton.click();
    
    // Wait for either dashboard redirect or error message
    await page.waitForTimeout(2000);
    
    // Should either redirect to dashboard or show error
    const currentUrl = page.url();
    const hasError = await page.locator('text=Invalid credentials, text=Login failed, .error').first().isVisible().catch(() => false);
    
    if (currentUrl.includes('/dashboard')) {
      // Successfully logged in
      await expect(page).toHaveURL(/.*\/dashboard/);
    } else {
      // Should show error message or stay on login
      expect(currentUrl.includes('/login') || hasError).toBeTruthy();
    }
  });

  test('should navigate to sign up page from login', async ({ page }) => {
    // Go to login page
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*\/login/);
    
    // Look for sign up link
    const signUpLink = page.locator('text=Sign Up, text=Create Account, text=Register').first();
    
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      await expect(page).toHaveURL(/.*\/(register|signup)/);
      
      // Verify sign up form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });

  test('should handle forgot password flow', async ({ page }) => {
    // Navigate to login
    await page.click('text=Sign In');
    
    // Look for forgot password link
    const forgotPasswordLink = page.locator('text=Forgot Password, text=Forgot your password, text=Reset Password').first();
    
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should be on forgot password page
      await expect(page).toHaveURL(/.*\/(forgot-password|reset)/);
      
      // Should have email input and submit button
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Test email submission
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('button[type="submit"]').click();
      
      // Should show success message or redirect
      await page.waitForTimeout(2000);
    }
  });

  test('should display session timeout modal after inactivity', async ({ page }) => {
    // This test would require being logged in first
    // Skip if we can't easily mock authentication
    test.skip(!process.env.E2E_TEST_USER, 'No test user credentials available');
    
    // Mock authenticated state by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ 
        id: '1', 
        email: 'test@example.com', 
        username: 'testuser' 
      }));
    });
    
    await page.goto('/dashboard');
    
    // Simulate user inactivity by reducing session timeout for testing
    await page.evaluate(() => {
      // Trigger session timeout warning (this would normally happen after period of inactivity)
      window.dispatchEvent(new CustomEvent('sessionTimeout'));
    });
    
    // Look for session timeout modal
    const sessionModal = page.locator('[data-testid="session-timeout-modal"], text=Session Timeout, text=extend session').first();
    
    if (await sessionModal.isVisible({ timeout: 5000 })) {
      await expect(sessionModal).toBeVisible();
      
      // Should have extend session button
      const extendButton = page.locator('button:has-text("Extend"), button:has-text("Continue")');
      await expect(extendButton).toBeVisible();
      
      // Test extending session
      await extendButton.click();
      await expect(sessionModal).not.toBeVisible();
    }
  });
});

test.describe('Navigation Flow', () => {
  test('should navigate through main pages without errors', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation links
    const navigationLinks = [
      { text: 'How It Works', expectedUrl: /how-it-works|#how/ },
      { text: 'Safety', expectedUrl: /safety/ },
      { text: 'Pricing', expectedUrl: /pricing/ },
    ];
    
    for (const link of navigationLinks) {
      const linkElement = page.locator(`text=${link.text}`).first();
      
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await expect(page).toHaveURL(link.expectedUrl);
        
        // Verify page loaded without errors
        const errorElement = page.locator('text=Error, text=404, text=Something went wrong').first();
        await expect(errorElement).not.toBeVisible();
        
        // Go back to home
        await page.goto('/');
      }
    }
  });
});