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

const formatDate = (isoString: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date >= today && date < new Date(today.getTime() + 86400000);
  const isYesterday = date >= yesterday && date < today;

  // Форматируем время в формате ЧЧ:MM с ведущим нулём
  const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });

  const timeStr = timeFormatter.format(date);

  if (isToday) {
    return `Сегодня в ${timeStr} i-gmt+3`;
  } else if (isYesterday) {
    return `Вчера в ${timeStr} i-gmt+3`;
  } else {
    // Для других дней выводим дату в формате ДД.ММ.ГГГГ
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Moscow',
    });
    const dateStr = dateFormatter.format(date);
    return `${dateStr} в ${timeStr} i-gmt+3`;
  }
};

export const OrderIngredients = ({ orderData }: OrderIngredientsProps): ReactElement => {
  const ingredients = orderData?.ingredients || [];
  const totalPrice = orderData?.order_price || 0;
  const formattedDate = orderData?.createdAt ? formatDate(orderData.createdAt) : '';

  return (
    <div className={styles.order}>
      <div className={styles.number}>#{orderData?.number}</div>
      <div className={styles.date}>{formattedDate}</div>
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
