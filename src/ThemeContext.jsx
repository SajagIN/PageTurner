import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          console.log('ThemeContext: Toggling mode to', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () => {
      console.log('ThemeContext: Recreating theme for mode:', mode);
      return createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#007AFF',
                },
                secondary: {
                  main: '#FF2D55',
                },
                text: {
                  primary: '#1C1C1E',
                  secondary: '#6D6D70',
                },
                background: {
                  default: '#F2F2F7',
                  paper: '#FFFFFF',
                },
                divider: '#C6C6C8',
              }
            : {
                primary: {
                  main: '#0A84FF',
                },
                secondary: {
                  main: '#FF453A',
                },
                text: {
                  primary: '#E5E5EA',
                  secondary: '#AEAEC2',
                },
                background: {
                  default: '#000000',
                  paper: '#1C1C1E',
                },
                divider: '#48484A',
              }),
        },
        typography: {
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
            button: { textTransform: 'none' },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: (t) => t.palette.background.paper,
                        color: (t) => t.palette.text.primary,
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: { minHeight: 44, '@media (min-width: 600px)': { minHeight: 44 } },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: '10px' },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { borderRadius: '10px' },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: { borderRadius: '10px', boxShadow: 'none' },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: { '& .MuiOutlinedInput-root': { borderRadius: '10px' } },
                },
            },
            MuiBottomNavigation: {
                styleOverrides: {
                    root: { height: 50 },
                },
            },
            MuiBottomNavigationAction: {
                styleOverrides: {
                    label: { fontSize: '0.65rem' },
                    root: { '&.Mui-selected': { color: (t) => t.palette.primary.main } },
                },
            },
        },
      });
    },
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);