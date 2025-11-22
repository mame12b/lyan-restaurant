import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Event as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { bookingAPI } from '../services/api';

const eventTypeOptions = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'meeting', label: 'Meeting or Conference' },
  { value: 'bridal-shower', label: 'Bridal Shower' },
  { value: 'other', label: 'Other' }
];

const locationTypeOptions = [
  { value: 'home', label: 'Private Residence' },
  { value: 'hotel', label: 'Hotel or Resort' },
  { value: 'venue', label: 'Event Venue' },
  { value: 'other', label: 'Custom Location' }
];

const paymentMethodLabels = {
  'pay-later': 'Coordinate with concierge',
  telebirr: 'Telebirr deposit',
  'bank-transfer': 'Bank transfer'
};

const paymentOptions = [
  {
    value: 'pay-later',
    label: 'Decide deposit later',
    description: 'Reserve now and align on the advance payment during your concierge call.'
  },
  {
    value: 'telebirr',
    label: 'Telebirr deposit',
    description: 'Send a deposit through Telebirr and share the transaction reference.'
  },
  {
    value: 'bank-transfer',
    label: 'Bank transfer',
    description: 'Transfer to our business account and share the reference number.'
  }
];

// TODO: Update these payment details with your official accounts.
const PAYMENT_DETAILS = {
  telebirr: {
    accountName: 'LYAN Catering & Events',
    accountNumber: '0944 123 456',
    note: 'Use the form below to share your Telebirr transaction code (e.g. TX1234).'
  },
  'bank-transfer': {
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000 1234 5678',
    accountName: 'LYAN Catering & Events',
    note: 'Share the reference number or receipt link so we can verify quickly.'
  }
};

const stepDefinitions = [
  {
    label: 'Event Details',
    description: 'Share the essentials so we can map your celebration.'
  },
  {
    label: 'Confirm & Connect',
    description: 'Review payment guidance and lock in your booking.'
  }
];

const conciergeHighlights = [
  {
    heading: 'Dedicated planning concierge',
    body: 'A specialist partners with you from discovery call to event day execution.'
  },
  {
    heading: 'Tailored culinary journeys',
    body: 'Menus curated by award-winning chefs honoring Ethiopian flair and global tastes.'
  },
  {
    heading: 'Seamless coordination',
    body: 'Logistics, decor, entertainment, and vendor management handled end-to-end.'
  }
];

const formatCurrency = (value) => Number(value || 0).toLocaleString();

