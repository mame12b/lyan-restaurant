import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Alert, Box, Container, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Lock, LockResetOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { resetPassword } from '../services/authService';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ethiopianColors = { gold: '#D4AF37', green: '#078930', red: '#DA121A', yellow: '#FCDD09' };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await resetPassword(token, data.password);
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, ${ethiopianColors.gold} 0%, ${ethiopianColors.green} 100%)`, py: 8 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={10} sx={{ p: 5, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${ethiopianColors.gold}, ${ethiopianColors.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                  <LockResetOutlined sx={{ fontSize: 40, color: 'white' }} />
                </Box>
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>Set New Password</Typography>
              <Typography variant="body1" color="text.secondary">Create a strong password for your account</Typography>
            </Box>
            {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert></motion.div>}
            {success && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert></motion.div>}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField margin="normal" required fullWidth name="password" label="New Password" type={showPassword ? 'text' : 'password'} id="password" autoFocus {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} error={!!errors.password} helperText={errors.password?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><Lock sx={{ color: ethiopianColors.gold }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: ethiopianColors.green }, '&.Mui-focused fieldset': { borderColor: ethiopianColors.gold } } }} />
              <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === watch('password') || 'Passwords do not match' })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><Lock sx={{ color: ethiopianColors.gold }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: ethiopianColors.green }, '&.Mui-focused fieldset': { borderColor: ethiopianColors.gold } } }} />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5, borderRadius: 2, fontSize: '1rem', fontWeight: 600, textTransform: 'none', background: `linear-gradient(135deg, ${ethiopianColors.gold}, ${ethiopianColors.green})`, boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)', '&:hover': { background: `linear-gradient(135deg, ${ethiopianColors.green}, ${ethiopianColors.gold})`, boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)', transform: 'translateY(-2px)' }, '&:disabled': { background: '#ccc' }, transition: 'all 0.3s ease' }}>{loading ? 'Resetting Password...' : 'Reset Password'}</Button>
            </Box>
          </Paper>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>© {new Date().getFullYear()} LYAN Catering & Events. All rights reserved.</Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResetPassword;
