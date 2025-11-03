import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let url = '/api/packages';
      const params = new URLSearchParams();
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (eventTypeFilter !== 'all') {
        params.append('eventType', eventTypeFilter);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const { data } = await axios.get(url);
      setPackages(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load packages');
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, eventTypeFilter]);

  const handleBookNow = (packageId) => {
    navigate(`/booking?package=${packageId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ብር'; // Birr symbol
  };

  const categoryColors = {
    catering: '#FF6B6B',
    decoration: '#4ECDC4',
    'full-package': '#FFD93D',
    venue: '#6C5CE7',
    photography: '#A8E6CF'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#2C3E50',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          የእኛ ፓኬጆች | Our Packages
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Choose the perfect package for your special event. Quality service at affordable prices!
        </Typography>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="catering">Catering</MenuItem>
              <MenuItem value="decoration">Decoration</MenuItem>
              <MenuItem value="full-package">Full Package</MenuItem>
              <MenuItem value="venue">Venue</MenuItem>
              <MenuItem value="photography">Photography</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={eventTypeFilter}
              label="Event Type"
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Events</MenuItem>
              <MenuItem value="wedding">Wedding</MenuItem>
              <MenuItem value="birthday">Birthday</MenuItem>
              <MenuItem value="engagement">Engagement</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="bridal-shower">Bridal Shower</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary">
            No packages found. Please try different filters.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {packages.map((pkg, index) => (
            <Grid item xs={12} sm={6} md={4} key={pkg._id}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    },
                    position: 'relative'
                  }}
                >
                  {pkg.discount > 0 && (
                    <Chip
                      label={`${pkg.discount}% OFF`}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                  
                  <CardMedia
                    component="img"
                    height="240"
                    image={pkg.image}
                    alt={pkg.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box mb={2}>
                      <Chip
                        label={pkg.category}
                        size="small"
                        sx={{
                          backgroundColor: categoryColors[pkg.category] || '#95A5A6',
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      />
                    </Box>
                    
                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                      {pkg.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {pkg.description}
                    </Typography>
                    
                    {pkg.features && pkg.features.length > 0 && (
                      <Box mb={2}>
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                          <Typography key={idx} variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
                            ✓ {feature}
                          </Typography>
                        ))}
                        {pkg.features.length > 3 && (
                          <Typography variant="body2" color="primary" sx={{ fontSize: '0.85rem' }}>
                            + {pkg.features.length - 3} more...
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    <Box mt="auto">
                      <Box display="flex" alignItems="baseline" gap={1} mb={2}>
                        {pkg.discount > 0 ? (
                          <>
                            <Typography
                              variant="h5"
                              color="error"
                              fontWeight="bold"
                            >
                              {formatPrice(pkg.discountedPrice)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              {formatPrice(pkg.price)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="h5" color="primary" fontWeight="bold">
                            {formatPrice(pkg.price)}
                          </Typography>
                        )}
                      </Box>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => handleBookNow(pkg._id)}
                        sx={{
                          backgroundColor: '#2C3E50',
                          '&:hover': {
                            backgroundColor: '#1A252F'
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Call to Action */}
      <Box textAlign="center" mt={8} p={4} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Need a Custom Package?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Contact us directly for personalized event planning services
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/contact')}
          sx={{ mr: 2 }}
        >
          Contact Us
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.open('https://wa.me/251912345678', '_blank')}
          sx={{
            backgroundColor: '#25D366',
            '&:hover': {
              backgroundColor: '#1DA851'
            }
          }}
        >
          💬 WhatsApp Us
        </Button>
      </Box>
    </Container>
  );
};

export default Packages;
