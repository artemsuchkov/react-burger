import {
  DragIcon,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@components/modal-window/modal';
import { ModalOverlay } from '@components/modal-window/modal-overlay';

import BurgerCard from '../burger-ingredients-card/burger-cards.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const bun = ingredients.filter((item) => item.type === 'bun')[0] ?? [];

  return (
    <section className={`${styles.burger_constructor} custom-scroll`}>
      <div className={styles.type_item}>
        <div className={styles.empty_place}></div>
        <BurgerCard data={{ item: bun, is_constructor: true, bun_part: 'top' }} />
      </div>
      <div className={`${styles.type_list} custom-scroll`}>
        {ingredients.map(
          (item, index) =>
            item.type !== 'bun' && (
              <div className={styles.type_item} key={index}>
                <DragIcon type="primary" />
                <BurgerCard data={{ item: item, is_constructor: true }} />
              </div>
            )
        )}
      </div>
      <div className={styles.type_item}>
        <div className={styles.empty_place}></div>
        <BurgerCard data={{ item: bun, is_constructor: true, bun_part: 'bottom' }} />
      </div>
      <div className={`${styles.totall} text text_type_main-large`}>
        <div className={styles.totall_price}>610</div>
        <CurrencyIcon type="primary" />
        <Button onClick={handleClick} size="large" type="primary">
          Оформить заказ
        </Button>
      </div>

      {isModalOpen && (
        <>
          <ModalOverlay onClose={() => setIsModalOpen(false)} />
          <Modal type="OrderDetails" onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </section>
  );
};
