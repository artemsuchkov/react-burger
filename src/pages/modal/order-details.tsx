import {
  Preloader,
  CloseIcon,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector } from '@hooks/hook.ts';
import { selectAllOrders, selectUserOrders } from '@services/orders/slice.ts';

import { ModalOverlay } from './modal-overlay.tsx';

import type { ReactElement } from 'react';

import type { Ingredient } from '@/types/ingredients';
import type { Order } from '@services/middleware/middleware.ts';

import styles from './modal.module.css';

type TransformedOrder = Omit<Order, 'ingredients'> & {
  ingredients: {
    image_mobile: string;
    price: number;
    name: string;
  }[];
  order_price: number;
};

export const OrderDetails = (): ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Селекторы для данных
  const allOrdersData = useAppSelector(selectAllOrders);
  const userOrders = useAppSelector(selectUserOrders);
  const burgerIngredients = useAppSelector((store) => store.ingredients.ingredients);
  const isLoading = useAppSelector((store) => store.ingredients.isLoading);
  const error = useAppSelector((store) => store.ingredients.error);

  // Состояние для текущего заказа
  const [currentOrder, setCurrentOrder] = useState<TransformedOrder | null>(null);

  // Извлекаем все заказы из всех источников
  const rawOrders = useMemo(() => {
    const ordersFromAll = allOrdersData.flatMap((data) => data.orders || []);
    return [...ordersFromAll, ...userOrders];
  }, [allOrdersData, userOrders]);

  // Функция для преобразования ID ингредиентов в объекты с image_mobile и price
  const mapIngredientsToImages = (order: Order): TransformedOrder => {
    if (!burgerIngredients || burgerIngredients.length === 0) {
      return {
        ...order,
        ingredients: [],
        order_price: 0,
      };
    }

    let totalPrice = 0;
    // Пропускаем последний элемент, так как он дублируется (булка)
    const ingredientsToProcess = order.ingredients.slice(0, -1);
    const ingredientDetails = ingredientsToProcess
      .map((id: string) => {
        const ingredient = burgerIngredients.find((ing: Ingredient) => ing._id === id);
        if (ingredient) {
          totalPrice += ingredient.price;
          return {
            image_mobile: ingredient.image_mobile,
            price: ingredient.price,
            name: ingredient.name,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as {
      image_mobile: string;
      price: number;
      name: string;
    }[];

    return {
      ...order,
      ingredients: ingredientDetails,
      order_price: totalPrice,
    };
  };

  // Эффект для поиска заказа по ID
  useEffect(() => {
    if (!id) return;

    const order = rawOrders.find((o) => o._id === id);
    if (order) {
      const transformed = mapIngredientsToImages(order);
      setCurrentOrder(transformed);
    } else {
      setCurrentOrder(null);
    }
  }, [id, rawOrders, burgerIngredients]);

  const onClose = (): void => {
    navigate('../');
  };

  // Показываем состояние загрузки
  if (isLoading && burgerIngredients.length === 0) {
    return <Preloader />;
  }

  // Показываем ошибку, если она есть
  if (error) {
    return <CloseIcon type="error" />;
  }

  // Форматирование даты
  const formatDate = (isoString: string): string => {
    if (!isoString) return '';

    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date >= today && date < new Date(today.getTime() + 86400000);
    const isYesterday = date >= yesterday && date < today;

    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow',
    });

    const timeStr = timeFormatter.format(date);

    if (isToday) {
      return `Сегодня в ${timeStr} i-gmt+3`;
    } else if (isYesterday) {
      return `Вчера в ${timeStr} i-gmt+3`;
    } else {
      const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Moscow',
      });
      const dateStr = dateFormatter.format(date);
      return `${dateStr} в ${timeStr} i-gmt+3`;
    }
  };

  // Получение текста статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'pending':
        return styles.statusPending;
      default:
        return '';
    }
  };

  return (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.body}>
            {currentOrder ? (
              <div className={styles.orderDetails}>
                <div className={styles.orderNumber}>
                  <span className="text text_type_digits-medium">
                    #{currentOrder.number}
                  </span>
                  <CloseIcon type="primary" onClick={onClose} />
                </div>
                <div className={styles.orderName}>
                  <h3 className="text text_type_main-medium">{currentOrder.name}</h3>
                </div>
                <div
                  className={`${styles.orderStatus} ${getStatusClass(currentOrder.status)}`}
                >
                  <span className="text text_type_main-default">
                    {getStatusText(currentOrder.status)}
                  </span>
                </div>
                <div className={styles.orderSection}>
                  <h4 className="text text_type_main-medium">Состав:</h4>
                  <div className={styles.ingredientsList}>
                    {currentOrder.ingredients.map((ingredient, index) => (
                      <div key={index} className={styles.ingredientItem}>
                        <div className={styles.ingredientImageWrapper}>
                          <img
                            src={ingredient.image_mobile}
                            alt={ingredient.name}
                            className={styles.ingredientImage}
                          />
                        </div>
                        <div className={styles.ingredientName}>
                          <span className="text text_type_main-default">
                            {ingredient.name}
                          </span>
                        </div>
                        <div className={styles.ingredientPrice}>
                          <span className="text text_type_digits-default">
                            {ingredient.price} ₽
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.orderFooter}>
                  <div className={styles.orderDate}>
                    <span className="text text_type_main-default text_color_inactive">
                      {formatDate(currentOrder.createdAt)}
                    </span>
                  </div>
                  <div className={styles.orderTotal}>
                    <span className="text text_type_digits-medium">
                      {currentOrder.order_price}
                    </span>
                    <CurrencyIcon type="primary" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text text_type_main-default">Заказ не найден</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
