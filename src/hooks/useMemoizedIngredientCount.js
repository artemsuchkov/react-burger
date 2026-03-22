import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useMemoizedIngredientCount = (ingredient) => {
  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  return useMemo(() => {
    if (ingredient.type === 'bun') {
      const hasBun = ingredientBurgers.some(
        (burgerItem) => burgerItem.item._id === ingredient._id
      );
      return hasBun ? 2 : false;
    }

    const count = ingredientBurgers.filter(
      (burgerItem) => burgerItem.item._id === ingredient._id
    ).length;

    return count ? count : false;
  }, [ingredient._id, ingredient.type, ingredientBurgers]);
};
