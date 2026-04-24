import { AppHeader } from '@components/app-header/app-header.tsx';

import type { ReactElement } from 'react';

import styles from './feed.module.css';

export const FeedPage = (): ReactElement => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>FeedPage</div>
    </>
  );
};
