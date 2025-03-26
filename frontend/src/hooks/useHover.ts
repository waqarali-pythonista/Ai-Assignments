import { useState, useCallback } from 'react';

interface UseHoverOptions {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const useHover = ({ onMouseEnter, onMouseLeave }: UseHoverOptions = {}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onMouseEnter?.();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onMouseLeave?.();
  }, [onMouseLeave]);

  return {
    isHovered,
    bind: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}; 