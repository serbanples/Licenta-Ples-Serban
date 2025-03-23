import React, { createContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { ToastContextType } from './types';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  
  const showToast = (newMessage: string, newSeverity: AlertColor = 'info') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };
  
  const hideToast = () => {
    setOpen(false);
  };
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={hideToast} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};