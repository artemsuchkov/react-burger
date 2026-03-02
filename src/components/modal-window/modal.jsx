import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { IngredientsDetails } from '@components/burger-ingredients/burger-ingredients-details';
import { ModalOverlay } from '@components/modal-window/modal-overlay';
import { OrderDetails } from '@components/order/order-details';

import styles from './modal.module.css';

export const Modal = ({
  title,
  type,
  image,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
  onClose,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (type === 'IngredientDetails') {
    return (
      <>
        <ModalOverlay onClose={() => onClose()} />
        <div className={styles.modal}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h2 className={`text text_type_main-medium`}>{title}</h2>
              <CloseIcon
                type="primary"
                onClick={() => {
                  onClose();
                }}
              />
            </div>
            <div className={styles.body}>
              <IngredientsDetails
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
      </>
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
