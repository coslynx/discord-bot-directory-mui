import React from 'react';
import { Box, Typography, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useAuth } from '../services/authContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile'); // Assuming an edit profile page exists
  };

  const handleFavorites = () => {
    navigate('/favorites'); // Assuming a favorites page exists
  };

  if (!user) {
    return <Typography>Please log in.</Typography>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Avatar sx={{ width: 80, height: 80 }} alt={user.username}>{user.username.charAt(0)}</Avatar>
        <Box ml={2}>
          <Typography variant="h5">{user.username}</Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
        </Box>
      </Box>
      <Button variant="contained" onClick={handleEditProfile}>Edit Profile</Button>
      <Button variant="outlined" onClick={handleFavorites} sx={{ ml: 2 }}>View Favorites</Button>
      <Button variant="outlined" color="error" onClick={logout} sx={{ ml: 2 }}>Logout</Button>
      <Box mt={4}>
        <Typography variant="h6">Saved Bots</Typography>
        <List>
          {user.favoriteBots && user.favoriteBots.map(bot => (
            <ListItem button key={bot.id} onClick={() => navigate(`/bot/${bot.id}`)}>
              <ListItemAvatar>
                <Avatar>{bot.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={bot.name} secondary={`Server Count: ${bot.serverCount}`} />
            </ListItem>
          ))}
          {!user.favoriteBots && <Typography>No saved bots yet.</Typography>}
        </List>
      </Box>
    </Box>
  );
};

export default Profile;
```