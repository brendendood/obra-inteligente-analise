import { Sun, Moon } from 'lucide-react';
import { useTheme, Theme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Tema claro';
      case 'dark':
        return 'Tema escuro';
      default:
        return 'Alternar tema';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;