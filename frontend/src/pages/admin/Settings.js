import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Switch, 
  Divider,
  Container,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Save, Person, Email, Lock, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';
import BRAND_COLORS from '../../theme/brandColors';
import { useNavigate } from 'react-router-dom';

const SettingsPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      
      // Reset password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha('#E4E9F2', 0.85)} 100%)`,
      py: 4 
    }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin')}
          sx={{ 
            mb: 2,
            color: brandColors.gold,
            borderColor: brandColors.gold,
            '&:hover': {
              borderColor: brandColors.green,
              bgcolor: alpha(brandColors.green, 0.08)
            }
          }}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
            Settings
          </Typography>

          <Grid container spacing={3}>
            {/* Profile Settings */}
            <Grid item xs={12} md={8}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: brandColors.green,
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">Edit Profile</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Update your account information
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <form onSubmit={handleProfileUpdate}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: brandColors.green },
                              '&.Mui-focused fieldset': { borderColor: brandColors.green }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: brandColors.green },
                              '&.Mui-focused fieldset': { borderColor: brandColors.green }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 2, mb: 2 }}>
                          Change Password
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Leave password fields empty if you don&apos;t want to change your password
                        </Alert>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: brandColors.green },
                              '&.Mui-focused fieldset': { borderColor: brandColors.green }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: brandColors.green },
                              '&.Mui-focused fieldset': { borderColor: brandColors.green }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={handleProfileChange}
                          InputProps={{
                            startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: brandColors.green },
                              '&.Mui-focused fieldset': { borderColor: brandColors.green }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={<Save />}
                          sx={{
                            mt: 2,
                            px: 4,
                            py: 1.5,
                            borderRadius: 999,
                            background: `linear-gradient(135deg, ${brandColors.green}, ${brandColors.gold})`,
                            fontWeight: 600,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.green})`
                            }
                          }}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            {/* System Settings */}
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    System Settings
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Notifications" 
                        secondary="Enable system notifications" 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <Switch defaultChecked />
                    </ListItem>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Email Alerts" 
                        secondary="Receive email updates" 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <Switch defaultChecked />
                    </ListItem>

                    <Divider sx={{ my: 1 }} />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Dark Theme" 
                        secondary="Enable dark mode" 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <Switch />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SettingsPanel;