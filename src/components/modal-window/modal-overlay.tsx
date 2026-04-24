import type { ReactElement } from 'react';

import styles from './modal.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: ModalOverlayProps): ReactElement => {
  return <div className={styles.overlay} onClick={onClose} />;
};
