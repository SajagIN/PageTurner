// src/App.jsx
import React, { useState, useEffect, useMemo, createContext } from 'react'; // Added createContext
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline, // Import CssBaseline for consistent styling
  Box,
  Button,
  IconButton,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

// Import your pages
import Homepage from './pages/Homepage';
import BrowseBooksPage from './pages/BrowseBooksPage';
import BookDetailPage from './pages/BookDetailPage';
import MangaPage from './pages/MangaPage';
import MangaDetailPage from './pages/MangaDetailPage';

// Define ColorModeContext directly here, or import it if ThemeContext.jsx only exports this.
// For self-containment in App.jsx, defining it here is often clearer for simple apps.
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  // Theme state and toggler logic
  const [mode, setMode] = useState('dark'); // Default to dark mode or user preference

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Customizing palette for better visual appeal
          primary: {
            main: mode === 'light' ? '#3f51b5' : '#90caf9', // Blue shades
          },
          secondary: {
            main: mode === 'light' ? '#f50057' : '#f48fb1', // Pink shades
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212', // Light grey or dark grey
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e', // White or slightly lighter dark grey for cards
          },
          text: {
            primary: mode === 'light' ? '#212121' : '#ffffff', // Dark text for light, white for dark
            secondary: mode === 'light' ? '#757575' : '#bdbdbd', // Grey text for light, lighter grey for dark
          },
          divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)', // Subtle divider color
        },
        typography: {
          fontFamily: 'Inter, sans-serif', // Using Inter font
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px', // Apply rounded corners to all buttons
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '10px', // Apply rounded corners to cards
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', // Apply rounded corners to text fields
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Applies base CSS styles, often crucial for consistent rendering */}
        <Router>
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
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
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
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
