import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Typography, Grid, Card, 
  CardMedia, Box, Chip, Badge
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Restaurant, Event, Celebration, Favorite, Cake, LocalDining,
  ShoppingBasket, MenuBook 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Reservation from './Reservation';

const Home = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
    // Fetch menu items
    useEffect(() => {
      const fetchMenu = async () => {
        try {
          const response = await axios.get('/api/menu');
          setMenuItems(response.data);
          setLoadingMenu(false);
        } catch (error) {
          console.error('Error fetching menu:', error);
          setLoadingMenu(false);
        }
      };
      fetchMenu();
    }, []);
  
    // Menu selection handlers
    const toggleMenuItem = (item) => {
      setSelectedItems(prev => {
        const exists = prev.some(i => i._id === item._id);
        return exists ? 
          prev.filter(i => i._id !== item._id) : 
          [...prev, { ...item, quantity: 1 }];
      });
    };
  
    const updateQuantity = (itemId, newQuantity) => {
      setSelectedItems(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
        )
      );
    };
  
    // Featured menu items
    const featuredMenu = menuItems.filter(item => item.featured).slice(0, 4);




  // Event types
  const eventTypes = [
    { title: 'Weddings', icon: <Favorite />, image: 'wedding' },
    { title: 'Birthdays', icon: <Cake />, image: 'birthday' },
    { title: 'Engagements', icon: <Celebration />, image: 'engagement' },
    { title: 'Corporate Events', icon: <Event />, image: 'corporate' }
  ];

  // Restaurant features
  const restaurantFeatures = [
    { title: 'Fine Dining', icon: <LocalDining />, image: 'fine-dining' },
    { title: 'Chef\'s Table', icon: <Restaurant />, image: 'chef-table' },
    { title: 'Wine Pairing', icon: <LocalDining />, image: 'wine' },
    { title: 'Seasonal Menu', icon: <Restaurant />, image: 'seasonal-menu' }
  ];

  return (
    <Box sx={{ 
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <Box sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
                    url(https://source.unsplash.com/random/1920x1080/?luxury-restaurant)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '3px solid #FFD700'
      }}>
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 1 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 300,
                  color: '#FFD700',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}
              >
                LYAN Restaurant & Events
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  color: '#ffffffcc',
                  fontWeight: 300
                }}
              >
                Where Culinary Excellence Meets Memorable Events
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="outlined" 
                    size="large"
                    component={Link} 
                    to="/reservation"
                    startIcon={<Restaurant sx={{ color: '#FFD700' }} />}
                    sx={{ 
                      px: 4,
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '&:hover': {
                        borderColor: '#C5A900',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }}
                  >
                    Book a Table
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    component={Link} 
                    to="/reservation"
                    startIcon={<Event sx={{ color: '#0a0a0a' }} />}
                    sx={{ 
                      px: 4,
                      backgroundColor: '#FFD700',
                      color: '#0a0a0a',
                      '&:hover': {
                        backgroundColor: '#C5A900'
                      }
                    }}
                  >
                    Plan an Event
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Restaurant Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 6,
              color: '#FFD700',
              fontWeight: 300,
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
          >
            Restaurant Experience
          </Typography>
          <Grid container spacing={4}>
            {restaurantFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #ffffff22'
                  }}>
                    <Box sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontSize: '3rem'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        color: '#FFD700',
                        fontWeight: 300
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://source.unsplash.com/random/800x600/?${feature.image}`}
                      alt={feature.title}
                      sx={{ borderRadius: 1 }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Catering Events */}
      <Box sx={{ 
        py: 8,
        background: `linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 100%)`
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideUp}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 6,
                color: '#FFD700',
                fontWeight: 300,
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            >
              Event Catering Services
            </Typography>
            <Grid container spacing={4}>
              {eventTypes.map((event, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card sx={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      height: 300,
                      '&:hover img': {
                        transform: 'scale(1.1)'
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={`https://source.unsplash.com/random/800x600/?${event.image}-event`}
                        alt={event.title}
                        sx={{ 
                          transition: 'transform 0.3s ease-in-out',
                          filter: 'brightness(0.7)'
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 3,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                      }}>
                        <Box sx={{ 
                          color: '#FFD700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5
                        }}>
                          {event.icon}
                          <Typography 
                            variant="h6" 
                            sx={{ fontWeight: 300 }}
                          >
                            {event.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Combined CTA */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 3,
              color: '#FFD700',
              fontWeight: 300
            }}
          >
                  {/* Featured Menu Section */}      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#FFD700',
                fontWeight: 300,
                textTransform: 'uppercase'
              }}
            >
              Featured Menu
            </Typography>
            <Button 
              component={Link} 
              to="/menu"
              endIcon={<MenuBook />}
              sx={{
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Full Menu
            </Button>
          </Box>

          <Grid container spacing={4}>
            {featuredMenu.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card 
                    onClick={() => toggleMenuItem(item)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      border: selectedItems.some(i => i._id === item._id) ? 
                        '2px solid #FFD700' : '2px solid transparent',
                      transition: 'border 0.3s ease',
                      backgroundColor: '#1a1a1a'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                      sx={{ filter: selectedItems.some(i => i._id === item._id) ? 
                        'brightness(1)' : 'brightness(0.7)' 
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }}>
                      <Chip 
                        label={`$${item.price}`} 
                        sx={{ backgroundColor: '#FFD700', color: '#0a0a0a' }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ color: '#FFD700' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff99' }}>
                        {item.description}
                      </Typography>
                      {selectedItems.some(i => i._id === item._id) && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id, selectedItems.find(i => i._id === item._id).quantity - 1);
                            }}
                            sx={{ 
                              minWidth: 30, 
                              color: '#FFD700', 
                              borderColor: '#FFD700' 
                            }}
                          >
                            -
                          </Button>
                          <Typography sx={{ color: '#FFD700' }}>
                            {selectedItems.find(i => i._id === item._id).quantity}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id, selectedItems.find(i => i._id === item._id).quantity + 1);
                            }}
                            sx={{ 
                              minWidth: 30, 
                              color: '#FFD700', 
                              borderColor: '#FFD700' 
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Selected Items CTA */}
      {selectedItems.length > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Button
              component={Link}
              to={{
                pathname: '/reserve',
                state: { selectedItems }
              }}
              variant="contained"
              startIcon={<ShoppingBasket />}
              sx={{
                px: 4,
                py: 2,
                backgroundColor: '#FFD700',
                color: '#0a0a0a',
                '&:hover': {
                  backgroundColor: '#C5A900'
                },
                boxShadow: 3,
                borderRadius: 2
              }}
            >
              Proceed to Reservation ({selectedItems.length})
            </Button>
          </motion.div>
        </Box>
       
  )}
            Experience the LYAN Difference
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: '#ffffff99',
              fontWeight: 300
            }}
          >
            Whether it's an intimate dinner or grand celebration
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                component={Link}
                to="/restaurant"
                startIcon={<Restaurant />}
                sx={{
                  px: 4,
                  backgroundColor: '#FFD700',
                  color: '#0a0a0a',
                  '&:hover': {
                    backgroundColor: '#C5A900'
                  }
                }}
              >
                View Restaurant
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/events"
                sx={{
                  px: 4,
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}
              >
                Explore Catering
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
      </Box>


  );
};

export default Home;