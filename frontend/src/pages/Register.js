import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Alert, Box, Container, Paper, InputAdornment, IconButton, Divider, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, HowToRegOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { alpha, useTheme } from '@mui/material/styles';
import BRAND_COLORS from '../theme/brandColors';

export const Register = () => {
  const { register: registerAccount } = useAuth();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const brandGradient = useMemo(
    () => `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.green} 100%)`,
    [brandColors]
  );
  const navigate = useNavigate();
  const { register: registerField, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const user = await registerAccount(data.name, data.email, data.password);
      if (!user) {
        throw new Error('Registration succeeded but user data was not received');
      }
      
      // Redirect based on user role - bypass email verification
      const redirectPath = user.role === 'admin' ? '/admin' : '/user/dashboard';
      navigate(redirectPath);
    } catch (err) {
      let errorMessage = 'Registration failed';

      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        errorMessage = err.errors[0]?.msg || err.errors[0]?.message || errorMessage;
      } else if (err?.data?.errors?.length) {
        errorMessage = err.data.errors[0]?.msg || err.data.errors[0]?.message || errorMessage;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: brandGradient, py: 8 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={10} sx={{ p: 5, borderRadius: 4, backgroundColor: alpha(theme.palette.background.paper, 0.98) }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: brandGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 8px 20px ${alpha(brandColors.green, 0.35)}` }}>
                  <HowToRegOutlined sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
                </Box>
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>Create Account</Typography>
              <Typography variant="body1" color="text.secondary">Join LYAN Catering & Events today</Typography>
            </Box>
            {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert></motion.div>}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name" autoFocus {...registerField('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} error={!!errors.name} helperText={errors.name?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><Person sx={{ color: brandColors.gold }} /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: brandColors.green }, '&.Mui-focused fieldset': { borderColor: brandColors.gold } } }} />
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" {...registerField('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><Email sx={{ color: brandColors.gold }} /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: brandColors.green }, '&.Mui-focused fieldset': { borderColor: brandColors.gold } } }} />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...registerField('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      'Password must be at least 8 characters and include uppercase, lowercase, and a number'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: brandColors.gold }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: brandColors.green },
                    '&.Mui-focused fieldset': { borderColor: brandColors.gold }
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: brandColors.gold }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: brandColors.green },
                    '&.Mui-focused fieldset': { borderColor: brandColors.gold }
                  }
                }}
              />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5, borderRadius: 2, fontSize: '1rem', fontWeight: 600, textTransform: 'none', background: brandGradient, color: theme.palette.primary.contrastText, boxShadow: `0 4px 15px ${alpha(brandColors.gold, 0.35)}`, '&:hover': { background: `linear-gradient(135deg, ${brandColors.green}, ${brandColors.gold})`, boxShadow: `0 6px 20px ${alpha(brandColors.gold, 0.4)}`, transform: 'translateY(-2px)' }, '&:disabled': { background: '#ccc' }, transition: 'all 0.3s ease' }}>{loading ? <Box display="flex" alignItems="center" gap={1}><CircularProgress size={22} sx={{ color: theme.palette.primary.contrastText }} />Creating Account...</Box> : 'Sign Up'}</Button>
              <Divider sx={{ my: 3 }}><Typography variant="body2" color="text.secondary">OR</Typography></Divider>
              <Box sx={{ textAlign: 'center' }}><Typography variant="body2" color="text.secondary">Already have an account? <Link to="/login" style={{ color: brandColors.gold, textDecoration: 'none', fontWeight: 600 }}>Sign in here</Link></Typography></Box>
            </Box>
          </Paper>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: theme.palette.primary.contrastText, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>© {new Date().getFullYear()} LYAN Catering & Events. All rights reserved.</Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
