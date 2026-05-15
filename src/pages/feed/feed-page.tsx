import { useEffect, useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { OrderIngredients } from '@components/order/order-ingredients.tsx';
import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect, disconnect } from '@services/orders/actions.ts';
import { selectIsConnected, selectAllOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';
import type { Order } from '@services/middleware/socketMiddleware.ts';

import styles from './feed.module.css';

type TransformedOrder = Omit<Order, 'ingredients'> & {
  ingredients: {
    image_mobile: string;
    price: number;
    name: string;
  }[];
  order_price: number;
};

export const FeedPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(connect()); // Без токена для публичных заказов

    return (): void => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const allOrders = useAppSelector(selectAllOrders);
  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);

  const latestOrders = allOrders?.length > 0 ? allOrders[allOrders.length - 1] : null;
  const rawOrders = Array.isArray(latestOrders?.orders) ? latestOrders.orders : [];
  const total = latestOrders?.total ?? 0;
  const totalToday = latestOrders?.totalToday ?? 0;

  // Функция для преобразования ID ингредиентов в объекты с image_mobile и price
  const mapIngredientsToImages = (order: Order): TransformedOrder => {
    if (!burgerIngredients || burgerIngredients.length === 0) {
      return {
        ...order,
        ingredients: [],
        order_price: 0,
      };
    }

    let totalPrice = 0;
    // Пропускаем последний элемент, так как он дублируется
    const ingredientsToProcess = order.ingredients.slice(0, -1);
    const ingredientDetails = ingredientsToProcess
      .map((id: string) => {
        const ingredient = burgerIngredients.find((ing: Ingredient) => ing._id === id);
        if (ingredient) {
          totalPrice += ingredient.price;
          return {
            image_mobile: ingredient.image_mobile,
            price: ingredient.price,
            name: ingredient.name,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as {
      image_mobile: string;
      price: number;
      name: string;
    }[];

    return {
      ...order,
      ingredients: ingredientDetails, // заменяем массив ID на массив объектов (без последнего дубликата)
      order_price: totalPrice,
    };
  };

  // Преобразуем заказы
  const orders: TransformedOrder[] = useMemo(() => {
    return rawOrders.map(mapIngredientsToImages);
  }, [rawOrders, burgerIngredients]);

  // Данные для блоков "Готовы" и "В работе"
  // Автоматически обновляются при получении новых данных от WebSocket
  const readyOrders = useMemo(() => {
    const doneOrders = rawOrders.filter((order) => order.status === 'done');
    // Сортируем по номеру по убыванию (последние первыми) - создаем копию для иммутабельности
    const sorted = [...doneOrders].sort((a, b) => b.number - a.number);
    // Берем первые 10
    return sorted.slice(0, 10).map((order) => order.number);
  }, [rawOrders]);

  const pendingOrders = useMemo(() => {
    const pending = rawOrders.filter(
      (order) => order.status === 'pending' || order.status === 'created'
    );
    // Сортируем по номеру по убыванию (последние первыми) - создаем копию для иммутабельности
    const sorted = [...pending].sort((a, b) => b.number - a.number);
    // Берем первые 10
    return sorted.slice(0, 10).map((order) => order.number);
  }, [rawOrders]);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.orders_list} custom-scroll`}>
          <h1 className={`text text_type_main-large mt-10 mb-5`}>Лента заказов</h1>
          <div className={`${styles.orders_list_wrap} `}>
            {isConnected &&
              orders.length > 0 &&
              orders.map((order: TransformedOrder) => (
                <div className={styles.orderData} key={order._id}>
                  <Link to={`${order._id}`}>
                    <OrderIngredients orderData={order} />
                  </Link>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.orders_info}>
          <div className={styles.orders_status}>
            <div className={styles.ready}>
              <h3 className={styles.status_title}>Готовы:</h3>
              <div className={styles.numbers_list}>
                {readyOrders.map((number) => (
                  <span key={number} className={styles.number_ready}>
                    {number}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.in_progress}>
              <h3 className={styles.status_title}>В работе:</h3>
              <div className={styles.numbers_list}>
                {pendingOrders.map((number) => (
                  <span key={number} className={styles.number_pending}>
                    {number}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.total_all}>
            <h3 className={styles.total_title}>Выполнено за все время:</h3>
            <p className={styles.total_number}>{total}</p>
          </div>
          <div className={styles.total_today}>
            <h3 className={styles.total_title}>Выполнено за сегодня:</h3>
            <p className={styles.total_number}>{totalToday}</p>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};
