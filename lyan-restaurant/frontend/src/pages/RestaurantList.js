import React, { useEffect, useState } from "react";
import { 
  Container, 
  Grid, 
  Typography, 
  CircularProgress,
  Alert
} from "@mui/material";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/restaurants");
        
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received");
        }

        setRestaurants(response.data);
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
        Our Restaurants
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
            <RestaurantCard 
              restaurant={restaurant}
              onSelect={() => window.location.href = `/restaurants/${restaurant._id}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RestaurantList;