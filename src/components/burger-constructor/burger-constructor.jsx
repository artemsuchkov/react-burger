import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { Modal } from '@components/modal-window/modal';
import { OrderDetails } from '@components/order/order-details';
import { useModal } from '@hooks/useModal';

import BurgerCard from '../burger-ingredients-card/burger-cards.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  return (
    <section className={`${styles.burger_constructor} custom-scroll`}>
      <div className={styles.type_item}>
        {ingredientBurgers
          .filter((ingredient) => ingredient.item.type == 'bun')
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
          .filter((ingredient) => ingredient.item.type == 'bun')
          .map((ingredient, index) => (
            <div className={styles.type_item} key={`${ingredient.item._id}-${index}`}>
              <div className={styles.empty_place}></div>
              <BurgerCard
                data={{ item: ingredient.item, isConstructor: true, bunPart: 'bottom' }}
              />
            </div>
          ))}
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
