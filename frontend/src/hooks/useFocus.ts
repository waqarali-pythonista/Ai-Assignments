import { useState, useCallback } from 'react';

interface UseFocusOptions {
  onFocus?: () => void;
  onBlur?: () => void;
}

export const useFocus = ({ onFocus, onBlur }: UseFocusOptions = {}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return {
    isFocused,
    bind: {
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}; 