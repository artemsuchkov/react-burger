import type { ReactElement } from 'react';

import styles from './order-details.module.css';

type IngredientDetail = {
  image_mobile: string;
  price: number;
  name: string;
};

type OrderIngredientsProps = {
  orderData: {
    number?: number;
    createdAt?: string;
    name?: string;
    ingredients: IngredientDetail[];
    order_price?: number;
  };
};

export const OrderIngredients = ({ orderData }: OrderIngredientsProps): ReactElement => {
  const ingredients = orderData?.ingredients || [];
  const totalPrice = orderData?.order_price || 0;

  return (
    <div className={styles.order}>
      <div className={styles.number}>#{orderData?.number}</div>
      <div className={styles.date}>{orderData?.createdAt}</div>
      <div className={styles.name}>{orderData?.name}</div>
      <div className={styles.ingredients}>
        {ingredients.map((ingredient: IngredientDetail, index: number) => (
          <img
            key={index}
            src={ingredient.image_mobile}
            alt={ingredient.name}
            className={styles.ingredientImage}
            title={`${ingredient.name} - ${ingredient.price} руб.`}
          />
        ))}
      </div>
      <div className={styles.price}>Общая стоимость: {totalPrice} руб.</div>
    </div>
  );
};
