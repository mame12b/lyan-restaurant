import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { packageAPI, inquiryAPI } from '../services/api';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

const categoryOptions = [
  { value: 'all', label: 'All experiences', accent: '#049669' },
  { value: 'wedding', label: 'Weddings & engagements', accent: '#D4AF37' },
  { value: 'corporate', label: 'Corporate events', accent: '#0F5B4F' },
  { value: 'birthday', label: 'Birthdays & celebrations', accent: '#F57C00' },
  { value: 'cultural', label: 'Cultural ceremonies', accent: '#6A1B9A' },
  { value: 'private-dining', label: 'Private dining', accent: '#FF6F61' },
  { value: 'other', label: 'Custom experiences', accent: '#546E7A' }
];

const eventOptions = [
  { value: 'all', label: 'All event types' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'conference', label: 'Conference' },
  { value: 'product-launch', label: 'Product launch' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'cultural', label: 'Cultural celebration' },
  { value: 'private-dining', label: 'Private dining' },
  { value: 'other', label: 'Other events' }
];

const categoryColors = {
  wedding: '#D4AF37',
  corporate: '#0F5B4F',
  birthday: '#F57C00',
  cultural: '#6A1B9A',
  'private-dining': '#FF6F61',
  other: '#546E7A'
};

const fallbackImage = 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80';
const WHATSAPP_NUMBER = '+971563561803';
const TELEGRAM_USERNAME = 'LyanEventsBot'; // Telegram username without @
const initialFormState = {
  name: '',
  eventDate: '',
  guests: '',
  location: '',
  notes: ''
};

