import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
//import styles from './feed.module.css';
import { selectIsConnected, selectAllOrders } from '@services/orders/slice.ts';
import { connect } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

export const FeedPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(connect());
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const allOrders = useAppSelector(selectAllOrders);

  const orders = Array.isArray(allOrders?.[0]?.orders) ? allOrders?.[0].orders : [];

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
