import React, { createContext, useContext, useState } from 'react';
import { LoadingOverlay } from '../components/LoadingOverlay';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoading = (message: string = 'Loading...') => {
    setMessage(message);
    setOpen(true);
  };

  const hideLoading = () => {
    setOpen(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingOverlay open={open} message={message} />
    </LoadingContext.Provider>
  );
}; 