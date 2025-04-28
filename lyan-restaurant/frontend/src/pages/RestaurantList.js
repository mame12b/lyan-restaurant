import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/restaurants");
                setRestaurants(response.data);
            } catch (error) {
                console.error("Failed to load restaurants:", error);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Restaurants</Typography>
            <Grid container spacing={3}>
                {restaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                        <RestaurantCard restaurant={restaurant} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RestaurantList;
