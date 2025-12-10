import { createTheme, responsiveFontSizes, alpha } from '@mui/material/styles';
import BRAND_COLORS from './brandColors';

const getDesignTokens = (mode = 'light') => {
  const isLight = mode === 'light';

  return {
    palette: {
      mode,
      contrastThreshold: 4.5,
      tonalOffset: 0.2,
      primary: {
        light: isLight ? '#FFD700' : '#FFD700',
        main: isLight ? BRAND_COLORS.gold : '#D4AF37',
        dark: isLight ? '#B8860B' : '#B8860B',
        contrastText: isLight ? '#1a1a1a' : '#1a1a1a'
      },
      secondary: {
        light: isLight ? '#FFD700' : '#FFD700',
        main: isLight ? BRAND_COLORS.gold : '#D4AF37',
        dark: isLight ? '#B8860B' : '#B8860B',
        contrastText: isLight ? '#1a1a1a' : '#1a1a1a'
      },
      error: {
        main: '#dc2626',
        contrastText: '#ffffff'
      },
      warning: {
        main: '#f59e0b',
        contrastText: '#ffffff'
      },
      success: {
        main: BRAND_COLORS.gold,
        contrastText: '#1a1a1a'
      },
      background: {
        default: isLight ? BRAND_COLORS.offWhite : '#0b1120',
        paper: isLight ? '#ffffff' : '#0f172a'
      },
      text: {
        primary: isLight ? BRAND_COLORS.navy : '#f8fafc',
        secondary: isLight ? '#334155' : '#cbd5f5'
      },
      divider: isLight ? '#e2e8f0' : '#1e293b',
      brand: BRAND_COLORS
    },
    shape: {
      borderRadius: 12
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      button: {
        textTransform: 'none',
        fontWeight: 600
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: '1.25rem'
          },
          containedPrimary: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              },
              '&:focus-visible': {
                outline: `3px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`
              }
            };
          },
          containedSecondary: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              color: theme.palette.secondary.contrastText,
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              },
              '&:focus-visible': {
                outline: `3px solid ${alpha(theme.palette.secondary.contrastText, 0.4)}`
              }
            };
          },
          outlinedPrimary: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              borderColor: alpha(theme.palette.primary.main, 0.4),
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08)
              }
            };
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                color: theme.palette.secondary.dark
              }
            };
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              backgroundImage: 'none',
              boxShadow: theme.shadows[1]
            };
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: (props) => {
          const theme = props?.theme ?? defaultTheme;
          return {
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary
            },
            a: {
              color: 'inherit'
            }
          };
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: (props) => {
            const theme = props?.theme ?? defaultTheme;
            return {
              borderRadius: 12,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2
              }
            };
          }
        }
      }
    }
  };
};

const defaultTheme = createTheme();

const createAppTheme = (mode = 'light') => responsiveFontSizes(createTheme(getDesignTokens(mode)));

export default createAppTheme;
