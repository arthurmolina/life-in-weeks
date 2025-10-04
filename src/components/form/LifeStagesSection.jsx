import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';
import { trackLifeStagesToggle } from '../../utils';

export default function LifeStagesSection() {
  const { t } = useTranslation();
  const { lifeStages, showLifeStages, setLifeStages, toggleLifeStages } = useAppState();

  const [stages, setStages] = useState({
    school: {
      startAge: lifeStages?.school?.startAge || 6,
      duration: lifeStages?.school?.duration || 12,
    },
    college: {
      startAge: lifeStages?.college?.startAge || 18,
      duration: lifeStages?.college?.duration || 4,
    },
    career: {
      startAge: lifeStages?.career?.startAge || 22,
      endAge: lifeStages?.career?.endAge || 65,
    },
    retirement: {
      startAge: lifeStages?.retirement?.startAge || 65,
    },
  });

  // Sync stages with context on mount
  useEffect(() => {
    setLifeStages(stages);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = () => {
    trackLifeStagesToggle(!showLifeStages);
    toggleLifeStages();
  };

  const handleChange = (stage, field, value) => {
    const newStages = {
      ...stages,
      [stage]: {
        ...stages[stage],
        [field]: parseInt(value, 10),
      },
    };
    setStages(newStages);
    setLifeStages(newStages);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
      >
        <span>{t('form.lifeStages.title')}</span>
        <span>{showLifeStages ? '▼' : '▶'}</span>
      </button>

      {showLifeStages && (
        <div className="space-y-3">
          {/* School */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-sm bg-cyan-500 dark:bg-cyan-600"></span>
              {t('form.lifeStages.school')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.startAge')}
                </label>
                <input
                  type="number"
                  value={stages.school.startAge}
                  onChange={(e) => handleChange('school', 'startAge', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.duration')}
                </label>
                <input
                  type="number"
                  value={stages.school.duration}
                  onChange={(e) => handleChange('school', 'duration', e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* College */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-sm bg-yellow-500 dark:bg-yellow-600"></span>
              {t('form.lifeStages.college')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.startAge')}
                </label>
                <input
                  type="number"
                  value={stages.college.startAge}
                  onChange={(e) => handleChange('college', 'startAge', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.duration')}
                </label>
                <input
                  type="number"
                  value={stages.college.duration}
                  onChange={(e) => handleChange('college', 'duration', e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Career */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-sm bg-orange-500 dark:bg-orange-600"></span>
              {t('form.lifeStages.career')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.startAge')}
                </label>
                <input
                  type="number"
                  value={stages.career.startAge}
                  onChange={(e) => handleChange('career', 'startAge', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('form.lifeStages.endAge')}
                </label>
                <input
                  type="number"
                  value={stages.career.endAge}
                  onChange={(e) => handleChange('career', 'endAge', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Retirement */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-sm bg-purple-500 dark:bg-purple-600"></span>
              {t('form.lifeStages.retirement')}
            </label>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('form.lifeStages.startAge')}
              </label>
              <input
                type="number"
                value={stages.retirement.startAge}
                onChange={(e) => handleChange('retirement', 'startAge', e.target.value)}
                min="0"
                max="100"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
