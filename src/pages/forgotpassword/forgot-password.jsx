import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { forgotPassword } from '@/services/user/actions.js';
import {
  selectError,
  selectIsLoading,
  selectForgotPassword,
} from '@/services/user/slice.js';
import { AppHeader } from '@components/app-header/app-header';

import styles from './forgotpassword.module.css';

export const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isSuccess = useSelector(selectForgotPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { email: emailRef.current?.value || '' };
    dispatch(forgotPassword(data));
  };

  useEffect(() => {
    if (isSuccess) {
      //dispatch(resetForgotPasswordState()); // действие для сброса состояния
      navigate('/reset-password');
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input ref={emailRef} placeholder="Эл. адрес" size="default" type="email" />
          <div>
            <Button size="medium" type="primary" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </form>
        {error && (
          <div className="error text text_type_main-default">Ошибка: {error}</div>
        )}
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вспомнили пароль? <a href="/login">Войти</a>
        </div>
      </div>
    </>
  );
};
