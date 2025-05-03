import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const RestaurantList = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Restaurant List
      </Typography>
      <Button 
        variant="contained" 
        sx={{ mb: 3 }}
      >
        Add New Restaurant
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Add restaurant data rows here */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RestaurantList;