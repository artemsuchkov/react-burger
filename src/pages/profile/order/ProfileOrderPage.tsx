import Cookies from 'js-cookie';
import { useEffect, useMemo } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { logout } from '@/services/user/actions';
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

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const isLoading = useAppSelector((state) => state.user.isLoading);

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

  // Преобразуем заказы и сортируем от самых новых к самым старым
  const orders: TransformedOrder[] = useMemo(() => {
    const transformed = userOrders.map(mapIngredientsToImages);
    // Сортировка по createdAt в обратном порядке (самые новые первыми)
    return transformed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [userOrders, burgerIngredients]);

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className="text text_type_main-default">
          <NavLink className={styles.link} to="/profile">
            Профиль
          </NavLink>
        </div>
        <div className="text text_type_main-default">
          <NavLink className={styles.link} to="orders">
            История заказов
          </NavLink>
        </div>
        <div className="text text_type_main-default">
          <Link className={styles.link} to="#" onClick={handleLogout}>
            {isLoading ? 'Выход...' : 'Выйти'}
          </Link>
        </div>
        <div className="text text_type_main-default text_color_inactive">
          В этом разделе вы можете изменить свои персональные данные
        </div>
      </div>
      <div>
        <div className={styles.orders_list}>
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
        <Outlet />
      </div>
    </div>
  );
};
