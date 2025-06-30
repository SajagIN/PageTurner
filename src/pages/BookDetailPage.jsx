import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    Divider,
    Button,
    Grid,
    Chip
} from '@mui/material';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { getOpenLibraryBookDetails, getLibgenDownloadLink } from '../api/openLibraryApi';

function BookDetailsPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [libgenLoading, setLibgenLoading] = useState(false);
    const [libgenError, setLibgenError] = useState(null);
    const [libgenDownloadUrl, setLibgenDownloadUrl] = useState(null);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOpenLibraryBookDetails(bookId);
                setBookDetails(data);
            } catch (err) {
                console.error('Error fetching book details:', err);
                setError(err.message || 'Failed to fetch book details.');
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchDetails();
        }
    }, [bookId]);

    // const handleLibgenDownload = async () => {
    //     if (!bookDetails) return;

    //     setLibgenLoading(true);
    //     setLibgenError(null);
    //     setLibgenDownloadUrl(null);

    //     try {
    //         const downloadUrl = await getLibgenDownloadLink({
    //             title: bookDetails.title,
    //             author: bookDetails.authors?.[0] || '', 
    //             isbn: bookDetails.isbns?.[0] || '' 
    //         });
    //         setLibgenDownloadUrl(downloadUrl);
    //         window.open(downloadUrl, '_blank');
    //     } catch (err) {
    //         console.error("Libgen download error:", err);
    //         setLibgenError(err.message || 'Could not find a download link on Libgen.');
    //     } finally {
    //         setLibgenLoading(false);
    //     }
    // };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Could not load book details. Please try again.
                </Typography>
                <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    <ArrowBackIcon /> Go Back
                </IconButton>
            </Box>
        );
    }

    if (!bookDetails) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Book Data Found.</Typography>
                <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    <ArrowBackIcon /> Go Back
                </IconButton>
            </Box>
        );
    }

    
    const placeholderText = bookDetails.title ? encodeURIComponent(bookDetails.title) : 'No+Cover';
    const imageUrl = bookDetails.imageLinks?.thumbnail || `https://placehold.co/225x320?text=${placeholderText}`;
    const overallRatingValue = bookDetails.averageRating || 0; 
    return (
        <Box
            sx={{ pb: 7 }} 
            ref={scrollContainerRef}
            style={{ height: '100vh', overflowY: 'auto' }}
        >
            <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default', zIndex: (theme) => theme.zIndex.appBar + 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        Book Details
                    </Typography>
                    <Box sx={{ width: 48 }} /> 
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mb: 3,
                    borderRadius: '10px',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden', 
                }}>
                    <CardMedia
                        component="img"
                        sx={{
                            width: { xs: '100%', sm: 250 }, 
                            height: { xs: 350, sm: 'auto' }, 
                            objectFit: 'contain',
                            borderRadius: { xs: '10px 10px 0 0', sm: '10px 0 0 10px' },
                            p: 2,
                            flexShrink: 0, 
                        }}
                        image={imageUrl}
                        alt={bookDetails.title}
                    />
                    <CardContent
                        sx={{
                            flex: '1 0 auto', 
                            p: { xs: 2, sm: 3 },
                            minWidth: 0, 
                            overflow: 'hidden', 
                        }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {bookDetails.title}
                        </Typography>
                        {bookDetails.fullTitle && bookDetails.fullTitle !== bookDetails.title && (
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ wordBreak: 'break-word' }}>
                                {bookDetails.fullTitle}
                            </Typography>
                        )}
                        {bookDetails.authors && bookDetails.authors.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                Author(s): {bookDetails.authors.join(', ')}
                            </Typography>
                        )}
                        {bookDetails.publishedDate && (
                            <Typography variant="body2" color="text.secondary">
                                Published: {bookDetails.publishedDate}
                            </Typography>
                        )}
                        {bookDetails.pageCount && ( 
                            <Typography variant="body2" color="text.secondary">
                                Pages: {bookDetails.pageCount}
                            </Typography>
                        )}
                        {bookDetails.averageRating !== null && bookDetails.averageRating !== undefined && ( 
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating
                                    name="overall-book-rating"
                                    value={overallRatingValue}
                                    precision={0.5}
                                    readOnly
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({bookDetails.ratingsCount} users)
                                </Typography>
                            </Box>
                        )}
                        {bookDetails.categories && bookDetails.categories.length > 0 && ( 
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', minWidth: 'fit-content' }}>
                                    Categories:
                                </Typography>
                                {bookDetails.categories.map((category, index) => (
                                    <Chip key={index} label={category} size="small" sx={{ wordBreak: 'break-word' }} />
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {bookDetails.description && ( 
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Synopsis
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {bookDetails.description}
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={1} sx={{ mt: 4, mb: 3, justifyContent: 'center' }}>
                    {bookDetails.previewLink && (
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                href={bookDetails.previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                fullWidth 
                            >
                                View on Open Library
                            </Button>
                        </Grid>
                    )}

                    {/* <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={libgenLoading ? <CircularProgress size={20} color="inherit" /> : <CloudDownloadIcon />}
                            onClick={handleLibgenDownload}
                            disabled={libgenLoading}
                            fullWidth 
                        >
                            {libgenLoading ? 'Searching Libgen...' : 'Download from Libgen'}
                        </Button>
                    </Grid> */}
                </Grid>
                {/* {libgenError && (
                    <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center', wordBreak: 'break-word' }}>
                        {libgenError}
                    </Typography>
                )}
                {libgenDownloadUrl && !libgenError && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1, textAlign: 'center', wordBreak: 'break-word' }}>
                        Download started! Check your downloads or click the button again.
                    </Typography>
                )} */}

            </Box>
        </Box>
    );
}

export default BookDetailsPage;
