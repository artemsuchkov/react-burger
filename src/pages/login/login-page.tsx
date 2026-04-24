import { Input as InputF, Button } from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login, type LoginFormData } from '@/services/user/actions.ts';
import { useAppDispatch, useAppSelector } from '@hooks/hook.ts';
import { useFormWithValidation } from '@hooks/use-form-with-validation.ts';

import type { FormEvent, ReactElement } from 'react';

import styles from './login.module.css';

export const LoginPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector((state) => state.user.isLoading);
  const error = useAppSelector((state) => state.user.error);
  const isSuccess = useAppSelector((state) => state.user.forgotPasswordCode);

  const inputRef = useRef<HTMLInputElement>(null);

  const { values, handleChange, errors } = useFormWithValidation({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(login(values as LoginFormData));
  };

  // Фокус на поле ввода при монтировании
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Редирект при успешном входе
  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <form noValidate onSubmit={handleSubmit} className={styles.form}>
          <InputF
            ref={inputRef}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={values.email || ''}
            error={errors.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
          />
          <InputF
            type="password"
            name="password"
            id="password"
            placeholder="Пароль"
            value={values.password || ''}
            error={errors.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
          />

          <Button size="medium" type="primary" htmlType="submit">
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
          {error && <span className="error">{`Ошибка: ${error}`}</span>}
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вы новый пользователь? <Link to="/register">Зарегистрироваться</Link>
        </div>
        <div className="text text_type_main-default text_color_inactive">
          Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
        </div>
      </div>
    </>
  );
};
