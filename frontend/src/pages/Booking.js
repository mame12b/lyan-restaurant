import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const packageId = searchParams.get('package');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);

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
    paymentReceipt: ''
  });

  const [errors, setErrors] = useState({});

  const steps = ['Event Details', 'Package Selection', 'Payment Info'];

  useEffect(() => {
    if (!user) {
      toast.info('Please login to make a booking');
      navigate('/login');
      return;
    }
    fetchPackages();
  }, [user, navigate]);

  useEffect(() => {
    if (packageId && packages.length > 0) {
      const pkg = packages.find(p => p._id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setFormData(prev => ({ ...prev, packageId }));
      }
    }
  }, [packageId, packages]);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get('/api/packages');
      setPackages(data.data);
    } catch (err) {
      toast.error('Failed to load packages');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePackageChange = (pkgId) => {
    const pkg = packages.find(p => p._id === pkgId);
    setSelectedPackage(pkg);
    setFormData(prev => ({ ...prev, packageId: pkgId }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.customerName) newErrors.customerName = 'Name is required';
      if (!formData.customerPhone) newErrors.customerPhone = 'Phone is required';
      if (!formData.eventType) newErrors.eventType = 'Event type is required';
      if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
      if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
      if (!formData.locationType) newErrors.locationType = 'Location type is required';
    } else if (step === 1) {
      if (!formData.packageId) newErrors.packageId = 'Please select a package';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        '/api/bookings',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Booking created successfully! Redirecting to WhatsApp...');
      
      // Redirect to WhatsApp with booking details
      if (data.data.whatsappLink) {
        window.location.href = data.data.whatsappLink;
      }
      
      // Optional: Navigate to user dashboard after a delay
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Event Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
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
                label="Phone Number"
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
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                >
                  <MenuItem value="wedding">💍 Wedding</MenuItem>
                  <MenuItem value="birthday">🎂 Birthday</MenuItem>
                  <MenuItem value="engagement">💑 Engagement</MenuItem>
                  <MenuItem value="meeting">🤝 Meeting/Conference</MenuItem>
                  <MenuItem value="bridal-shower">👰 Bridal Shower</MenuItem>
                  <MenuItem value="other">🎉 Other</MenuItem>
                </Select>
                {errors.eventType && <Typography color="error" variant="caption">{errors.eventType}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Date"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                error={Boolean(errors.eventDate)}
                helperText={errors.eventDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Time"
                name="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={handleInputChange}
                error={Boolean(errors.eventTime)}
                helperText={errors.eventTime}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.locationType)} required>
                <InputLabel>Location Type</InputLabel>
                <Select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleInputChange}
                  label="Location Type"
                >
                  <MenuItem value="home">🏠 Home</MenuItem>
                  <MenuItem value="hotel">🏨 Hotel</MenuItem>
                  <MenuItem value="venue">🎪 Event Venue</MenuItem>
                  <MenuItem value="other">📍 Other</MenuItem>
                </Select>
                {errors.locationType && <Typography color="error" variant="caption">{errors.locationType}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location Address (Optional)"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleInputChange}
                multiline
                rows={2}
                placeholder="Enter the full address of your event location"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Guests (Optional)"
                name="numberOfGuests"
                type="number"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Choose Your Package
              </Typography>
              {errors.packageId && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.packageId}
                </Alert>
              )}
            </Grid>
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: formData.packageId === pkg._id ? '3px solid #2C3E50' : '1px solid #ddd',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handlePackageChange(pkg._id)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {pkg.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {pkg.description.substring(0, 100)}...
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {pkg.discountedPrice.toLocaleString()} ብር
                    </Typography>
                    {pkg.discount > 0 && (
                      <Typography variant="body2" color="error">
                        Save {pkg.discount}%!
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom fontWeight="bold">
                  📱 TeleBirr Payment Instructions
                </Typography>
                <Typography variant="body2">
                  1. Send advance payment to: <strong>09XXXXXXXX</strong>
                </Typography>
                <Typography variant="body2">
                  2. Account Name: <strong>LYAN Catering & Events</strong>
                </Typography>
                <Typography variant="body2">
                  3. Upload screenshot of payment receipt (Optional)
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              {selectedPackage && (
                <Card sx={{ mb: 3, backgroundColor: '#F8F9FA' }}>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>Package:</strong> {selectedPackage.name}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                      Total Amount: {selectedPackage.discountedPrice.toLocaleString()} ብር
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recommended advance: {(selectedPackage.discountedPrice * 0.3).toLocaleString()} ብር (30%)
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Receipt URL (Optional)"
                name="paymentReceipt"
                value={formData.paymentReceipt}
                onChange={handleInputChange}
                placeholder="Paste image URL or upload link"
                helperText="You can upload the receipt screenshot and paste the link here"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests (Optional)"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Any special requirements or notes for your event..."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Book Your Event with LYAN
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below and we'll connect with you on WhatsApp
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#25D366',
                    '&:hover': {
                      backgroundColor: '#1DA851'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : '📱 Book & Contact on WhatsApp'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    backgroundColor: '#2C3E50',
                    '&:hover': {
                      backgroundColor: '#1A252F'
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Booking;
