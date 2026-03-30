import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';

import styles from './register.module.css';

export const RegisterPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <form className={styles.form}>
          <Input placeholder="Имя" size="default" type="text" />
          <Input placeholder="Эл. адрес" size="default" type="email" />
          <Input icon="ShowIcon" placeholder="Пароль" size="default" type="password" />
          <div>
            <Button size="medium" type="primary">
              Зарегистрироваться
            </Button>
          </div>
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вы уже зарегистрированы? <a href="/login">Войти</a>
        </div>
      </div>
    </>
  );
};
