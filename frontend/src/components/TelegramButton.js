import { useMemo, useCallback } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Telegram } from '@mui/icons-material';

const TelegramButton = () => {
  const telegramUsername = useMemo(() => 'lyanrestaurant', []); // Telegram username without @

  const handleClick = useCallback(() => {
    const message = 'Hello! I would like to inquire about your services.';
    const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [telegramUsername]);

  return (
    <Tooltip title="Chat on Telegram" placement="left">
      <Fab
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 90, sm: 100 },
          right: { xs: 16, sm: 24 },
          backgroundColor: '#0088cc',
          color: 'white',
          width: { xs: 56, sm: 64 },
          height: { xs: 56, sm: 64 },
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#006699',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 136, 204, 0.4)',
        }}
      >
        <Telegram sx={{ fontSize: { xs: 28, sm: 32 } }} />
      </Fab>
    </Tooltip>
  );
};

export default TelegramButton;
