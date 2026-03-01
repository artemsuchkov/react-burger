import styles from './burger-ingredients-details.module.css';

export const BurgerIngredientsDetails = ({
  image,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
}) => {
  return (
    <>
      <img src={image} />
      <div className={styles.details}>
        <div>Имя:</div>
        <div>{name}</div>
        <div>Каллорий:</div>
        <div>{calories}</div>
        <div>Протеинов:</div>
        <div>{proteins}</div>
        <div>Жиров:</div>
        <div>{fat}</div>
        <div>Углеводов:</div>
        <div>{carbohydrates}</div>
      </div>
    </>
  );
};
