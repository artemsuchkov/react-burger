import { test, expect } from '@playwright/test';

test('should have text "Соберите бургер" on home page', async ({ page }) => {
  // Переходим на главную страницу
  await page.goto('/');
  
  // Проверяем наличие текста "Соберите бургер"
  await expect(page.getByText('Соберите бургер')).toBeVisible();
});

 