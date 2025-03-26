import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  key: string;
  initialValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export const useLocalStorage = <T>({
  key,
  initialValue,
  serializer = JSON.stringify,
  deserializer = JSON.parse,
}: UseLocalStorageOptions<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, serializer(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue, serializer]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (error) {
        console.error('Error setting localStorage value:', error);
      }
    },
    [storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
}; 