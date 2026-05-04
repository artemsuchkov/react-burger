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
    dispatch(connect());
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const allOrders = useAppSelector(selectAllOrders);
  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);

  console.log(burgerIngredients);
  console.log(allOrders);

  const rawOrders = Array.isArray(allOrders?.[0]?.orders) ? allOrders?.[0].orders : [];

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
    const ingredientDetails = order.ingredients
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
      ingredients: ingredientDetails, // заменяем массив ID на массив объектов
      order_price: totalPrice,
    };
  };

  // Преобразуем заказы
  const orders: TransformedOrder[] = useMemo(() => {
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
            orders.map((order: TransformedOrder) => (
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
