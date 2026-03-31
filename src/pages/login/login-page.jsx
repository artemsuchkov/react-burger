import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';

export function Input({ inputRef, error = '', value = '', ...props }) {
  return (
    <label>
      <input ref={inputRef} {...props} value={value} />
      <span className="error">{error || ''}</span>
    </label>
  );
}

import { useDispatch, useSelector } from 'react-redux';

import { login } from '@services/user/actions.js';
import { selectError, selectIsLoading } from '@services/user/slice.js';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const inputRef = useRef(null);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(values));
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h3>Вход</h3>
      <Input
        inputRef={inputRef}
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={values.email || ''}
        error={errors.email}
        onChange={handleChange}
        aria-invalid={!!errors.email}
      />
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="Пароль"
        value={values.password || ''}
        error={errors.password}
        onChange={handleChange}
        aria-invalid={!!errors.password}
      />
      <button type="submit" disabled={isLoading || !isValid}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
      {error && <span className="error">{`Ошибка: ${error}`}</span>}
      <span>
        Вы - новый пользователь?
        <Link to={'/register'}>Зарегистрироваться</Link>
      </span>
    </form>
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
