import { Preloader, CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { ReactElement } from 'react';

import type { RootState } from '@/services/store';

import styles from './home.module.css';

export const HomePage = (): ReactElement => {
  const isLoading = useSelector((store: RootState) => store.ingredients.isLoading);
  const error = useSelector((store: RootState) => store.ingredients.error);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <CloseIcon type="error" />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients />
          <BurgerConstructor />
        </DndProvider>
      </main>
      <Outlet />
    </div>
  );
};
