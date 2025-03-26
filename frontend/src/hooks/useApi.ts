import { useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { useNotification } from '../contexts/NotificationContext';

interface UseApiOptions {
  showLoading?: boolean;
  showNotification?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useApi = <T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) => {
  const {
    showLoading = true,
    showNotification = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const { showLoading: showGlobalLoading, hideLoading } = useLoading();
  const { showNotification: showGlobalNotification } = useNotification();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      if (showLoading) {
        showGlobalLoading();
      }

      const result = await apiFunction();
      setData(result);
      setError(null);

      if (showNotification) {
        showGlobalNotification(successMessage, 'success');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      setData(null);

      if (showNotification) {
        showGlobalNotification(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
      if (showLoading) {
        hideLoading();
      }
    }
  }, [
    apiFunction,
    showLoading,
    showNotification,
    successMessage,
    errorMessage,
    showGlobalLoading,
    hideLoading,
    showGlobalNotification,
  ]);

  return {
    data,
    error,
    loading,
    execute,
  };
}; 