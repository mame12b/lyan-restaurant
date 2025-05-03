import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import axios from "axios";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        
        if (!response.data) {
          navigate("/not-found");
          return;
        }

        setRestaurant(response.data);
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;

  return (
    <Container maxWidth="lg">
      <Button 
        variant="outlined" 
        onClick={() => navigate("/restaurants")}
        sx={{ mb: 4 }}
      >
        &larr; Back to Restaurants
      </Button>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {restaurant && (
        <>
          <Typography variant="h2" gutterBottom>
            {restaurant.name}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {restaurant.description}
          </Typography>

          <Button 
            variant="contained" 
            onClick={() => navigate(`/menu/${id}`)}
            sx={{ mt: 2, mb: 4 }}
          >
            View Full Menu &rarr;
          </Button>

          <Typography variant="h4" gutterBottom>
            Popular Items
          </Typography>
          
          <Grid container spacing={3}>
            {restaurant.popularItems?.slice(0, 3).map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default RestaurantDetails;