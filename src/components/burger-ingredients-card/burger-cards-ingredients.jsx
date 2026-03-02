import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import { Modal } from '@components/modal-window/modal';
import { useModal } from '@hooks/useModal';

import styles from './burger-ingredients-card.module.css';

function BurgerCardIngredients({ data }) {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className={styles.card} onClick={openModal}>
        <div>
          <Counter count={1} size="default" />
        </div>
        <img src={data.image} alt={data.name} />
        <div className={styles.card_price}>
          <CurrencyIcon type="primary" /> {data.price}
        </div>
        <div className={styles.card_name}>{data.name}</div>
      </div>

      {isModalOpen && (
        <Modal
          title="Детали ингредиента"
          type="IngredientDetails"
          image={data.image}
          name={data.name}
          calories={data.calories}
          proteins={data.proteins}
          fat={data.fat}
          carbohydrates={data.carbohydrates}
          price={data.price}
          onClose={() => closeModal()}
        />
      )}
    </>
  );
}

export default BurgerCardIngredients;
