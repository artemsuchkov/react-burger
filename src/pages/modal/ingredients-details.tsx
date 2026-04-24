import { Preloader, CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { loadIngredients } from '@/services/ingredients/actions';
import { IngredientsDetails as IngredientsDetailsComponent } from '@components/burger-ingredients/burger-ingredients-details';

import { ModalOverlay } from './modal-overlay.tsx';

import type { ReactElement } from 'react';

import type { RootState, AppDispatch } from '@/services/store';
import type { Ingredient } from '@/types/ingredients';

import styles from './modal.module.css';

export const IngredientsDetails = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  // Селекторы для данных и состояния загрузки
  const ingredientModal = useSelector(
    (store: RootState) => store.ingredients.ingredients
  );
  const isLoading = useSelector((store: RootState) => store.ingredients.isLoading); // флаг загрузки
  const error = useSelector((store: RootState) => store.ingredients.error); // ошибка загрузки

  // Состояние для текущего ингредиента
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(null);

  // Извлекаем ID из пути
  const getIngredientIdFromPath = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  // Эффект для загрузки данных и поиска ингредиента
  useEffect(() => {
    const ingredientId = getIngredientIdFromPath();

    // Если данных нет и загрузка не идёт — запускаем загрузку
    if (ingredientModal.length === 0 && !isLoading) {
      dispatch(loadIngredients());
      return;
    }

    // Когда данные загружены, ищем нужный ингредиент
    if (ingredientModal.length > 0) {
      const ingredient = ingredientModal.find((item) => item._id === ingredientId);
      if (ingredient) {
        setCurrentIngredient(ingredient);
      } else {
        setCurrentIngredient(null);
      }
    }
  }, [ingredientModal, isLoading, location.pathname, dispatch]);

  const onClose = (): void => {
    navigate('/');
  };

  // Показываем состояние загрузки
  if (isLoading && ingredientModal.length === 0) {
    return <Preloader />;
  }

  // Показываем ошибку, если она есть
  if (error) {
    return <CloseIcon type="error" />;
  }

  return (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={`text text_type_main-medium`}>Детали ингредиента</h2>
            <CloseIcon type="primary" onClick={onClose} />
          </div>
          <div className={styles.body}>
            {currentIngredient ? (
              <IngredientsDetailsComponent data={currentIngredient} />
            ) : (
              <p>Ингредиент не найден</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
