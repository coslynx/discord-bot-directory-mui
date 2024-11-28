import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';


const BotCard = ({ bot }) => {
  const navigate = useNavigate();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();

  const handleBotClick = () => {
    navigate(`/bot/${bot.id}`);
  };

  const handleFavoriteClick = async () => {
    if (isFavorite(bot.id)) {
      await removeFromFavorites(bot.id);
    } else {
      await addToFavorites(bot.id);
    }
  };

  return (
    <Card onClick={handleBotClick} sx={{cursor: 'pointer', height: '100%'}}>
      <CardMedia
        component="img"
        height="140"
        image={bot.imageUrl || 'https://via.placeholder.com/150'} // Default image if none provided
        alt={bot.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {bot.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bot.description.substring(0, 100) + '...'} {/ Truncate description /}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Rating value={bot.averageRating} readOnly precision={0.5} />
          <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
            {isFavorite(bot.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Typography variant="caption">Server Count: {bot.serverCount}</Typography>
      </CardContent>
    </Card>
  );
};

export default BotCard;
```