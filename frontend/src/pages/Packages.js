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
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const fetchPackages = useCallback(async () => {
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
      
      const response = await axios.get(url);
      const items = response?.data?.data ?? [];
      setPackages(items);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load packages');
      toast.error('Failed to load packages');
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

  const handleBookNow = (pkg) => {
    // WhatsApp number (without + symbol)
    const whatsappNumber = '251912345678';

    const finalPrice = calculateDiscountedPrice(pkg);
    
    // Create pre-filled message with package details
    const message = `Hello LYAN Catering & Events! 👋

I'm interested in booking the following package:

📦 *${pkg.name}*
💰 Price: ${formatPrice(finalPrice)}
🎯 Category: ${pkg.category}

I would like to discuss:
- Event date and time
- Number of guests
- Location details
- Any customizations

Please let me know the next steps!`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
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

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => handleBookNow(pkg)}
                        sx={{
                          backgroundColor: '#25D366', // WhatsApp green
                          '&:hover': {
                            backgroundColor: '#128C7E'
                          }
                        }}
                      >
                        📱 Book via WhatsApp
                      </Button>
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
              onClick={() => window.open('https://wa.me/251912345678', '_blank')}
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
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Packages;
