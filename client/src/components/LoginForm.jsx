import React, { useState } from 'react';
import { Box, TextField, Button, Typography, FormControl, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../services/authContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <FormControl fullWidth margin="normal">
        <FormLabel id="email-label">Email Address</FormLabel>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          error={!!errors.email}
          helperText={errors.email ? 'Email is required and must be a valid email address' : ''}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel id="password-label">Password</FormLabel>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password', { required: true, minLength: 6 })}
          error={!!errors.password}
          helperText={errors.password ? 'Password is required and must be at least 6 characters long' : ''}
        />
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      <Typography variant="body2" align="center">
        <Box component="a" href="/register" sx={{ cursor: 'pointer' }}>
          Don't have an account? Sign Up
        </Box>
      </Typography>
    </Box>
  );
};

export default LoginForm;
```