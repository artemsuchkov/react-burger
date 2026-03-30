import styles from './modal.module.css';

export const ModalOverlay = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose} />;
};
