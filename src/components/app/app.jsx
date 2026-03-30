import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: 'ingredients/',
    Component: Ingredients,
    children: [
      {
        path: ':id',
        element: <IngredientsDetails />,
      },
    ],
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
    children: [
      {
        path: 'orders',
        element: <ProfileOrderPage />,
      },
    ],
  },
  {
    path: '/feed',
    Component: FeedPage,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
