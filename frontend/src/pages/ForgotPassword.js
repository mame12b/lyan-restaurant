import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Alert, Box, Container, Paper, InputAdornment } from '@mui/material';
import { Email, LockResetOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { forgotPassword } from '../services/authService';

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const ethiopianColors = { gold: '#D4AF37', green: '#078930', red: '#DA121A', yellow: '#FCDD09' };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await forgotPassword(data.email);
      setSuccess('Password reset email sent successfully! Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.gold} 100%)`, py: 8 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={10} sx={{ p: 5, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${ethiopianColors.green}, ${ethiopianColors.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                  <LockResetOutlined sx={{ fontSize: 40, color: 'white' }} />
                </Box>
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>Reset Password</Typography>
              <Typography variant="body1" color="text.secondary">Enter your email to receive a password reset link</Typography>
            </Box>
            {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert></motion.div>}
            {success && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert></motion.div>}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoFocus {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><Email sx={{ color: ethiopianColors.green }} /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: ethiopianColors.gold }, '&.Mui-focused fieldset': { borderColor: ethiopianColors.green } } }} />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5, borderRadius: 2, fontSize: '1rem', fontWeight: 600, textTransform: 'none', background: `linear-gradient(135deg, ${ethiopianColors.green}, ${ethiopianColors.gold})`, boxShadow: '0 4px 15px rgba(7, 137, 48, 0.3)', '&:hover': { background: `linear-gradient(135deg, ${ethiopianColors.gold}, ${ethiopianColors.green})`, boxShadow: '0 6px 20px rgba(7, 137, 48, 0.4)', transform: 'translateY(-2px)' }, '&:disabled': { background: '#ccc' }, transition: 'all 0.3s ease' }}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
              <Box sx={{ textAlign: 'center', mt: 3 }}><Typography variant="body2" color="text.secondary">Remember your password? <Link to="/login" style={{ color: ethiopianColors.green, textDecoration: 'none', fontWeight: 600 }}>Sign in here</Link></Typography></Box>
            </Box>
          </Paper>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>© {new Date().getFullYear()} LYAN Catering & Events. All rights reserved.</Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
