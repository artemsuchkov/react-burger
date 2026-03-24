import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { IngredientsDetails } from '@components/burger-ingredients/burger-ingredients-details';
import { Modal } from '@components/modal-window/modal';
import { useMemoizedIngredientCount } from '@hooks/useMemoizedIngredientCount';
import { useModal } from '@hooks/useModal';

import styles from './burger-ingredients-card.module.css';

function BurgerCardIngredients({ data }) {
  const { isModalOpen, openIngredientsModal, closeModal } = useModal(data);

  const item = data;

  const [{ isDrag }, dragRef] = useDrag({
    type: 'BURGER_INGREDIENTS',
    item: { item },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const { ingredientCount } = useMemoizedIngredientCount(data);

  return (
    !isDrag && (
      <>
        <div className={styles.card} onClick={openIngredientsModal} ref={dragRef}>
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
            <IngredientsDetails />
          </Modal>
        )}
      </>
    )
  );
}

export default BurgerCardIngredients;
