import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@hooks/hook.ts';
import { connect } from '@services/orders/actions.ts';
import { selectIsConnected, selectUserOrders } from '@services/orders/slice.ts';

import type { ReactElement } from 'react';

import type { Order } from '@services/middleware/middleware.ts';

//import styles from './profileorder.module.css';

export const ProfileOrderPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const accessToken: string = Cookies.get('accessToken') || '';
  const token: string = accessToken.replace('Bearer ', '');

  useEffect(() => {
    dispatch(connect(token));
  }, [dispatch]);

  const isConnected = useAppSelector(selectIsConnected);
  const userOrders = useAppSelector(selectUserOrders);

  return (
    <>
      <div>
        {isConnected &&
          userOrders.length > 0 &&
          userOrders.map((order: Order) => (
            <div key={order._id}>
              <Link to={`/profile/orders/${order._id}`}>{order.name}</Link>
            </div>
          ))}
      </div>
      <Outlet />
    </>
  );
};
