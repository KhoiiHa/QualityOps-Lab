import { expect, test } from '@playwright/test';

test('gültiger Benutzer kann sich anmelden', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});
