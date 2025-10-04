import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';

export default function Footer() {
  const { t } = useTranslation();
  const { currentAge } = useAppState();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-4">
        {currentAge && (
          <p className="text-center text-gray-700 dark:text-gray-300 mb-2">
            {currentAge.weeks > 0
              ? t('grid.ageDisplay', {
                  years: currentAge.years,
                  weeks: currentAge.weeks,
                })
              : t('grid.ageDisplayYearsOnly', { years: currentAge.years })}
          </p>
        )}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footer.credits')}
        </p>
      </div>
    </footer>
  );
}
