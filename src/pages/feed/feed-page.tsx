import { useEffect, useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { OrderIngredients } from '@components/order/order-ingredients.tsx';
import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect } from '@services/orders/actions.ts';
import { selectIsConnected, selectAllOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';
import type { Order } from '@services/middleware/middleware.ts';

import styles from './feed.module.css';

export const FeedPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(connect());
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const allOrders = useAppSelector(selectAllOrders);
  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);

  console.log(burgerIngredients);
  console.log(allOrders);

  const rawOrders = Array.isArray(allOrders?.[0]?.orders) ? allOrders?.[0].orders : [];

  // Функция для преобразования ID ингредиентов в image_mobile
  const mapIngredientsToImages = (order: Order): Order => {
    if (!burgerIngredients || burgerIngredients.length === 0) return order;

    const ingredientImages = order.ingredients
      .map((id: string) => {
        const ingredient = burgerIngredients.find((ing: Ingredient) => ing._id === id);
        return ingredient ? ingredient.image_mobile : '';
      })
      .filter((url) => url !== ''); // убираем пустые, если ингредиент не найден

    return {
      ...order,
      ingredients: ingredientImages, // заменяем массив ID на массив URL
    };
  };

  // Преобразуем заказы
  const orders = useMemo(() => {
    const mapped = rawOrders.map(mapIngredientsToImages);
    console.log('Преобразованные заказы:', mapped);
    return mapped;
  }, [rawOrders, burgerIngredients]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.orders_list}>
          <h1>Лента заказов</h1>
          {isConnected &&
            orders.length > 0 &&
            orders.map((order: Order) => (
              <div className={styles.orderData} key={order._id}>
                <Link to={`${order._id}`}>
                  <OrderIngredients orderData={order} />
                </Link>
              </div>
            ))}
        </div>
        <div className={styles.orders_info}></div>
      </div>
      <Outlet />
    </>
  );
};
