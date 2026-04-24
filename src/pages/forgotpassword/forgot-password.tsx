import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
  type ReactElement,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword, type ForgotPasswordFormData } from '@/services/user/actions.ts';
import { useAppDispatch, useAppSelector } from '@hooks/hook.ts';

import styles from './forgotpassword.module.css';

export const ForgotPasswordPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const isLoading = useAppSelector((state) => state.user.isLoading);
  const error = useAppSelector((state) => state.user.error);
  const isSuccess = useAppSelector((state) => state.user.forgotPasswordCode);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: ForgotPasswordFormData = {
      email,
    };
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
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            placeholder="Эл. адрес"
            size="default"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <div>
            <Button size="medium" type="primary" htmlType="submit" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </form>
        {error && (
          <div className="error text text_type_main-default">Ошибка: {error}</div>
        )}
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </div>
      </div>
    </>
  );
};
