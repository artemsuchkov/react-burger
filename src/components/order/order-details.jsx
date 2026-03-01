import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order.module.css';

export const OrderDetails = () => {
  return (
    <>
      <div className={styles.order_details}>
        <div className="text text_type_digits-medium">345-478</div>
        <div className="text text_type_main-default text_color_inactive">
          идентифкатор заказа
        </div>
        <div>
          <CheckMarkIcon type="primary" />
        </div>
        <div className="text text_type_main-small">Ваш заказ начали готовить</div>
        <div className="text text_type_main-small">
          Дождитесь, пока наши курьеры привезут вам заказ
        </div>
      </div>
    </>
  );
};
