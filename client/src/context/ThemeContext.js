
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      detectTheme();
    }
  }, []);

  const detectTheme = () => {
    const currentHour = new Date().getHours();
    const detectedTheme = (currentHour >= 10 && currentHour < 12) ? 'light' : 'dark';

    setTheme(detectedTheme);
    localStorage.setItem('theme', detectedTheme);
    document.documentElement.setAttribute('data-theme', detectedTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, detectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
