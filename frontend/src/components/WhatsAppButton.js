import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = () => {
  const whatsappNumber = '251912345678'; // Ethiopian number format
  const message = 'Hello LYAN! I would like to inquire about your catering and event services.';
  
  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Fab
        color="success"
        aria-label="whatsapp"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#25D366',
          '&:hover': {
            backgroundColor: '#1DA851'
          },
          zIndex: 1000,
          width: 60,
          height: 60
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Tooltip>
  );
};

export default WhatsAppButton;
