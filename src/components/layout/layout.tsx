import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import type { ReactElement } from 'react';

export const Layout = (): ReactElement => {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};
