import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';

import styles from './forgotpassword.module.css';

export const ForgotPasswordPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form className={styles.form}>
          <Input placeholder="Эл. адрес" size="default" type="email" />
          <div>
            <Button size="medium" type="primary">
              Войти
            </Button>
          </div>
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вспомнили пароль? <a href="/login">Войти</a>
        </div>
      </div>
    </>
  );
};
