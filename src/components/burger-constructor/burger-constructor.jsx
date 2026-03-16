import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '@components/modal-window/modal';
import { OrderDetails } from '@components/order/order-details';
import { useModal } from '@hooks/useModal';
import { addIngredientToBurger } from '@services/ingredients/reducers';

import BurgerCard from '../burger-ingredients-card/burger-cards.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const dispatch = useDispatch(); // Добавляем dispatch

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  const handleDrop = (draggedItem) => {
    // Проверяем, что переданный объект содержит нужные данные

    if (!draggedItem || !draggedItem.item) {
      console.error('Invalid drag item structure:', draggedItem);
      return;
    }

    const ingredient = draggedItem;

    // Проверяем, является ли ингредиент булкой
    if (ingredient.item.type === 'bun') {
      // Проверяем, есть ли уже булка в ingredientBurgers
      const hasBun = ingredientBurgers.some(({ item }) => item.type === 'bun');

      if (hasBun) {
        alert('В бургере уже есть булка! Нельзя добавить вторую.');
        return;
      }
    }

    // Добавляем ингредиент в store
    dispatch(addIngredientToBurger(ingredient));
  };

  // Настраиваем useDrop с корректным типом
  const [, dropTarget] = useDrop({
    accept: 'BURGER_INGREDIENTS', // Используем осмысленный тип
    drop: handleDrop,
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
        <div className={`${styles.type_list} custom-scroll`}>
          {ingredientBurgers
            .filter((ingredient) => ingredient.item.type !== 'bun')
            .map((ingredient, index) => (
              <div className={styles.type_item} key={`${ingredient.item._id}-${index}`}>
                <DragIcon type="primary" />
                <BurgerCard data={{ item: ingredient.item, isConstructor: true }} />
              </div>
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
        <div className={styles.totall_price}>610</div>
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
