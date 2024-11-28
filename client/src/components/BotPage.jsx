import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container, Grid, Avatar, Rating, Button } from '@mui/material';
import { apiService } from '../services/apiService';
import UserReview from './UserReview';
import ReviewForm from './ReviewForm';

const BotPage = () => {
  const { botId } = useParams();
  const [bot, setBot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const [botData, reviewsData] = await Promise.all([
          apiService.getBotById(botId),
          apiService.getBotReviews(botId),
        ]);
        setBot(botData);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load bot data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBotData();
  }, [botId]);

  const handleSubmitReview = async (newReview) => {
    try {
      await apiService.createReview(newReview);
      setReviews([...reviews, newReview]);
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!bot) {
    return <Typography>Bot not found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ width: 80, height: 80 }} alt={bot.name}>{bot.name.charAt(0)}</Avatar>
            <Box ml={2}>
              <Typography variant="h5">{bot.name}</Typography>
              <Typography variant="subtitle1">{bot.description}</Typography>
              <Box sx={{ mt: 1 }}>
                <Rating value={bot.averageRating} readOnly precision={0.5} />
                <Typography variant="caption">({bot.reviewCount} reviews)</Typography>
              </Box>
              <Button href={bot.inviteLink} target="_blank" variant="contained">Invite Bot</Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Reviews</Typography>
          {reviews.map((review) => (
            <UserReview key={review.id} review={review} />
          ))}
          <Box mt={2}>
            <ReviewForm botId={botId} onSubmit={handleSubmitReview} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BotPage;

```