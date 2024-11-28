import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import BotCard from './BotCard';

const BotList = ({ bots, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading bots...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading bots.</Typography>;
  }

  if (!bots || bots.length === 0) {
    return <Typography>No bots found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {bots.map((bot) => (
        <Grid item xs={12} sm={6} md={4} key={bot.id}>
          <BotCard bot={bot} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BotList;
```