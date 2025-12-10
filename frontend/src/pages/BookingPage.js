import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { inquiryAPI } from '../services/api';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const calculateDiscountedPrice = (pkg) => {
  const basePrice = Number(pkg?.price || 0);
  if (!pkg?.discount) {
    return basePrice;
  }
  return Math.round(basePrice * (1 - Number(pkg.discount) / 100));
};

const formatPrice = (price) => {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) {
    return '—';
  }
  return `${new Intl.NumberFormat('en-ET').format(numeric)} ብር`;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageData, platform } = location.state || {};

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phoneNumber: '',
    eventDate: '',
    guests: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (!packageData || !platform) {
      toast.error('Invalid booking request');
      navigate('/packages');
    }
  }, [packageData, platform, navigate]);

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async () => {
    if (!bookingForm.name || !bookingForm.phoneNumber || !bookingForm.eventDate) {
      toast.error('Please fill in your name, phone number, and event date');
      return;
    }

    try {
      const response = await inquiryAPI.create({
        ...bookingForm,
        packageId: packageData._id
      });

      if (platform === 'whatsapp') {
        const message = `🎉 *LYAN Restaurant Booking*\\n\\n` +
          `Package: *${packageData.name}*\\n` +
          `Price: ${formatPrice(calculateDiscountedPrice(packageData))}\\n\\n` +
          `Name: ${bookingForm.name}\\n` +
          `Phone: ${bookingForm.phoneNumber}\\n` +
          `Event Date: ${bookingForm.eventDate}\\n` +
          `Guests: ${bookingForm.guests || 'Not specified'}\\n` +
          `Location: ${bookingForm.location || 'Not specified'}\\n` +
          `Notes: ${bookingForm.notes || 'None'}`;

        window.open(`https://wa.me/+971563561803?text=${encodeURIComponent(message)}`, '_blank');
        toast.success('Opening WhatsApp...');
      } else if (platform === 'telegram') {
        if (response && response.success) {
          const inquiryId = response.data._id;
          window.open(`https://t.me/LyanEventsBot?start=inquiry_${inquiryId}`, '_blank');
          toast.success('Opening Telegram...');
        }
      }

      setTimeout(() => navigate('/packages'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process booking. Please try again.');
    }
  };

  if (!packageData) return null;

  const discountedPrice = calculateDiscountedPrice(packageData);

  return (
    <Box sx={{ bgcolor: '#f6f8fb', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(212,175,55,0.88) 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/packages')}
              sx={{
                color: 'white',
                mb: 3,
                '&:hover': { bgcolor: alpha('#fff', 0.1) }
              }}
            >
              Back to Packages
            </Button>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h3" fontWeight={900}>
                Complete Your Booking
              </Typography>
              {platform === 'whatsapp' ? (
                <Chip
                  icon={<WhatsAppIcon />}
                  label="via WhatsApp"
                  sx={{ bgcolor: '#25D366', color: 'white', fontWeight: 600, px: 2, py: 3 }}
                />
              ) : (
                <Chip
                  icon={<TelegramIcon />}
                  label="via Telegram"
                  sx={{ bgcolor: '#0088cc', color: 'white', fontWeight: 600, px: 2, py: 3 }}
                />
              )}
            </Stack>

            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
              You&apos;re almost there! Fill in your details below to finalize your event booking.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Grid container spacing={4}>
          {/* Booking Form */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Your Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    All fields are required except special requests
                  </Typography>

                  <Stack spacing={3}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      variant="outlined"
                    />

                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={bookingForm.phoneNumber}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      variant="outlined"
                      placeholder="+251 or +971"
                    />

                    <TextField
                      label="Event Date"
                      name="eventDate"
                      type="date"
                      value={bookingForm.eventDate}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Number of Guests"
                          name="guests"
                          type="number"
                          value={bookingForm.guests}
                          onChange={handleFormChange}
                          fullWidth
                          variant="outlined"
                          placeholder="50"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Event Location"
                          name="location"
                          value={bookingForm.location}
                          onChange={handleFormChange}
                          fullWidth
                          variant="outlined"
                          placeholder="Addis Ababa"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="Special Requests / Notes (Optional)"
                      name="notes"
                      value={bookingForm.notes}
                      onChange={handleFormChange}
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      placeholder="Tell us about any special requirements..."
                    />

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={platform === 'whatsapp' ? <WhatsAppIcon /> : <TelegramIcon />}
                      onClick={handleSubmitBooking}
                      sx={{
                        py: 2,
                        bgcolor: platform === 'whatsapp' ? '#25D366' : '#0088cc',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        borderRadius: 3,
                        mt: 2,
                        boxShadow: platform === 'whatsapp'
                          ? '0 8px 24px rgba(37,211,102,0.3)'
                          : '0 8px 24px rgba(0,136,204,0.3)',
                        '&:hover': {
                          bgcolor: platform === 'whatsapp' ? '#128C7E' : '#0077b5',
                          transform: 'translateY(-2px)',
                          boxShadow: platform === 'whatsapp'
                            ? '0 12px 32px rgba(37,211,102,0.4)'
                            : '0 12px 32px rgba(0,136,204,0.4)'
                        }
                      }}
                    >
                      Continue to {platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Package Summary */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: '#D4AF37',
                  position: 'sticky',
                  top: 20
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={packageData.image || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'}
                  alt={packageData.name}
                  sx={{ borderRadius: '16px 16px 0 0' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Chip
                        label={packageData.category}
                        size="small"
                        sx={{
                          bgcolor: alpha('#D4AF37', 0.1),
                          color: '#D4AF37',
                          fontWeight: 600,
                          mb: 1
                        }}
                      />
                      <Typography variant="h5" fontWeight={800}>
                        {packageData.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {packageData.description}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Features */}
                    {packageData.features && packageData.features.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          What&apos;s Included
                        </Typography>
                        <Stack spacing={1}>
                          {packageData.features.slice(0, 5).map((feature, idx) => (
                            <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                              <CheckCircleIcon sx={{ fontSize: 18, color: '#D4AF37', mt: 0.3 }} />
                              <Typography variant="body2">{feature}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    <Divider />

                    {/* Price Details */}
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <PeopleIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
                        <Typography variant="body2">
                          {packageData.minGuests} - {packageData.maxGuests} guests
                        </Typography>
                      </Stack>

                      {packageData.discount > 0 && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <LocalOfferIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
                          <Chip
                            label={`${packageData.discount}% OFF`}
                            size="small"
                            sx={{ bgcolor: '#D4AF37', color: '#1a1a1a', fontWeight: 700 }}
                          />
                        </Stack>
                      )}

                      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography variant="body2" color="text.secondary">
                          Total Price
                        </Typography>
                        <Box>
                          {packageData.discount > 0 && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                mr: 1
                              }}
                            >
                              {formatPrice(packageData.price)}
                            </Typography>
                          )}
                          <Typography variant="h4" fontWeight={900} color="#D4AF37">
                            {formatPrice(discountedPrice)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha('#D4AF37', 0.05),
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: '#D4AF37'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
                        <Typography variant="caption" fontWeight={600}>
                          Book now and secure your date!
                        </Typography>
                      </Stack>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPage;
