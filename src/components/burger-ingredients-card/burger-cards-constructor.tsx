import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import { removeIngredientFromBurger } from '@/services/ingredients/slice.ts';
import { useAppDispatch, useAppSelector } from '@hooks/hook.ts';

import type { ReactElement } from 'react';

import type { Ingredient, BurgerIngredient } from '@/types/ingredients.ts';

type BurgerCardConstructorProps = {
  data: {
    item: Ingredient;
    id: string;
    bunPart?: 'top' | 'bottom';
  };
};

function BurgerCardConstructor({ data }: BurgerCardConstructorProps): ReactElement {
  const dispatch = useAppDispatch();

  const handleRemoveIngredient = (id: string): void => {
    dispatch(removeIngredientFromBurger(id));
  };

  const ingredientBurgers = useAppSelector(
    (store) => store.ingredients.ingredientBurgers
  );

  const hasNonBunIngredients = ingredientBurgers.some(
    ({ item }: BurgerIngredient) => item.type !== 'bun'
  );

  const isBunLocked = data.item.type === 'bun' && hasNonBunIngredients;

  if (data.item.type === 'bun' && data.bunPart === 'top') {
    return (
      <ConstructorElement
        handleClose={() => handleRemoveIngredient(data.id)}
        isLocked={isBunLocked}
        price={data.item.price}
        text={data.item.name + ' (верх)'}
        thumbnail={data.item.image_mobile}
        type="top"
      />
    );
  }

  if (data.item.type === 'bun' && data.bunPart === 'bottom') {
    return (
      <ConstructorElement
        handleClose={() => handleRemoveIngredient(data.id)}
        isLocked={isBunLocked}
        price={data.item.price}
        text={data.item.name + ' (низ)'}
        thumbnail={data.item.image_mobile}
        type="bottom"
      />
    );
  }

  return (
    <ConstructorElement
      handleClose={() => handleRemoveIngredient(data.id)}
      isLocked={isBunLocked}
      price={data.item.price}
      text={data.item.name}
      thumbnail={data.item.image_mobile}
    />
  );
}

export default BurgerCardConstructor;
