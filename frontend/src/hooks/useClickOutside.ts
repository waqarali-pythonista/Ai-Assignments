import { useEffect, RefObject } from 'react';

interface UseClickOutsideOptions {
  ref: RefObject<HTMLElement>;
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

export const useClickOutside = ({
  ref,
  handler,
  enabled = true,
}: UseClickOutsideOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}; 