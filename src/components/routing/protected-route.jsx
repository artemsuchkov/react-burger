import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/user/slice.js';

export const ProtectedRoute = ({ onlyUnAuth = false, element }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    return <Navigate to="/" />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" />;
  }

  return element;
};
