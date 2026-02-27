import { Tab } from '@krgaa/react-developer-burger-ui-components';

import BurgerCard from '../burger-ingredients-card/burger-cards.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log('BurgerIngredients');
  console.log(ingredients);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <main className={`${styles.main_field} custom-scroll`}>
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title}>Булки</h2>
          <ul className={styles.type_list}>
            {ingredients.map(
              (item, index) =>
                item.type === 'bun' && (
                  <li className={styles.type_item} key={index}>
                    <BurgerCard data={item} />
                  </li>
                )
            )}
          </ul>
        </div>
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title}>Соусы</h2>
          <ul className={styles.type_list}>
            {ingredients.map(
              (item, index) =>
                item.type === 'sauce' && (
                  <li className={styles.type_item} key={index}>
                    <BurgerCard data={item} />
                  </li>
                )
            )}
          </ul>
        </div>
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title}>Начинки</h2>
          <ul className={styles.type_list}>
            {ingredients.map(
              (item, index) =>
                item.type === 'main' && (
                  <li className={styles.type_item} key={index}>
                    <BurgerCard data={item} />
                  </li>
                )
            )}
          </ul>
        </div>
      </main>
    </section>
  );
};
