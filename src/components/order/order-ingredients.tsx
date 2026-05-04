import type { ReactElement } from 'react';

import styles from './order-details.module.css';

type OrderIngredientsProps = {
  orderData: {
    number?: number;
    createdAt?: string;
    name?: string;
    ingredients: string[];
  };
};

export const OrderIngredients = ({ orderData }: OrderIngredientsProps): ReactElement => {
  const ingredients = orderData?.ingredients || [];

  return (
    <>
      <div className={styles.number}>{orderData?.number}</div>
      <div className={styles.date}>{orderData?.createdAt}</div>
      <div className={styles.name}>{orderData?.name}</div>
      <div className={styles.ingredients}>
        {ingredients.map((src: string, index: number) => (
          <img
            key={index}
            src={src}
            alt={`Ingredient ${index + 1}`}
            className={styles.ingredientImage}
          />
        ))}
      </div>
    </>
  );
};
