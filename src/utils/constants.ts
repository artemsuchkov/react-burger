//export const host = 'https://norma.education-services.ru';
export const host = 'https://new-stellarburgers.education-services.ru';

export type DefaultOptions = {
  method: string;
  headers: Record<string, string>;
};

export const defaultOptions: DefaultOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Mock data for tests
export const mockIngredient = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

export const mockBurgerIngredient = {
  item: mockIngredient,
  id: 'unique-id-1',
};

export const mockIngredientsResponse = {
  success: true,
  data: [mockIngredient],
};

export const mockOrderResponse = {
  success: true,
  name: 'Space флюоресцентный бургер',
  order: {
    number: 12345,
  },
};

export const mockOrder = {
  _id: '60d3b41abdacab0026a733c6',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2023-01-01T12:00:00.000Z',
  updatedAt: '2023-01-01T12:00:00.000Z',
  number: 12345,
};

export const mockDataResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10,
};

export const userLogin = 'artemsuchkov@yandex.ru';
export const userPassword = 'hg6ydgxbrf';
