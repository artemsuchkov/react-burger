import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { nanoid } from 'nanoid';
import { useState, useRef, type ReactElement } from 'react';
import { useDrop, useDrag } from 'react-dnd';

import {
  addIngredientToBurger,
  removeIngredientFromBurger,
  reorderIngredients,
} from '@/services/ingredients/slice.ts';
import { Modal } from '@components/modal-window/modal.tsx';
import { OrderDetails } from '@components/order/order-details.tsx';
import { useAppDispatch, useAppSelector } from '@hooks/hook.ts';
import { useMemoizedIngredientCount } from '@hooks/useMemoizedIngredientCount.ts';
import { useModal } from '@hooks/useModal.ts';

import BurgerCard from '../burger-ingredients-card/burger-cards.tsx';

import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

import type { Ingredient, BurgerIngredient } from '@/types/ingredients';

import styles from './burger-constructor.module.css';

type DraggableIngredientProps = {
  ingredient: BurgerIngredient;
  index: number;
};

type DragItem = {
  item: Ingredient;
};

type InternalDragItem = {
  ingredient: BurgerIngredient;
  index: number;
};

type DropCollectedProps = {
  isOver: boolean;
  canDrop: boolean;
};

type DragCollectedProps = {
  isDragging: boolean;
};

const DraggableIngredient = ({
  ingredient,
  index,
}: DraggableIngredientProps): ReactElement => {
  const [{ isDragging }, drag] = useDrag<InternalDragItem, unknown, DragCollectedProps>({
    type: 'BURGER_INGREDIENT',
    item: { ingredient, index },
    collect: (monitor: DragSourceMonitor): DragCollectedProps => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`${styles.type_item} ${isDragging ? styles.dragging : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <BurgerCard
        data={{ item: ingredient.item, id: ingredient.id, isConstructor: true }}
      />
    </div>
  );
};

export const BurgerConstructor = (): ReactElement => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const [hoverIndex, setHoverIndex] = useState(-1);

  const { orderSumm } = useMemoizedIngredientCount();

  const ingredientBurgers = useAppSelector(
    (store) => store.ingredients.ingredientBurgers
  );

  const handleDrop = (draggedItem: DragItem): void => {
    if (!draggedItem || !draggedItem.item) {
      console.error('Ошибка структуры:', draggedItem);
      return;
    }

    const ingredient: BurgerIngredient = {
      id: nanoid(),
      item: draggedItem.item,
    };

    if (ingredient.item.type === 'bun') {
      const existingBun = ingredientBurgers.find(({ item }) => item.type === 'bun');
      if (existingBun) {
        dispatch(removeIngredientFromBurger(existingBun.id));
      }
    }

    dispatch(addIngredientToBurger(ingredient));
  };

  const dropTargetRef = useRef<HTMLDivElement>(null);
  const [, dropTarget] = useDrop<DragItem, unknown, DropCollectedProps>({
    accept: 'BURGER_INGREDIENTS',
    drop: handleDrop,
    collect: (monitor: DropTargetMonitor): DropCollectedProps => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  dropTarget(dropTargetRef);

  const dropTargetIngredientRef = useRef<HTMLDivElement>(null);
  const [, dropTargetIngredient] = useDrop<
    InternalDragItem,
    unknown,
    DropCollectedProps
  >({
    accept: 'BURGER_INGREDIENT',
    hover: (draggedItem: InternalDragItem, monitor: DropTargetMonitor) => {
      const { index: draggedIndex } = draggedItem;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverBoundingRect = document
        .querySelector(`.${styles.type_list}`)
        ?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const itemHeight = 80;
      const hoverIndex = Math.floor(hoverClientY / itemHeight);

      const nonBunIngredients = ingredientBurgers.filter(
        (ingredient) => ingredient.item.type !== 'bun'
      );
      const maxIndex = nonBunIngredients.length - 1;
      const clampedHoverIndex = Math.max(0, Math.min(hoverIndex, maxIndex));

      if (draggedIndex !== clampedHoverIndex) {
        setHoverIndex(clampedHoverIndex);
      }
    },
    drop: (draggedItem: InternalDragItem, monitor: DropTargetMonitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const { ingredient: draggedIngredient, index: draggedIndex } = draggedItem;
      const targetIndex = hoverIndex !== -1 ? hoverIndex : draggedIndex;

      const nonBunIngredients = ingredientBurgers.filter(
        (ingredient) => ingredient.item.type !== 'bun'
      );

      if (targetIndex < 0 || targetIndex >= nonBunIngredients.length) {
        setHoverIndex(-1);
        return;
      }

      const realTargetIndex = ingredientBurgers.findIndex(
        (ingredient) => ingredient.id === nonBunIngredients[targetIndex]?.id
      );
      const realDraggedIndex = ingredientBurgers.findIndex(
        (item) => item.id === draggedIngredient.id
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
    collect: (monitor: DropTargetMonitor): DropCollectedProps => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  dropTargetIngredient(dropTargetIngredientRef);

  return (
    <section>
      <div className={`${styles.burger_constructor} custom-scroll`} ref={dropTargetRef}>
        <div className={styles.type_item}>
          {ingredientBurgers.some((ingredient) => ingredient.item.type === 'bun') ? (
            ingredientBurgers
              .filter((ingredient) => ingredient.item.type === 'bun')
              .map((ingredient) => (
                <div className={styles.type_item} key={`${ingredient.id}`}>
                  <div className={styles.empty_place}></div>
                  <BurgerCard
                    data={{
                      item: ingredient.item,
                      id: ingredient.id,
                      isConstructor: true,
                      bunPart: 'top',
                    }}
                  />
                </div>
              ))
          ) : (
            <div className={styles.empty_bun_top}>Выберите булочку</div>
          )}
        </div>
        <div
          className={`${styles.type_list} custom-scroll`}
          ref={dropTargetIngredientRef}
        >
          {ingredientBurgers.some((ingredient) => ingredient.item.type !== 'bun') ? (
            ingredientBurgers
              .filter((ingredient) => ingredient.item.type !== 'bun')
              .map((ingredient, index) => (
                <DraggableIngredient
                  key={`${ingredient.id}`}
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
                <div className={styles.type_item} key={`${ingredient.id}`}>
                  <div className={styles.empty_place}></div>
                  <BurgerCard
                    data={{
                      item: ingredient.item,
                      id: ingredient.id,
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

          <Button onClick={openModal} size="large" type="primary" htmlType="button">
            Оформить заказ
          </Button>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal} title="Детали заказа">
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
