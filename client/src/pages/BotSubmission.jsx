import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../services/authContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';


const BotSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await apiService.getAllCategories();
      setCategories(data);
    } catch (error) {
      setError('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await apiService.submitBot({...data, ownerId: user.id});
      navigate('/');
      reset();
    } catch (err) {
      setError('Failed to submit bot. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Submitting...</Typography>
  }

  if (!user) {
    return <Typography>Please log in to submit a bot.</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>Submit Your Bot</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="name-label">Bot Name</FormLabel>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Bot Name"
                name="name"
                {...register('name', { required: true })}
                error={!!errors.name}
                helperText={errors.name ? 'Bot name is required' : ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="description-label">Description</FormLabel>
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                {...register('description', { required: true })}
                error={!!errors.description}
                helperText={errors.description ? 'Description is required' : ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="inviteLink-label">Invite Link</FormLabel>
              <TextField
                margin="normal"
                required
                fullWidth
                id="inviteLink"
                label="Invite Link"
                name="inviteLink"
                {...register('inviteLink', { required: true, pattern: /^(https?:\/\/)?(discord\.gg\/|discord\.com\/invite\/)[a-zA-Z0-9]+/i })}
                error={!!errors.inviteLink}
                helperText={errors.inviteLink ? 'Valid invite link is required' : ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="imageUrl-label">Image URL (Optional)</FormLabel>
              <TextField
                margin="normal"
                fullWidth
                id="imageUrl"
                label="Image URL"
                name="imageUrl"
                {...register('imageUrl')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="category-label">Category</FormLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                {...register('category', { required: true })}
                error={!!errors.category}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <FormLabel id="repositoryLink-label">Repository Link (Optional)</FormLabel>
              <TextField
                margin="normal"
                fullWidth
                id="repositoryLink"
                label="Repository Link"
                name="repositoryLink"
                {...register('repositoryLink')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">Submit</Button>
          </Grid>
          {error && <Grid item xs={12}><Typography variant="body2" color="error">{error}</Typography></Grid>}
        </Grid>
      </Box>
    </Container>
  );
};

export default BotSubmission;
```