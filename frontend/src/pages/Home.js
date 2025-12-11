import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BungalowIcon from '@mui/icons-material/Bungalow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import partnerLogos from '../data/partnerLogos';

// Hero background image
const heroImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=60&fm=webp';

const serviceHighlights = [
  {
    title: 'Culinary Excellence',
    description: 'Award-winning chefs blending Ethiopian flavors with global gastronomy.',
    icon: <RestaurantIcon fontSize="large" />,
    color: '#D4AF37',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Event Design',
    description: 'Immersive environments and decor tailored to your vision.',
    icon: <CelebrationIcon fontSize="large" />,
    color: '#FFD700',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da1a56d?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Photography',
    description: 'Professional photography and videography to capture every moment.',
    icon: <CameraAltIcon fontSize="large" />,
    color: '#B8860B',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Premium Venues',
    description: 'Exclusive partnerships with iconic venues across Addis Ababa.',
    icon: <BungalowIcon fontSize="large" />,
    color: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da1a56d?auto=format&fit=crop&w=800&q=80',
    video: null
  }
];

const showcaseItems = [
  {
    title: 'Luxury Weddings',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da1a56d?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Corporate Events',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Cultural Celebrations',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    video: null
  },
  {
    title: 'Private Dining',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    video: null
  }
];

