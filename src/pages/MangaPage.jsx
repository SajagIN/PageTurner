import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Grid, CircularProgress, InputAdornment, AppBar, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MangaCard from '../components/MangaCard';
import { searchManga, debounce } from '../api/jikanApi';

function MangaPage() {
  const [mangaResults, setMangaResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('Naruto');

  const debouncedFetchManga = useCallback(
    debounce(async (query) => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchManga(query);
        setMangaResults(data);
      } catch (err) {
        setError('Failed to fetch manga. Please try again.');
        console.error('Manga fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 800),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedFetchManga(searchTerm);
    } else {
      setMangaResults([]);
      setLoading(false);
    }
  }, [searchTerm, debouncedFetchManga]);
  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Manga
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <TextField
          label="Search for manga..."
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
        {!loading && !error && mangaResults.length === 0 && searchTerm.trim() !== '' && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            No manga found for "{searchTerm}".
          </Typography>
        )}
        {!loading && !error && mangaResults.length > 0 && (
          <Grid container spacing={2}>
            {mangaResults.map(manga => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={manga.mal_id}>
                <MangaCard manga={manga} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default MangaPage;