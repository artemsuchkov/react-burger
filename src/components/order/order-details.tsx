import {
  Preloader,
  CloseIcon,
  CheckMarkIcon,
} from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@hooks/hook.ts';

import type { ReactElement } from 'react';

import styles from './order.module.css';

export const OrderDetails = (): ReactElement => {
  const isOrderLoading = useAppSelector((store) => store.ingredients.isOrderLoading);
  const errorOrder = useAppSelector((store) => store.ingredients.errorOrder);
  const orderAnswer = useAppSelector((store) => store.ingredients.orderAnswer);

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (errorOrder) {
    return <CloseIcon type="error" />;
  }

  if (!orderAnswer) {
    return <Preloader />;
  }

  return (
    <div className={styles.order_details}>
      <div className="text text_type_digits-medium">{orderAnswer.order.number}</div>
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
  );
};
