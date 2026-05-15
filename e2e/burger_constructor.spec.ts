import { test, expect } from '@playwright/test';

// Mock данные для ингредиентов
const mockIngredients = {
  success: true,
  data: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun' as const,
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0,
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main' as const,
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0,
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce' as const,
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      __v: 0,
    },
  ],
};

// Mock ответ для создания заказа
const mockOrderResponse = {
  success: true,
  name: 'Астероидный бургер',
  order: {
    number: 12345,
  },
};

// Mock ответ для авторизации
const mockAuthResponse = {
  success: true,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    email: 'artemsuchkov@yandex.ru',
    name: 'Artem',
  },
};

test.describe('Главная страница "Соберите бургер"', () => {
  test.beforeEach(async ({ page }) => {
    // Мокируем запросы к API
    await page.route('**/api/ingredients', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockIngredients),
      });
    });

    await page.route('**/api/orders', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderResponse),
      });
    });

    await page.route('**/api/auth/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthResponse),
      });
    });

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


  // Авторизация на сайте 

  test.describe('Авторизация на сайте', () => {
    test('авторизация на сайте', async ({ page }) => {
      // Авторизуемся перед созданием заказа
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
      await page.locator('#email').fill('artemsuchkov@yandex.ru');
      await page.locator('#password').fill('hg6ydgxbrf');
      await page.getByRole('button', { name: 'Войти' }).click();
      // Ждем перехода на главную страницу после успешного входа
      await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 15000 });
    });
  });


  // Тест перетаскивание ингредиентов в конструктор

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

  // Тест Детали ингредиента в модальном окне

  test.describe('Детали ингредиента', () => {
    test('клик на ингредиент открывает модальное окно с деталями и закрывается по Escape', async ({ page }) => {
      // Находим первую карточку ингредиента (булку)
      const ingredientCard = page.locator('.bun').first();
      // Кликаем на карточку
      await ingredientCard.click();
      // Ждем появления модального окна с заголовком "Детали ингредиента"
      await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
      // Находим модальное окно как контейнер с классом, содержащим "modal__modal"
      const ingredientModal = page.locator('[class*="modal__modal"]').first();
      // Проверяем, что отображается изображение ингредиента
      await expect(ingredientModal.locator('img')).toBeVisible();
      // Закрываем модальное окно нажатием Escape
      await page.keyboard.press('Escape');
      await expect(ingredientModal).not.toBeVisible();
    });
  });

  // Тест Создание заказа

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
      const bunCard = page.locator('.bun').first();
      const dropZoneTop = page.locator('[class*="empty_bun_top"]');
      await bunCard.hover();
      await page.mouse.down();
      await dropZoneTop.hover();
      await page.mouse.up();

      // Добавляем начинку
      const mainCard = page.locator('.main').first();
      const dropZoneMiddle = page.locator('[class*="burger_constructor"] [class*="type_list"]');
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
      await expect(page.getByRole('heading', { name: 'Детали заказа' })).toBeVisible();
      // Находим модальное окно как контейнер с классом, содержащим "modal__modal"
      const orderModal = page.locator('[class*="modal__modal"]').first();
      // Проверяем, что отображается номер заказа (ожидаем текст "идентифкатор заказа" или "xxxx")
      await expect(orderModal.getByText(/идентификатор заказа/i)).toBeVisible({ timeout: 15000 });

      // Закрываем модальное окно нажатием Escape
      await page.keyboard.press('Escape');
      await expect(orderModal).not.toBeVisible();
    });
  });

  
  

});