import { Input as InputF, Button } from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { login, type LoginFormData } from '@/services/user/actions.ts';
//import { selectError, selectIsLoading, selectUser } from '@/services/user/slice.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';
import { useFormWithValidation } from '@hooks/use-form-with-validation.ts';

import type { FormEvent, ReactElement } from 'react';

import type { AppDispatch, RootState } from '@/services/store.ts';

import styles from './login.module.css';

export const LoginPage = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Инициализация навигации

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);
  const isSuccess = useSelector((state: RootState) => state.user.forgotPasswordCode);

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
      <AppHeader />
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
