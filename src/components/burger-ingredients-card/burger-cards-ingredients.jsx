import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { IngredientsDetails } from '@components/burger-ingredients/burger-ingredients-details';
import { Modal } from '@components/modal-window/modal';
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

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  const countIngredientNumInConstructor = (ingredient) => {
    // Если это булочка
    if (ingredient.type === 'bun') {
      // Проверяем, есть ли булочка с таким _id в ingredientBurgers
      const hasBun = ingredientBurgers.some(
        (burgerItem) => burgerItem.item._id === ingredient._id
      );
      return hasBun ? 2 : 0;
    }

    // Для всех остальных типов — считаем количество вхождений
    const count = ingredientBurgers.filter(
      (burgerItem) => burgerItem.item._id === ingredient._id
    ).length;

    return count;
  };

  return (
    !isDrag && (
      <>
        <div className={styles.card} onClick={openIngredientsModal} ref={dragRef}>
          <div>
            <Counter count={countIngredientNumInConstructor(data)} size="default" />
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
