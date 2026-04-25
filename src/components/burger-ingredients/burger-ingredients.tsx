import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@hooks/hook.ts';
import { useScroll } from '@hooks/useScroll.ts';

import BurgerCard from '../burger-ingredients-card/burger-cards.tsx';

import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';

import styles from './burger-ingredients.module.css';

type UseScrollReturn = {
  isTabActive: (tabName: 'bun' | 'sauce' | 'main') => boolean;
  handleScroll: () => void;
  parentRef: React.RefObject<HTMLElement>;
  bunField: React.RefObject<HTMLHeadingElement>;
  sauceField: React.RefObject<HTMLHeadingElement>;
  mainField: React.RefObject<HTMLHeadingElement>;
};

export const BurgerIngredients = (): ReactElement => {
  const { isTabActive, handleScroll, parentRef, bunField, sauceField, mainField } =
    useScroll() as unknown as UseScrollReturn;

  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={isTabActive('bun')}
            onClick={() => {
              bunField.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Булки
          </Tab>
          <Tab
            value="sauce"
            active={isTabActive('sauce')}
            onClick={() => {
              sauceField.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Соусы
          </Tab>
          <Tab
            value="main"
            active={isTabActive('main')}
            onClick={() => {
              mainField.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Начинки
          </Tab>
        </ul>
      </nav>

      <main
        className={`${styles.main_field} custom-scroll`}
        onScroll={handleScroll}
        ref={parentRef}
      >
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title} ref={bunField}>
            Булки
          </h2>
          <ul className={styles.type_list}>
            {burgerIngredients.map(
              (item: Ingredient) =>
                item.type === 'bun' && (
                  <li className={styles.type_item} key={item._id}>
                    <BurgerCard data={item} />
                  </li>
                )
            )}
          </ul>
        </div>
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title} ref={sauceField}>
            Соусы
          </h2>
          <ul className={styles.type_list}>
            {burgerIngredients.map(
              (item: Ingredient) =>
                item.type === 'sauce' && (
                  <li className={styles.type_item} key={item._id}>
                    <BurgerCard data={item} />
                  </li>
                )
            )}
          </ul>
        </div>
        <div className={`${styles.type_box}`}>
          <h2 className={styles.type_title} ref={mainField}>
            Начинки
          </h2>
          <ul className={styles.type_list}>
            {burgerIngredients.map(
              (item: Ingredient) =>
                item.type === 'main' && (
                  <li className={styles.type_item} key={item._id}>
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
