import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { checkUserAuth } from '@/services/user/actions';
import { ProtectedRoute } from '@components/routing/protected-route.tsx';
import {
  HomePage,
  NotFoundPage,
  IngredientsDetails,
  RegisterPage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  ProfileOrderPage,
  FeedPage,
} from '@pages/index.ts';

import type { ReactElement } from 'react';

import type { AppDispatch } from '@/services/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        path: 'ingredients/:id',
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

export const App = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
