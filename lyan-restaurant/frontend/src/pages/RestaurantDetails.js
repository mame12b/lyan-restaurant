import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
                setRestaurant(res.data);
            } catch (error) {
                console.error("Failed to load restaurant details:", error);
            }
        };

        const fetchMenu = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/menu/${id}`);
                setMenu(res.data);
            } catch (error) {
                console.error("Failed to load menu:", error);
            }
        };

        fetchRestaurantDetails();
        fetchMenu();
    }, [id]);

    if (!restaurant) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4">{restaurant.name}</Typography>
            <Typography>{restaurant.description}</Typography>

            <Typography variant="h5" marginTop={4}>Menu</Typography>
            <Grid container spacing={2}>
                {menu.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography>${item.price}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RestaurantDetails;
