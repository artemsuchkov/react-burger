import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ProtectedRoute } from '@components/routing/protected-route.jsx';
import {
  HomePage,
  NotFoundPage,
  Ingredients,
  IngredientsDetails,
  RegisterPage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  ProfileOrderPage,
  FeedPage,
} from '@pages/index.js';
import { checkUserAuth } from '@services/user/actions.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'ingredients/',
    element: <Ingredients />,
    children: [
      {
        path: ':id',
        element: <IngredientsDetails />,
      },
    ],
  },
  {
    path: '/register',
    element: <ProtectedRoute onlyUnAuth element={<RegisterPage />} />,
  },
  {
    path: '/login',
    element: <ProtectedRoute onlyUnAuth element={<LoginPage />} />,
  },
  {
    path: '/forgot-password',
    element: <ProtectedRoute onlyUnAuth element={<ForgotPasswordPage />} />,
  },
  {
    path: '/reset-password',
    element: <ProtectedRoute onlyUnAuth element={<ResetPasswordPage />} />,
  },
  {
    path: '/profile',
    element: <ProtectedRoute element={<ProfilePage />} />,
    children: [
      {
        path: 'orders',
        element: <ProtectedRoute element={<ProfileOrderPage />} />,
      },
    ],
  },
  {
    path: '/feed',
    element: <FeedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
