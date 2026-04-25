import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { ModalOverlay } from '@components/modal-window/modal-overlay.tsx';

import type { ReactElement, ReactNode } from 'react';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ title, children, onClose }: ModalProps): ReactElement => {
  useEffect((): (() => void) => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => {
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
