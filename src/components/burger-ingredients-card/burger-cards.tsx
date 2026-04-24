import BurgerCardConstructor from './burger-cards-constructor.tsx';
import BurgerCardIngredients from './burger-cards-ingredients.tsx';

import type { ReactElement } from 'react';

import type { Ingredient } from '../../types/ingredients';

type ConstructorData = {
  isConstructor: true;
  item: Ingredient;
  id: string;
  bunPart?: 'top' | 'bottom';
};

type IngredientData = Ingredient & { isConstructor?: false };

type BurgerCardData = ConstructorData | IngredientData;

type BurgerCardProps = {
  data: BurgerCardData;
};

function BurgerCard({ data }: BurgerCardProps): ReactElement {
  if (data.isConstructor) {
    return <BurgerCardConstructor data={data} />;
  } else {
    return <BurgerCardIngredients data={data} />;
  }
}

export default BurgerCard;
