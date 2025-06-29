import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

function BookCard({ book }) {
    if (!book || !book.id) { 
        return (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 200, mx: 'auto', borderRadius: '8px' }}>
                <CardMedia
                    component="img"
                    height="190"
                    image="https://placehold.co/128x190?text=Book"
                    alt="Generic book cover"
                    sx={{ objectFit: 'cover', borderRadius: '4px', margin: '8px auto 0 auto' }}
                />
                <CardContent sx={{ textAlign: 'center', p: 1, pb: '8px !important' }}>
                    <Typography variant="subtitle2" component="h3" sx={{ mt: 0.5, mb: 0.5, lineHeight: 1.2, fontWeight: 'medium' }}>
                        Loading...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Unknown
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    const placeholderText = book.title ? encodeURIComponent(book.title.substring(0, 20) + (book.title.length > 20 ? '...' : '')) : 'No+Title';
    const imageUrl = book.cover || `https://placehold.co/128x190?text=${placeholderText}`;

    const ratingValue = book.averageRating || 0;

    const navPath = `/books/${book.id}`;

    return (
        <Link to={navPath} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                '&:hover': {
                    transform: 'scale(1.03)',
                },
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
                    alt={`${book.title} cover`}
                />
                <CardContent sx={{ textAlign: 'center', p: 1, pb: '8px !important' }}>
                    <Typography variant="subtitle2" component="h3" sx={{ mt: 0.5, mb: 0.5, lineHeight: 1.2, fontWeight: 'medium' }}>
                        {book.title.length > 50 ? `${book.title.substring(0, 47)}...` : book.title}
                    </Typography>
                    {book.authors && book.authors.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            {book.authors[0]}
                        </Typography>
                    )}
                    {book.firstPublishYear && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            ({book.firstPublishYear})
                        </Typography>
                    )}
                    {book.averageRating !== null && book.averageRating !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                            <Rating
                                name={`book-rating-${book.id}`}
                                value={ratingValue}
                                precision={0.5}
                                readOnly
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                sx={{ fontSize: '1rem' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                ({book.averageRating.toFixed(1)})
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

export default BookCard;
