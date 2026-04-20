import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getBurgeringredientModal } from '@/services/ingredients/slice';
import { selectUser } from '@/services/user/slice.js';
import { getOrderId } from '@services/ingredients/actions';

// кастомные хуки всегда должны начинаться с глагола `use`, чтобы реакт понял, что это хук. Он следит за их вызовами
export const useModal = (data = []) => {
  const user = useSelector(selectUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // `useCallback` нужен для того, чтобы зафиксировать ссылку на функцию. Таким образом уменьшится кол-во перерисовок компонента, куда будет передана эта функция
  const openIngredientsModal = useCallback(() => {
    dispatch(getBurgeringredientModal(data));
    if (data._id) {
      navigate(`/ingredients/${data._id}`);
    }
  }, [data, dispatch, navigate]);

  const openModal = useCallback(() => {
    // Если не авторизован, то отправим на станраницу логина вместо модального окна
    if (!user) {
      navigate(`/login`);
      return false;
    }

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
