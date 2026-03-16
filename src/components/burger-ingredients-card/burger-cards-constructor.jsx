import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';

import { removeIngredientFromBurger } from '@services/ingredients/reducers';

function BurgerCardConstructor({ data }) {
  const dispatch = useDispatch();

  const handleRemoveIngredient = (index) => {
    dispatch(removeIngredientFromBurger(index));
  };

  const ingredientBurgers = useSelector((store) => store.ingredients.ingredientBurgers);

  const hasNonBunIngredients = ingredientBurgers.some(({ item }) => item.type !== 'bun');

  const isBunLocked = data.item.type === 'bun' && hasNonBunIngredients;

  if (data.item.type == 'bun' && data.bunPart == 'top') {
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

  if (data.item.type == 'bun' && data.bunPart == 'bottom') {
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
