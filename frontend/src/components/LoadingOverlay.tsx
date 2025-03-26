import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Loading...',
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Backdrop>
  );
}; 