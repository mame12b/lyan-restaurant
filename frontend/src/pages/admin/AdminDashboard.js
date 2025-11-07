import React, { useMemo } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, Grid, Avatar, Button, Divider, CircularProgress, Container, Paper, Chip } from "@mui/material";
import { People, ShoppingCart, Settings, Logout, MenuBook as MenuBookIcon, Event } from "@mui/icons-material";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Menu from "./Menu";
import Users from "./Users";
import Orders from "./Orders";
import SettingsPanel from "./Settings";
import { alpha, useTheme } from "@mui/material/styles";
import BRAND_COLORS from "../../theme/brandColors";


const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const heroGradient = useMemo(
    () => `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`,
    [brandColors]
  );

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
    { label: 'Total Packages', value: '8', icon: <MenuBookIcon />, color: brandColors.gold },
    { label: 'Active Orders', value: '24', icon: <ShoppingCart />, color: brandColors.green },
    { label: 'Total Events', value: '156', icon: <Event />, color: brandColors.yellow },
    { label: 'Total Users', value: '342', icon: <People />, color: brandColors.red }
  ];

  const quickActions = [
  { label: 'Manage Users', icon: <People />, onClick: () => navigate('/admin/users') },
  { label: 'View Orders', icon: <ShoppingCart />, onClick: () => navigate('/admin/orders') },
  { label: 'Package Management', icon: <MenuBookIcon />, onClick: () => navigate('/admin/menu') },
  { label: 'Settings', icon: <Settings />, onClick: () => navigate('/admin/settings') }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CssBaseline />
      <Routes>
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="menu" element={<Menu />} />
        <Route path="settings" element={<SettingsPanel />} />
        <Route index element={
          <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha('#E4E9F2', 0.85)} 100%)`, py: 4 }}>
            <Container maxWidth="lg">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper elevation={3} sx={{ p: 4, mb: 4, background: heroGradient, color: theme.palette.primary.contrastText, borderRadius: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', background: alpha(theme.palette.primary.contrastText, 0.2), border: `3px solid ${theme.palette.primary.contrastText}` }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">Welcome back, {user.name}! 🛠️</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>Admin Dashboard - Manage your restaurant business</Typography>
                        <Chip label={user.role?.toUpperCase()} size="small" sx={{ mt: 1, backgroundColor: alpha(theme.palette.primary.contrastText, 0.28), color: theme.palette.primary.contrastText, fontWeight: 'bold' }} />
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
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>🚀 Quick Actions</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Button fullWidth variant="outlined" startIcon={action.icon} onClick={action.onClick} sx={{ py: 2, borderColor: brandColors.gold, color: brandColors.gold, '&:hover': { borderColor: brandColors.green, bgcolor: alpha(brandColors.green, 0.08), transform: 'scale(1.02)' }, transition: 'all 0.3s' }}>
                            {action.label}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>📊 Recent Activity</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ py: 2 }}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: alpha(brandColors.green, 0.12), color: brandColors.green }}><ShoppingCart /></Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="500">New order received</Typography>
                              <Typography variant="caption" color="text.secondary">2 minutes ago</Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: alpha(brandColors.gold, 0.12), color: brandColors.gold }}><People /></Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="500">New user registered</Typography>
                              <Typography variant="caption" color="text.secondary">15 minutes ago</Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: alpha(brandColors.yellow, 0.12), color: brandColors.yellow }}><Event /></Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="500">Package booking received</Typography>
                              <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>📈 Performance</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ py: 2 }}>
                          <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" color="text.secondary">Orders Growth</Typography>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: brandColors.green }}>+15%</Typography>
                            </Box>
                            <Box sx={{ height: 8, bgcolor: '#E0E0E0', borderRadius: 1, overflow: 'hidden' }}>
                              <Box sx={{ width: '75%', height: '100%', bgcolor: brandColors.green, borderRadius: 1 }} />
                            </Box>
                          </Box>
                          <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" color="text.secondary">Customer Satisfaction</Typography>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: brandColors.gold }}>92%</Typography>
                            </Box>
                            <Box sx={{ height: 8, bgcolor: '#E0E0E0', borderRadius: 1, overflow: 'hidden' }}>
                              <Box sx={{ width: '92%', height: '100%', bgcolor: brandColors.gold, borderRadius: 1 }} />
                            </Box>
                          </Box>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" color="text.secondary">Revenue Target</Typography>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: brandColors.yellow }}>85%</Typography>
                            </Box>
                            <Box sx={{ height: 8, bgcolor: '#E0E0E0', borderRadius: 1, overflow: 'hidden' }}>
                              <Box sx={{ width: '85%', height: '100%', bgcolor: brandColors.yellow, borderRadius: 1 }} />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </Box>
        } />
        {/* Catch-all route - redirect unknown admin routes to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Box>
  );
};

export default AdminDashboard;