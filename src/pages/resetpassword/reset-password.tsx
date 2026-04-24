import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useEffect, type FormEvent, type ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { resetPassword, type ResetPasswordFormData } from '@/services/user/actions.ts';
import {
  resetForgotPasswordState,
  resetResetPasswordState,
} from '@/services/user/slice.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';

import type { AppDispatch, RootState } from '@/services/store.ts';

import styles from './resetpassword.module.css';

export const ResetPasswordPage = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const newPassRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);

  const isSuccess = useSelector((state: RootState) => state.user.resetPasswordCode);
  const isForgotPassword = useSelector(
    (state: RootState) => state.user.forgotPasswordCode
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: ResetPasswordFormData = {
      password: newPassRef.current?.value || '',
      token: tokenRef.current?.value || '',
    };
    dispatch(resetPassword(data));
  };

  // Пустая функция для onChange

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetResetPasswordState()); // действие для сброса состояния
      dispatch(resetForgotPasswordState()); // действие для сброса состояния
      navigate('/login');
    }
    if (!isForgotPassword) {
      navigate('/forgot-password');
    }
  }, [isSuccess, isForgotPassword, dispatch, navigate]);

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* @ts-expect-error - defaultValue используется вместо value */}
          <Input
            ref={newPassRef}
            icon="ShowIcon"
            placeholder="Введите новый пароль"
            size="default"
            type="password"
            defaultValue=""
            name="password"
          />
          {/* @ts-expect-error - defaultValue используется вместо value */}
          <Input
            ref={tokenRef}
            placeholder="Введите код из письма"
            size="default"
            type="text"
            defaultValue=""
            name="token"
          />
          <div>
            <Button size="medium" type="primary" htmlType="submit">
              Сохранить
            </Button>
          </div>
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </div>
      </div>
    </>
  );
};