const formatBookingDate = (value) => {
  if (!value) {
    return 'Not set';
  }

  try {
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return value;
  }
};

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingForm, setBookingForm] = useState({ ...initialFormState });

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};

      if (categoryFilter !== 'all') {
        filters.category = categoryFilter;
      }
      if (eventTypeFilter !== 'all') {
        filters.eventType = eventTypeFilter;
      }

      const response = await packageAPI.getAll(filters);
      const items = response?.data ?? [];
      setPackages(items);
      setError(null);
    } catch (err) {
      const message = err?.message || err?.data?.message || 'Failed to load packages';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, eventTypeFilter]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const heroStats = useMemo(() => {
    if (!packages.length) {
      return [
        { label: 'Experiences', value: '0', helper: 'Ready for your celebration' },
        { label: 'Event styles', value: '0', helper: 'Curated categories' },
        { label: 'Avg. investment', value: formatPrice(0), helper: 'Per event' },
        { label: 'Top savings', value: '0%', helper: 'Seasonal offers' }
      ];
    }

    const total = packages.length;
    const categoryCount = new Set(packages.map((pkg) => pkg.category)).size;
    const averagePrice = Math.round(
      packages.reduce((sum, pkg) => sum + Number(pkg.price || 0), 0) / total
    );
    const topDiscount = packages.reduce(
      (max, pkg) => Math.max(max, Number(pkg.discount || 0)),
      0
    );

    return [
      { label: 'Experiences', value: total, helper: 'Available to reserve' },
      { label: 'Event styles', value: categoryCount, helper: 'Unique celebrations' },
      { label: 'Avg. investment', value: formatPrice(averagePrice), helper: 'Per celebration' },
      { label: 'Top savings', value: `${topDiscount}%`, helper: 'Limited-time offers' }
    ];
  }, [packages]);

  const isFiltering = categoryFilter !== 'all' || eventTypeFilter !== 'all';

  const openBookingDialog = (pkg) => {
    setSelectedPackage(pkg);
    setBookingForm({ ...initialFormState });
    setBookingDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setBookingDialogOpen(false);
    setSelectedPackage(null);
    setBookingForm({ ...initialFormState });
  };

  const handleBookingFieldChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendWhatsApp = () => {
    sendBookingInquiry('whatsapp');
  };

  const handleSendTelegram = () => {
    sendBookingInquiry('telegram');
  };

  const sendBookingInquiry = async (platform) => {
    if (!selectedPackage) {
      return;
    }

    const name = bookingForm.name.trim();
    if (!name) {
      toast.error('Please share your name so we can personalise our reply.');
      return;
    }

    if (!bookingForm.eventDate) {
      toast.error('Please choose your preferred event date.');
      return;
    }

    const friendlyDate = formatBookingDate(bookingForm.eventDate);
    const guests = bookingForm.guests ? bookingForm.guests.toString().trim() : '';
    const location = bookingForm.location ? bookingForm.location.trim() : '';
    const notes = bookingForm.notes ? bookingForm.notes.trim() : '';
    const finalPrice = calculateDiscountedPrice(selectedPackage);
    const categoryLabel = selectedPackage.category
      ? selectedPackage.category.replace('-', ' ')
      : 'Custom';
    const priceLabel = formatPrice(finalPrice);
    const basePriceLabel =
      Number(selectedPackage.discount || 0) > 0 ? formatPrice(selectedPackage.price) : null;

    if (platform === 'telegram') {
      try {
        // Create inquiry record to pass data to bot
        const response = await inquiryAPI.create({
          name,
          eventDate: bookingForm.eventDate,
          guests: bookingForm.guests,
          location: bookingForm.location,
          notes: bookingForm.notes,
          packageId: selectedPackage._id
        });

        if (response.data && response.data.success) {
          const inquiryId = response.data.data._id;
          window.open(`https://t.me/${TELEGRAM_USERNAME}?start=inquiry_${inquiryId}`, '_blank');
          toast.success('Telegram opened! Click START to send your inquiry.');
          closeBookingDialog();
          return;
        }
      } catch (error) {
        console.error('Failed to create inquiry:', error);
        toast.error('Something went wrong. Please try again.');
        return;
      }
    }

    // Generate beautiful message with formatting
    const message = `╔═══════════════════════════╗
   🎉 *LYAN RESTAURANT* 🎉
   New Booking Inquiry
╚═══════════════════════════╝

Hello LYAN Team! 👋

━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Name: *${name}*

━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *PACKAGE SELECTED*
━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *${selectedPackage.name}*
🎯 Category: *${categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)}*
💰 Price: *${priceLabel}*${basePriceLabel ? `\n~~${basePriceLabel}~~` : ''}${selectedPackage.maxGuests ? `\n👥 Capacity: *${selectedPackage.maxGuests} guests*` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *EVENT DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📆 Date: *${friendlyDate}*${guests ? `\n👥 Expected Guests: *${guests}*` : ''}${location ? `\n📍 Location: *${location}*` : ''}${notes ? `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 *SPECIAL REQUESTS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━

*Could you guide me through the next steps?*

Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
      toast.success('WhatsApp opened! Send the message to continue.');
    }
    
    // Generate auto-response confirmation for customer
    setTimeout(() => {
      const autoResponseMessage = `╔═══════════════════════════╗
   🎉 *LYAN RESTAURANT* 🎉
   Booking Confirmation
╚═══════════════════════════╝

Dear *${name}*,

✅ *Thank you for your inquiry!*

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *YOUR REQUEST SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Package: *${selectedPackage.name}*
📆 Date: *${friendlyDate}*${guests ? `\n👥 Guests: *${guests}*` : ''}${location ? `\n📍 Location: *${location}*` : ''}
💰 Price: *${priceLabel}*

━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 *NEXT STEPS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Our team will contact you within 24 hours
2️⃣ We'll confirm all details and customize the package
3️⃣ Final arrangements will be confirmed

━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ *IMPORTANT*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Save this for your reference
📌 Contact us for any changes
📌 Cancellations: 48 hours notice

╔═══════════════════════════╗
  Questions? We're here!
╚═══════════════════════════╝

📞 ${WHATSAPP_NUMBER}
📧 info@lyanrestaurant.com
🌐 www.lyanrestaurant.com

_Thank you for choosing LYAN!_ ❤️
_We'll make your event unforgettable!_ ✨`;

      const sendConfirmation = window.confirm(
        '✅ Inquiry sent!\n\n' +
        'Would you like to receive an automatic confirmation message with your booking details?'
      );
      
      if (sendConfirmation) {
        const encodedAutoResponse = encodeURIComponent(autoResponseMessage);
        window.open(`https://wa.me/?text=${encodedAutoResponse}`, '_blank');
        toast.info('Confirmation message opened - Save it for your records!');
      }
    }, 2000);
    
    closeBookingDialog();
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
    <Box sx={{ bgcolor: '#f7f9fb' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(7,137,48,0.92) 0%, rgba(212,175,55,0.88) 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -120,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)'
          }}
        />
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box textAlign={{ xs: 'left', md: 'center' }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, fontWeight: 600, opacity: 0.85 }}
              >
                LYAN CATERING & EVENTS
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mt: 1,
                  fontSize: { xs: '2.4rem', md: '3.2rem' }
                }}
              >
                Celebrate beautifully with curated event packages
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  maxWidth: 640,
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                From intimate dinners to grand celebrations, discover handcrafted experiences that
                balance authentic Ethiopian hospitality with modern flair.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {heroStats.map((stat) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.18)',
                      borderRadius: 3,
                      p: 2.5,
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.7 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                      {stat.helper}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: -8, pb: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            mb: 6,
            boxShadow: '0 24px 60px -24px rgba(7,137,48,0.25)'
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Tailor the experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filter by celebration style and event type to find the perfect match.
                </Typography>
              </Box>
              {isFiltering && (
                <Button
                  variant="text"
                  onClick={() => {
                    setCategoryFilter('all');
                    setEventTypeFilter('all');
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  Reset filters
                </Button>
              )}
            </Stack>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                Celebration style
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {categoryOptions.map((option) => {
                  const active = categoryFilter === option.value;
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => setCategoryFilter(option.value)}
                      variant={active ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 999,
                        fontWeight: active ? 700 : 500,
                        backgroundColor: active ? option.accent : 'transparent',
                        color: active ? 'white' : 'text.primary',
                        borderColor: active ? option.accent : 'rgba(7,137,48,0.25)',
                        '&:hover': {
                          backgroundColor: active ? option.accent : 'rgba(7,137,48,0.08)'
                        }
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                Event type
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {eventOptions.map((option) => {
                  const active = eventTypeFilter === option.value;
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => setEventTypeFilter(option.value)}
                      variant={active ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 999,
                        fontWeight: active ? 700 : 500,
                        backgroundColor: active ? 'rgba(7,137,48,0.18)' : 'transparent',
                        color: active ? '#078930' : 'text.primary',
                        borderColor: active ? 'rgba(7,137,48,0.18)' : 'rgba(7,137,48,0.18)'
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            {error && (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2,
                  borderColor: 'rgba(211, 47, 47, 0.3)',
                  bgcolor: 'rgba(211,47,47,0.04)'
                }}
              >
                <Typography variant="body2" color="error" fontWeight={600}>
                  {error}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Packages Grid */}
      {packages.length === 0 ? (
          <Paper
            sx={{
              textAlign: 'center',
              py: 8,
              px: { xs: 3, md: 6 },
              borderRadius: 4,
              border: '1px dashed rgba(7,137,48,0.3)',
              bgcolor: 'rgba(7,137,48,0.03)'
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No packages match your filters yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 3 }}>
              Adjust your celebration style or event preferences to explore more curated experiences.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setCategoryFilter('all');
                setEventTypeFilter('all');
              }}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 999,
                background: 'linear-gradient(135deg, #078930 0%, #D4AF37 100%)'
              }}
            >
              Reset filters
            </Button>
          </Paper>
      ) : (
        <Grid container spacing={4}>
          {packages.map((pkg, index) => {
            const discountedPrice = calculateDiscountedPrice(pkg);
            const hasDiscount = Number(pkg.discount || 0) > 0;

            return (
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
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 18px 45px -28px rgba(7,137,48,0.5)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 26px 60px -24px rgba(7,137,48,0.55)'
                    },
                    position: 'relative',
                    bgcolor: 'white'
                  }}
                >
                  {pkg.discount > 0 && (
                    <Chip
                      label={`${pkg.discount}% off`}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 18,
                        right: 18,
                        zIndex: 2,
                        fontWeight: 700
                      }}
                    />
                  )}
                  
                  <CardMedia
                    component="img"
                    height="240"
                    image={pkg.image || fallbackImage}
                    alt={pkg.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Chip
                        label={pkg.category.replace('-', ' ')}
                        size="small"
                        sx={{
                          backgroundColor: categoryColors[pkg.category] || '#95A5A6',
                          color: 'white',
                          textTransform: 'capitalize',
                          fontWeight: 700
                        }}
                      />
                      {pkg.maxGuests && (
                        <Typography variant="caption" color="text.secondary">
                          Up to {pkg.maxGuests} guests
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                      {pkg.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {pkg.description?.length > 180
                        ? `${pkg.description.substring(0, 177)}...`
                        : pkg.description}
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
                        {hasDiscount ? (
                          <>
                            <Typography variant="h5" color="error" fontWeight="bold">
                              {formatPrice(discountedPrice)}
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
                      
                      {pkg.eventTypes?.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
                          {pkg.eventTypes.slice(0, 3).map((type) => (
                            <Chip
                              key={type}
                              label={type.replace('-', ' ')}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          ))}
                        </Stack>
                      )}

                      <Stack spacing={1.5}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<WhatsAppIcon />}
                          onClick={() => openBookingDialog(pkg)}
                          sx={{
                            py: 1.5,
                            backgroundColor: '#25D366',
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)',
                            '&:hover': {
                              backgroundColor: '#128C7E',
                              boxShadow: '0 5px 16px rgba(37, 211, 102, 0.4)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Book via WhatsApp
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<TelegramIcon />}
                          onClick={() => openBookingDialog(pkg)}
                          sx={{
                            py: 1.5,
                            backgroundColor: '#0088cc',
                            color: 'white',
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            boxShadow: '0 3px 12px rgba(0, 136, 204, 0.3)',
                            '&:hover': {
                              backgroundColor: '#006699',
                              boxShadow: '0 5px 16px rgba(0, 136, 204, 0.4)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Book via Telegram
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

        {/* Call to Action */}
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            mt: 10,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(7,137,48,0.12) 100%)'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Need a bespoke celebration?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 540, mx: 'auto' }}>
            Our planners will craft a tailor-made package that reflects your story, culture, and
            guest experience from start to finish.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ borderRadius: 999, px: 4, py: 1.2 }}
            >
              Contact our team
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.2,
                backgroundColor: '#25D366',
                '&:hover': {
                  backgroundColor: '#1DA851'
                }
              }}
            >
              💬 Chat on WhatsApp
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.open(`https://t.me/${TELEGRAM_USERNAME}`, '_blank')}
              startIcon={<TelegramIcon />}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.2,
                backgroundColor: '#0088cc',
                '&:hover': {
                  backgroundColor: '#006699'
                }
              }}
            >
              Chat on Telegram
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Dialog 
        open={bookingDialogOpen} 
        onClose={closeBookingDialog} 
        fullWidth 
        maxWidth="sm"
        fullScreen={isMobile}
        scroll="paper"
        PaperProps={{
          sx: {
            height: isMobile ? '100vh' : 'auto',
            maxHeight: isMobile ? '100vh' : '85vh',
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          Share a few details before WhatsApp
        </DialogTitle>
        <DialogContent 
          dividers={!isMobile}
          sx={{ 
            overflowY: 'auto',
            p: isMobile ? 2 : 3,
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px'
            }
          }}
        >
          {selectedPackage && (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                display: 'flex',
                gap: 2
              }}
            >
              <Box
                component="img"
                src={selectedPackage.image || fallbackImage}
                alt={selectedPackage.name}
                sx={{
                  width: 96,
                  height: 96,
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main' }}>
                  Selected package
                </Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {selectedPackage.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(calculateDiscountedPrice(selectedPackage))}
                  {Number(selectedPackage.discount || 0) > 0 && (
                    <Box component="span" sx={{ color: 'text.disabled', ml: 1 }}>
                      (Original {formatPrice(selectedPackage.price)})
                    </Box>
                  )}
                </Typography>
                {selectedPackage.category && (
                  <Chip
                    label={selectedPackage.category.replace('-', ' ')}
                    size="small"
                    sx={{
                      mt: 1.5,
                      textTransform: 'capitalize',
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>
            </Paper>
          )}

          <Stack spacing={2.5} sx={{ mt: selectedPackage ? 3 : 0 }}>
            <TextField
              label="Your name"
              name="name"
              value={bookingForm.name}
              onChange={handleBookingFieldChange}
              required
              fullWidth
            />
            <TextField
              label="Preferred event date"
              name="eventDate"
              type="date"
              value={bookingForm.eventDate}
              onChange={handleBookingFieldChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expected guest count"
              name="guests"
              type="number"
              value={bookingForm.guests}
              onChange={handleBookingFieldChange}
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Event location"
              name="location"
              value={bookingForm.location}
              onChange={handleBookingFieldChange}
              fullWidth
            />
            <TextField
              label="Additional notes"
              name="notes"
              value={bookingForm.notes}
              onChange={handleBookingFieldChange}
              fullWidth
              multiline
              minRows={3}
              placeholder="Share must-have elements, cultural traditions, or custom requests."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
          borderTop: 1,
          borderColor: 'divider',
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 3,
          gap: 1.5,
          flexDirection: 'column'
        }}>
          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
            Choose your preferred messaging platform
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleSendWhatsApp}
            startIcon={<WhatsAppIcon sx={{ fontSize: 24 }} />}
            fullWidth
            sx={{
              py: 2,
              backgroundColor: '#25D366',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
              '&:hover': {
                backgroundColor: '#128C7E',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Box sx={{ textAlign: 'left', flex: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Continue with WhatsApp
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                Most popular choice
              </Typography>
            </Box>
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSendTelegram}
            startIcon={<TelegramIcon sx={{ fontSize: 24 }} />}
            fullWidth
            sx={{
              py: 2,
              backgroundColor: '#0088cc',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0, 136, 204, 0.3)',
              '&:hover': {
                backgroundColor: '#006699',
                boxShadow: '0 6px 20px rgba(0, 136, 204, 0.4)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Box sx={{ textAlign: 'left', flex: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Continue with Telegram
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                Fast and secure
              </Typography>
            </Box>
          </Button>
          
          <Button 
            onClick={closeBookingDialog}
            fullWidth
            sx={{ 
              mt: 1,
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: alpha('#000', 0.05)
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Packages;
