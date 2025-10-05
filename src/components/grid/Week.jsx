import { memo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getWeekStatus, isWeekInStage, getWeekDateRange } from '../../utils';
import Tooltip from '../common/Tooltip';

function Week({ weekNumber, currentWeekNumber, marking, lifeStages, showLifeStages, onClick, birthdate, isLastWeek, zoom = 1, baseSize = 8 }) {
  const { i18n } = useTranslation();
  const status = getWeekStatus(weekNumber, currentWeekNumber);

  // Get date range for this week
  const { startDate, endDate } = birthdate
    ? getWeekDateRange(birthdate, weekNumber)
    : { startDate: null, endDate: null };

  let bgClass = 'bg-gray-200 dark:bg-gray-700';
  let animationClass = '';
  if (status === 'past') bgClass = 'bg-blue-400 dark:bg-blue-600';
  if (status === 'current') {
    bgClass = 'bg-green-500 dark:bg-green-600';
    animationClass = 'animate-pulse-ring';
  }

  // Check if week is in a life stage
  let stageClass = '';
  if (showLifeStages && lifeStages) {
    const isPast = status === 'past';

    if (isWeekInStage(weekNumber, lifeStages.school)) {
      if (isPast) {
        // Lived weeks: solid background color
        bgClass = 'bg-cyan-500 dark:bg-cyan-600';
        stageClass = 'ring-1 ring-cyan-600 dark:ring-cyan-700';
      } else {
        // Future weeks: light background with colored border
        bgClass = 'bg-cyan-100 dark:bg-cyan-900/30';
        stageClass = 'ring-1 ring-cyan-500';
      }
    } else if (isWeekInStage(weekNumber, lifeStages.college)) {
      if (isPast) {
        bgClass = 'bg-yellow-500 dark:bg-yellow-600';
        stageClass = 'ring-1 ring-yellow-600 dark:ring-yellow-700';
      } else {
        bgClass = 'bg-yellow-100 dark:bg-yellow-900/30';
        stageClass = 'ring-1 ring-yellow-500';
      }
    } else if (isWeekInStage(weekNumber, lifeStages.career)) {
      if (isPast) {
        bgClass = 'bg-orange-500 dark:bg-orange-600';
        stageClass = 'ring-1 ring-orange-600 dark:ring-orange-700';
      } else {
        bgClass = 'bg-orange-100 dark:bg-orange-900/30';
        stageClass = 'ring-1 ring-orange-500';
      }
    } else if (isWeekInStage(weekNumber, lifeStages.retirement)) {
      if (isPast) {
        bgClass = 'bg-purple-500 dark:bg-purple-600';
        stageClass = 'ring-1 ring-purple-600 dark:ring-purple-700';
      } else {
        bgClass = 'bg-purple-100 dark:bg-purple-900/30';
        stageClass = 'ring-1 ring-purple-500';
      }
    }
  }

  // Calculate size based on zoom
  const size = `${baseSize * zoom}px`;

  // Use inline style for custom marking colors and size
  const style = {
    width: size,
    height: size,
    ...(marking ? { backgroundColor: marking.color } : {}),
  };

  // Build tooltip content
  let tooltipContent = null;
  if (startDate && endDate && birthdate) {
    const isPt = i18n.language === 'pt';
    const dateFormat = isPt ? 'dd/MM/yyyy' : 'MMM d, yyyy';
    const locale = isPt ? ptBR : undefined;

    const startStr = format(startDate, dateFormat, { locale });
    const endStr = format(endDate, dateFormat, { locale });

    // Calculate age properly using the start date of this week
    const birth = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
    const ageYears = Math.floor((startDate - birth) / (365.25 * 24 * 60 * 60 * 1000));

    // Calculate last birthday date
    const lastBirthday = new Date(birth);
    lastBirthday.setFullYear(birth.getFullYear() + ageYears);

    // Calculate weeks since last birthday
    const daysSinceLastBirthday = Math.floor((startDate - lastBirthday) / (24 * 60 * 60 * 1000));
    const ageWeeks = Math.floor(daysSinceLastBirthday / 7);

    const ageDisplay = ageWeeks > 0
      ? isPt
        ? `${ageYears} anos e ${ageWeeks} semanas`
        : `${ageYears} years and ${ageWeeks} weeks`
      : isPt
        ? `${ageYears} anos`
        : `${ageYears} years`;

    const weekLabel = isPt ? `Semana ${weekNumber + 1}` : `Week ${weekNumber + 1}`;

    tooltipContent = (
      <div className="text-center">
        {marking?.label && (
          <div className="font-semibold mb-1">{marking.label}</div>
        )}
        <div className="text-xs font-medium">{ageDisplay} • {weekLabel}</div>
        <div className="text-xs opacity-90">{startStr} - {endStr}</div>
      </div>
    );
  }

  if (isLastWeek) {
    return (
      <Tooltip content={tooltipContent}>
        <div
          className="rounded-sm cursor-pointer hover:scale-150 transition-transform flex items-center justify-center bg-gray-300 dark:bg-gray-600"
          style={{ width: size, height: size }}
          onClick={() => onClick?.(weekNumber)}
        >
          <span className="text-[7px] font-bold leading-none text-gray-600 dark:text-gray-300">+</span>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={tooltipContent}>
      <div
        className={`rounded-sm cursor-pointer hover:scale-150 transition-transform ${!marking ? bgClass : ''} ${stageClass} ${animationClass}`}
        style={style}
        onClick={() => onClick?.(weekNumber)}
      />
    </Tooltip>
  );
}

export default memo(Week);
