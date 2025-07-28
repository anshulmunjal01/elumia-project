// frontend/src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { lightTheme, darkTheme } from '../styles/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize themeMode from localStorage, default to 'light' if not found
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const storedTheme = localStorage.getItem('elumiaThemeMode');
      return storedTheme || 'light';
    } catch (error) {
      console.error("Failed to read theme from localStorage:", error);
      return 'light'; // Fallback to light theme on error
    }
  });

  // Effect to update localStorage whenever themeMode changes
  useEffect(() => {
    try {
      localStorage.setItem('elumiaThemeMode', themeMode);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [themeMode]);

  // Function to toggle theme, wrapped in useCallback for stability
  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []); // Empty dependency array means this function is created once and is stable

  const theme = useMemo(() => {
    return themeMode === 'light' ? lightTheme : darkTheme;
  }, [themeMode]); // theme depends only on themeMode

  const value = useMemo(() => ({
    themeMode,
    theme,
    toggleTheme,
  }), [themeMode, theme, toggleTheme]); // Now toggleTheme is a stable dependency

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);