const stats = [
  { value: '500+', label: 'Events Delivered' },
  { value: '200+', label: 'Happy Clients' },
  { value: '50K+', label: 'Guests Served' }
];

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const slideUp = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <Box sx={{ bgcolor: '#f6f8fb', overflow: 'hidden' }}>
      {/* Hero Section - Simplified */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '85vh', md: '92vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.88) 0%, rgba(212,175,55,0.75) 50%, rgba(184,134,11,0.85) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' }
        }}
      >
        {/* Overlay pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent 60%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Brand Logo/Name */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' },
                  lineHeight: 1,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.02em'
                }}
              >
                LYAN
              </Typography>
            </Box>

            {/* Question-based Tagline */}
            <Typography
              variant="h5"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                mb: 5,
                fontWeight: 600,
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                opacity: 0.95,
                lineHeight: 1.4
              }}
            >
              
            </Typography>

            {/* CTA Button */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <Button
                component={Link}
                to="/packages"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.75, md: 2.25 },
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  borderRadius: '50px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                  color: '#1a1a1a',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 12px 48px rgba(212,175,55,0.5)',
                    background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                  }
                }}
              >
                Explore Our Packages
              </Button>
            </motion.div>

            {/* Stats */}
            <Stack 
              direction="row" 
              spacing={{ xs: 3, sm: 4, md: 6 }} 
              justifyContent="center"
              alignItems="center"
              sx={{ mt: { xs: 6, md: 8 } }}
            >
              {stats.map((stat) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      color: '#FFD700',
                      mb: 0.5
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                      fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideUp}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              letterSpacing: 3,
              color: 'primary.main',
              fontWeight: 600,
              mb: 1
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            What We Offer
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 600, mx: 'auto', mb: 6, fontSize: '1.1rem' }}
          >
            From culinary excellence to flawless execution, we bring your vision to life
          </Typography>

          <Grid container spacing={4}>
            {serviceHighlights.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={service.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      border: `2px solid ${alpha(service.color, 0.2)}`,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-16px) scale(1.02)',
                        boxShadow: `0 24px 48px ${alpha(service.color, 0.25)}`,
                        borderColor: service.color,
                        '& .service-image': {
                          transform: 'scale(1.1)',
                        },
                        '& .service-overlay': {
                          opacity: 0.95
                        },
                        '& .service-icon': {
                          transform: 'scale(1.2) rotate(10deg)'
                        }
                      }
                    }}
                  >
                    {/* Background Image */}
                    <Box
                      sx={{
                        position: 'relative',
                        height: 200,
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        className="service-image"
                        image={service.image}
                        alt={service.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <Box
                        className="service-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(180deg, ${alpha(service.color, 0.7)} 0%, ${alpha(service.color, 0.9)} 100%)`,
                          opacity: 0.85,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Box
                          className="service-icon"
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.95)',
                            color: service.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                          }}
                        >
                          {service.icon}
                        </Box>
                      </Box>

                      {/* Play Icon for Video Placeholder */}
                      <PlayCircleIcon
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontSize: 32,
                          color: 'white',
                          opacity: 0.9,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          zIndex: 2
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        gutterBottom
                        sx={{ 
                          color: service.color,
                          mb: 1.5
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ lineHeight: 1.7 }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Event Showcase Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideUp}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                letterSpacing: 3,
                color: 'primary.main',
                fontWeight: 600,
                mb: 1
              }}
            >
              Our Work
            </Typography>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Events We&apos;ve Crafted
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 620, mx: 'auto', mb: 6, fontSize: '1.1rem' }}
            >
              See how we bring visions to life through stunning events and celebrations
            </Typography>

            <Grid container spacing={3}>
              {showcaseItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        height: 300,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          '& .overlay': {
                            opacity: 0.9
                          },
                          '& .play-icon': {
                            transform: 'scale(1.2)',
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Overlay */}
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                          opacity: 0.7,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          p: 3
                        }}
                      >
                        {/* Play Icon for video placeholder */}
                        <PlayCircleIcon
                          className="play-icon"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 64,
                            color: 'white',
                            opacity: 0.8,
                            transition: 'all 0.3s ease',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                          }}
                        />
                        
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            textAlign: 'center',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(135deg, rgba(26,26,26,0.05) 0%, rgba(212,175,55,0.15) 50%, rgba(184,134,11,0.1) 100%)'
        }}
      >
        <Container maxWidth="md">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.75rem' }
                }}
              >
                Ready to Create Your Event?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 540, mx: 'auto', mb: 5, fontSize: '1.15rem', lineHeight: 1.7 }}
              >
                Let&apos;s bring your vision to life. Explore our packages and start planning your unforgettable event today.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  component={Link}
                  to="/packages"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    backgroundColor: '#D4AF37',
                    color: '#1a1a1a',
                    boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                    '&:hover': {
                      backgroundColor: '#B8860B',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(212,175,55,0.4)'
                    }
                  }}
                >
                  View All Packages
                </Button>
                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: '#D4AF37',
                    color: '#D4AF37',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#B8860B',
                      backgroundColor: alpha('#D4AF37', 0.05),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Contact Us
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Partners Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideUp}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                letterSpacing: 3,
                color: '#D4AF37',
                fontWeight: 600,
                mb: 1
              }}
            >
              Trusted By
            </Typography>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Working With Us
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 620, mx: 'auto', mb: 6, fontSize: '1.1rem' }}
            >
              Proud to collaborate with leading Ethiopian brands and organizations
            </Typography>

            <Grid container spacing={4} justifyContent="center" alignItems="center">
              {partnerLogos.map((partner, index) => (
                <Grid item xs={6} sm={4} md={2} key={partner.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 12px 24px rgba(212,175,55,0.15)'
                        }
                      }}
                    >
                      <img
                        src={partner.lightLogo}
                        alt={partner.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'opacity 0.3s ease',
                          opacity: 0.8
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                      />
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 2, sm: 3 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: { xs: 1.5, sm: 3 }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                fontWeight: 500
              }}
            >
              Quick Contact:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<WhatsAppIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                href="https://wa.me/971563561803"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: '#25D366',
                  color: '#25D366',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  textTransform: 'none',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  minWidth: { xs: '110px', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#25D366',
                    bgcolor: alpha('#25D366', 0.08)
                  }
                }}
              >
                WhatsApp
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<TelegramIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                href="https://t.me/+971563561803"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: '#0088cc',
                  color: '#0088cc',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  textTransform: 'none',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  minWidth: { xs: '110px', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#0088cc',
                    bgcolor: alpha('#0088cc', 0.08)
                  }
                }}
              >
                Telegram
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
