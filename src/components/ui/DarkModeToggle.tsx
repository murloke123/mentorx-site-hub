
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="toggle dark mode"
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
