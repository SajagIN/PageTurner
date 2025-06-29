import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Grid, CircularProgress, InputAdornment, AppBar, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookCard from '../components/BookCard';
import { searchOpenLibraryBooks, debounce } from '../api/openLibraryApi';
function BrowseBooksPage() {
    const [bookResults, setBookResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('Lord of the Rings'); 

    const debouncedFetchBooks = useCallback(
        debounce(async (query) => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchOpenLibraryBooks(query);
                setBookResults(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch books. Please try again.');
                console.error('Book fetch error:', err);
            } finally {
                setLoading(false);
            }
        }, 800),
        []
    );

    useEffect(() => {
        if (searchTerm.trim()) {
            debouncedFetchBooks(searchTerm);
        } else {
            setBookResults([]);
            setLoading(false);
        }
    }, [searchTerm, debouncedFetchBooks]);

    return (
        <Box>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Books
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2 }}>
                <TextField
                    label="Search for books..."
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
                {!loading && !error && bookResults.length === 0 && searchTerm.trim() !== '' && (
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        No books found for "{searchTerm}".
                    </Typography>
                )}
                {!loading && !error && bookResults.length > 0 && (
                    <Grid container spacing={2}>
                        {bookResults.map(book => (
                            book.id && (
                                <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id}>
                                    <BookCard book={book} />
                                </Grid>
                            )
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}

export default BrowseBooksPage;

