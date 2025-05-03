import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material';

const RestaurantDetails = () => {
  const { id } = useParams();

  // Temporary data - replace with API calls
  const restaurant = {
    id: id,
    name: "Sample Restaurant",
    cuisine: "Italian",
    location: "New York",
    rating: 4.5,
    status: "Active"
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {restaurant.name} Details
      </Typography>
      
      <Stack spacing={2} sx={{ maxWidth: 500 }}>
        <Divider textAlign="left">Basic Info</Divider>
        <Typography><strong>ID:</strong> {restaurant.id}</Typography>
        <Typography><strong>Cuisine:</strong> {restaurant.cuisine}</Typography>
        <Typography><strong>Location:</strong> {restaurant.location}</Typography>
        
        <Divider textAlign="left">Status</Divider>
        <Stack direction="row" spacing={1}>
          <Chip 
            label={restaurant.status} 
            color={restaurant.status === "Active" ? "success" : "error"} 
          />
          <Chip 
            label={`★ ${restaurant.rating}`} 
            color="warning" 
          />
        </Stack>
        
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Back to List
        </Button>
      </Stack>
    </Box>
  );
};

export default RestaurantDetails;