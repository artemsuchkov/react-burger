import { Preloader, CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { getBurgerIngredients } from '@utils/todoist-api';

import { LOAD_INGREDIENTS } from '../../services/ingredients/actions.js';

import styles from './app.module.css';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    // Вызываем диспатчер с командой загрузить данные LOAD_TASK_SUCCESS
    getBurgerIngredients()
      .then((data) => {
        dispatch({
          type: LOAD_INGREDIENTS,
          payload: data.data,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (loading) {
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
        <CloseIcon type="error" /> Ошибка
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
