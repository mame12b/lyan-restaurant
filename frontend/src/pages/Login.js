import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Button, 
  TextField, 
  Typography, 
  Alert,
  Box,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LoginOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { alpha, useTheme } from '@mui/material/styles';
import BRAND_COLORS from '../theme/brandColors';

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { user, login } = useAuth();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const brandGradient = useMemo(
    () => `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`,
    [brandColors]
  );

  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from?.pathname ||
        (user.role === 'admin' ? '/admin' : '/user/dashboard');
      navigate(redirectPath);
    }
  }, [user, navigate, location]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login error:', err);
      // Handle different error formats
      const errorMessage = err.message || err.error || err.msg || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: brandGradient,
        py: 8
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 5,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.background.paper, 0.98)
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: brandGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: `0 8px 20px ${alpha(brandColors.green, 0.35)}`
                    }}
                  >
                    <LoginOutlined sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
                </Box>
              </motion.div>

              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to LYAN Catering & Events
              </Typography>
            </Box>

            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: brandColors.green }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: brandColors.gold },
                    '&.Mui-focused fieldset': { borderColor: brandColors.green },
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: brandColors.green }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: brandColors.gold },
                    '&.Mui-focused fieldset': { borderColor: brandColors.green },
                  },
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
                  <Link to="/forgot-password" style={{ color: brandColors.green, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: brandGradient,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 15px ${alpha(brandColors.green, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.green})`,
                    boxShadow: `0 6px 20px ${alpha(brandColors.green, 0.4)}`,
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': { background: '#ccc' },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">OR</Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Do not have an account?{' '}
                  <Link to="/register" style={{ color: brandColors.green, textDecoration: 'none', fontWeight: 600 }}>
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mt: 3,
              color: theme.palette.primary.contrastText,
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            © {new Date().getFullYear()} LYAN Catering & Events. All rights reserved.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
