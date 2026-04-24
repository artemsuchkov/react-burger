import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { IngredientsDetails } from '@components/burger-ingredients/burger-ingredients-details.tsx';
import { Modal } from '@components/modal-window/modal';
import { useMemoizedIngredientCount } from '@hooks/useMemoizedIngredientCount.ts';

import { useModal } from '../../hooks/useModal';

import type { ReactElement, Ref } from 'react';

import type { Ingredient } from '../../types/ingredients';

import styles from './burger-ingredients-card.module.css';

type BurgerCardIngredientsProps = {
  data: Ingredient;
};

type DragItem = {
  item: Ingredient;
};

type DragResult = {
  isDrag: boolean;
};

function BurgerCardIngredients({
  data,
}: BurgerCardIngredientsProps): ReactElement | null {
  const { isModalOpen, openIngredientsModal, closeModal } = useModal(data);

  const item = data;

  const [{ isDrag }, dragRef] = useDrag<DragItem, unknown, DragResult>({
    type: 'BURGER_INGREDIENTS',
    item: { item },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const { ingredientCount } = useMemoizedIngredientCount(data);

  if (isDrag) {
    return null;
  }

  return (
    <>
      <div
        className={styles.card}
        onClick={openIngredientsModal}
        ref={dragRef as unknown as Ref<HTMLDivElement>}
      >
        <div>
          {ingredientCount && <Counter count={ingredientCount} size="default" />}
        </div>
        <img src={data.image} alt={data.name} />
        <div className={styles.card_price}>
          <CurrencyIcon type="primary" /> {data.price}
        </div>
        <div className={styles.card_name}>{data.name}</div>
      </div>

      {isModalOpen && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientsDetails data={data} />
        </Modal>
      )}
    </>
  );
}

export default BurgerCardIngredients;
