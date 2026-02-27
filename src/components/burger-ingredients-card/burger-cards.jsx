import BurgerCardConstructor from './burger-cards-constructor.jsx';
import BurgerCardIngredients from './burger-cards-ingredients.jsx';

function BurgerCard({ data }) {
  if (data.is_constructor) return <BurgerCardConstructor data={data} />;
  else return <BurgerCardIngredients data={data} />;
}

export default BurgerCard;
