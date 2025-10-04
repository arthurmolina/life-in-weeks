import { useEffect } from 'react';
import { ThemeProvider, AppStateProvider } from './contexts';
import { HomePage } from './pages';
import { initGA, trackPageView } from './utils';
import './i18n/config';

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    trackPageView('/');
  }, []);

  return (
    <ThemeProvider>
      <AppStateProvider>
        <HomePage />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
