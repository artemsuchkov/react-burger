import { AppHeader } from '@components/app-header/app-header';

import styles from './register.module.css';

export const RegisterPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>Register</div>
    </>
  );
};
