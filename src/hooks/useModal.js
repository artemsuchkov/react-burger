import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getOrderId } from '@services/ingredients/actions';
import { getBurgeringredientModal } from '@services/ingredients/reducers';

// кастомные хуки всегда должны начинаться с глагола `use`, чтобы реакт понял, что это хук. Он следит за их вызовами
export const useModal = (data = []) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);
  //console.log(ingredientBurgers);

  // `useCallback` нужен для того, чтобы зафиксировать ссылку на функцию. Таким образом уменьшится кол-во перерисовок компонента, куда будет передана эта функция
  const openIngredientsModal = useCallback(() => {
    dispatch(getBurgeringredientModal(data));
    //setIsModalOpen(true);
    if (data._id) {
      navigate(`/ingredients/${data._id}`);
    }
  }, [data, dispatch, navigate]);

  const openModal = useCallback(() => {
    dispatch(getOrderId());
    setIsModalOpen(true);
  }, [dispatch]);

  const closeModal = useCallback(() => {
    navigate(`/`);
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openIngredientsModal,
    openModal,
    closeModal,
  };
};
