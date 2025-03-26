import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollDirection {
  x: 'left' | 'right' | null;
  y: 'up' | 'down' | null;
}

interface UseScrollOptions {
  throttle?: number;
  element?: HTMLElement | null;
}

export const useScroll = ({ throttle = 100, element }: UseScrollOptions = {}) => {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<ScrollDirection>({
    x: null,
    y: null,
  });
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    const target = element || window;
    const currentPosition = {
      x: element ? element.scrollLeft : window.scrollX,
      y: element ? element.scrollTop : window.scrollY,
    };

    setDirection({
      x: currentPosition.x > position.x ? 'right' : 'left',
      y: currentPosition.y > position.y ? 'down' : 'up',
    });

    setPosition(currentPosition);
    setIsScrolling(true);
  }, [element, position]);

  useEffect(() => {
    const target = element || window;
    let timeoutId: NodeJS.Timeout;

    const throttledScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        handleScroll();
        setIsScrolling(false);
      }, throttle);
    };

    target.addEventListener('scroll', throttledScroll);
    return () => {
      target.removeEventListener('scroll', throttledScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [element, handleScroll, throttle]);

  const scrollTo = useCallback(
    (x: number, y: number) => {
      const target = element || window;
      if (element) {
        element.scrollTo(x, y);
      } else {
        window.scrollTo(x, y);
      }
    },
    [element]
  );

  const scrollToTop = useCallback(() => {
    scrollTo(0, 0);
  }, [scrollTo]);

  const scrollToBottom = useCallback(() => {
    const target = element || window;
    const maxScroll = element
      ? element.scrollHeight - element.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;
    scrollTo(0, maxScroll);
  }, [element, scrollTo]);

  return {
    position,
    direction,
    isScrolling,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}; 