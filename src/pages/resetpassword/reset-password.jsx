import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { resetPassword } from '@services/user/actions.js';
import { selectResetPassword, resetResetPasswordState } from '@services/user/slice.js';

import styles from './resetpassword.module.css';

export const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const newPassRef = useRef(null);
  const tokenRef = useRef(null);

  const isSuccess = useSelector(selectResetPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      password: newPassRef.current?.value || '',
      token: tokenRef.current?.value || '',
    };
    dispatch(resetPassword(data));
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetResetPasswordState()); // действие для сброса состояния
      navigate('/login');
      console.log('Пароль успешно изменен');
    }
  }, [isSuccess]);

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            ref={newPassRef}
            icon="ShowIcon"
            placeholder="Введите новый пароль"
            size="default"
            type="password"
          />
          <Input
            ref={tokenRef}
            placeholder="Введите код из письма"
            size="default"
            type="text"
          />
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
