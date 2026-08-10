import { expect, test } from '@playwright/test';

test('angemeldeter Benutzer kann ein Produkt in den Warenkorb legen', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const backpack = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/cart\.html$/);

  const cartItems = page.locator('[data-test="inventory-item"]');
  await expect(cartItems).toHaveCount(1);
  await expect(cartItems.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
});
