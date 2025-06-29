// src/App.jsx
import React from 'react'; // Only need React here, state/memo/context handled by ThemeContext
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme, // Use useTheme hook to access the current theme for styling
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

// Import your pages
import Homepage from './pages/Homepage';
import BrowseBooksPage from './pages/BrowseBooksPage';
import BookDetailPage from './pages/BookDetailPage';
import MangaPage from './pages/MangaPage';
import MangaDetailPage from './pages/MangaDetailPage';

// Import the ThemeProvider and useColorMode from your ThemeContext.jsx
import { ThemeProvider, useColorMode } from './ThemeContext'; // Correct import

function AppContent() {
  const theme = useTheme(); // Access the theme provided by MuiThemeProvider
  const colorMode = useColorMode(); // Access the toggle function from ColorModeContext

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            PageTurner
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/books">
            Books
          </Button>
          <Button color="inherit" component={RouterLink} to="/manga">
            Manga
          </Button>
          {/* Theme Toggler Button */}
          <IconButton
            sx={{
              ml: 1,
              position: 'fixed', // Essential for z-index to work against other content
              bottom: 16,
              right: 16,
              // Use theme palette directly
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: '50%',
              p: 1,
              boxShadow: theme.shadows[3],
              zIndex: 9999, // Set a very high z-index to ensure it's on top
              '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<BrowseBooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/manga" element={<MangaPage />} />
          <Route path="/manga/:mangaId" element={<MangaDetailPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

// App is now wrapped by ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
