import React from 'react';
import { Typography } from '@mui/material';
import UserReview from './UserReview';

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">No reviews yet!</Typography>;
  }

  return (
    <>
      {reviews.map(review => (
        <UserReview key={review.id} reviewerName={review.reviewerName} rating={review.rating}>
          {review.text}
        </UserReview>
      ))}
    </>
  );
}

export default ReviewList;