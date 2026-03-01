import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@components/modal-window/modal';
import { ModalOverlay } from '@components/modal-window/modal-overlay';

import styles from './burger-ingredients-card.module.css';

function BurgerCardIngredients({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.card} onClick={handleClick}>
        <div>
          <Counter count={1} size="default" />
        </div>
        <img src={data.image} />
        <div className={styles.card_price}>
          <CurrencyIcon type="primary" /> {data.price}
        </div>
        <div className={styles.card_name}>{data.name}</div>
      </div>

      {isModalOpen && (
        <>
          <ModalOverlay onClose={() => setIsModalOpen(false)} />
          <Modal
            type="IngredientDetails"
            image={data.image}
            name={data.name}
            calories={data.calories}
            proteins={data.proteins}
            fat={data.fat}
            carbohydrates={data.carbohydrates}
            price={data.price}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </>
  );
}

export default BurgerCardIngredients;