const formatDateDisplay = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatTimeDisplay = (value) => {
  if (!value) return '';
  const [hour = '0', minute = '0'] = value.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

const normalizePackages = (payload) => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((pkg) => {
    const price = Number(pkg.price || 0);
    const discount = Number(pkg.discount || 0);
    const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    return {
      ...pkg,
      price,
      discount,
      discountedPrice
    };
  });
};

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    locationType: '',
    locationAddress: '',
    numberOfGuests: '',
    specialRequests: '',
    paymentReceipt: '',
    paymentMethod: 'pay-later',
    advancePayment: '',
    paymentReference: ''
  });

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!user) {
      toast.info('Please login to make a booking');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (_, value) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
      paymentReference: value === 'pay-later' ? '' : prev.paymentReference
    }));

    if (errors.paymentMethod || errors.paymentReference) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paymentMethod: '',
        paymentReference: ''
      }));
    }
  };

  const handlePackageChange = (pkgId) => {
    const pkg = packages.find((item) => item._id === pkgId);
    setSelectedPackage(pkg || null);
    setFormData((prev) => ({ ...prev, packageId: pkgId }));

    if (errors.packageId) {
      setErrors((prev) => ({ ...prev, packageId: '' }));
    }
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 0) {
      if (!formData.customerName) nextErrors.customerName = 'Name is required';
      if (!formData.customerPhone) nextErrors.customerPhone = 'Phone is required';
      if (!formData.eventType) nextErrors.eventType = 'Event type is required';
      if (!formData.eventDate) nextErrors.eventDate = 'Event date is required';
      if (!formData.eventTime) nextErrors.eventTime = 'Event time is required';
      if (!formData.locationType) nextErrors.locationType = 'Location type is required';
    } else if (step === 1) {
      if (!formData.paymentMethod) {
        nextErrors.paymentMethod = 'Select how you would like to handle the advance payment.';
      }

      if (formData.paymentMethod && formData.paymentMethod !== 'pay-later') {
        if (!formData.paymentReference?.trim()) {
          nextErrors.paymentReference = 'Share the payment reference so we can verify quickly.';
        }
      }

      if (formData.advancePayment) {
        const advanceValue = Number(formData.advancePayment);
        if (Number.isNaN(advanceValue) || advanceValue < 0) {
          nextErrors.advancePayment = 'Advance payment must be zero or a positive number.';
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      toast.error('Please fill in all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep(activeStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        paymentReceipt: formData.paymentReceipt?.trim() || undefined,
        paymentReference: formData.paymentReference?.trim() || undefined
      };

      if (formData.advancePayment !== '') {
        const advanceValue = Number(formData.advancePayment);
        payload.advancePayment = Number.isNaN(advanceValue) ? undefined : advanceValue;
      } else {
        payload.advancePayment = undefined;
      }

      const response = await bookingAPI.create(payload);

      toast.success('Booking created successfully! Redirecting to WhatsApp...');

      const whatsappLink = response?.data?.whatsappLink || response?.whatsappLink;
      if (whatsappLink) {
        window.location.href = whatsappLink;
      }

      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (error) {
      const message = error?.message || error?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypeLabel = useMemo(() => {
    if (!formData.eventType) return '';
    return eventTypeOptions.find((option) => option.value === formData.eventType)?.label || formData.eventType;
  }, [formData.eventType]);

  const locationTypeLabel = useMemo(() => {
    if (!formData.locationType) return '';
    return (
      locationTypeOptions.find((option) => option.value === formData.locationType)?.label || formData.locationType
    );
  }, [formData.locationType]);

  const selectedPaymentOption = useMemo(
    () => paymentOptions.find((option) => option.value === formData.paymentMethod),
    [formData.paymentMethod]
  );

  const bookingSummary = useMemo(() => {
    const advanceValue = Number(formData.advancePayment);
    const hasAdvance = Number.isFinite(advanceValue) && advanceValue > 0;

    return [
      { label: 'Event type', value: eventTypeLabel || 'Not specified yet' },
      { label: 'Event date', value: formatDateDisplay(formData.eventDate) || 'Awaiting date' },
      { label: 'Event time', value: formatTimeDisplay(formData.eventTime) || 'Awaiting time' },
      { label: 'Location', value: locationTypeLabel || 'Awaiting location type' },
      {
        label: 'Guest count',
        value: formData.numberOfGuests ? `${formData.numberOfGuests} guests` : 'Flexible guest count'
      },
      {
        label: 'Advance plan',
        value: paymentMethodLabels[formData.paymentMethod] || 'Select your preference'
      },
      {
        label: 'Advance amount',
        value: hasAdvance ? `ETB ${formatCurrency(advanceValue)}` : 'Discuss with concierge'
      },
      {
        label: 'Payment reference',
        value: formData.paymentReference?.trim() || 'Share after payment'
      }
    ];
  }, [
    eventTypeLabel,
    formData.advancePayment,
    formData.eventDate,
    formData.eventTime,
    formData.numberOfGuests,
    formData.paymentMethod,
    formData.paymentReference,
    locationTypeLabel
  ]);

  const PackageCard = ({ pkg, isCompact = false }) => {
    const isSelected = pkg._id === formData.packageId;

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Paper
          elevation={isSelected ? 8 : 2}
          sx={{
            borderRadius: 4,
            border: isSelected ? `3px solid ${theme.palette.success.main}` : '1px solid rgba(7,137,48,0.12)',
            transition: 'all 0.3s ease',
            minWidth: isCompact ? 280 : 'auto',
            maxWidth: isCompact ? 320 : 'none',
            flexShrink: isCompact ? 0 : undefined,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: isSelected 
              ? `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
              : '#ffffff'
          }}
        >
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <CheckCircleIcon />
            </Box>
          )}
          <CardActionArea onClick={() => handlePackageChange(pkg._id)} sx={{ borderRadius: 4, height: '100%' }}>
            {pkg.image && (
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={pkg.image}
                  alt={pkg.name}
                  sx={{ 
                    borderTopLeftRadius: 16, 
                    borderTopRightRadius: 16, 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                {pkg.discount > 0 && (
                  <Chip
                    icon={<StarIcon />}
                    label={`${pkg.discount}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 700,
                      boxShadow: 2
                    }}
                  />
                )}
              </Box>
            )}
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrophyIcon sx={{ color: 'success.main' }} />
                    {pkg.name}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                  {pkg.description || 'A curated experience tailored to your celebration.'}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ py: 1 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ETB {formatCurrency(pkg.discountedPrice)}
                  </Typography>
                  {pkg.discount > 0 && (
                    <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ETB {formatCurrency(pkg.price)}
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ my: 1 }} />

                {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
                  <Stack spacing={1}>
                    {pkg.features.slice(0, 4).map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="body2">{feature}</Typography>
                        </Stack>
                      </motion.div>
                    ))}
                    {pkg.features.length > 4 && (
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        +{pkg.features.length - 4} more premium inclusions
                      </Typography>
                    )}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Includes chef-crafted menu, full service staff, and decor styling.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </CardActionArea>
        </Paper>
      </motion.div>
    );
  };

  const renderSummaryCard = (title, content) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha('#078930', 0.02)} 0%, ${alpha('#B8860B', 0.02)} 100%)`,
          border: `1px solid ${alpha('#078930', 0.15)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'success.main'
        }}>
          <CelebrationIcon />
          {title}
        </Typography>
        {content}
      </Paper>
    </motion.div>
  );

  const renderEventDetails = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha('#ffffff', 1)} 0%, ${alpha('#f8f9fa', 1)} 100%)`,
          border: `2px solid ${alpha('#078930', 0.1)}`,
          boxShadow: `0 8px 32px ${alpha('#078930', 0.08)}`,
          width: '100%',
          mx: 'auto'
        }}
      >
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 2,
            borderBottom: `2px solid ${alpha('#078930', 0.1)}`
          }}>
            <Box sx={{ 
              bgcolor: 'success.main', 
              color: 'white', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EventIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Event profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share a few details so our planning concierge can tailor recommendations for you.
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Show validation errors summary */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Please correct the following errors:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <Typography variant="body2">{message}</Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Your name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              error={Boolean(errors.customerName)}
              helperText={errors.customerName}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone number"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              error={Boolean(errors.customerPhone)}
              helperText={errors.customerPhone}
              placeholder="09XXXXXXXX"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.eventType)} required>
              <InputLabel>Event type</InputLabel>
              <Select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                label="Event type"
                startAdornment={
                  <InputAdornment position="start">
                    <CelebrationIcon sx={{ color: 'success.main', ml: 1 }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'success.main' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'success.main', borderWidth: 2 }
                }}
              >
                {eventTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.eventType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.eventType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Event date"
              name="eventDate"
              InputLabelProps={{ shrink: true }}
              value={formData.eventDate}
              onChange={handleInputChange}
              error={Boolean(errors.eventDate)}
              helperText={errors.eventDate}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="time"
              label="Event time"
              name="eventTime"
              InputLabelProps={{ shrink: true }}
              value={formData.eventTime}
              onChange={handleInputChange}
              error={Boolean(errors.eventTime)}
              helperText={errors.eventTime}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimeIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.locationType)} required>
              <InputLabel>Location type</InputLabel>
              <Select
                name="locationType"
                value={formData.locationType}
                onChange={handleInputChange}
                label="Location type"
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: 'success.main', ml: 1 }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'success.main' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'success.main', borderWidth: 2 }
                }}
              >
                {locationTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.locationType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.locationType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location details"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              placeholder="Venue name, neighborhood, or any helpful notes"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Guest count"
              name="numberOfGuests"
              type="number"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special requests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Share menu preferences, decor style, entertainment ideas, etc."
              multiline
              minRows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <DescriptionIcon sx={{ color: 'success.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: 'success.main' },
                  '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 2 }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );

  const renderPackageSelection = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha('#ffffff', 1)} 0%, ${alpha('#f8f9fa', 1)} 100%)`,
          border: `2px solid ${alpha('#078930', 0.1)}`,
          boxShadow: `0 8px 32px ${alpha('#078930', 0.08)}`,
          width: '100%',
          mx: 'auto'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 2,
            borderBottom: `2px solid ${alpha('#078930', 0.1)}`,
            width: '100%'
          }}>
            <Box sx={{ 
              bgcolor: 'success.main', 
              color: 'white', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TicketIcon fontSize="large" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={800}>
                Choose your experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a package that resonates with your celebration. You can fine-tune details with our concierge after submitting.
              </Typography>
            </Box>
            {packagesLoading && <CircularProgress size={24} sx={{ color: 'success.main' }} />}
          </Box>
        </Stack>

        {errors.packageId && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${alpha('#ed6c02', 0.3)}`
            }}
          >
            {errors.packageId}
          </Alert>
        )}
        <AnimatePresence mode="wait">
          {isMdUp ? (
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
              }}
            >
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </Box>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  pb: 1,
                  mx: -2,
                  px: 2,
                  '&::-webkit-scrollbar': { height: 8 },
                  '&::-webkit-scrollbar-track': { 
                    backgroundColor: alpha('#078930', 0.1),
                    borderRadius: 4
                  },
                  '&::-webkit-scrollbar-thumb': { 
                    backgroundColor: alpha('#078930', 0.4), 
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: alpha('#078930', 0.6)
                    }
                  }
                }}
              >
                {packages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} isCompact />
                ))}
              </Box>
            </Stack>
          )}
        </AnimatePresence>

        {!packagesLoading && packages.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: isMdUp ? 3 : 2,
              borderRadius: 2,
              border: `1px solid ${alpha('#0288d1', 0.3)}`
            }}
          >
            No packages available yet. Please check back soon or contact our concierge.
          </Alert>
        )}
      </Paper>
    </motion.div>
  );

  const renderConfirmation = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 4,
        bgcolor: '#ffffff',
        border: '1px solid rgba(7,137,48,0.08)',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Confirm & connect
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your booking details and confirm how you would like to continue. Our team will reach out within one business day.
      </Typography>

      {/* Show validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Please correct the following errors:
          </Typography>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <Typography variant="body2">{message}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        Uploading payment receipts is optional at this stage. You can also share them with the concierge on WhatsApp once we connect.
      </Alert>

      <Stack spacing={3}>
        {renderSummaryCard(
          'Advance payment plan',
          <Stack spacing={2.5}>
            <Stack spacing={1.5}>
              <ToggleButtonGroup
                value={formData.paymentMethod}
                exclusive
                onChange={handlePaymentMethodChange}
                orientation="vertical"
                fullWidth
                color="success"
              >
                {paymentOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 1.5,
                      px: 2,
                      textTransform: 'none',
                      gap: 0.5
                    }}
                  >
                    <Stack spacing={0.25} alignItems="flex-start">
                      <Typography variant="body1" fontWeight={600}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {errors.paymentMethod && (
                <Typography variant="caption" color="error">
                  {errors.paymentMethod}
                </Typography>
              )}
            </Stack>

            {selectedPaymentOption && (
              <Typography variant="body2" color="text.secondary">
                {selectedPaymentOption.value === 'pay-later'
                  ? 'We will align on the advance deposit during your concierge call.'
                  : 'Add your payment details below so we can confirm receipt right away.'}
              </Typography>
            )}

            <Stack spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Advance payment (optional)"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
                error={Boolean(errors.advancePayment)}
                helperText={errors.advancePayment || 'Share the proposed amount you have already sent or plan to send.'}
              />

              {formData.paymentMethod !== 'pay-later' && (
                <TextField
                  fullWidth
                  label="Payment reference"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleInputChange}
                  placeholder="e.g. Telebirr TX1234 or bank transfer code"
                  error={Boolean(errors.paymentReference)}
                  helperText={
                    errors.paymentReference ||
                    'Add the transaction reference so our finance desk can verify immediately.'
                  }
                  required
                />
              )}

              <TextField
                fullWidth
                label="Receipt link or upload reference"
                name="paymentReceipt"
                value={formData.paymentReceipt}
                onChange={handleInputChange}
                placeholder="Share a Google Drive link or note where we can view the receipt."
              />
            </Stack>

            {formData.paymentMethod !== 'pay-later' && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(7,137,48,0.06)',
                  border: '1px dashed rgba(7,137,48,0.3)'
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Payment details
                </Typography>
                <Stack spacing={0.75}>
                  {PAYMENT_DETAILS[formData.paymentMethod]?.accountName && (
                    <Typography variant="body2">
                      Account name: {PAYMENT_DETAILS[formData.paymentMethod].accountName}
                    </Typography>
                  )}
                  {PAYMENT_DETAILS[formData.paymentMethod]?.bankName && (
                    <Typography variant="body2">
                      Bank: {PAYMENT_DETAILS[formData.paymentMethod].bankName}
                    </Typography>
                  )}
                  {PAYMENT_DETAILS[formData.paymentMethod]?.accountNumber && (
                    <Typography variant="body2">
                      Account / phone: {PAYMENT_DETAILS[formData.paymentMethod].accountNumber}
                    </Typography>
                  )}
                  {PAYMENT_DETAILS[formData.paymentMethod]?.note && (
                    <Typography variant="body2" color="text.secondary">
                      {PAYMENT_DETAILS[formData.paymentMethod].note}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        {renderSummaryCard(
          'Booking snapshot',
          <Stack spacing={1.5}>
            {bookingSummary.map((item) => (
              <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight={600} textAlign="right">
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );

  const renderAsidePanel = () => (
    <Stack spacing={3}>
      {renderSummaryCard(
        'Concierge promise',
        <Stack spacing={2}>
          {conciergeHighlights.map((highlight) => (
            <Box key={highlight.heading}>
              <Typography variant="subtitle2" fontWeight={700}>
                {highlight.heading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {highlight.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {renderSummaryCard(
        'Event details recap',
        <Stack spacing={1.5}>
          {bookingSummary.map((item) => (
            <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight={600} textAlign="right">
                {item.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderEventDetails();
      case 1:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha('#078930', 0.03)} 0%, ${alpha('#B8860B', 0.03)} 50%, ${alpha('#078930', 0.03)} 100%)`,
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Stack spacing={4}>
            <Box sx={{ 
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -40,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 100,
                background: `radial-gradient(circle, ${alpha('#078930', 0.1)} 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
              }
            }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Chip 
                  icon={<StarIcon />}
                  label="LYAN CONCIERGE BOOKING" 
                  sx={{ 
                    color: 'success.main', 
                    fontWeight: 700, 
                    letterSpacing: 2,
                    fontSize: '0.75rem',
                    mb: 2,
                    bgcolor: alpha('#078930', 0.1),
                    border: `2px solid ${alpha('#078930', 0.3)}`,
                    px: 2,
                    py: 2.5
                  }} 
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight={900} 
                  sx={{ 
                    mt: 2, 
                    mb: 2,
                    background: `linear-gradient(135deg, #078930 0%, #B8860B 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  Plan an Unforgettable Experience
                </Typography>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Our concierge team will co-create every detail of your celebration. Complete this guided request and we will reach out with a bespoke proposal tailored to your vision.
                </Typography>
              </motion.div>
            </Box>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Paper
                elevation={4}
                sx={{
                  px: { xs: 2, md: 4 },
                  py: { xs: 2.5, md: 3.5 },
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
                  border: `2px solid ${alpha('#078930', 0.2)}`,
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 8px 32px ${alpha('#078930', 0.15)}`
                }}
              >
                <Stepper activeStep={activeStep} alternativeLabel={isMdUp} orientation={isMdUp ? 'horizontal' : 'horizontal'}>
                  {stepDefinitions.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel 
                        optional={isMdUp ? <Typography variant="caption">{step.description}</Typography> : null}
                        StepIconProps={{
                          sx: {
                            color: index <= activeStep ? 'success.main' : 'grey.400',
                            '&.Mui-active': { color: 'success.main' },
                            '&.Mui-completed': { color: 'success.main' }
                          }
                        }}
                      >
                        <Typography fontWeight={index === activeStep ? 700 : 500}>
                          {isMdUp ? step.label : step.label.split(' ')[0]}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </motion.div>

          <Grid container spacing={{ xs: 0, md: 4 }} alignItems="flex-start" sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center', width: '100%', px: { xs: 0, md: 2 } }}>
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}
                  
                  {/* Action buttons moved inside form for better flow */}
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    sx={{ 
                      mt: 4,
                      px: { xs: 0, md: 0 }
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={activeStep === 0 || isSubmitting}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: 'success.main',
                        color: 'success.main',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: alpha('#078930', 0.05)
                        },
                        '&:disabled': {
                          borderColor: 'grey.300'
                        }
                      }}
                    >
                      Back
                    </Button>
                    {activeStep === stepDefinitions.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{ 
                          px: 5, 
                          py: 1.5,
                          borderRadius: 999,
                          background: `linear-gradient(135deg, #078930 0%, #065d24 100%)`,
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: `0 4px 20px ${alpha('#078930', 0.4)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, #065d24 0%, #078930 100%)`,
                            boxShadow: `0 6px 25px ${alpha('#078930', 0.5)}`,
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isSubmitting ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                            <span>Processing...</span>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon />
                            <span>Confirm Booking</span>
                          </Box>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ 
                          px: 5, 
                          py: 1.5,
                          borderRadius: 999,
                          background: `linear-gradient(135deg, #078930 0%, #065d24 100%)`,
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: `0 4px 20px ${alpha('#078930', 0.4)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, #065d24 0%, #078930 100%)`,
                            boxShadow: `0 6px 25px ${alpha('#078930', 0.5)}`,
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Continue →
                      </Button>
                    )}
                  </Stack>
                </form>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                {renderAsidePanel()}
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </motion.div>
    </Container>
    </Box>
  );
};

export default Booking;
