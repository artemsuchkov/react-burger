import { useEffect, useRef, useState } from 'react';

export type UseScrollReturn = {
  isTabActive: (tabName: 'bun' | 'sauce' | 'main') => boolean;
  handleScroll: () => void;
  parentRef: React.RefObject<HTMLElement | null>;
  bunField: React.RefObject<HTMLHeadingElement | null>;
  sauceField: React.RefObject<HTMLHeadingElement | null>;
  mainField: React.RefObject<HTMLHeadingElement | null>;
};

export const useScroll = (): UseScrollReturn => {
  const bunField = useRef<HTMLHeadingElement>(null);
  const sauceField = useRef<HTMLHeadingElement>(null);
  const mainField = useRef<HTMLHeadingElement>(null);
  const parentRef = useRef<HTMLElement>(null);

  const [activeElement, setActiveElement] = useState<string | null>(null);

  const checkScrollDistance = (
    elementRef: React.RefObject<HTMLElement | null>,
    elementName: string
  ): void => {
    if (!elementRef.current || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    const distanceToParentTop = elementRect.top - parentRect.top;
    const isClose = distanceToParentTop < 10;

    if (isClose && activeElement !== elementName) {
      setActiveElement(elementName);
    }
  };

  const handleScroll = (): void => {
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

    return (): void => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Вспомогательная функция для проверки активности табов
  const isTabActive = (tabName: 'bun' | 'sauce' | 'main'): boolean => {
    const fieldMap: Record<'bun' | 'sauce' | 'main', string> = {
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
