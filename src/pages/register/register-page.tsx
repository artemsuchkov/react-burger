import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, type AuthResponse, type RegisterFormData } from '@/utils/api-user.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';
import { useFormWithValidation } from '@hooks/use-form-with-validation.ts';

import type { ReactElement } from 'react';

import styles from './register.module.css';

export const RegisterPage = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AuthResponse | null>(null);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    async function register(): Promise<void> {
      try {
        setIsLoading(true);
        const response = await api.register(values as RegisterFormData);
        setResponse(response);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    register();
  };

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <form noValidate onSubmit={handleSubmit} className={styles.form}>
          <Input
            ref={inputRef}
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
          <Button
            size="medium"
            type="primary"
            htmlType="submit"
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
          {error && (
            <span className="text text_type_main-small">{`Ошибка: ${error}`}</span>
          )}
          {response && <span className="success">Вы успешно зарегистрировались!</span>}
        </form>
        <div className="mt-10 text text_type_main-default text_color_inactive">
          Вы уже зарегистрированы? <Link to="/login">Войти</Link>
        </div>
      </div>
    </>
  );
};
