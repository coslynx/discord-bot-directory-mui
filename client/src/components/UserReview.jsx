import React from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';

const UserReview = ({ review }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body1" component="div">
          {review.comment}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Rating value={review.rating} readOnly />
        </Box>
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          {`- ${review.username} (${review.date})`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserReview;
```