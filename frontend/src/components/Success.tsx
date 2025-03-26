import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface SuccessProps {
  message: string;
  onAction?: () => void;
  actionText?: string;
}

export const Success: React.FC<SuccessProps> = ({
  message,
  onAction,
  actionText = 'Continue',
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      textAlign="center"
      p={3}
    >
      <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h6" color="success.main" gutterBottom>
        Success
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}; 