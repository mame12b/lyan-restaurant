import React, { memo, useCallback, useMemo } from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = () => {
  const whatsappNumber = useMemo(() => '251912345678', []); // Ethiopian number format
  const message = useMemo(
    () => 'Hello LYAN! I would like to inquire about your catering and event services.',
    []
  );

  const handleClick = useCallback(() => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [whatsappNumber, message]);

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Fab
        color="success"
        aria-label="whatsapp"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
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

export default memo(WhatsAppButton);
