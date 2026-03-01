import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { BurgerIngredientsDetails } from '@components/burger-ingredients/burger-ingredients-details';
import { OrderDetails } from '@components/order/order-details';

import styles from './modal.module.css';

export const Modal = ({
  type,
  image,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
  onClose,
}) => {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (type === 'IngredientDetails') {
    return (
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={`text text_type_main-medium`}>Детали ингредиента</div>
            <CloseIcon
              type="primary"
              onClick={() => {
                onClose();
              }}
            />
          </div>
          <div className={styles.body}>
            <BurgerIngredientsDetails
              image={image}
              name={name}
              calories={calories}
              proteins={proteins}
              fat={fat}
              carbohydrates={carbohydrates}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'OrderDetails') {
    return (
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={`text text_type_main-medium`}></div>
            <CloseIcon
              type="primary"
              onClick={() => {
                onClose();
              }}
            />
          </div>
          <div className={styles.body}>
            <OrderDetails />
          </div>
        </div>
      </div>
    );
  }
};
