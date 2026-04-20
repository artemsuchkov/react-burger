import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { logout, updateUserData } from '@/services/user/actions.js';
import { selectIsLoading, selectUser } from '@/services/user/slice.js';
import { AppHeader } from '@components/app-header/app-header.tsx';

import styles from './profilepage.module.css';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const userData = useSelector(selectUser);

  // Рефы для доступа к значениям полей
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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

  const handleLogout = () => {
    dispatch(logout());
  };

  // Проверяем, изменились ли данные
  const checkForChanges = () => {
    const currentName = nameRef.current?.value || '';
    const currentEmail = emailRef.current?.value || '';

    const isNameChanged = currentName !== originalData.name;
    const isEmailChanged = currentEmail !== originalData.email;
    // Пароль считаем изменённым, если поле не пустое
    const isPasswordChanged = passwordRef.current?.value !== '';

    setHasChanges(isNameChanged || isEmailChanged || isPasswordChanged);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
    };
    dispatch(updateUserData(data));
    //setHasChanges(false); // Сбрасываем флаг изменений после сохранения
  };

  // Обработчик отмены — восстанавливаем исходные значения
  const handleCancel = () => {
    if (nameRef.current) nameRef.current.value = originalData.name;
    if (emailRef.current) emailRef.current.value = originalData.email;
    if (passwordRef.current) passwordRef.current.value = '';
    setHasChanges(false);
  };

  return (
    <>
      <AppHeader />
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className="text text_type_main-default">Профиль</div>
          <div className="text text_type_main-default">
            <a className={styles.link} href="/feed">
              История заказов
            </a>
          </div>
          <div className="text text_type_main-default">
            <a className={styles.link} href="#" onClick={handleLogout}>
              {isLoading ? 'Выход...' : 'Выйти'}
            </a>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              ref={nameRef}
              placeholder="Имя"
              size="default"
              type="text"
              defaultValue={userData?.name}
              onChange={checkForChanges}
            />
            <Input
              ref={emailRef}
              placeholder="Эл. адрес"
              size="default"
              type="email"
              defaultValue={userData?.email}
              onChange={checkForChanges}
            />
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
                <Button size="medium" type="secondary" onClick={handleCancel}>
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
