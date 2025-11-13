import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { bookingAPI, packageAPI } from '../services/api';

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
    label: 'Event Blueprint',
    description: 'Share the essentials so we can map your celebration.'
  },
  {
    label: 'Select Experience',
    description: 'Choose a curated package that fits your vision.'
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
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const packageId = searchParams.get('package');

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    locationType: '',
    locationAddress: '',
    packageId: packageId || '',
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
      return;
    }

    const loadPackages = async () => {
      setPackagesLoading(true);
      try {
        const response = await packageAPI.getAll();
        const payload = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.packages)
            ? response.packages
            : [];

        setPackages(normalizePackages(payload));
      } catch (error) {
        console.error(error);
        toast.error('Failed to load packages');
      } finally {
        setPackagesLoading(false);
      }
    };

    loadPackages();
  }, [user, navigate]);

  useEffect(() => {
    if (packageId && packages.length > 0) {
      const pkg = packages.find((item) => item._id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setFormData((prev) => ({ ...prev, packageId }));
      }
    }
  }, [packageId, packages]);

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
      if (!formData.packageId) nextErrors.packageId = 'Select a package to continue.';
    } else if (step === 2) {
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
      <Paper
        elevation={isSelected ? 6 : 1}
        sx={{
          borderRadius: 4,
          border: isSelected ? '2px solid #078930' : '1px solid rgba(7,137,48,0.12)',
          transition: 'all 0.3s ease',
          minWidth: isCompact ? 280 : 'auto',
          maxWidth: isCompact ? 320 : 'none',
          flexShrink: isCompact ? 0 : undefined,
          height: '100%'
        }}
      >
        <CardActionArea onClick={() => handlePackageChange(pkg._id)} sx={{ borderRadius: 4, height: '100%' }}>
          {pkg.image && (
            <CardMedia
              component="img"
              height="180"
              image={pkg.image}
              alt={pkg.name}
              sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, objectFit: 'cover' }}
            />
          )}
          <CardContent sx={{ p: 3, height: '100%' }}>
            <Stack spacing={1.5} sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  {pkg.name}
                </Typography>
                <Chip
                  label={isSelected ? 'Selected' : 'Tap to select'}
                  color={isSelected ? 'success' : 'default'}
                  size="small"
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {pkg.description || 'A curated experience tailored to your celebration.'}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ETB {formatCurrency(pkg.discountedPrice)}
                </Typography>
                {pkg.discount > 0 && (
                  <Chip
                    label={`Save ${pkg.discount}%`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>

              <Divider sx={{ my: 1 }} />

              {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
                <Stack spacing={1}>
                  {pkg.features.slice(0, 4).map((feature) => (
                    <Stack direction="row" spacing={1} alignItems="center" key={feature}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#078930'
                        }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Stack>
                  ))}
                  {pkg.features.length > 4 && (
                    <Typography variant="caption" color="text.secondary">
                      +{pkg.features.length - 4} more inclusions
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
    );
  };

  const renderSummaryCard = (title, content) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: '#ffffff',
        border: '1px solid rgba(7,137,48,0.08)'
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {content}
    </Paper>
  );

  const renderEventDetails = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: '#ffffff',
        border: '1px solid rgba(7,137,48,0.08)'
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Event profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share a few details so our planning concierge can tailor recommendations for you.
      </Typography>

      <Grid container spacing={2.5}>
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
            >
              {eventTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.eventType && (
              <Typography variant="caption" color="error">
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
            >
              {locationTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.locationType && (
              <Typography variant="caption" color="error">
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
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderPackageSelection = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: '#ffffff',
        border: '1px solid rgba(7,137,48,0.08)'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Choose your experience
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a package that resonates with your celebration. You can fine-tune details with our concierge after submitting.
          </Typography>
        </Box>
        {packagesLoading && <CircularProgress size={24} />}
      </Stack>

      {errors.packageId && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {errors.packageId}
        </Alert>
      )}
      {isMdUp ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
          }}
        >
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
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
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(7,137,48,0.3)', borderRadius: 999 }
            }}
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} isCompact />
            ))}
          </Box>
        </Stack>
      )}

      {!packagesLoading && packages.length === 0 && (
        <Alert severity="info" sx={{ mt: isMdUp ? 3 : 2 }}>
          No packages available yet. Please check back soon or contact our concierge.
        </Alert>
      )}
    </Paper>
  );

  const renderConfirmation = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: '#ffffff',
        border: '1px solid rgba(7,137,48,0.08)'
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Confirm & connect
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your booking details and confirm how you would like to continue. Our team will reach out within one business day.
      </Typography>

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

        {renderSummaryCard(
          'Selected experience',
          selectedPackage ? (
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                {selectedPackage.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPackage.description || 'Experience crafted for unforgettable celebrations.'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="h6" fontWeight={700} color="success.main">
                  ETB {formatCurrency(selectedPackage.discountedPrice)}
                </Typography>
                {selectedPackage.discount > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ETB {formatCurrency(selectedPackage.price)}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No package selected yet. Head back to step two to pick your experience.
            </Typography>
          )
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

      {renderSummaryCard(
        'Selected package',
        selectedPackage ? (
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              {selectedPackage.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPackage.description || 'Experience crafted for unforgettable celebrations.'}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              ETB {formatCurrency(selectedPackage.discountedPrice)}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            You have not selected a package yet. Step two will help you explore curated options.
          </Typography>
        )
      )}
    </Stack>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderEventDetails();
      case 1:
        return renderPackageSelection();
      case 2:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: '#078930', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}
            >
              Lyan concierge booking
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
              Plan an unforgettable experience
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Our concierge team will co-create every detail of your celebration. Complete this guided request and we will reach out with a bespoke proposal tailored to your vision.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 3 },
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid rgba(7,137,48,0.12)'
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {stepDefinitions.map((step) => (
                <Step key={step.label}>
                  <StepLabel optional={<Typography variant="caption">{step.description}</Typography>}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Grid container spacing={4} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>{renderStepContent()}</form>
            </Grid>
            <Grid item xs={12} md={4}>
              {renderAsidePanel()}
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
            <Button
              variant="text"
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
            >
              Back
            </Button>
            {activeStep === stepDefinitions.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ px: 4, borderRadius: 999 }}
              >
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Confirm booking'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleNext}
                sx={{ px: 4, borderRadius: 999 }}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Stack>
      </motion.div>
    </Container>
  );
};

export default Booking;
