import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Avatar, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Grid, 
  Typography, 
  Alert ,
  Box
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user, login }= useAuth();

  useEffect(()=>{
    if (user) {
      const redirectPath = location.state?.from?.pathname ||
                        (user.role=== 'admin' ? '/admin/dashboard' :
                          '/user/dashboard')
                        navigate(redirectPath);
    }
  },[user, navigate, location]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await login(data.email, data.password);
     
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    AuthLayout,
    null,
    [
      React.createElement(
        Avatar,
        {
          sx: { m: 1, bgcolor: 'secondary.main' },
          key: 'avatar'
        },
        React.createElement(LockOutlinedIcon, { key: 'icon' })
      ),
      React.createElement(
        Typography,
        {
          component: 'h1',
          variant: 'h5',
          key: 'title'
        },
        'Sign in'
      ),
      error && React.createElement(
        Alert,
        {
          severity: 'error',
          sx: { width: '100%', mt: 2 },
          key: 'error'
        },
        error
      ),
      React.createElement(
        Box,
        {
          component: 'form',
          onSubmit: handleSubmit(onSubmit),
          noValidate: true,
          sx: { mt: 1 },
          key: 'form'
        },
        [
          React.createElement(
            TextField,
            {
              margin: 'normal',
              required: true,
              fullWidth: true,
              id: 'email',
              label: 'Email Address',
              name: 'email',
              autoComplete: 'email',
              autoFocus: true,
              ...register('email', { required: 'Email is required' }),
              error: !!errors.email,
              helperText: errors.email?.message,
              key: 'email'
            }
          ),
          React.createElement(
            TextField,
            {
              margin: 'normal',
              required: true,
              fullWidth: true,
              name: 'password',
              label: 'Password',
              type: 'password',
              id: 'password',
              autoComplete: 'current-password',
              ...register('password', { required: 'Password is required' }),
              error: !!errors.password,
              helperText: errors.password?.message,
              key: 'password'
            }
          ),
          React.createElement(
            FormControlLabel,
            {
              control: React.createElement(Checkbox, { value: 'remember', color: 'primary' }),
              label: 'Remember me',
              key: 'remember'
            }
          ),
          React.createElement(
            Button,
            {
              type: 'submit',
              fullWidth: true,
              variant: 'contained',
              sx: { mt: 3, mb: 2 },
              disabled: loading,
              key: 'submit'
            },
            loading ? 'Signing In...' : 'Sign In'
          ),
          React.createElement(
            Grid,
            { container: true, key: 'links' },
            [
              React.createElement(
                Grid,
                { item: true, xs: true, key: 'forgot' },
                React.createElement(
                  Link,
                  { to: '/forgot-password', variant: 'body2', key: 'forgot-link' },
                  'Forgot password?'
                )
              ),
              React.createElement(
                Grid,
                { item: true, key: 'register' },
                React.createElement(
                  Link,
                  { to: '/register', variant: 'body2', key: 'register-link' },
                  "Don't have an account? Sign Up"
                )
              )
            ]
          )
        ]
      )
    ]
  );
};
export default Login;