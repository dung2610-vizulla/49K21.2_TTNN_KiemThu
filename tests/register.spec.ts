import { test, expect } from '@playwright/test';


test('Register-001 - Register successfully with mandatory fields only', async ({ page }) => {
  await page.goto('https://demo.nopcommerce.com/register');

  await page.locator('#FirstName').fill('demo');
  await page.locator('#LastName').fill('nopcommerce');
  const email = `demo${Date.now()}@example.com`;
  await page.locator('#Email').fill(email);
  await page.locator('#Password').fill('123456');
  await page.locator('#ConfirmPassword').fill('123456');

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/register') && resp.status() === 200),
    page.click('#register-button'),
  ]);

  const result = page.locator('.result');
  await expect(result).toHaveText(/Your registration completed/i);
});
