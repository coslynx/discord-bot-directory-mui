import React, { useState } from 'react';
import { TextField, Button, Rating, Box, Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useForm } from 'react-hook-form';


const ReviewForm = ({ botId, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [rating, setRating] = useState(0);

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

  const handleReset = () => {
    reset();
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit(data => onSubmit({ ...data, rating, botId }))}>
      <FormControl fullWidth>
        <FormLabel id="rating-label">Rating</FormLabel>
        <Rating 
          name="rating"
          value={rating}
          onChange={handleRatingChange}
          size="large"
          precision={0.5}
          {...register('rating', { required: true, min: 0, max: 5 })}
        />
        {errors.rating && <Typography variant="caption" color="error">Rating is required.</Typography>}
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel id="comment-label">Comment</FormLabel>
        <TextField
          {...register('comment', { required: true, maxLength: 500 })}
          id="comment"
          label="Your review"
          multiline
          rows={4}
          variant="outlined"
          error={errors.comment ? true : false}
          helperText={errors.comment ? 'Comment is required and must be less than 500 characters.' : ''}
          fullWidth
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">Submit Review</Button>
      <Button onClick={handleReset} variant="outlined" color="secondary" style={{marginLeft: '10px'}}>Reset</Button>
    </form>
  );
};

export default ReviewForm;

```