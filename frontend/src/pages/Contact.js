import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Telegram,
  WhatsApp
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contact = () => {
  const contactInfo = {
    phone: '+971 56 356 1803',
    email: 'info@lyancatering.com',
    address: 'Addis Ababa, Ethiopia',
    whatsapp: '971563561803',
    facebook: 'https://facebook.com/lyancatering',
    instagram: 'https://instagram.com/lyancatering',
    telegram: 'https://t.me/LyanEventsBot'
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
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
          ያግኙን | Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Get in touch with LYAN Catering & Events for exceptional event services
        </Typography>
      </Box>

      {/* Contact Cards */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4ECDC4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Phone sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Call Us
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {contactInfo.phone}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                href={`tel:${contactInfo.phone}`}
              >
                Call Now
              </Button>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#FF6B6B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Email sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Email Us
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {contactInfo.email}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                href={`mailto:${contactInfo.email}`}
              >
                Send Email
              </Button>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#FFD93D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <LocationOn sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Visit Us
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {contactInfo.address}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => window.open('https://maps.google.com/?q=Addis+Ababa,+Ethiopia', '_blank')}
              >
                Get Directions
              </Button>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Messaging CTAs */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              sx={{
                backgroundColor: '#25D366',
                color: 'white',
                p: 4,
                textAlign: 'center',
                height: '100%'
              }}
            >
              <WhatsApp sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                WhatsApp
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Get immediate responses to your questions
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleWhatsApp}
                sx={{
                  backgroundColor: 'white',
                  color: '#25D366',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                Chat on WhatsApp
              </Button>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card
              sx={{
                backgroundColor: '#0088cc',
                color: 'white',
                p: 4,
                textAlign: 'center',
                height: '100%'
              }}
            >
              <Telegram sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Telegram
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Fast and secure messaging support
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.open(contactInfo.telegram, '_blank')}
                sx={{
                  backgroundColor: 'white',
                  color: '#0088cc',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                Chat on Telegram
              </Button>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Social Media */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Follow Us on Social Media
        </Typography>
        <Box mt={3}>
          <IconButton
            href={contactInfo.facebook}
            target="_blank"
            sx={{
              mx: 1,
              backgroundColor: '#1877F2',
              color: 'white',
              '&:hover': { backgroundColor: '#145dbf' }
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            href={contactInfo.instagram}
            target="_blank"
            sx={{
              mx: 1,
              background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
              color: 'white',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            href={contactInfo.telegram}
            target="_blank"
            sx={{
              mx: 1,
              backgroundColor: '#0088cc',
              color: 'white',
              '&:hover': { backgroundColor: '#006699' }
            }}
          >
            <Telegram />
          </IconButton>
          <IconButton
            onClick={handleWhatsApp}
            sx={{
              mx: 1,
              backgroundColor: '#25D366',
              color: 'white',
              '&:hover': { backgroundColor: '#1DA851' }
            }}
          >
            <WhatsApp />
          </IconButton>
        </Box>
      </Box>

      {/* About Section */}
      <Card sx={{ p: 4, backgroundColor: '#F8F9FA' }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
          About LYAN Catering & Events
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 800, mx: 'auto' }}>
          LYAN Catering & Events is the premier event planning and catering service provider in Ethiopia. 
          We specialize in weddings, birthdays, engagements, corporate meetings, and all special occasions. 
          With years of experience and a passion for excellence, we bring your dream events to life with 
          professional catering, elegant decorations, and seamless event management. Our team is dedicated 
          to making every celebration memorable and stress-free.
        </Typography>
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            href="/packages"
            sx={{
              backgroundColor: '#2C3E50',
              mr: 2,
              '&:hover': {
                backgroundColor: '#1A252F'
              }
            }}
          >
            View Packages
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/booking"
          >
            Book Now
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default Contact;
