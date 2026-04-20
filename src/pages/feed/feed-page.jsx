import { AppHeader } from '@components/app-header/app-header.tsx';

import styles from './feed.module.css';

export const FeedPage = () => {
  return (
    <>
      <AppHeader />
      <div className={styles.container}>FeedPage</div>
    </>
  );
};
