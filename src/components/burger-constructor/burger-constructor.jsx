import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import {
  addIngredientToBurger,
  removeIngredientFromBurger,
  reorderIngredients,
} from '@/services/ingredients/slice.js';
import { Modal } from '@components/modal-window/modal';
import { OrderDetails } from '@components/order/order-details';
import { useMemoizedIngredientCount } from '@hooks/useMemoizedIngredientCount';
import { useModal } from '@hooks/useModal';

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
  const [hoverIndex, setHoverIndex] = useState(-1);

  const { orderSumm } = useMemoizedIngredientCount();

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  const handleDrop = (draggedItem) => {
    if (!draggedItem || !draggedItem.item) {
      console.error('Ошибка структуры:', draggedItem);
      return;
    }

    const ingredient = {
      ...draggedItem,
      item: {
        ...draggedItem.item, // копируем все существующие поля item
        id: nanoid(), // добавляем новый id
      },
    };

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
    hover: (draggedItem, monitor) => {
      const { index: draggedIndex } = draggedItem;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Получаем DOM-элемент контейнера
      const hoverBoundingRect = document
        .querySelector(`.${styles.type_list}`)
        ?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      // Вычисляем вертикальную позицию курсора относительно контейнера
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Определяем высоту элемента (приблизительно)
      const itemHeight = 80; // примерная высота элемента
      const hoverIndex = Math.floor(hoverClientY / itemHeight);

      // Фильтруем ингредиенты без булок
      const nonBunIngredients = ingredientBurgers.filter(
        (ingredient) => ingredient.item.type !== 'bun'
      );
      const maxIndex = nonBunIngredients.length - 1;
      const clampedHoverIndex = Math.max(0, Math.min(hoverIndex, maxIndex));

      if (draggedIndex !== clampedHoverIndex) {
        setHoverIndex(clampedHoverIndex);
      }
    },
    drop: (draggedItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const { ingredient: draggedIngredient, index: draggedIndex } = draggedItem;

      // Используем hoverIndex как целевой индекс
      const targetIndex = hoverIndex !== -1 ? hoverIndex : draggedIndex;

      // Фильтруем ингредиенты без булок для корректного индекса
      const nonBunIngredients = ingredientBurgers.filter(
        (ingredient) => ingredient.item.type !== 'bun'
      );

      // Проверяем, что targetIndex в пределах
      if (targetIndex < 0 || targetIndex >= nonBunIngredients.length) {
        setHoverIndex(-1);
        return;
      }

      // Находим реальный индекс в общем массиве
      const realTargetIndex = ingredientBurgers.findIndex(
        (ingredient) => ingredient.item.id === nonBunIngredients[targetIndex]?.item.id
      );
      const realDraggedIndex = ingredientBurgers.findIndex(
        (item) => item.item.id === draggedIngredient.item.id
      );

      if (
        realDraggedIndex !== -1 &&
        realTargetIndex !== -1 &&
        realDraggedIndex !== realTargetIndex
      ) {
        dispatch(reorderIngredients({ from: realDraggedIndex, to: realTargetIndex }));
      }

      setHoverIndex(-1);
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
          {ingredientBurgers.some((ingredient) => ingredient.item.type === 'bun') ? (
            ingredientBurgers
              .filter((ingredient) => ingredient.item.type === 'bun')
              .map((ingredient) => (
                <div className={styles.type_item} key={`${ingredient.item.id}`}>
                  <div className={styles.empty_place}></div>
                  <BurgerCard
                    data={{ item: ingredient.item, isConstructor: true, bunPart: 'top' }}
                  />
                </div>
              ))
          ) : (
            <div className={styles.empty_bun_top}>Выберите булочку</div>
          )}
        </div>
        <div className={`${styles.type_list} custom-scroll`} ref={dropTargetIngredient}>
          {ingredientBurgers.some((ingredient) => ingredient.item.type !== 'bun') ? (
            ingredientBurgers
              .filter((ingredient) => ingredient.item.type !== 'bun')
              .map((ingredient, index) => (
                <DraggableIngredient
                  key={`${ingredient.item.id}`}
                  ingredient={ingredient}
                  index={index}
                />
              ))
          ) : (
            <div className={styles.empty_ingredients}>Выберите начинку</div>
          )}
        </div>
        <div className={styles.type_item}>
          {ingredientBurgers.some((ingredient) => ingredient.item.type === 'bun') ? (
            ingredientBurgers
              .filter((ingredient) => ingredient.item.type === 'bun')
              .map((ingredient) => (
                <div className={styles.type_item} key={`${ingredient.item.id}`}>
                  <div className={styles.empty_place}></div>
                  <BurgerCard
                    data={{
                      item: ingredient.item,
                      isConstructor: true,
                      bunPart: 'bottom',
                    }}
                  />
                </div>
              ))
          ) : (
            <div className={styles.empty_bun_bottom}>Выберите булочку</div>
          )}
        </div>
      </div>
      {ingredientBurgers.length > 0 && (
        <div className={`${styles.totall} text text_type_main-large`}>
          <div className={styles.totall_price}>{orderSumm}</div>
          <CurrencyIcon type="primary" />

          <Button onClick={openModal} size="large" type="primary">
            Оформить заказ
          </Button>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
