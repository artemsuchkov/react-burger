import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { IngredientsDetails as IngredientsDetailsComponent } from '@components/burger-ingredients/burger-ingredients-details';

import { ModalOverlay } from './modal-overlay';

import styles from './modal.module.css';

export const IngredientsDetails = () => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(`/`);
  };

  return (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={`text text_type_main-medium`}>Детали ингредиента</h2>
            <CloseIcon type="primary" onClick={onClose} />
          </div>
          <div className={styles.body}>
            <IngredientsDetailsComponent />
          </div>
        </div>
      </div>
    </>
  );
};
