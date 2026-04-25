import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import type { ReactElement } from 'react';

import styles from './app-header.module.css';

export const AppHeader = (): ReactElement => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type="primary" />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type="secondary" />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon type="secondary" />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};
