import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';
import { isWeekInStage } from '../../utils';

export default function StatisticsPanel() {
  const { t } = useTranslation();
  const {
    birthdate,
    currentWeekNumber,
    totalWeeks,
    currentAge,
    lifeStages,
    showLifeStages,
    markedWeeks
  } = useAppState();

  if (!birthdate) return null;

  const weeksLived = currentWeekNumber + 1;
  const weeksRemaining = totalWeeks - weeksLived;
  const percentageLived = ((weeksLived / totalWeeks) * 100).toFixed(1);

  // Calculate weeks in each life stage (only lived weeks)
  let schoolWeeks = 0;
  let collegeWeeks = 0;
  let careerWeeks = 0;
  let retirementWeeks = 0;

  if (showLifeStages && lifeStages) {
    for (let i = 0; i < weeksLived; i++) {
      if (isWeekInStage(i, lifeStages.school)) schoolWeeks++;
      else if (isWeekInStage(i, lifeStages.college)) collegeWeeks++;
      else if (isWeekInStage(i, lifeStages.career)) careerWeeks++;
      else if (isWeekInStage(i, lifeStages.retirement)) retirementWeeks++;
    }
  }

  const markedWeeksCount = markedWeeks.size;

  const stats = [
    {
      label: t('stats.percentageLived'),
      value: `${percentageLived}%`,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: t('stats.weeksLived'),
      value: weeksLived.toLocaleString(),
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: t('stats.weeksRemaining'),
      value: weeksRemaining.toLocaleString(),
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: t('stats.currentAge'),
      value: currentAge ? `${currentAge.years}y ${currentAge.weeks}w` : '-',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const stageStats = showLifeStages && lifeStages ? [
    {
      label: t('form.lifeStages.school'),
      value: schoolWeeks,
      color: 'bg-cyan-500 dark:bg-cyan-600',
    },
    {
      label: t('form.lifeStages.college'),
      value: collegeWeeks,
      color: 'bg-yellow-500 dark:bg-yellow-600',
    },
    {
      label: t('form.lifeStages.career'),
      value: careerWeeks,
      color: 'bg-orange-500 dark:bg-orange-600',
    },
    {
      label: t('form.lifeStages.retirement'),
      value: retirementWeeks,
      color: 'bg-purple-500 dark:bg-purple-600',
    },
  ] : [];

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Life Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('stats.lifeProgress')}
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {percentageLived}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-500 ease-out relative"
            style={{ width: `${percentageLived}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Life Stages Stats */}
      {showLifeStages && stageStats.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('stats.weeksPerStage')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stageStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${stat.color}`}></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marked Weeks Count */}
      {markedWeeksCount > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {markedWeeksCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t('stats.markedWeeks')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
