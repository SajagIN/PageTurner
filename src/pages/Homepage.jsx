import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  useTheme,
  AppBar,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebIcon from '@mui/icons-material/Web';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <LibraryBooksIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            PageTurner
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 6, p: { xs: 2, sm: 4 }, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50', boxShadow: theme.shadows[1] }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Welcome to PageTurner!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Your ultimate destination for discovering, exploring, and reviewing a vast collection of books and captivating manga series. Dive into new stories today!
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: { xs: 2, sm: 3 },
                borderRadius: '12px',
                boxShadow: theme.shadows[3],
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <BookIcon sx={{ fontSize: 60, color: theme.palette.primary.dark, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                Explore Books
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Discover new bestsellers, classic novels, and hidden gems. Search, browse, and find your next great read.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/books')}
                sx={{ borderRadius: '25px', px: 4 }}
              >
                Browse Books
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: { xs: 2, sm: 3 },
                borderRadius: '12px',
                boxShadow: theme.shadows[3],
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 60, color: theme.palette.secondary.dark, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                Discover Manga
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Dive into the captivating world of mangas, manhwa, manhua, and more. Search for your favorite series and explore new releases.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/manga')}
                sx={{ borderRadius: '25px', px: 4 }}
              >
                Browse Manga
              </Button>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 8, p: { xs: 2, sm: 4 }, bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100', borderRadius: '12px', boxShadow: theme.shadows[1] }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            About PageTurner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            PageTurner is an open-source web application built to help you explore and engage with books and manga.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<GitHubIcon />}
                href="https://github.com/SajagIN/PageTurner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Source Code
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<WebIcon />}
                href="https://sajagin.thedev.id"
                target="_blank"
                rel="noopener noreferrer"
              >
                Author's Website
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<GitHubIcon />}
                href="https://github.com/SajagIN"
                target="_blank"
                rel="noopener noreferrer"
              >
                Author's GitHub
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Box sx={{ mt: 4, py: 2, bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.200', color: 'text.disabled', textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption">
            PageTurner App | Made with ❤️ for readers everywhere.
          </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;