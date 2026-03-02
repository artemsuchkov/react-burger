import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { ModalOverlay } from '@components/modal-window/modal-overlay';

import styles from './modal.module.css';

export const Modal = ({ title, children, onClose }) => {
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

  return (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={`text text_type_main-medium`}>{title}</h2>
            <CloseIcon type="primary" onClick={onClose} />
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </>
  );
};
