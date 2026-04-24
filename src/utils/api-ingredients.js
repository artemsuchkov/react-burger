import { host } from '@utils/constants.ts';

const getResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};

const request = (url, options = {}) => {
  return fetch(url, options).then(getResponse);
};

export const getIngredientsTasks = () => {
  return request(host + '/api/ingredients');
};

export const getOrderIdTasks = (ingredients) => {
  //console.log(ingredients);

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

  return request(host + '/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: finalIngredients,
    }),
  });
};
