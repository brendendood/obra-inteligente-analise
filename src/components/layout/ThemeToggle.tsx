
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 rounded-full hover:bg-accent transition-all duration-200"
      title={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200" />
      )}
    </Button>
  );
};

export default ThemeToggle;
