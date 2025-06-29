import React from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function StarRating({ rating }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating name="read-only" value={rating} precision={0.5} readOnly />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
        ({rating.toFixed(1)})
      </Typography>
    </Box>
  );
}

export default StarRating;