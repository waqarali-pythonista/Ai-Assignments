import { useState, useEffect } from 'react';

interface UseDebounceOptions {
  delay: number;
  initialValue?: any;
}

export const useDebounce = <T>({
  delay,
  initialValue,
}: UseDebounceOptions) => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return {
    value,
    setValue,
    debouncedValue,
  };
}; 