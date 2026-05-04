import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect } from '@services/orders/actions.ts';
//import styles from './feed.module.css';
import { selectIsConnected, selectAllOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

import type { Order } from '@services/middleware/middleware.ts';

export const FeedPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(connect());
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const allOrders = useAppSelector(selectAllOrders);

  const orders = Array.isArray(allOrders?.[0]?.orders) ? allOrders?.[0].orders : [];

  return (
    <>
      {isConnected &&
        orders.length > 0 &&
        orders.map((order: Order) => <div key={order._id}>{order.name}</div>)}
    </>
  );
};
