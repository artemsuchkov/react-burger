import { host } from '@utils/constants.ts';

import type {
  BurgerIngredient,
  IngredientsResponse,
  OrderResponse,
} from '@/types/ingredients';

const getResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json() as Promise<T>;
  }
  return Promise.reject(`Ошибка ${res.status}`);
};

const request = <T>(url: string, options: RequestInit = {}): Promise<T> => {
  return fetch(url, options).then(getResponse<T>);
};

export const getIngredientsTasks = (): Promise<IngredientsResponse> => {
  return request<IngredientsResponse>(host + '/api/ingredients');
};

export const getOrderIdTasks = (
  ingredients: BurgerIngredient[]
): Promise<OrderResponse> => {
  // Находим булку (type: "bun")
  const bun = ingredients.find((ingredient) => ingredient.item.type === 'bun');
  if (!bun) {
    return Promise.reject(`В заказе нет булки (type: "bun")`);
  }
  const bunId = bun.item._id;

  // Фильтруем остальные ингредиенты (исключаем булку)
  const otherIngredients = ingredients.filter(
    (ingredient) => ingredient.item.type !== 'bun'
  );
  const otherIds = otherIngredients.map((ingredient) => ingredient.item._id);

  // Формируем итоговый массив: булка + остальные ингредиенты + булка
  const finalIngredients = [bunId, ...otherIds, bunId];

  return request<OrderResponse>(host + '/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: finalIngredients,
    }),
  });
};
