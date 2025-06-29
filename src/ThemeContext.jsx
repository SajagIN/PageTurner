// src/ThemeContext.jsx
import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// This context will provide the toggle function to other components
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// This component will encapsulate the theme logic and provide it to its children
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light'); // Initial theme mode

  // Memoize the colorMode object to prevent unnecessary re-renders
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          console.log('ThemeContext: Toggling mode to', newMode); // Log for debugging
          return newMode;
        });
      },
    }),
    [],
  );

  // Memoize the theme object itself so it only recalculates when 'mode' changes
  const theme = useMemo(
    () => {
      console.log('ThemeContext: Recreating theme for mode:', mode); // Log for debugging
      return createTheme({
        palette: {
          mode, // Set the current mode
          // Light mode palette
          ...(mode === 'light'
            ? {
                primary: { main: '#007AFF' }, // Blue
                secondary: { main: '#FF2D55' }, // Red-Pink
                text: { primary: '#1C1C1E', secondary: '#6D6D70' }, // Dark text, grey secondary
                background: { default: '#F2F2F7', paper: '#FFFFFF' }, // Light background, white paper
                divider: '#C6C6C8', // Light divider
              }
            : // Dark mode palette
              {
                primary: { main: '#0A84FF' }, // Lighter Blue
                secondary: { main: '#FF453A' }, // Orange-Red
                text: { primary: '#E5E5EA', secondary: '#AEAEC2' }, // Light text, lighter grey secondary
                background: { default: '#000000', paper: '#1C1C1E' }, // Black background, dark paper
                divider: '#48484A', // Dark divider
              }),
        },
        typography: {
            // Define your custom typography, ensure 'Inter' or other web-safe fonts
            // are loaded if not using system fonts.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            h4: { fontSize: '1.8rem', fontWeight: 700 },
            h5: { fontSize: '1.5rem', fontWeight: 600 },
            h6: { fontSize: '1.1rem', fontWeight: 600 },
            body1: { fontSize: '0.95rem' },
            body2: { fontSize: '0.85rem' },
            subtitle1: { fontSize: '1rem', fontWeight: 600 },
            subtitle2: { fontSize: '0.9rem', fontWeight: 600 },
            button: { textTransform: 'none' }, // Prevent uppercase buttons by default
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: (t) => t.palette.background.paper, // Use theme background
                        color: (t) => t.palette.text.primary, // Use theme text color
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: { minHeight: 44, '@media (min-width: 600px)': { minHeight: 44 } },
                },
            },
            MuiButton: { styleOverrides: { root: { borderRadius: '10px' } } },
            MuiPaper: { styleOverrides: { root: { borderRadius: '10px' } } },
            MuiCard: { styleOverrides: { root: { borderRadius: '10px', boxShadow: 'none' } } },
            MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: '10px' } } } },
            MuiBottomNavigation: { styleOverrides: { root: { height: 50 } } },
            MuiBottomNavigationAction: {
                styleOverrides: {
                    label: { fontSize: '0.65rem' },
                    root: { '&.Mui-selected': { color: (t) => t.palette.primary.main } },
                },
            },
        },
      });
    },
    [mode], // Recreate theme only when 'mode' changes
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme /> {/* enableColorScheme is good for system preference sync */}
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Custom hook for easier consumption of the color mode context
export const useColorMode = () => useContext(ColorModeContext);
