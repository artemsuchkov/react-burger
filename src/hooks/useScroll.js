import { useEffect, useRef, useState } from 'react';

export const useScroll = () => {
  const bunField = useRef(null);
  const sauceField = useRef(null);
  const mainField = useRef(null);
  const parentRef = useRef(null);

  const [activeElement, setActiveElement] = useState(null);

  const checkScrollDistance = (elementRef, elementName) => {
    if (!elementRef.current || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    const distanceToParentTop = elementRect.top - parentRect.top;
    const isClose = distanceToParentTop < 10;

    if (isClose && activeElement !== elementName) {
      setActiveElement(elementName);
    }
  };

  const handleScroll = (activeElement) => {
    // Проверяем элементы в порядке приоритета: bun → sauce → main
    checkScrollDistance(bunField, 'bunField');
    if (activeElement !== 'bunField') {
      checkScrollDistance(sauceField, 'sauceField');
    }
    if (activeElement !== 'bunField' && activeElement !== 'sauceField') {
      checkScrollDistance(mainField, 'mainField');
    }
  };

  // Инициализация при монтировании и добавление обработчика скролла
  useEffect(() => {
    handleScroll(); // Первоначальная проверка

    const container = parentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Вспомогательная функция для проверки активности табов
  const isTabActive = (tabName) => {
    const fieldMap = {
      bun: 'bunField',
      sauce: 'sauceField',
      main: 'mainField',
    };
    return activeElement === fieldMap[tabName];
  };

  return {
    isTabActive,
    handleScroll,
    parentRef,
    bunField,
    sauceField,
    mainField,
  };
};
