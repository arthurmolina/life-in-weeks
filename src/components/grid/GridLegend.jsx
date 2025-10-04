import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';

export default function GridLegend() {
  const { t } = useTranslation();
  const { showLifeStages } = useAppState();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {t('grid.legend.title')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 dark:bg-blue-600 rounded-sm" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('grid.legend.past')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded-sm ring-2 ring-green-700" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('grid.legend.current')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('grid.legend.future')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-sm" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('grid.legend.marked')}
          </span>
        </div>

        {showLifeStages && (
          <>
            <div className="col-span-2 md:col-span-4 border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('grid.legend.lifeStages')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 dark:bg-cyan-600 rounded-sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('form.lifeStages.school')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded-sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('form.lifeStages.college')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 dark:bg-orange-600 rounded-sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('form.lifeStages.career')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 dark:bg-purple-600 rounded-sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('form.lifeStages.retirement')}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        {t('grid.legend.clickToMark')}
      </p>
    </div>
  );
}
