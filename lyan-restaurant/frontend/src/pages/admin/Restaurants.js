import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="page">
      <Typography variant="h4" mb={3}>Manage Restaurants</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>Add New Restaurant</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurants.map((rest) => (
            <TableRow key={rest._id}>
              <TableCell>{rest.name}</TableCell>
              <TableCell>{rest.location}</TableCell>
              <TableCell>
                <Button size="small" variant="outlined" color="primary">Edit</Button>
                <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Restaurants;
