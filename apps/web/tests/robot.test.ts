import { expect, test } from '@playwright/test';

test('robot page has expected title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Device')).toBeVisible();
});
