// Общие типы для ингредиентов и заказов

export type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type BurgerIngredient = {
  item: Ingredient;
  id: string;
};

export type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

export type OrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};
