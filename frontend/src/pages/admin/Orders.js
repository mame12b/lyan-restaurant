import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Container,
  Alert,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  Refresh,
  Edit,
  Person,
  Event,
  Payment,
  Phone,
  Email
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { bookingAPI } from '../../services/api';
import { alpha, useTheme } from '@mui/material/styles';
import BRAND_COLORS from '../../theme/brandColors';

const Orders = () => {
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleOpenStatusDialog = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setAdminNotes(booking.adminNotes || '');
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      await bookingAPI.updateStatus(selectedBooking._id, {
        status: newStatus,
        adminNotes: adminNotes
      });
      toast.success('Booking status updated successfully');
      setStatusDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return brandColors.green;
      case 'pending':
        return brandColors.yellow;
      case 'cancelled':
        return brandColors.red;
      case 'completed':
        return brandColors.gold;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          📦 Booking Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchBookings}
          sx={{
            borderColor: brandColors.gold,
            color: brandColors.gold,
            '&:hover': {
              borderColor: brandColors.green,
              bgcolor: alpha(brandColors.green, 0.08)
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      {bookings.length === 0 ? (
        <Alert severity="info">No bookings found</Alert>
      ) : isMobile ? (
        // Mobile Card View
        <Stack spacing={2}>
          {bookings.map((booking) => (
            <Card key={booking._id} elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      ID: {booking._id.slice(-8)}
                    </Typography>
                    <Chip
                      label={booking.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(booking.status), 0.12),
                        color: getStatusColor(booking.status),
                        fontWeight: 600,
                        ml: 1
                      }}
                    />
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewBooking(booking)}
                      sx={{ color: brandColors.gold }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenStatusDialog(booking)}
                      sx={{ color: brandColors.green }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {booking.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.customerPhone}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Event fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">
                        {booking.packageId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(booking.eventDate)} • {booking.numberOfGuests} guests
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Payment fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(booking.totalAmount)}
                      </Typography>
                      {booking.advancePayment > 0 && (
                        <Typography variant="caption" color="success.main">
                          Paid: {formatCurrency(booking.advancePayment)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        // Desktop Table View
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(brandColors.gold, 0.1) }}>
              <TableRow>
                <TableCell><strong>Booking ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Package</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Guests</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  sx={{
                    '&:hover': { bgcolor: alpha(brandColors.gold, 0.05) },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {booking._id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {booking.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.customerPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.packageId?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(booking.eventDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>{booking.numberOfGuests}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(booking.totalAmount)}
                    </Typography>
                    {booking.advancePayment > 0 && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Paid: {formatCurrency(booking.advancePayment)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(booking.status), 0.12),
                        color: getStatusColor(booking.status),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewBooking(booking)}
                          sx={{ color: brandColors.gold }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenStatusDialog(booking)}
                          sx={{ color: brandColors.green }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Booking Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: alpha(brandColors.gold, 0.1), fontWeight: 'bold' }}>
          Booking Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color={brandColors.gold}>
                      <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Customer Information
                    </Typography>
                    <Stack spacing={1} mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" color="action" />
                        <Typography><strong>Name:</strong> {selectedBooking.customerName}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Email fontSize="small" color="action" />
                        <Typography><strong>Email:</strong> {selectedBooking.customerEmail}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone fontSize="small" color="action" />
                        <Typography><strong>Phone:</strong> {selectedBooking.customerPhone}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color={brandColors.green}>
                      <Event sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Event Details
                    </Typography>
                    <Stack spacing={1} mt={2}>
                      <Typography><strong>Package:</strong> {selectedBooking.packageId?.name}</Typography>
                      <Typography><strong>Event Date:</strong> {formatDate(selectedBooking.eventDate)}</Typography>
                      <Typography><strong>Guests:</strong> {selectedBooking.numberOfGuests}</Typography>
                      <Typography><strong>Location:</strong> {selectedBooking.location || 'Not specified'}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color={brandColors.yellow}>
                      <Payment sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Payment Details
                    </Typography>
                    <Stack spacing={1} mt={2}>
                      <Typography><strong>Total Amount:</strong> {formatCurrency(selectedBooking.totalAmount)}</Typography>
                      <Typography><strong>Advance Paid:</strong> {formatCurrency(selectedBooking.advancePayment)}</Typography>
                      <Typography><strong>Balance:</strong> {formatCurrency(selectedBooking.totalAmount - (selectedBooking.advancePayment || 0))}</Typography>
                      <Typography><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</Typography>
                      {selectedBooking.paymentReference && (
                        <Typography><strong>Reference:</strong> {selectedBooking.paymentReference}</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {selectedBooking.specialRequests && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Special Requests</Typography>
                      <Typography color="text.secondary">{selectedBooking.specialRequests}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedBooking.adminNotes && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(brandColors.yellow, 0.05) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Admin Notes</Typography>
                      <Typography color="text.secondary">{selectedBooking.adminNotes}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Chip
                  label={`Status: ${selectedBooking.status.toUpperCase()}`}
                  sx={{
                    bgcolor: alpha(getStatusColor(selectedBooking.status), 0.12),
                    color: getStatusColor(selectedBooking.status),
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setViewDialogOpen(false);
              handleOpenStatusDialog(selectedBooking);
            }}
            sx={{
              bgcolor: brandColors.green,
              '&:hover': { bgcolor: brandColors.gold }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: alpha(brandColors.green, 0.1), fontWeight: 'bold' }}>
          Update Booking Status
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedBooking && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Booking ID: {selectedBooking._id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer: {selectedBooking.customerName}
                </Typography>
              </Box>

              <TextField
                select
                fullWidth
                label="Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Admin Notes"
                multiline
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this booking..."
              />

              {newStatus === 'confirmed' && (
                <Alert severity="success">
                  Customer will be notified that their booking is confirmed.
                </Alert>
              )}
              {newStatus === 'cancelled' && (
                <Alert severity="warning">
                  Customer will be notified about the cancellation.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={updating}
            sx={{
              bgcolor: brandColors.green,
              '&:hover': { bgcolor: brandColors.gold }
            }}
          >
            {updating ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
