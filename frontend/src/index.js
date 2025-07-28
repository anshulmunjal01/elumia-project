// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Import ThemeProvider and useTheme
import { ThemeProvider as StyledThemeProvider } from 'styled-components'; // Import styled-components ThemeProvider
import GlobalStyle from './styles/GlobalStyle'; // Assuming you have a GlobalStyle component

// Create a wrapper component to provide the theme to styled-components
function AppWrapper() {
  const { theme } = useTheme(); // Get the theme object from your custom ThemeProvider

  return (
    <StyledThemeProvider theme={theme}> {/* Pass your custom 'theme' object to styled-components' ThemeProvider */}
      <GlobalStyle /> {/* Apply global styles here */}
      <App />
    </StyledThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* Your custom ThemeProvider */}
      <AppWrapper /> {/* Wrap App with the AppWrapper to access 'theme' */}
    </ThemeProvider>
  </React.StrictMode>
);