import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

function MangaCard({ manga }) {
  const imageUrl = manga.images?.jpg?.image_url || 'https://placehold.co/128x190?text=No+Cover';
  const ratingValue = manga.score ? manga.score / 2 : 0;

  return (
    <Link to={`/manga/${manga.mal_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 0,
        borderRadius: '8px',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s',
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}>
        <CardMedia
          component="img"
          sx={{
            height: 190,
            width: 128,
            objectFit: 'cover',
            borderRadius: '4px',
            margin: '8px auto 0 auto',
            display: 'block',
            boxShadow: (theme) => `0 2px 5px rgba(0,0,0,0.1), 0 0 0 1px ${theme.palette.divider}`,
          }}
          image={imageUrl}
          alt={`${manga.title} cover`}
        />
        <CardContent sx={{ textAlign: 'center', p: 1, pb: '8px !important' }}>
          <Typography variant="subtitle2" component="h3" sx={{ mt: 0.5, mb: 0.5, lineHeight: 1.2, fontWeight: 'medium' }}>
            {manga.title}
          </Typography>
          {manga.authors && manga.authors.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {manga.authors[0].name}
            </Typography>
          )}
          {manga.published?.prop?.from?.year && (
            <Typography variant="caption" color="text.secondary" display="block">
              ({manga.published.prop.from.year})
            </Typography>
          )}
          {manga.score !== null && manga.score !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
              <Rating
                name={`manga-rating-${manga.mal_id}`}
                value={ratingValue}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                sx={{ fontSize: '1rem' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                ({manga.score})
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default MangaCard;