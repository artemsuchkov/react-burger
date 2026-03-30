import styles from './burger-ingredients-details.module.css';

export const IngredientsDetails = ({ data }) => {
  const ingredientModal = data;

  return (
    <>
      <img src={ingredientModal.image} alt={ingredientModal.name} />
      <div className={`${styles.name} text text_type_main-medium`}>
        {ingredientModal.name}
      </div>
      <div
        className={`${styles.details} text text_type_main-default text_color_inactive`}
      >
        <div>
          <div className={`text_type_main-small`}>Каллорий, ккал</div>
          <div>{ingredientModal.calories}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Белки, г.</div>
          <div>{ingredientModal.proteins}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Жиров, г.</div>
          <div>{ingredientModal.fat}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Углеводов, г.</div>
          <div>{ingredientModal.carbohydrates}</div>
        </div>
      </div>
    </>
  );
};
