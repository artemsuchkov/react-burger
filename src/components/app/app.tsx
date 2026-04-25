import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { loadIngredients } from '@/services/ingredients/actions';
import { checkUserAuth } from '@/services/user/actions';
import { Layout } from '@components/layout/layout.tsx';
import { ProtectedRoute } from '@components/routing/protected-route.tsx';
import { useAppDispatch } from '@hooks/hook.ts';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            path: 'ingredients/:id',
            element: <IngredientsDetails />,
          },
        ],
      },
      {
        path: 'register',
        element: <ProtectedRoute onlyUnAuth element={<RegisterPage />} />,
      },
      {
        path: 'login',
        element: <ProtectedRoute onlyUnAuth element={<LoginPage />} />,
      },
      {
        path: 'forgot-password',
        element: <ProtectedRoute onlyUnAuth element={<ForgotPasswordPage />} />,
      },
      {
        path: 'reset-password',
        element: <ProtectedRoute onlyUnAuth element={<ResetPasswordPage />} />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute element={<ProfilePage />} />,
        children: [
          {
            path: 'orders',
            element: <ProtectedRoute element={<ProfileOrderPage />} />,
          },
        ],
      },
      {
        path: 'feed',
        element: <FeedPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const App = (): ReactElement => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(loadIngredients());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
