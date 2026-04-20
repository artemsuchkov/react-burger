import { Input as InputF, Button } from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '@/services/user/actions.js';
import { selectError, selectIsLoading, selectUser } from '@/services/user/slice.js';
import { AppHeader } from '@components/app-header/app-header.tsx';
import { useFormWithValidation } from '@hooks/use-form-with-validation';

import styles from './login.module.css';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Инициализация навигации
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isSuccess = useSelector(selectUser); // Статус успеха

  const inputRef = useRef(null);

  const { values, handleChange, errors } = useFormWithValidation({
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(values));
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

          <Button size="medium" type="primary">
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

/* import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

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
}; */
