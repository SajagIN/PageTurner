
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    Grid 
} from '@mui/material';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LaunchIcon from '@mui/icons-material/Launch'; 

import { getMangaById, getMangaReviews } from '../api/jikanApi';

const REVIEW_TEXT_LIMIT = 300;
const REVIEWS_PER_LOAD = 5; 

function MangaDetailPage() {
    const { mangaId } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [allReviewsData, setAllReviewsData] = useState([]); 
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [loadingMoreReviews, setLoadingMoreReviews] = useState(false); 

    const scrollContainerRef = useRef(null); 

    
    const handleToggleExpand = (reviewId) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.mal_id === reviewId ? { ...review, isExpanded: !review.isExpanded } : review
            )
        );
    };

    
    useEffect(() => {
        const fetchMangaDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getMangaById(mangaId);
                setManga(data);
            } catch (err) {
                console.error('Error fetching manga details:', err);
                setError(err.message || 'Failed to fetch manga details.');
            } finally {
                setLoading(false);
            }
        };

        if (mangaId) {
            fetchMangaDetails();
        }
    }, [mangaId]);

    
    const fetchAndProcessReviews = useCallback(async (pageToFetch) => {
        try {
            const data = await getMangaReviews(mangaId);
            console.log('Jikan API Reviews Data:', data);

            const processedReviews = data
                .filter(review => review.review)
                .map(review => ({
                    ...review,
                    isExpanded: false
                }));

            setAllReviewsData(processedReviews); 
            setReviewsError(null);
            setHasMoreReviews(processedReviews.length > REVIEWS_PER_LOAD); 

            
            setReviews(processedReviews.slice(0, REVIEWS_PER_LOAD));
            setCurrentPage(1);

        } catch (err) {
            console.error('Error fetching manga reviews:', err);
            setReviewsError('Failed to load reviews.');
            setHasMoreReviews(false); 
        } finally {
            setReviewsLoading(false);
        }
    }, [mangaId]);

    
    useEffect(() => {
        if (mangaId) {
            setReviewsLoading(true); 
            fetchAndProcessReviews(0); 
        }
    }, [mangaId, fetchAndProcessReviews]); 

    const loadMoreReviews = useCallback(() => {
        if (loadingMoreReviews || !hasMoreReviews) return; 

        setLoadingMoreReviews(true);

        const startIndex = currentPage * REVIEWS_PER_LOAD;
        const endIndex = startIndex + REVIEWS_PER_LOAD;
        const newReviews = allReviewsData.slice(startIndex, endIndex);

        if (newReviews.length > 0) {
            setReviews(prevReviews => [...prevReviews, ...newReviews]);
            setCurrentPage(prevPage => prevPage + 1);
            setHasMoreReviews(endIndex < allReviewsData.length); 
        } else {
            setHasMoreReviews(false); 
        }
        setLoadingMoreReviews(false);
    }, [currentPage, loadingMoreReviews, hasMoreReviews, allReviewsData]);


    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollHeight - scrollTop <= clientHeight + 100 && hasMoreReviews && !loadingMoreReviews) {
                loadMoreReviews();
            }
        };

        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreReviews, loadingMoreReviews, loadMoreReviews]);


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
                    Could not load manga details. Please try again.
                </Typography>
                <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    <ArrowBackIcon /> Go Back
                </IconButton>
            </Box>
        );
    }

    if (!manga) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Manga Data Found.</Typography>
                <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    <ArrowBackIcon /> Go Back
                </IconButton>
            </Box>
        );
    }

    const imageUrl = manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || 'https://placeholder.co/225x320?text=No+Cover';
    const overallRatingValue = manga.score ? manga.score / 2 : 0;

    const mangaDexUrl = `https://mangadex.org/search?q=${encodeURIComponent(manga.title)}`;

    return (
        <Box sx={{ pb: 7 }} ref={scrollContainerRef}
            style={{ height: '100vh', overflowY: 'auto' }}
        >
            <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}> {/* Changed position to sticky, added bgcolor */}
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        Manga Details
                    </Typography>
                    <Box sx={{ width: 48 }} />
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, borderRadius: '10px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                    <CardMedia
                        component="img"
                        sx={{
                            width: { xs: '100%', sm: 200 },
                            height: { xs: 300, sm: 'auto' },
                            objectFit: 'contain',
                            borderRadius: { xs: '10px 10px 0 0', sm: '10px 0 0 10px' },
                            p: 2,
                        }}
                        image={imageUrl}
                        alt={manga.title}
                    />
                    <CardContent sx={{ flex: '1 0 auto', p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {manga.title}
                        </Typography>
                        {manga.title_japanese && (
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                {manga.title_japanese}
                            </Typography>
                        )}
                        {manga.authors && manga.authors.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Author(s): {manga.authors.map(a => a.name).join(', ')}
                            </Typography>
                        )}
                        {manga.published?.string && (
                            <Typography variant="body2" color="text.secondary">
                                Published: {manga.published.string}
                            </Typography>
                        )}
                        {manga.chapters && (
                            <Typography variant="body2" color="text.secondary">
                                Chapters: {manga.chapters}
                            </Typography>
                        )}
                        {manga.volumes && (
                            <Typography variant="body2" color="text.secondary">
                                Volumes: {manga.volumes}
                            </Typography>
                        )}
                        {manga.score !== null && manga.score !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating
                                    name="overall-manga-rating"
                                    value={overallRatingValue}
                                    precision={0.5}
                                    readOnly
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({manga.scored_by} users)
                                </Typography>
                            </Box>
                        )}
                        {manga.genres && manga.genres.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Genres: {manga.genres.map(g => g.name).join(', ')}
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Grid container spacing={1} sx={{ mt: 2, mb: 3, justifyContent: 'center' }}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LaunchIcon />}
                            href={mangaDexUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth
                            sx={{
                                boxShadow: (theme) => theme.shadows[3],
                                border: (theme) => `1px solid ${theme.palette.primary.dark}`,
                                '&:hover': {
                                    boxShadow: (theme) => theme.shadows[6],
                                    backgroundColor: (theme) => theme.palette.primary.dark,
                                },
                                borderRadius: '8px',
                            }}
                        >
                            View on MangaDex
                        </Button>
                    </Grid>
                </Grid>

                {manga.synopsis && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Synopsis
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {manga.synopsis}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        User Reviews
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {reviewsLoading && !reviewsError && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {reviewsError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                            {reviewsError}
                        </Typography>
                    )}

                    {!reviewsLoading && !reviewsError && reviews.length === 0 && allReviewsData.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            No reviews available for this manga yet.
                        </Typography>
                    )}

                    {/* Display loaded reviews */}
                    {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                        <Box>
                            {reviews.map((review, index) => {
                                const isContentTooLong = review.review && review.review.length > REVIEW_TEXT_LIMIT;
                                const displayedContent = review.isExpanded || !isContentTooLong
                                    ? review.review
                                    : review.review.substring(0, REVIEW_TEXT_LIMIT) + '...';

                                return (
                                    <Card
                                        key={review.mal_id || index}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            borderRadius: '10px',
                                            boxShadow: 'none',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {review.user?.username || 'Anonymous User'}
                                                </Typography>
                                                {review.score !== null && review.score !== undefined && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                        <Rating
                                                            name={`review-rating-${review.mal_id || index}`}
                                                            value={review.score / 2}
                                                            precision={0.5}
                                                            readOnly
                                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                            sx={{ fontSize: '1rem', mr: 0.5 }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            ({review.score})
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                {review.date ? new Date(review.date).toLocaleDateString() : 'Date N/A'}
                                            </Typography>
                                            {review.review && (
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                    {displayedContent}
                                                    {isContentTooLong && (
                                                        <Button
                                                            onClick={() => handleToggleExpand(review.mal_id)}
                                                            size="small"
                                                            sx={{
                                                                ml: 1,
                                                                p: 0,
                                                                minWidth: 0,
                                                                textTransform: 'none',
                                                                '&:hover': {
                                                                    backgroundColor: 'transparent',
                                                                    textDecoration: 'underline'
                                                                }
                                                            }}
                                                        >
                                                            {review.isExpanded ? 'Show Less' : 'Read More'}
                                                        </Button>
                                                    )}
                                                </Typography>
                                            )}
                                            {!review.review && (
                                                <Typography variant="body2" color="text.secondary">
                                                    No review content available.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Card>
                                );
                            })}
                            {loadingMoreReviews && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            )}
                            {!hasMoreReviews && allReviewsData.length > 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                                    You've reached the end of the reviews!
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default MangaDetailPage;
