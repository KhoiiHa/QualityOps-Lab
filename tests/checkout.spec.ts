import { expect, test } from '@playwright/test';

test('angemeldeter Benutzer kann eine Bestellung abschließen', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const backpack = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page).toHaveURL(/checkout-step-one\.html$/);

  await page.getByPlaceholder('First Name').fill('Max');
  await page.getByPlaceholder('Last Name').fill('Mustermann');
  await page.getByPlaceholder('Zip/Postal Code').fill('20095');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two\.html$/);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99');
  await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');
  await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');

  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page).toHaveURL(/checkout-complete\.html$/);
  await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
});

test('fehlender Vorname verhindert das Fortsetzen im Checkout', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const backpack = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByPlaceholder('Last Name').fill('Mustermann');
  await page.getByPlaceholder('Zip/Postal Code').fill('20095');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-one\.html$/);
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
});
