import React from 'react';
import { 
  Container, Button, Typography, Grid, Card, CardContent,
  Box, CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Cake, Favorite, Event, CameraAlt, Restaurant, LocationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const ethiopianColors = {
    gold: '#D4AF37',
    green: '#078930',
    red: '#DA121A',
    yellow: '#FCDD09'
  };

  const eventPackages = [
    { 
      title: 'Weddings',
      description: 'Unforgettable wedding celebrations',
      icon: <Favorite sx={{ fontSize: 60, color: ethiopianColors.red }} />,
      image: 'https://source.unsplash.com/800x600/?ethiopian-wedding,celebration'
    },
    { 
      title: 'Birthdays',
      description: 'Special birthday parties',
      icon: <Cake sx={{ fontSize: 60, color: ethiopianColors.yellow }} />,
      image: 'https://source.unsplash.com/800x600/?birthday-party,celebration'
    },
    { 
      title: 'Engagements',
      description: 'Romantic engagement events',
      icon: <Favorite sx={{ fontSize: 60, color: ethiopianColors.gold }} />,
      image: 'https://source.unsplash.com/800x600/?engagement-party'
    },
    { 
      title: 'Corporate Events',
      description: 'Professional corporate gatherings',
      icon: <Event sx={{ fontSize: 60, color: ethiopianColors.green }} />,
      image: 'https://source.unsplash.com/800x600/?corporate-event,meeting'
    }
  ];

  const services = [
    {
      title: 'Catering',
      description: 'Premium Ethiopian and international cuisine',
      icon: <Restaurant />,
      color: ethiopianColors.red
    },
    {
      title: 'Decoration',
      description: 'Beautiful event decorations',
      icon: <CameraAlt />,
      color: ethiopianColors.yellow
    },
    {
      title: 'Venues',
      description: 'Perfect event venues',
      icon: <LocationOn />,
      color: ethiopianColors.green
    },
    {
      title: 'Photography',
      description: 'Professional photography services',
      icon: <CameraAlt />,
      color: ethiopianColors.gold
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box
        sx={{
          height: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                      url(https://source.unsplash.com/random/1920x1080/?ethiopian-celebration,event)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: `5px solid ${ethiopianColors.gold}`
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  mb: 2
                }}
              >
                LYAN Catering & Events
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.5rem' },
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                }}
              >
                Making Your Special Days Extraordinary
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    component={Link} 
                    to="/packages"
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      backgroundColor: ethiopianColors.gold,
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#B8941F' }
                    }}
                  >
                    Browse Packages
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outlined" 
                    size="large"
                    component={Link} 
                    to="/contact"
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: ethiopianColors.gold,
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div initial="hidden" whileInView="visible" variants={slideUp} viewport={{ once: true }}>
          <Typography 
            variant="h3" 
            sx={{ mb: 2, textAlign: 'center', fontWeight: 600, color: ethiopianColors.green }}
          >
            Our Event Services
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 6, textAlign: 'center', color: '#666', fontSize: '1.1rem' }}
          >
            We specialize in creating memorable experiences for every occasion
          </Typography>
          
          <Grid container spacing={4}>
            {eventPackages.map((pkg, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    '&:hover': { boxShadow: 8 }
                  }}>
                    <CardMedia component="img" height="200" image={pkg.image} alt={pkg.title} />
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>{pkg.icon}</Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        {pkg.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pkg.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/packages"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5, backgroundColor: ethiopianColors.green, '&:hover': { backgroundColor: '#056624' } }}
            >
              View All Packages
            </Button>
          </Box>
        </motion.div>
      </Container>

      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" variants={slideUp} viewport={{ once: true }}>
            <Typography 
              variant="h3" 
              sx={{ mb: 6, textAlign: 'center', fontWeight: 600, color: ethiopianColors.red }}
            >
              Our Services
            </Typography>
            
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      backgroundColor: '#fafafa',
                      border: `2px solid ${service.color}`,
                      boxShadow: 2
                    }}>
                      <Box sx={{ fontSize: '3rem', color: service.color, mb: 2 }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: service.color }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Box 
        sx={{ 
          py: 10,
          background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 100%)`,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <motion.div initial="hidden" whileInView="visible" variants={slideUp} viewport={{ once: true }}>
            <Typography 
              variant="h3" 
              sx={{ mb: 3, fontWeight: 700, color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Ready to Plan Your Event?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ mb: 4, color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Let us make your special day unforgettable together
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/booking"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    backgroundColor: 'white',
                    color: ethiopianColors.green,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}
                >
                  Book Now
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/gallery"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': { borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  View Gallery
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
