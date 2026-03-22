import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop, useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '@components/modal-window/modal';
import { OrderDetails } from '@components/order/order-details';
import { useMemoizedIngredientCount } from '@hooks/useMemoizedIngredientCount';
import { useModal } from '@hooks/useModal';
import {
  addIngredientToBurger,
  removeIngredientFromBurger,
  reorderIngredients,
} from '@services/ingredients/reducers';

import BurgerCard from '../burger-ingredients-card/burger-cards.jsx';

import styles from './burger-constructor.module.css';

const DraggableIngredient = ({ ingredient, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BURGER_INGREDIENT',
    item: { ingredient, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`${styles.type_item} ${isDragging ? styles.dragging : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <BurgerCard data={{ item: ingredient.item, isConstructor: true }} />
    </div>
  );
};

export const BurgerConstructor = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const dispatch = useDispatch();

  const { orderSumm } = useMemoizedIngredientCount();

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  const handleDrop = (draggedItem) => {
    //console.log('draggedItem');
    //console.log(draggedItem);

    if (!draggedItem || !draggedItem.item) {
      console.error('Ошибка структуры:', draggedItem);
      return;
    }

    const ingredient = draggedItem;

    if (ingredient.item.type === 'bun') {
      const existingBun = ingredientBurgers.find(({ item }) => item.type === 'bun');
      if (existingBun) {
        dispatch(removeIngredientFromBurger(existingBun.item.id));
      }
    }

    dispatch(addIngredientToBurger(ingredient));
  };

  // Настраиваем useDrop с корректным типом
  const [, dropTarget] = useDrop({
    accept: 'BURGER_INGREDIENTS',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [, dropTargetIngredient] = useDrop({
    accept: 'BURGER_INGREDIENT', // тип для перемещения внутри
    drop: (draggedItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const { ingredient: draggedIngredient, index: draggedIndex } = draggedItem;

      // Находим текущий индекс ингредиента в списке
      const currentIndex = ingredientBurgers.findIndex(
        (item) => item.item.id === draggedIngredient.item.id
      );
      console.log('currentIndex ' + currentIndex);
      if (currentIndex !== -1 && draggedIndex !== currentIndex) {
        // Переставляем ингредиенты в списке
        dispatch(reorderIngredients({ from: draggedIndex, to: currentIndex }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <section>
      <div className={`${styles.burger_constructor} custom-scroll`} ref={dropTarget}>
        <div className={styles.type_item}>
          {ingredientBurgers
            .filter((ingredient) => ingredient.item.type === 'bun')
            .map((ingredient, index) => (
              <div className={styles.type_item} key={`${ingredient.item._id}-${index}`}>
                <div className={styles.empty_place}></div>
                <BurgerCard
                  data={{ item: ingredient.item, isConstructor: true, bunPart: 'top' }}
                />
              </div>
            ))}
        </div>
        <div className={`${styles.type_list} custom-scroll`} ref={dropTargetIngredient}>
          {ingredientBurgers
            .filter((ingredient) => ingredient.item.type !== 'bun')
            .map((ingredient, index) => (
              <DraggableIngredient
                key={`${ingredient.item._id}-${index}`}
                ingredient={ingredient}
                index={index}
              />
            ))}
        </div>
        <div className={styles.type_item}>
          {ingredientBurgers
            .filter((ingredient) => ingredient.item.type === 'bun')
            .map((ingredient, index) => (
              <div className={styles.type_item} key={`${ingredient.item._id}-${index}`}>
                <div className={styles.empty_place}></div>
                <BurgerCard
                  data={{
                    item: ingredient.item,
                    isConstructor: true,
                    bunPart: 'bottom',
                  }}
                />
              </div>
            ))}
        </div>
      </div>
      <div className={`${styles.totall} text text_type_main-large`}>
        <div className={styles.totall_price}>{orderSumm}</div>
        <CurrencyIcon type="primary" />
        <Button onClick={openModal} size="large" type="primary">
          Оформить заказ
        </Button>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
