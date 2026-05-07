import Cookies from 'js-cookie';
import { useEffect, useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { OrderIngredients } from '@components/order/order-ingredients.tsx';
import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect } from '@services/orders/actions.ts';
import { selectIsConnected, selectUserOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';
import type { Order } from '@services/middleware/middleware.ts';

import styles from './profileorder.module.css';

type TransformedOrder = Omit<Order, 'ingredients'> & {
  ingredients: {
    image_mobile: string;
    price: number;
    name: string;
  }[];
  order_price: number;
};

export const ProfileOrderPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const accessToken: string = Cookies.get('accessToken') || '';
  const token: string = accessToken.replace('Bearer ', '');

  useEffect(() => {
    dispatch(connect(token));
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const userOrders = useAppSelector(selectUserOrders);
  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);

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
    return userOrders.map(mapIngredientsToImages);
  }, [userOrders, burgerIngredients]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.orders_list}>
          <h1>История заказов</h1>
          <div className={styles.orders_list_wrap}>
            {isConnected &&
              orders.length > 0 &&
              orders.map((order: TransformedOrder) => (
                <div className={styles.orderData} key={order._id}>
                  <Link to={`/profile/orders/${order._id}`}>
                    <OrderIngredients orderData={order} />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};
