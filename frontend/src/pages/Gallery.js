import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const buildSrcSet = (url, widths = [480, 768, 1200]) =>
  widths
    .map((width) => `${url.replace(/w=\d+/g, `w=${width}`)} ${width}w`)
    .join(', ');

const Gallery = () => {
  // Sample gallery images - replace with real images from backend
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      title: 'Ethiopian Wedding Celebration',
      category: 'wedding'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      title: 'Birthday Party Decoration',
      category: 'birthday'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
      title: 'Catering Service',
      category: 'catering'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      title: 'Engagement Ceremony',
      category: 'engagement'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1519167758481-83f29da8c1cb?w=800',
      title: 'Corporate Meeting Setup',
      category: 'meeting'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',
      title: 'Bridal Shower Event',
      category: 'bridal-shower'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
      title: 'Traditional Ethiopian Coffee Ceremony',
      category: 'cultural'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      title: 'Gourmet Plating',
      category: 'catering'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1519167758481-83f29da8c1cb?w=800',
      title: 'Elegant Table Setting',
      category: 'decoration'
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

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
          የእኛ ስራዎች | Our Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Explore our previous events and see the quality of our work
        </Typography>
      </Box>

      {/* Featured Carousel */}
      <Box mb={8} sx={{ 
        '& .slick-slide img': {
          width: '100%',
          height: '500px',
          objectFit: 'cover',
          borderRadius: 2
        },
        '& .slick-dots': {
          bottom: 20
        },
        '& .slick-dots li button:before': {
          color: 'white',
          fontSize: 12
        },
        '& .slick-prev, & .slick-next': {
          zIndex: 1
        },
        '& .slick-prev': {
          left: 25
        },
        '& .slick-next': {
          right: 25
        }
      }}>
        <Slider {...sliderSettings}>
          {galleryImages.slice(0, 5).map((image) => (
            <div key={image.id}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={image.url}
                  srcSet={buildSrcSet(image.url, [600, 960, 1280])}
                  sizes="(max-width: 900px) 100vw, 900px"
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 'auto' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {image.title}
                  </Typography>
                </Box>
              </Box>
            </div>
          ))}
        </Slider>
      </Box>

      {/* Gallery Grid */}
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={4}>
        Recent Events
      </Typography>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {galleryImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover img': {
                      transform: 'scale(1.1)'
                    },
                    '&:hover .overlay': {
                      opacity: 1
                    }
                  }}
                >
                  <img
                    src={image.url}
                    srcSet={buildSrcSet(image.url)}
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={image.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <Box textAlign="center" color="white">
                      <Typography variant="h6" fontWeight="bold">
                        {image.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Call to Action */}
      <Box textAlign="center" mt={8} p={4} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Ready to Create Your Perfect Event?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Let us bring your vision to life with our professional catering and event services
        </Typography>
        <Box>
          <a href="/packages" style={{ textDecoration: 'none', marginRight: 16 }}>
            <motion.button
              style={{
                backgroundColor: '#2C3E50',
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Packages
            </motion.button>
          </a>
          <a href="/booking" style={{ textDecoration: 'none' }}>
            <motion.button
              style={{
                backgroundColor: '#25D366',
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </a>
        </Box>
      </Box>
    </Container>
  );
};

export default Gallery;
