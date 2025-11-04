import { useState } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, Grid, Avatar, Button, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery, CircularProgress, Container, Paper } from "@mui/material";
import { AccountCircle, Email, CalendarToday, ShoppingCart, CheckCircle, Pending, Cancel, Logout, Event, LocalOffer, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const ethiopianColors = { gold: '#D4AF37', green: '#078930', red: '#DA121A', yellow: '#FCDD09' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>);
  }

  if (!user) {
    return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Typography variant="h6">Please log in to access the dashboard</Typography></Box>);
  }

  const stats = [
    { label: 'Total Bookings', value: '0', icon: <ShoppingCart />, color: ethiopianColors.green },
    { label: 'Completed', value: '0', icon: <CheckCircle />, color: ethiopianColors.gold },
    { label: 'Pending', value: '0', icon: <Pending />, color: ethiopianColors.yellow },
    { label: 'Cancelled', value: '0', icon: <Cancel />, color: ethiopianColors.red }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F7FA 0%, #E4E9F2 100%)', py: 4 }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.gold} 100%)`, color: 'white', borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', background: 'rgba(255, 255, 255, 0.2)', border: '3px solid white' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">Welcome back, {user.name}!</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>Manage your bookings and explore our packages</Typography>
                </Box>
              </Box>
              <Button variant="contained" startIcon={<Logout />} onClick={handleLogout} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}>Logout</Button>
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
                      <ListItemIcon><AccountCircle sx={{ color: ethiopianColors.gold }} /></ListItemIcon>
                      <ListItemText primary="Name" secondary={user.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Email sx={{ color: ethiopianColors.green }} /></ListItemIcon>
                      <ListItemText primary="Email" secondary={user.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarToday sx={{ color: ethiopianColors.gold }} /></ListItemIcon>
                      <ListItemText primary="Member Since" secondary={new Date(user.createdAt || Date.now()).toLocaleDateString()} />
                    </ListItem>
                  </List>
                  <Button fullWidth variant="outlined" sx={{ mt: 2, borderColor: ethiopianColors.gold, color: ethiopianColors.gold, '&:hover': { borderColor: ethiopianColors.green, bgcolor: 'rgba(7, 137, 48, 0.05)' } }}>Edit Profile</Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}>
                    <Card elevation={3} sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mt: 1 }}>{stat.value}</Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 60, height: 60 }}>{stat.icon}</Avatar>
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
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" startIcon={<LocalOffer />} onClick={() => navigate('/packages')} sx={{ py: 2, background: `linear-gradient(135deg, ${ethiopianColors.gold}, ${ethiopianColors.green})`, '&:hover': { background: `linear-gradient(135deg, ${ethiopianColors.green}, ${ethiopianColors.gold})` } }}>Browse Packages</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<ShoppingCart />} onClick={() => navigate('/bookings')} sx={{ py: 2, borderColor: ethiopianColors.green, color: ethiopianColors.green, '&:hover': { borderColor: ethiopianColors.gold, bgcolor: 'rgba(212, 175, 55, 0.05)' } }}>My Bookings</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<Event />} onClick={() => navigate('/gallery')} sx={{ py: 2, borderColor: ethiopianColors.gold, color: ethiopianColors.gold, '&:hover': { borderColor: ethiopianColors.green, bgcolor: 'rgba(7, 137, 48, 0.05)' } }}>View Gallery</Button></Grid>
                <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" startIcon={<Phone />} onClick={() => navigate('/contact')} sx={{ py: 2, borderColor: ethiopianColors.green, color: ethiopianColors.green, '&:hover': { borderColor: ethiopianColors.gold, bgcolor: 'rgba(212, 175, 55, 0.05)' } }}>Contact Us</Button></Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>📅 Recent Bookings</Typography>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary" gutterBottom>No bookings yet</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Start exploring our packages and make your first booking!</Typography>
                <Button variant="contained" startIcon={<LocalOffer />} onClick={() => navigate('/packages')} sx={{ background: `linear-gradient(135deg, ${ethiopianColors.gold}, ${ethiopianColors.green})`, '&:hover': { background: `linear-gradient(135deg, ${ethiopianColors.green}, ${ethiopianColors.gold})` } }}>Browse Packages</Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserDashboard;
