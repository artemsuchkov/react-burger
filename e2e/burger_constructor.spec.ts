import { test, expect } from '@playwright/test';

test.describe('Главная страница "Соберите бургер"', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/');
    // Ждем загрузки ингредиентов
    await expect(page.getByText('Соберите бургер')).toBeVisible();
  });

  test('должна отображать заголовок "Соберите бургер"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test('должна содержать разделы ингредиентов: Булки, Соусы, Начинки', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Булки' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Соусы' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Начинки' })).toBeVisible();
  });

  test.describe('Перетаскивание ингредиентов', () => {
    test('перетаскивание булки в конструктор', async ({ page }) => {
      // Находим первую булку в списке ингредиентов по классу bun_type
      const bunCard = page.locator('.bun_type').first();
      // Находим область для булки в конструкторе (верхняя пустая область)
      const dropZoneTop = page.locator('[class*="empty_bun_top"]');
      
      // Перетаскиваем
      await bunCard.hover();
      await page.mouse.down();
      await dropZoneTop.hover();
      await page.mouse.up();
      
      // Проверяем, что булка появилась в конструкторе
      await expect(page.locator('[class*="burger_constructor"] .type_item').first()).toBeVisible();
    });

    test('перетаскивание соуса в конструктор', async ({ page }) => {
      // Переключаемся на вкладку Соусы
      await page.getByRole('tab', { name: 'Соусы' }).click();
      // Ждем появления соусов
      const sauceCard = page.locator('.sauce_type').first();
      // Находим область для начинок в конструкторе (средняя часть)
      const dropZoneMiddle = page.locator('[class*="empty_ingredients"]');
      
      await sauceCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();
      
      // Проверяем, что соус появился в конструкторе
      await expect(page.locator('[class*="burger_constructor"] .type_list').first()).toBeVisible();
    });

    test('перетаскивание начинки в конструктор', async ({ page }) => {
      // Переключаемся на вкладку Начинки
      await page.getByRole('tab', { name: 'Начинки' }).click();
      const mainCard = page.locator('.main_type').first();
      const dropZoneMiddle = page.locator('[class*="empty_ingredients"]');
      
      await mainCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();
      
      //await expect(page.locator('[class*="burger_constructor"] .main_type').first()).toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page }) => {
      // Авторизуемся перед созданием заказа
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
      await page.locator('#email').fill('artemsuchkov@yandex.ru');
      await page.locator('#password').fill('hg6ydgxbrf');
      await page.getByRole('button', { name: 'Войти' }).click();
      // Ждем перехода на главную страницу после успешного входа
      await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 15000 });
    });

    test('создание заказа после добавления ингредиентов', async ({ page }) => {
      // Добавляем булку
      const bunCard = page.locator('.bun_type').first();
      const dropZoneTop = page.locator('[class*="empty_bun_top"]');
      await bunCard.hover();
      await page.mouse.down();
      await dropZoneTop.hover();
      await page.mouse.up();

      // Добавляем начинку
      await page.getByRole('tab', { name: 'Начинки' }).click();
      const mainCard = page.locator('.main_type').first();
      const dropZoneMiddle = page.locator('[class*="empty_ingredients"]');
      await mainCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();

      // Проверяем, что кнопка "Оформить заказ" активна
      const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
      await expect(orderButton).toBeEnabled();

      // Нажимаем кнопку
      await orderButton.click();

      // Ждем появления модального окна с деталями заказа
      const orderModal = page.locator('[class*="modal"]');
      await expect(orderModal).toBeVisible();

      // Проверяем, что отображается номер заказа (ожидаем текст "идентификатор заказа" или "xxxx")
      await expect(orderModal.getByText(/идентификатор заказа/i)).toBeVisible({ timeout: 15000 });

      // Закрываем модальное окно
      const closeButton = orderModal.getByRole('button', { name: 'Закрыть' }).or(orderModal.locator('[class*="close"]'));
      await closeButton.click();
      await expect(orderModal).not.toBeVisible();
    });
  });

  test.describe('Модальные окна', () => {
    test('открытие модального окна с деталями ингредиента', async ({ page }) => {
      // Кликаем на карточку ингредиента
      const ingredientCard = page.locator('[class*="type_item"]').first();
      await ingredientCard.click();

      // Проверяем, что открылось модальное окно
      const ingredientModal = page.locator('[class*="modal"]');
      await expect(ingredientModal).toBeVisible();

      // Проверяем, что в модальном окне есть название ингредиента и калории
      await expect(ingredientModal.getByText(/калории/i)).toBeVisible();
      await expect(ingredientModal.getByText(/белки/i)).toBeVisible();
      await expect(ingredientModal.getByText(/жиры/i)).toBeVisible();
      await expect(ingredientModal.getByText(/углеводы/i)).toBeVisible();

      // Закрываем модальное окно
      const closeButton = ingredientModal.getByRole('button', { name: 'Закрыть' }).or(ingredientModal.locator('[class*="close"]'));
      await closeButton.click();
      await expect(ingredientModal).not.toBeVisible();
    });

    test('модальное окно деталей заказа появляется после оформления', async ({ page }) => {
      // Авторизуемся
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
      await page.locator('#email').fill('artemsuchkov@yandex.ru');
      await page.locator('#password').fill('hg6ydgxbrf');
      await page.getByRole('button', { name: 'Войти' }).click();
      await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 15000 });

      // Добавляем булку и начинку
      const bunCard = page.locator('.bun_type').first();
      const dropZoneTop = page.locator('[class*="empty_bun_top"]');
      await bunCard.hover();
      await page.mouse.down();
      await dropZoneTop.hover();
      await page.mouse.up();

      await page.getByRole('tab', { name: 'Начинки' }).click();
      const mainCard = page.locator('.main_type').first();
      const dropZoneMiddle = page.locator('[class*="empty_ingredients"]');
      await mainCard.hover();
      await page.mouse.down();
      await dropZoneMiddle.hover();
      await page.mouse.up();

      // Оформляем заказ
      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      // Проверяем модальное окно
      const orderModal = page.locator('[class*="modal"]');
      await expect(orderModal).toBeVisible();
      await expect(orderModal.getByText(/заказ принят/i)).toBeVisible({ timeout: 15000 });

      // Закрываем
      const closeButton = orderModal.getByRole('button', { name: 'Закрыть' }).or(orderModal.locator('[class*="close"]'));
      await closeButton.click();
      await expect(orderModal).not.toBeVisible();
    });
  });
});