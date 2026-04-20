import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/services/store';
import type { Ingredient, BurgerIngredient } from '@/types/ingredients';

type UseMemoizedIngredientCountResult = {
  ingredientCount: number | false;
  orderSumm: number;
};

export const useMemoizedIngredientCount = (
  ingredient?: Ingredient
): UseMemoizedIngredientCountResult => {
  const ingredientBurgers = useSelector(
    (state: RootState) => state.ingredients.ingredientBurgers
  );

  const ingredientCount = useMemo(() => {
    if (!ingredient) {
      return false;
    }
    if (ingredient.type === 'bun') {
      const hasBun = ingredientBurgers.some(
        (burgerItem: BurgerIngredient) => burgerItem.item._id === ingredient._id
      );
      return hasBun ? 2 : false;
    }

    const count = ingredientBurgers.filter(
      (burgerItem: BurgerIngredient) => burgerItem.item._id === ingredient._id
    ).length;

    return count ? count : false;
  }, [ingredient, ingredientBurgers]);

  const orderSumm = useMemo(() => {
    return ingredientBurgers.reduce(
      (sum: number, item: BurgerIngredient) => sum + item.item.price,
      0
    );
  }, [ingredientBurgers]);

  return {
    ingredientCount,
    orderSumm,
  };
};
