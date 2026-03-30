import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  HomePage,
  NotFoundPage,
  Ingredients,
  IngredientsDetails,
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
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
