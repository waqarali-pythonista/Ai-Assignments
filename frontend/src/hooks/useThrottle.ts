import { useState, useEffect, useRef } from 'react';

interface UseThrottleOptions {
  delay: number;
  initialValue?: any;
}

export const useThrottle = <T>({
  delay,
  initialValue,
}: UseThrottleOptions) => {
  const [value, setValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastExecuted.current + delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    }
  }, [value, delay]);

  return {
    value,
    setValue,
    throttledValue,
  };
}; 