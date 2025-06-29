import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  useTheme,
  Typography,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useColorMode } from './ThemeContext';

import HomePage from './pages/HomePage';
import BrowseBooksPage from './pages/BrowseBooksPage';
import BookDetailPage from './pages/BookDetailPage';
import MangaPage from './pages/MangaPage';
import MangaDetailPage from './pages/MangaDetailPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();

  const [value, setValue] = useState(() => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/books')) return 1;
    if (location.pathname.startsWith('/manga')) return 2;
    return 0;
  });

  useEffect(() => {
    if (location.pathname === '/') setValue(0);
    else if (location.pathname.startsWith('/books')) setValue(1);
    else if (location.pathname.startsWith('/manga')) setValue(2);
    else setValue(false);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate('/');
    if (newValue === 1) navigate('/books');
    if (newValue === 2) navigate('/manga');
  };

  return (
    <Box sx={{ pb: 7, position: 'relative' }}>
      <IconButton
        sx={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          backgroundColor: (t) => t.palette.background.paper,
          borderRadius: '50%',
          boxShadow: (t) => t.shadows[2],
          '&:hover': {
            backgroundColor: (t) => t.palette.action.hover,
          },
          color: (t) => t.palette.text.primary,
        }}
        onClick={() => {
          console.log('App: Theme toggler button clicked!');
          toggleColorMode();
        }}
        aria-label="toggle light/dark theme"
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BrowseBooksPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/manga" element={<MangaPage />} />
        <Route path="/manga/:mangaId" element={<MangaDetailPage />} />
        <Route
          path="*"
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">404 - Page Not Found</Typography>
            </Box>
          }
        />
      </Routes>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleTabChange}
          sx={{
            backgroundColor: (t) => t.palette.background.paper,
            borderTop: '1px solid',
            borderColor: (t) => t.palette.divider,
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Books" icon={<BookIcon />} />
          <BottomNavigationAction label="Manga" icon={<AutoStoriesIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;