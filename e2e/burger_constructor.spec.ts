import { test, expect } from '@playwright/test';

test.describe('Главная страница "Соберите бургер"', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/');
    // Ждем загрузки ингредиентов
    await expect(page.getByText('Соберите бургер')).toBeVisible();
    // Ждем загрузки карточек ингредиентов
    await expect(page.locator('.bun').first()).toBeVisible({ timeout: 10000 });
  });

  test('должна отображать заголовок "Соберите бургер"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test.describe('Перетаскивание ингредиентов', () => {
    test('перетаскивание булки в конструктор', async ({ page }) => {
      // Находим первую булку в списке ингредиентов по классу bun
      const bunCard = page.locator('.bun').first();
      // Находим область для булки в конструкторе (верхняя пустая область)
      const dropZoneTop = page.locator('[class*="empty_bun_top"]');
      
      // Перетаскиваем
      await bunCard.hover();
      await page.mouse.down();
      await dropZoneTop.hover();
      await page.mouse.up();
      
      // Проверяем, что булка появилась в конструкторе
      await expect(page.locator('[class*="burger_constructor"] .bun').first()).toBeVisible();
    });

    test('перетаскивание соуса в конструктор', async ({ page }) => {
      // Соусы уже на странице, находим первую карточку соуса
      const sauceCard = page.locator('.sauce').first();
      // Прокручиваем к карточке, если нужно
      await sauceCard.scrollIntoViewIfNeeded();
      // Находим область для начинок в конструкторе (средняя часть)
      const dropZoneMiddle = page.locator('[class*="burger_constructor"] [class*="type_list"]');
      
      // Убедимся, что область существует
      await expect(dropZoneMiddle).toBeVisible();
      
      await sauceCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();
      
      // Проверяем, что соус появился в конструкторе
      await expect(page.locator('[class*="burger_constructor"] .sauce').first()).toBeVisible({ timeout: 10000 });
    });

    test('перетаскивание начинки в конструктор', async ({ page }) => {
      // Начинки уже на странице, находим первую карточку начинки
      const mainCard = page.locator('.main').first();
      await mainCard.scrollIntoViewIfNeeded();
      const dropZoneMiddle = page.locator('[class*="burger_constructor"] [class*="type_list"]');
      
      await expect(dropZoneMiddle).toBeVisible();
      
      await mainCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();
      
      await expect(page.locator('[class*="burger_constructor"] .main').first()).toBeVisible({ timeout: 10000 });
    });
  });

  
  

});