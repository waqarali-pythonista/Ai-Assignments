import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  error?: boolean;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      error={error}
      helperText={helperText}
      {...props}
    />
  );
}; 