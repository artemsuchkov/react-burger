import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@/services/user/slice.ts';
import { useAppSelector } from '@hooks/hook.ts';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  element,
}: ProtectedRouteProps): ReactElement | null => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};
