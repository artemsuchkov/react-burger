import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import styles from './profilepage.module.css';

export const ProfilePage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>ProfilePage</div>
      <Outlet />
    </>
  );
};
