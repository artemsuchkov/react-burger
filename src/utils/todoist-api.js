import { api_url } from '@utils/api_url';

export const getIngredientsTasks = () => {
  return fetch(api_url).then(getResponse);
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

  return fetch('https://new-stellarburgers.education-services.ru/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: finalIngredients,
    }),
  }).then(getResponse);
};

const getResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};
