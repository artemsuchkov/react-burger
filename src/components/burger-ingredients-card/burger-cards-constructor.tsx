import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';

import { removeIngredientFromBurger } from '@/services/ingredients/slice.ts';

import type { ReactElement } from 'react';

import type { RootState, AppDispatch } from '@/services/store';
import type { Ingredient, BurgerIngredient } from '@/types/ingredients.ts';

type BurgerCardConstructorProps = {
  data: {
    item: Ingredient;
    bunPart?: 'top' | 'bottom';
  };
};

function BurgerCardConstructor({ data }: BurgerCardConstructorProps): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveIngredient = (id: string): void => {
    dispatch(removeIngredientFromBurger(id));
  };

  const ingredientBurgers = useSelector(
    (store: RootState) => store.ingredients.ingredientBurgers
  );

  const hasNonBunIngredients = ingredientBurgers.some(
    ({ item }: BurgerIngredient) => item.type !== 'bun'
  );

  const isBunLocked = data.item.type === 'bun' && hasNonBunIngredients;

  if (data.item.type === 'bun' && data.bunPart === 'top') {
    return (
      <ConstructorElement
        handleClose={() => handleRemoveIngredient(data.item._id)}
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
        handleClose={() => handleRemoveIngredient(data.item._id)}
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
      handleClose={() => handleRemoveIngredient(data.item._id)}
      isLocked={isBunLocked}
      price={data.item.price}
      text={data.item.name}
      thumbnail={data.item.image_mobile}
    />
  );
}

export default BurgerCardConstructor;
