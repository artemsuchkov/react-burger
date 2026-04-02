import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { logout } from '@services/user/actions.js';
import { selectIsLoading } from '@services/user/slice.js';

import styles from './profilepage.module.css';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className="text text_type_main-default">Профиль</div>
          <div className="text text_type_main-default">
            <a className={styles.link} href="/feed">
              История заказов
            </a>
          </div>
          <div className="text text_type_main-default">
            <a className={styles.link} href="#" onClick={handleLogout}>
              {isLoading ? 'Выход...' : 'Выйти'}
            </a>
          </div>
        </div>
        <div>
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
        </div>
        <div>
          <div className="text text_type_main-default text_color_inactive">
            В этом разделе вы можете изменить свои персональные данные
          </div>
        </div>
        <div></div>
      </div>
      <Outlet />
    </>
  );
};
