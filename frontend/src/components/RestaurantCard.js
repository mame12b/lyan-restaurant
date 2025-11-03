import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
    return (
        <Card>
            <CardMedia component="img" height="140" image={restaurant.image || "https://via.placeholder.com/300"} alt={restaurant.name} />
            <CardContent>
                <Typography variant="h5">{restaurant.name}</Typography>
                <Typography variant="body2">{restaurant.description}</Typography>
                <Button component={Link} to={`/restaurants/${restaurant._id}`} variant="contained" color="primary" fullWidth>
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
};

export default RestaurantCard;
