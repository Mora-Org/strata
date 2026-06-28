import { test, expect } from '@playwright/test';

// Smoke test placeholder for M1.c. Run with: npm run e2e
// Full e2e coverage of M1 screens lands in M1.d (chat flow) and M1.e (settings).

test('shell renders header + sidebar + main composer', async ({ page }) => {
  await page.goto('/');

  // Header
  await expect(page.getByText('strata', { exact: true })).toBeVisible();
  await expect(page.getByTestId('mode-badge')).toHaveText('vereda');

  // Sidebar
  await expect(page.getByText('workspace')).toBeVisible();
  await expect(page.getByText('conversações')).toBeVisible();
  await expect(page.getByText('vault')).toBeVisible();

  // Composer
  await expect(page.getByTestId('composer-textarea')).toBeVisible();

  // Empty-state placeholder
  await expect(page.getByText(/Cada sessão é uma camada/)).toBeVisible();

  // Footer hints
  await expect(page.getByText(/explica, não edita/)).toBeVisible();
});
