    // src/App.jsx
    import React from 'react';
    import { Routes, Route, Link as RouterLink } from 'react-router-dom'; // Only import Routes, Route, and Link
    import { Box, AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material'; // useTheme for theme access
    import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
    import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

    // Import your pages
    import Homepage from './pages/Homepage';
    import BrowseBooksPage from './pages/BrowseBooksPage';
    import BookDetailsPage from './pages/BookDetailPage';
    import MangaPage from './pages/MangaPage';
    import MangaDetailPage from './pages/MangaDetailPage';

    // Import the ColorModeContext from ThemeContext.jsx to use toggleColorMode
    import { useColorMode } from './ThemeContext'; // Correct way to import useColorMode

    function App() {
      const theme = useTheme(); // Access the current theme
      const colorMode = useColorMode(); // Access the color mode toggler

      return (
        // The ThemeProvider and BrowserRouter are now handled in src/main.jsx
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
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
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            borderRadius: '50%',
                            p: 1,
                            boxShadow: theme.shadows[3],
                            zIndex: 9999,
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

            {/* Routes directly within App, as BrowserRouter is now in main.jsx */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/books" element={<BrowseBooksPage />} />
                    {/* Ensure the parameter name matches what useParams expects in BookDetailsPage */}
                    <Route path="/books/:bookId" element={<BookDetailsPage />} />
                    <Route path="/manga" element={<MangaPage />} />
                    <Route path="/manga/:mangaId" element={<MangaDetailPage />} />
                </Routes>
            </Box>
        </Box>
      );
    }

    export default App;
    