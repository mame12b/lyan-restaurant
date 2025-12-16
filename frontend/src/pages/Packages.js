import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { packageAPI, inquiryAPI } from '../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import CloseIcon from '@mui/icons-material/Close';

const categoryOptions = [
  { value: 'all', label: 'All Packages', color: '#D4AF37' },
  { value: 'wedding', label: 'Weddings', color: '#D4AF37' },
  { value: 'corporate', label: 'Corporate', color: '#1a1a1a' },
  { value: 'birthday', label: 'Birthdays', color: '#B8860B' },
  { value: 'cultural', label: 'Cultural', color: '#DAA520' },
  { value: 'private-dining', label: 'Private Dining', color: '#FFD700' }
];

const fallbackImage = 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80';

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

const Packages = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null); // 'whatsapp' or 'telegram'
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phoneNumber: '',
    eventDate: '',
    guests: '',
    location: '',
    notes: ''
  });

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const filters = categoryFilter !== 'all' ? { category: categoryFilter } : {};
      console.log('Fetching packages with filters:', filters);
      const response = await packageAPI.getAll(filters);
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      const items = response?.data?.data ?? response?.data ?? [];
      console.log('Parsed items:', items);
      console.log('Items length:', items.length);
      setPackages(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      const message = err?.message || err?.data?.message || 'Failed to load packages';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleDirectWhatsApp = (pkg) => {
    navigate('/booking', { state: { packageData: pkg, platform: 'whatsapp' } });
  };

  const handleDirectTelegram = (pkg) => {
    navigate('/booking', { state: { packageData: pkg, platform: 'telegram' } });
  };

  const handleCloseDialog = () => {
    setBookingDialog(false);
    setSelectedPackage(null);
    setSelectedPlatform(null);
  };

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleWhatsAppBooking = async () => {
    const message = `🎉 *LYAN Restaurant Booking*\\n\\n` +
      `Package: *${selectedPackage.name}*\\n` +
      `Price: ${formatPrice(calculateDiscountedPrice(selectedPackage))}\\n\\n` +
      `Name: ${bookingForm.name}\\n` +
      `Phone: ${bookingForm.phoneNumber}\\n` +
      `Event Date: ${bookingForm.eventDate}\\n` +
      `Guests: ${bookingForm.guests || 'Not specified'}\\n` +
      `Location: ${bookingForm.location || 'Not specified'}\\n` +
      `Notes: ${bookingForm.notes || 'None'}`;

    try {
      await inquiryAPI.create({
        ...bookingForm,
        packageId: selectedPackage._id
      });

      window.open(`https://wa.me/+971563561803?text=${encodeURIComponent(message)}`, '_blank');
      toast.success('Opening WhatsApp...');
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      // Still open WhatsApp even if save fails
      window.open(`https://wa.me/+971563561803?text=${encodeURIComponent(message)}`, '_blank');
      toast.warning('Booking saved locally, opening WhatsApp...');
      handleCloseDialog();
    }
  };

  const handleTelegramBooking = async () => {
    try {
      const response = await inquiryAPI.create({
        ...bookingForm,
        packageId: selectedPackage._id
      });

      if (response && response.success) {
        const inquiryId = response.data._id;
        window.open(`https://t.me/LyanEventsBot?start=inquiry_${inquiryId}`, '_blank');
        toast.success('Opening Telegram...');
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process booking. Please try again.');
    }
  };

  const handleSubmitBooking = () => {
    // Validate required fields
    if (!bookingForm.name || !bookingForm.phoneNumber || !bookingForm.eventDate) {
      toast.error('Please fill in your name, phone number, and event date');
      return;
    }

    if (selectedPlatform === 'whatsapp') {
      handleWhatsAppBooking();
    } else if (selectedPlatform === 'telegram') {
      handleTelegramBooking();
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Box sx={{ bgcolor: '#f6f8fb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(212,175,55,0.88) 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12), transparent 50%)'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Our Event Packages
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              Choose from our curated selection of packages designed to make your event unforgettable
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Category Filter */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 6, position: 'relative', zIndex: 2 }}>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'white'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              Filter by Category
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              {categoryOptions.map((cat) => (
                <Chip
                  key={cat.value}
                  label={cat.label}
                  onClick={() => setCategoryFilter(cat.value)}
                  variant={categoryFilter === cat.value ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 2.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderColor: categoryFilter === cat.value ? cat.color : 'divider',
                    bgcolor: categoryFilter === cat.value ? cat.color : 'transparent',
                    color: categoryFilter === cat.value ? 'white' : 'text.primary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: cat.color,
                      bgcolor: categoryFilter === cat.value ? cat.color : alpha(cat.color, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </motion.div>
      </Container>

      {/* Packages Grid */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} sx={{ color: '#D4AF37' }} />
          </Box>
        ) : error ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: alpha(theme.palette.error.main, 0.05)
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={fetchPackages}
              sx={{
                mt: 2,
                bgcolor: '#D4AF37',
                color: '#1a1a1a',
                '&:hover': { bgcolor: '#B8860B' }
              }}
            >
              Try Again
            </Button>
          </Paper>
        ) : packages.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No packages available in this category
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setCategoryFilter('all')}
              sx={{ mt: 2 }}
            >
              View All Packages
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {packages.map((pkg, index) => {
              const discountedPrice = calculateDiscountedPrice(pkg);
              const hasDiscount = pkg.discount && Number(pkg.discount) > 0;
              const categoryColor =
                categoryOptions.find((c) => c.value === pkg.category)?.color || '#D4AF37';

              return (
                <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid',
                        borderColor: 'transparent',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: `0 24px 48px ${alpha(categoryColor, 0.2)}`,
                          borderColor: alpha(categoryColor, 0.3)
                        }
                      }}
                    >
                      {/* Image */}
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={pkg.image || fallbackImage}
                          alt={pkg.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImage;
                          }}
                          sx={{ objectFit: 'cover' }}
                        />
                        
                        {/* Category Badge */}
                        <Chip
                          label={pkg.category?.replace('-', ' ').toUpperCase() || 'EVENT'}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: categoryColor,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            letterSpacing: 0.5
                          }}
                        />

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              bgcolor: '#D4AF37',
                              color: '#1a1a1a',
                              px: 2,
                              py: 0.75,
                              borderRadius: 2,
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              boxShadow: '0 4px 12px rgba(218,18,26,0.4)'
                            }}
                          >
                            <LocalOfferIcon fontSize="small" />
                            {pkg.discount}% OFF
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Package Name */}
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{
                            fontWeight: 800,
                            mb: 2,
                            color: 'text.primary'
                          }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            lineHeight: 1.7,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {pkg.description}
                        </Typography>

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <Stack spacing={1} sx={{ mb: 3 }}>
                            {pkg.features.slice(0, 3).map((feature, idx) => (
                              <Stack
                                key={idx}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <CheckCircleIcon
                                  sx={{ fontSize: 18, color: categoryColor }}
                                />
                                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                  {feature}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        )}

                        {/* Max Guests */}
                        {pkg.maxGuests && (
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              Up to {pkg.maxGuests} guests
                            </Typography>
                          </Stack>
                        )}

                        {/* Price */}
                        <Box sx={{ mt: 'auto' }}>
                          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                            {hasDiscount && (
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: 'text.disabled'
                                }}
                              >
                                {formatPrice(pkg.price)}
                              </Typography>
                            )}
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 900,
                                color: categoryColor
                              }}
                            >
                              {formatPrice(discountedPrice)}
                            </Typography>
                          </Stack>

                          {/* WhatsApp and Telegram Buttons */}
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<WhatsAppIcon />}
                              onClick={() => handleDirectWhatsApp(pkg)}
                              sx={{
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                bgcolor: '#25D366',
                                boxShadow: '0 8px 16px rgba(37,211,102,0.3)',
                                '&:hover': {
                                  bgcolor: '#128C7E',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 12px 24px rgba(37,211,102,0.4)'
                                }
                              }}
                            >
                              WhatsApp
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<TelegramIcon />}
                              onClick={() => handleDirectTelegram(pkg)}
                              sx={{
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                bgcolor: '#0088cc',
                                boxShadow: '0 8px 16px rgba(0,136,204,0.3)',
                                '&:hover': {
                                  bgcolor: '#0077b5',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 12px 24px rgba(0,136,204,0.4)'
                                }
                              }}
                            >
                              Telegram
                            </Button>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Quick Contact Section */}
      <Box sx={{ 
        py: { xs: 4, sm: 6 }, 
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Have Questions? Contact Us Directly
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                fontWeight: 500,
                maxWidth: '600px'
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
                size="medium"
                startIcon={<WhatsAppIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                href="https://wa.me/971563561803"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: '#25D366',
                  color: '#25D366',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  minWidth: { xs: '120px', sm: '140px' },
                  fontWeight: 600,
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
                size="medium"
                startIcon={<TelegramIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                href="https://t.me/+971563561803"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: '#0088cc',
                  color: '#0088cc',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  minWidth: { xs: '120px', sm: '140px' },
                  fontWeight: 600,
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

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Book {selectedPackage?.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  via
                </Typography>
                {selectedPlatform === 'whatsapp' ? (
                  <Chip
                    icon={<WhatsAppIcon />}
                    label="WhatsApp"
                    size="small"
                    sx={{ bgcolor: '#25D366', color: 'white', fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    icon={<TelegramIcon />}
                    label="Telegram"
                    size="small"
                    sx={{ bgcolor: '#0088cc', color: 'white', fontWeight: 600 }}
                  />
                )}
              </Stack>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Please fill in your details to proceed with the booking:
            </Typography>
            <TextField
              label="Your Name"
              name="name"
              value={bookingForm.name}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={bookingForm.phoneNumber}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Event Date"
              name="eventDate"
              type="date"
              value={bookingForm.eventDate}
              onChange={handleFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Number of Guests"
                name="guests"
                type="number"
                value={bookingForm.guests}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={bookingForm.location}
                onChange={handleFormChange}
                fullWidth
              />
            </Stack>
            <TextField
              label="Special Requests / Notes"
              name="notes"
              value={bookingForm.notes}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
            
            {/* Single Proceed Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={selectedPlatform === 'whatsapp' ? <WhatsAppIcon /> : <TelegramIcon />}
              onClick={handleSubmitBooking}
              sx={{
                py: 2,
                bgcolor: selectedPlatform === 'whatsapp' ? '#25D366' : '#0088cc',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                boxShadow: selectedPlatform === 'whatsapp' 
                  ? '0 8px 24px rgba(37,211,102,0.3)' 
                  : '0 8px 24px rgba(0,136,204,0.3)',
                '&:hover': {
                  bgcolor: selectedPlatform === 'whatsapp' ? '#128C7E' : '#0077b5',
                  transform: 'translateY(-2px)',
                  boxShadow: selectedPlatform === 'whatsapp' 
                    ? '0 12px 32px rgba(37,211,102,0.4)' 
                    : '0 12px 32px rgba(0,136,204,0.4)'
                }
              }}
            >
              Continue to {selectedPlatform === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
            </Button>
            
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Click to open {selectedPlatform === 'whatsapp' ? 'WhatsApp' : 'Telegram'} and complete your booking
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Packages;
