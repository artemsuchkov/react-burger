import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getOrderId } from '@/services/ingredients/actions';
import { getBurgeringredientModal } from '@/services/ingredients/slice.ts';
import { selectUser } from '@/services/user/slice.ts';
import { useAppDispatch, useAppSelector } from '@hooks/hook.ts';

import type { Ingredient } from '@/types/ingredients';

type UseModalReturn = {
  isModalOpen: boolean;
  openIngredientsModal: () => void;
  openModal: () => void;
  closeModal: () => void;
};

// кастомные хуки всегда должны начинаться с глагола `use`, чтобы реакт понял, что это хук. Он следит за их вызовами
export const useModal = (data: Ingredient | Ingredient[] = []): UseModalReturn => {
  const user = useAppSelector(selectUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // `useCallback` нужен для того, чтобы зафиксировать ссылку на функцию. Таким образом уменьшится кол-во перерисовок компонента, куда будет передана эта функция
  const openIngredientsModal = useCallback((): void => {
    dispatch(getBurgeringredientModal(Array.isArray(data) ? data : [data]));
    if (!Array.isArray(data) && data._id) {
      navigate(`/ingredients/${data._id}`);
    }
  }, [data, dispatch, navigate]);

  const openModal = useCallback((): void => {
    // Если не авторизован, то отправим на станраницу логина вместо модального окна
    if (!user) {
      navigate(`/login`);
      return;
    }

    dispatch(getOrderId());
    setIsModalOpen(true);
  }, [dispatch, navigate, user]);

  const closeModal = useCallback((): void => {
    navigate(`/`);
    setIsModalOpen(false);
  }, [navigate]);

  return {
    isModalOpen,
    openIngredientsModal,
    openModal,
    closeModal,
  };
};
