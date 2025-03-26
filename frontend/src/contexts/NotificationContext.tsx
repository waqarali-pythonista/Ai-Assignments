import React, { createContext, useContext, useState } from 'react';
import { AlertColor } from '@mui/material';
import { Notification } from '../components/Notification';

interface NotificationContextType {
  showNotification: (message: string, severity: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showNotification = (message: string, severity: AlertColor) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
}; 