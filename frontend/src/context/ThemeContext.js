// In context/ThemeContext.js
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from '../theme';

const ThemeContext = createContext({ isDarkTheme: false, toggleTheme: () => {} });

export const ThemeProviderWrapper = ({ children }) => {
    const [mode, setMode] = useState('light');

    const toggleTheme = useCallback(() => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    }, []);

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const contextValue = useMemo(() => ({
        isDarkTheme: mode === 'dark',
        toggleTheme
    }), [mode, toggleTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);