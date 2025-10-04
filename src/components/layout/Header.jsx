import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('app.title')}
        </h1>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title={t('header.changeLanguage')}
          >
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title={t('header.toggleTheme')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
