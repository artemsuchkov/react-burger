import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-ingredients-card.module.css';

function BurgerCardIngredients({ data }) {
  return (
    <div className={styles.card}>
      <div>
        <Counter count={1} size="default" />
      </div>
      <img src={data.image} />
      <div className={styles.card_price}>
        <CurrencyIcon type="primary" /> {data.price}
      </div>
      <div className={styles.card_name}>{data.name}</div>
    </div>
  );
}

export default BurgerCardIngredients;
