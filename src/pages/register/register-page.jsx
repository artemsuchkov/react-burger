import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { api } from '@utils/api';

export function Input({ inputRef, error = '', value = '', ...props }) {
  return (
    <label>
      <input ref={inputRef} {...props} value={value} />
      <span className="error">{error || ''}</span>
    </label>
  );
}

export const RegisterPage = () => {
  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    async function register() {
      try {
        setIsLoading(true);
        const response = await api.register(values);
        setResponse(response);
        console.log(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    register();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h3>Регистрация</h3>
      <Input
        inputRef={inputRef}
        type="text"
        name="name"
        id="name"
        placeholder="Имя"
        value={values.name || ''}
        error={errors.name}
        onChange={handleChange}
        aria-invalid={!!errors.email}
      />
      <Input
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
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      {error && <span className="error">{`Ошибка: ${error}`}</span>}
      {response && <span className="success">Вы успешно зарегистрировались!</span>}
      <span>
        Уже есть аккаунт?&nbsp;
        <Link to={'/login'}>Войти</Link>
      </span>
    </form>
  );
};

/* import { Input, Button } from '@krgaa/react-developer-burger-ui-components';

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
}; */
