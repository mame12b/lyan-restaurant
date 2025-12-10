import { useMemo, useState, useEffect } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, Grid, Avatar, Button, Divider, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Container, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AccountCircle, Email, CalendarToday, ShoppingCart, CheckCircle, Pending, Cancel, Logout, Event, LocalOffer, Phone, AccessTime, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingAPI } from "../services/api";
import { motion } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import BRAND_COLORS from "../theme/brandColors";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const brandColors = {
    ...BRAND_COLORS,
    yellow: '#FFA500',
    red: '#D32F2F',
    ...(theme.palette.brand || {})
  };
  const heroGradient = useMemo(
    () => `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`,
    [brandColors]
  );

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });

  // Fetch user's bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await bookingAPI.getMyBookings();
        const bookingsData = response?.data?.bookings || response?.bookings || [];
        setBookings(bookingsData);
        
        // Calculate stats from bookings
        const totalBookings = bookingsData.length;
        const completedCount = bookingsData.filter(b => b.status === 'completed').length;
        const pendingCount = bookingsData.filter(b => b.status === 'pending').length;
        const cancelledCount = bookingsData.filter(b => b.status === 'cancelled').length;
        
        setStats({
          total: totalBookings,
          completed: completedCount,
          pending: pendingCount,
          cancelled: cancelledCount
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setBookingsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#D4AF37';
      case 'completed':
        return '#D4AF37';
      case 'pending':
        return '#FFA500';
      case 'cancelled':
        return '#D32F2F';
      default:
        return theme.palette.grey[500];
    }
  };

  const formatCurrency = (value) => {
    const numeric = Number(value || 0);
    if (Number.isNaN(numeric)) return '0';
    return numeric.toLocaleString('en-ET');
  };

  if (loading) {
    return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>);
  }

  if (!user) {
    return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Typography variant="h6">Please log in to access the dashboard</Typography></Box>);
  }

  const statsCards = [
    { label: 'Total Bookings', value: stats.total, icon: <ShoppingCart />, color: brandColors.green },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle />, color: brandColors.gold },
    { label: 'Pending', value: stats.pending, icon: <Pending />, color: brandColors.yellow },
    { label: 'Cancelled', value: stats.cancelled, icon: <Cancel />, color: brandColors.red }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha('#E4E9F2', 0.85)} 100%)`, pt: 12, pb: 4 }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, background: heroGradient, color: theme.palette.primary.contrastText, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', background: alpha(theme.palette.primary.contrastText, 0.2), border: `3px solid ${theme.palette.primary.contrastText}` }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">Welcome back, {user.name}!</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>Manage your bookings and explore our packages</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.18),
                  color: theme.palette.primary.contrastText,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.contrastText, 0.28) }
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </motion.div>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>📋 Profile Information</Typography>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon><AccountCircle sx={{ color: brandColors.gold }} /></ListItemIcon>
                      <ListItemText primary="Name" secondary={user.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Email sx={{ color: brandColors.green }} /></ListItemIcon>
                      <ListItemText primary="Email" secondary={user.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarToday sx={{ color: brandColors.gold }} /></ListItemIcon>
                      <ListItemText primary="Member Since" secondary={new Date(user.createdAt || Date.now()).toLocaleDateString()} />
                    </ListItem>
                  </List>
                  <Button fullWidth variant="outlined" sx={{ mt: 2, borderColor: brandColors.gold, color: brandColors.gold, '&:hover': { borderColor: brandColors.green, bgcolor: alpha(brandColors.green, 0.08) } }}>Edit Profile</Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {statsCards.map((stat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}>
                    <Card elevation={3} sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mt: 1 }}>{stat.value}</Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: alpha(stat.color, 0.12), color: stat.color, width: 60, height: 60 }}>{stat.icon}</Avatar>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>🚀 Quick Actions</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" startIcon={<Event />} onClick={() => navigate('/booking')} sx={{ py: 2, background: `linear-gradient(135deg, #D4AF37, #FFD700)`, color: theme.palette.primary.contrastText, fontWeight: 700, '&:hover': { background: `linear-gradient(135deg, #FFD700, #D4AF37)` } }}>Book Event</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<LocalOffer />} onClick={() => navigate('/packages')} sx={{ py: 2, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' } }}>Browse Packages</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<ShoppingCart />} onClick={() => navigate('/bookings')} sx={{ py: 2, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' } }}>My Bookings</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<Phone />} onClick={() => navigate('/contact')} sx={{ py: 2, borderColor: '#D4AF37', color: '#D4AF37', '&:hover': { borderColor: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' } }}>Contact Us</Button></Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>📅 Recent Bookings</Typography>
              <Divider sx={{ my: 2 }} />
              
              {bookingsLoading ? (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : bookings.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>No bookings yet</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>Start exploring our packages and make your first booking!</Typography>
                  <Button variant="contained" startIcon={<LocalOffer />} onClick={() => navigate('/packages')} sx={{ background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.green})`, color: theme.palette.primary.contrastText, '&:hover': { background: `linear-gradient(135deg, ${brandColors.green}, ${brandColors.gold})` } }}>Browse Packages</Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Event</strong></TableCell>
                        <TableCell><strong>Date & Time</strong></TableCell>
                        <TableCell><strong>Location</strong></TableCell>
                        <TableCell><strong>Guests</strong></TableCell>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.slice(0, 5).map((booking) => (
                        <TableRow key={booking._id} sx={{ '&:hover': { bgcolor: alpha(brandColors.green, 0.05) } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {booking.eventType?.charAt(0).toUpperCase() + booking.eventType?.slice(1)}
                            </Typography>
                            {booking.packageId?.name && (
                              <Typography variant="caption" color="text.secondary">
                                {booking.packageId.name}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarToday sx={{ fontSize: 16, color: brandColors.gold }} />
                              <Typography variant="body2">
                                {new Date(booking.eventDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                              <AccessTime sx={{ fontSize: 16, color: brandColors.green }} />
                              <Typography variant="caption" color="text.secondary">
                                {booking.eventTime}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOn sx={{ fontSize: 16, color: brandColors.gold }} />
                              <Typography variant="body2">
                                {booking.locationType?.charAt(0).toUpperCase() + booking.locationType?.slice(1)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.numberOfGuests || 'TBD'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {booking.totalAmount > 0 ? `${formatCurrency(booking.totalAmount)} ETB` : 'TBD'}
                            </Typography>
                            {booking.advancePayment > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Paid: {formatCurrency(booking.advancePayment)} ETB
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status?.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: alpha(getStatusColor(booking.status), 0.15),
                                color: getStatusColor(booking.status),
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/bookings`)}
                              sx={{
                                borderColor: brandColors.green,
                                color: brandColors.green,
                                fontSize: '0.75rem',
                                '&:hover': {
                                  borderColor: brandColors.gold,
                                  bgcolor: alpha(brandColors.gold, 0.08)
                                }
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {bookings.length > 5 && (
                <Box mt={2} textAlign="center">
                  <Button
                    variant="text"
                    onClick={() => navigate('/bookings')}
                    sx={{ color: brandColors.green, fontWeight: 600 }}
                  >
                    View All Bookings ({bookings.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserDashboard;
