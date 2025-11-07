import React, { memo } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      flexDirection="column"
      gap={2}
    >
      <CircularProgress color="primary" size={60} />
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default memo(LoadingSpinner);