import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect } from '@services/orders/actions.ts';
import { selectIsConnected, selectAllOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

//import styles from './profileorder.module.css';

export const ProfileOrderPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const accessToken: string = Cookies.get('accessToken') || '';
  const token: string = accessToken.replace('Bearer ', '');

  useEffect(() => {
    dispatch(connect(token));
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const messages = useAppSelector(selectAllOrders);

  const firstMessage = messages?.[0];
  const orders = Array.isArray(firstMessage?.orders) ? firstMessage.orders : [];

  type Order = {
    _id?: string;
    ingredients?: string[];
    status?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    number?: number;
  };
  return (
    <>
      {isConnected &&
        orders.length > 0 &&
        orders.map((order: Order) => <div key={order._id}>{order.name}</div>)}
    </>
  );
};
