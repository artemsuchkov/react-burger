import { useEffect } from 'react';

import styles from './modal.module.css';

export const ModalOverlay = ({ onClose }) => {
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

  return <div className={styles.overlay} onClick={onClose} />;
};
