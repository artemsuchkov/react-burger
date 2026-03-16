import { Preloader, CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { loadIngredients } from '@services/ingredients/actions';

import styles from './app.module.css';

export const App = () => {
  const isLoading = useSelector((store) => store.ingredients.isLoading);
  const error = useSelector((store) => store.ingredients.error);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadIngredients());
  }, []);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <CloseIcon type="error" />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </div>
  );
};
