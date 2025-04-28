import React from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const AuthLayout = ({ children }) => {
  return React.createElement(
    ThemeProvider,
    { theme: theme },
    [
      React.createElement(CssBaseline, { key: 'cssbaseline' }),
      React.createElement(
        Container,
        {
          component: 'main',
          maxWidth: 'xs',
          key: 'container'
        },
        React.createElement(
          Box,
          {
            sx: {
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            key: 'box'
          },
          children
        )
      )
    ]
  );
};