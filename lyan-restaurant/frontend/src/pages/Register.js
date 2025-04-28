import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Box
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { AuthLayout } from '../components/AuthLayout';
import { registerUser } from '../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        React.createElement(HowToRegIcon, { key: 'icon' })
      ),
      React.createElement(
        Typography,
        {
          component: 'h1',
          variant: 'h5',
          key: 'title'
        },
        'Sign up'
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
          noValidate: true,
          onSubmit: handleSubmit(onSubmit),
          sx: { mt: 3 },
          key: 'form'
        },
        [
          React.createElement(
            Grid,
            { container: true, spacing: 2, key: 'grid' },
            [
              React.createElement(
                Grid,
                { item: true, xs: 12, key: 'name' },
                React.createElement(
                  TextField,
                  {
                    autoComplete: 'name',
                    name: 'name',
                    required: true,
                    fullWidth: true,
                    id: 'name',
                    label: 'Full Name',
                    autoFocus: true,
                    ...register('name', { required: 'Name is required' }),
                    error: !!errors.name,
                    helperText: errors.name?.message,
                    key: 'name-field'
                  }
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, key: 'email' },
                React.createElement(
                  TextField,
                  {
                    required: true,
                    fullWidth: true,
                    id: 'email',
                    label: 'Email Address',
                    name: 'email',
                    autoComplete: 'email',
                    ...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    }),
                    error: !!errors.email,
                    helperText: errors.email?.message,
                    key: 'email-field'
                  }
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, key: 'password' },
                React.createElement(
                  TextField,
                  {
                    required: true,
                    fullWidth: true,
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    id: 'password',
                    autoComplete: 'new-password',
                    ...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    }),
                    error: !!errors.password,
                    helperText: errors.password?.message,
                    key: 'password-field'
                  }
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, key: 'confirm' },
                React.createElement(
                  TextField,
                  {
                    required: true,
                    fullWidth: true,
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                    id: 'confirmPassword',
                    ...register('confirmPassword', {
                      validate: value => 
                        value === watch('password') || 'Passwords do not match'
                    }),
                    error: !!errors.confirmPassword,
                    helperText: errors.confirmPassword?.message,
                    key: 'confirm-field'
                  }
                )
              )
            ]
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
            loading ? 'Registering...' : 'Sign Up'
          ),
          React.createElement(
            Grid,
            { container: true, justifyContent: 'flex-end', key: 'bottom-links' },
            React.createElement(
              Grid,
              { item: true, key: 'login-link' },
              React.createElement(
                Link,
                { to: '/login', variant: 'body2', key: 'link' },
                'Already have an account? Sign in'
              )
            )
          )
        ]
      )
    ]
  );
};
export default Register;