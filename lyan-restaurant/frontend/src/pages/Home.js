// import { useEffect, useState } from "react";
// import API from "../utils/api";

// const Home= ()=>{
//     const[ restaurants, setRestaurants]= useState([]);

//     useEffect (()=>{
//         const fetchRestaurants= async()=>{
//             try {
//                 const{data}= await API.get("/restuarants");
//                 setRestaurants(data);
//             } catch (err) {
//                 console.error("Error fetching restaurants:", err);
//             }
//         };
//         fetchRestaurants();
//     }, []);

//     return (
//         <div>
//         <h1>Welcome to Our Restaurant & Catering Booking</h1>
//         <h2>Available Restaurants</h2>
//         <ul>
//           {restaurants.map((restaurant) => (
//             <li key={restaurant._id}>{restaurant.name}</li>
//           ))}
//         </ul>
//       </div>
//     );
// };

// export default Home;
import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom>Welcome to Lyan Restaurant & Catering!</Typography>
      <Typography variant="h6" paragraph>
        Book tables, order catering, and enjoy our delicious menus.
      </Typography>
      <Button variant="contained" component={Link} to="/restaurants" sx={{ mt: 2 }}>
        Explore Restaurants
      </Button>
    </Container>
  );
};

export default Home;
