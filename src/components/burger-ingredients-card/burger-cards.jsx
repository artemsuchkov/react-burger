import BurgerCardConstructor from './burger-cards-constructor.tsx';
import BurgerCardIngredients from './burger-cards-ingredients.tsx';

function BurgerCard({ data }) {
  if (data.isConstructor) return <BurgerCardConstructor data={data} />;
  else return <BurgerCardIngredients data={data} />;
}

export default BurgerCard;
