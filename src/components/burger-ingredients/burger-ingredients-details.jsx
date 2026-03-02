import styles from './burger-ingredients-details.module.css';

export const IngredientsDetails = ({
  image,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
}) => {
  return (
    <>
      <img src={image} alt={name} />
      <div className={`${styles.name} text text_type_main-medium`}>{name}</div>
      <div
        className={`${styles.details} text text_type_main-default text_color_inactive`}
      >
        <div>
          <div className={`text_type_main-small`}>Каллорий, ккал</div>
          <div>{calories}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Белки, г.</div>
          <div>{proteins}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Жиров, г.</div>
          <div>{fat}</div>
        </div>
        <div>
          <div className={`text_type_main-small`}>Углеводов, г.</div>
          <div>{carbohydrates}</div>
        </div>
      </div>
    </>
  );
};
