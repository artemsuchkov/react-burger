import { api_url } from '@utils/api_url';

export const getBurgerIngredients = () => {
  return fetch(api_url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  });
};

export const getProjectTasks = () => {
  return fetch(api_url).then(getResponse);
};

const getResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Ошибка ${res.status}`);
};
