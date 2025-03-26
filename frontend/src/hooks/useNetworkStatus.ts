import { useState, useEffect } from 'react';

interface NetworkStatus {
  online: boolean;
  type: string | null;
  effectiveType: string | null;
  rtt: number | null;
  downlink: number | null;
  saveData: boolean | null;
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
    type: null,
    effectiveType: null,
    rtt: null,
    downlink: null,
    saveData: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, online: false }));
    };

    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setStatus((prev) => ({
          ...prev,
          type: connection.type,
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          downlink: connection.downlink,
          saveData: connection.saveData,
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return status;
}; 