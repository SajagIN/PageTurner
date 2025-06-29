import React from 'react';
import { Paper, Typography, Box} from '@mui/material';
import StarRating from './StarRating';

function UserReview({ reviewerName, rating, children }) {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 0, borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 'bold' }}>
          {reviewerName}
        </Typography>
        {rating && <StarRating rating={rating} />}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Paper>
  );
}

export default UserReview;