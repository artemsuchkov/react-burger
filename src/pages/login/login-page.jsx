import { AppHeader } from '@components/app-header/app-header';

import styles from './login.module.css';

export const LoginPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>Login</div>
    </>
  );
};
