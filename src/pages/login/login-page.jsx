import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';

import styles from './login.module.css';

export const LoginPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <form className={styles.form}>
          <Input placeholder="Эл. адрес" size="default" type="email" />
          <Input icon="ShowIcon" placeholder="Пароль" size="default" type="password" />
          <div>
            <Button size="medium" type="primary">
              Войти
            </Button>
          </div>
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вы новый пользователь? <a href="/register">Зарегистрироваться</a>
        </div>
        <div className="text text_type_main-default text_color_inactive">
          Забыли пароль? <a href="/forgot-password">Восстановить пароль</a>
        </div>
      </div>
    </>
  );
};
