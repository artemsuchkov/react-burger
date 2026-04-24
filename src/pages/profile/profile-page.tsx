import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';

import {
  logout,
  updateUserData,
  type UpdateUserFormData,
} from '@/services/user/actions';
//import { selectIsLoading, selectUser } from '@/services/user/slice';

import type { FormEvent, ReactElement } from 'react';

import type { AppDispatch, RootState } from '@/services/store.ts';

import styles from './profilepage.module.css';

export const ProfilePage = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const userData = useSelector((state: RootState) => state.user.user);

  // Рефы для доступа к значениям полей
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Состояние для отслеживания изменений
  const [hasChanges, setHasChanges] = useState(false);
  // Храним исходные данные для возможности отмены
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
  });

  // Сохраняем исходные данные при загрузке компонента
  useEffect(() => {
    if (userData) {
      setOriginalData({
        name: userData.name || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  const handleLogout = (): void => {
    dispatch(logout());
  };

  // Проверяем, изменились ли данные
  const checkForChanges = (): void => {
    const currentName = nameRef.current?.value || '';
    const currentEmail = emailRef.current?.value || '';

    const isNameChanged = currentName !== originalData.name;
    const isEmailChanged = currentEmail !== originalData.email;
    // Пароль считаем изменённым, если поле не пустое
    const isPasswordChanged = passwordRef.current?.value !== '';

    setHasChanges(isNameChanged || isEmailChanged || isPasswordChanged);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: UpdateUserFormData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
    };
    dispatch(updateUserData(data));
    //setHasChanges(false); // Сбрасываем флаг изменений после сохранения
  };

  // Обработчик отмены — восстанавливаем исходные значения
  const handleCancel = (): void => {
    if (nameRef.current) nameRef.current.value = originalData.name;
    if (emailRef.current) emailRef.current.value = originalData.email;
    if (passwordRef.current) passwordRef.current.value = '';
    setHasChanges(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className="text text_type_main-default">Профиль</div>
          <div className="text text_type_main-default">
            <Link className={styles.link} to="/feed">
              История заказов
            </Link>
          </div>
          <div className="text text_type_main-default">
            <button type="button" className={styles.link} onClick={handleLogout}>
              {isLoading ? 'Выход...' : 'Выйти'}
            </button>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* @ts-expect-error - defaultValue используется вместо value */}
            <Input
              ref={nameRef}
              placeholder="Имя"
              size="default"
              type="text"
              defaultValue={userData?.name}
              onChange={checkForChanges}
            />
            {/* @ts-expect-error - defaultValue используется вместо value */}
            <Input
              ref={emailRef}
              placeholder="Эл. адрес"
              size="default"
              type="email"
              defaultValue={userData?.email}
              onChange={checkForChanges}
            />
            {/* @ts-expect-error - defaultValue используется вместо value */}
            <Input
              ref={passwordRef}
              icon="ShowIcon"
              placeholder="Пароль"
              size="default"
              type="password"
              defaultValue=""
              onChange={checkForChanges}
            />
            {/* Показываем кнопки только при наличии изменений */}
            {hasChanges && (
              <div>
                <Button size="medium" type="primary" htmlType="submit">
                  {isLoading ? 'Сохраняем...' : 'Сохранить'}
                </Button>
                <Button
                  size="medium"
                  type="secondary"
                  htmlType="button"
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
              </div>
            )}
          </form>
        </div>
        <div>
          <div className="text text_type_main-default text_color_inactive">
            В этом разделе вы можете изменить свои персональные данные
          </div>
        </div>
        <div></div>
      </div>
      <Outlet />
    </>
  );
};
