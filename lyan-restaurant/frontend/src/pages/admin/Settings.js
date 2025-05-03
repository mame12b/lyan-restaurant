import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';

const SettingsPanel = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <List sx={{ maxWidth: 600 }}>
        <ListItem>
          <ListItemText 
            primary="Notifications" 
            secondary="Enable system notifications" 
          />
          <Switch defaultChecked />
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem>
          <ListItemText 
            primary="Maintenance Mode" 
            secondary="Temporarily disable public access" 
          />
          <Switch />
        </ListItem>

        <Divider sx={{ my: 2 }} />
        
        <ListItem>
          <ListItemText 
            primary="Dark Theme" 
            secondary="Enable dark mode interface" 
          />
          <Switch />
        </ListItem>
      </List>
    </Box>
  );
};

export default SettingsPanel;