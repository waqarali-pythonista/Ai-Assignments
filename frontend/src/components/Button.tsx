import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({
  loading,
  disabled,
  children,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </MuiButton>
  );
}; 