import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { AuthLayout } from '../components/AuthLayout';
import api from '../services/api'; // Now using the correct path

 const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Updated API endpoint to match your backend route
        await api.get(`/verify-email`);
        setSuccess('Email verified successfully! You can now login.');
      } catch (err) {
        setError(err.message || 'Email verification failed. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthLayout>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <VerifiedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Email Verification
      </Typography>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {loading && <CircularProgress />}
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <>
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {success}
            </Alert>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default VerifyEmail;