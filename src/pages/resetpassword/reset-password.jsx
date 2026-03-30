import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';

import styles from './resetpassword.module.css';

export const ResetPasswordPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form className={styles.form}>
          <Input
            icon="ShowIcon"
            placeholder="Введите новый пароль"
            size="default"
            type="password"
          />
          <Input placeholder="Введите код из письма" size="default" type="number" />
          <div>
            <Button size="medium" type="primary">
              Сохранить
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
