import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Alert
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  People,
  Payment,
  Description,
  ArrowBack,
  CheckCircle,
  Cancel as CancelIcon,
  Pending,
  Event
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { bookingAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import BRAND_COLORS from "../theme/brandColors";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      const bookingsData = response?.data?.bookings || response?.bookings || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await bookingAPI.cancel(selectedBooking._id);
      toast.success('Booking cancelled successfully');
      setCancelDialogOpen(false);
      setDetailsOpen(false);
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return brandColors.green;
      case 'completed':
        return brandColors.gold;
      case 'pending':
        return brandColors.yellow;
      case 'cancelled':
        return brandColors.red;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <Event />;
    }
  };

  const formatCurrency = (value) => {
    const numeric = Number(value || 0);
    if (Number.isNaN(numeric)) return '0';
    return numeric.toLocaleString('en-ET');
  };

  const canCancelBooking = (booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: alpha('#E4E9F2', 0.3), py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              background: `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`,
              color: theme.palette.primary.contrastText,
              borderRadius: 3
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/user/dashboard')}
                sx={{
                  color: theme.palette.primary.contrastText,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.contrastText, 0.1) }
                }}
              >
                Back
              </Button>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              My Bookings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              View and manage all your event bookings
            </Typography>
          </Paper>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box textAlign="center" py={6}>
                  <Event sx={{ fontSize: 80, color: brandColors.gold, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    No Bookings Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Start exploring our packages and make your first booking!
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/packages')}
                    sx={{
                      background: `linear-gradient(135deg, ${brandColors.green}, ${brandColors.gold})`,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.green})`
                      }
                    }}
                  >
                    Browse Packages
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking, index) => (
              <Grid item xs={12} key={booking._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {booking.eventType?.charAt(0).toUpperCase() + booking.eventType?.slice(1)} Event
                              </Typography>
                              {booking.packageId?.name && (
                                <Chip
                                  label={booking.packageId.name}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(brandColors.gold, 0.15),
                                    color: brandColors.gold,
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </Box>
                            <Chip
                              icon={getStatusIcon(booking.status)}
                              label={booking.status?.toUpperCase()}
                              sx={{
                                bgcolor: alpha(getStatusColor(booking.status), 0.15),
                                color: getStatusColor(booking.status),
                                fontWeight: 700
                              }}
                            />
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday sx={{ fontSize: 20, color: brandColors.gold }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Event Date
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {new Date(booking.eventDate).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <AccessTime sx={{ fontSize: 20, color: brandColors.green }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Time
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {booking.eventTime}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <LocationOn sx={{ fontSize: 20, color: brandColors.gold }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Location
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {booking.locationType?.charAt(0).toUpperCase() + booking.locationType?.slice(1)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <People sx={{ fontSize: 20, color: brandColors.green }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Guests
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {booking.numberOfGuests || 'To be determined'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              bgcolor: alpha(brandColors.green, 0.05),
                              borderRadius: 2,
                              p: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Total Amount
                              </Typography>
                              <Typography variant="h5" fontWeight="bold" color={brandColors.green}>
                                {booking.totalAmount > 0
                                  ? `${formatCurrency(booking.totalAmount)} ETB`
                                  : 'To be discussed'}
                              </Typography>
                              {booking.advancePayment > 0 && (
                                <>
                                  <Typography variant="caption" color="text.secondary" mt={1} display="block">
                                    Advance Paid
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600" color={brandColors.gold}>
                                    {formatCurrency(booking.advancePayment)} ETB
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" mt={1} display="block">
                                    Balance
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {formatCurrency(booking.totalAmount - booking.advancePayment)} ETB
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Box mt={2}>
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleViewDetails(booking)}
                                sx={{
                                  bgcolor: brandColors.green,
                                  '&:hover': { bgcolor: brandColors.gold }
                                }}
                              >
                                View Details
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Booking Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedBooking && (
            <>
              <DialogTitle sx={{ bgcolor: alpha(brandColors.green, 0.1) }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Booking Details
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedBooking.status)}
                    label={selectedBooking.status?.toUpperCase()}
                    sx={{
                      bgcolor: alpha(getStatusColor(selectedBooking.status), 0.15),
                      color: getStatusColor(selectedBooking.status),
                      fontWeight: 700
                    }}
                  />
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Booking ID"
                      secondary={selectedBooking._id}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Event Type"
                      secondary={selectedBooking.eventType?.charAt(0).toUpperCase() + selectedBooking.eventType?.slice(1)}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {selectedBooking.packageId?.name && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Package"
                          secondary={selectedBooking.packageId.name}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    </>
                  )}
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Event Date"
                      secondary={new Date(selectedBooking.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Event Time"
                      secondary={selectedBooking.eventTime}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Location"
                      secondary={`${selectedBooking.locationType?.charAt(0).toUpperCase() + selectedBooking.locationType?.slice(1)}${
                        selectedBooking.locationAddress ? ` - ${selectedBooking.locationAddress}` : ''
                      }`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Number of Guests"
                      secondary={selectedBooking.numberOfGuests || 'To be determined'}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Total Amount"
                      secondary={
                        selectedBooking.totalAmount > 0
                          ? `${formatCurrency(selectedBooking.totalAmount)} ETB`
                          : 'To be discussed with concierge'
                      }
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {selectedBooking.advancePayment > 0 && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Advance Payment"
                          secondary={`${formatCurrency(selectedBooking.advancePayment)} ETB`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Balance Due"
                          secondary={`${formatCurrency(selectedBooking.totalAmount - selectedBooking.advancePayment)} ETB`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    </>
                  )}
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Payment Method"
                      secondary={selectedBooking.paymentMethod?.replace('-', ' ').toUpperCase()}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {selectedBooking.specialRequests && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Special Requests"
                          secondary={selectedBooking.specialRequests}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    </>
                  )}
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Booking Date"
                      secondary={new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </List>

                {selectedBooking.status === 'pending' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Our team will contact you within 24 hours to confirm your booking details.
                  </Alert>
                )}
              </DialogContent>
              <DialogActions>
                {canCancelBooking(selectedBooking) && (
                  <Button
                    onClick={() => {
                      setDetailsOpen(false);
                      setCancelDialogOpen(true);
                    }}
                    color="error"
                    startIcon={<CancelIcon />}
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button onClick={() => setDetailsOpen(false)} variant="contained">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => !cancelling && setCancelDialogOpen(false)}
        >
          <DialogTitle>Cancel Booking?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Typography>
            {selectedBooking?.advancePayment > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You have paid an advance of {formatCurrency(selectedBooking.advancePayment)} ETB.
                Please contact us regarding refund policies.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
              No, Keep It
            </Button>
            <Button
              onClick={handleCancelBooking}
              color="error"
              variant="contained"
              disabled={cancelling}
            >
              {cancelling ? <CircularProgress size={24} /> : 'Yes, Cancel Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyBookings;
