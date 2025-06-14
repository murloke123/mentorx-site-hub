
import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <IconButton
      onClick={toggleDarkMode}
      color="inherit"
      aria-label="toggle dark mode"
    >
      {isDarkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};
