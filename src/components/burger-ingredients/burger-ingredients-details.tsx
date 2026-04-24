import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';

import styles from './burger-ingredients-details.module.css';

type IngredientsDetailsProps = {
  data: Ingredient;
};

export const IngredientsDetails = ({ data }: IngredientsDetailsProps): ReactElement => {
  return (
    <>
      <img src={data.image} alt={data.name} />
      <div className={`${styles.name} text text_type_main-medium`}>{data.name}</div>
      <div
        className={`${styles.details} text text_type_main-default text_color_inactive`}
      >
        <div>
          <div className={`text_type_main-small`}>Каллорий, ккал</div>
          <div>{data.calories}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Белки, г.</div>
          <div>{data.proteins}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Жиров, г.</div>
          <div>{data.fat}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Углеводов, г.</div>
          <div>{data.carbohydrates}</div>
        </div>
      </div>
    </>
  );
};
