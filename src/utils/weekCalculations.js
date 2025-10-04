import { differenceInDays, differenceInYears, addDays, isLeapYear, parseISO } from 'date-fns';
import { WEEKS_PER_YEAR } from './constants';

/**
 * Calculate the total number of weeks lived from birthdate to now
 * @param {Date|string} birthdate - The birthdate
 * @returns {number} Total weeks lived
 */
export function calculateWeeksLived(birthdate) {
  if (!birthdate) return 0;

  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate;
  const today = new Date();

  const days = differenceInDays(today, birth);
  return Math.floor(days / 7);
}

/**
 * Calculate the current age in years and weeks
 * @param {Date|string} birthdate - The birthdate
 * @returns {Object} Object with years, weeks, and total weeks
 */
export function calculateCurrentAge(birthdate) {
  if (!birthdate) return { years: 0, weeks: 0, totalWeeks: 0 };

  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate;
  const today = new Date();

  const years = differenceInYears(today, birth);

  // Calculate the date of the last birthday
  const lastBirthday = new Date(birth);
  lastBirthday.setFullYear(birth.getFullYear() + years);

  // Calculate weeks since last birthday
  const daysSinceLastBirthday = differenceInDays(today, lastBirthday);
  const weeks = Math.floor(daysSinceLastBirthday / 7);

  const totalWeeks = calculateWeeksLived(birthdate);

  return {
    years,
    weeks,
    totalWeeks,
  };
}

/**
 * Calculate the total number of weeks expected to live
 * @param {number} lifeExpectancy - Life expectancy in years
 * @returns {number} Total weeks
 */
export function calculateTotalWeeks(lifeExpectancy) {
  return Math.ceil(lifeExpectancy * WEEKS_PER_YEAR);
}

/**
 * Calculate the current week number based on birthdate
 * @param {Date|string} birthdate - The birthdate
 * @returns {number} Current week number (0-indexed)
 */
export function getCurrentWeekNumber(birthdate) {
  return calculateWeeksLived(birthdate);
}

/**
 * Get the date range for a specific week number
 * @param {Date|string} birthdate - The birthdate
 * @param {number} weekNumber - Week number (0-indexed)
 * @returns {Object} Object with startDate and endDate
 */
export function getWeekDateRange(birthdate, weekNumber) {
  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate;
  const startDate = addDays(birth, weekNumber * 7);
  const endDate = addDays(startDate, 6);

  return {
    startDate,
    endDate,
  };
}

/**
 * Calculate the age (in years) for a specific week number
 * @param {number} weekNumber - Week number (0-indexed)
 * @returns {number} Age in years
 */
export function getAgeForWeek(weekNumber) {
  return Math.floor(weekNumber / WEEKS_PER_YEAR);
}

/**
 * Check if a week is in the past, present, or future
 * @param {number} weekNumber - Week number (0-indexed)
 * @param {number} currentWeekNumber - Current week number
 * @returns {string} 'past', 'current', or 'future'
 */
export function getWeekStatus(weekNumber, currentWeekNumber) {
  if (weekNumber < currentWeekNumber) return 'past';
  if (weekNumber === currentWeekNumber) return 'current';
  return 'future';
}

/**
 * Calculate weeks remaining based on life expectancy
 * @param {number} currentWeekNumber - Current week number
 * @param {number} lifeExpectancy - Life expectancy in years
 * @returns {number} Weeks remaining
 */
export function calculateWeeksRemaining(currentWeekNumber, lifeExpectancy) {
  const totalWeeks = calculateTotalWeeks(lifeExpectancy);
  return Math.max(0, totalWeeks - currentWeekNumber);
}

/**
 * Calculate the week number range for a life stage
 * @param {Object} stage - Stage object with startAge and duration or endAge
 * @param {number} stage.startAge - Starting age in years
 * @param {number} [stage.duration] - Duration in years (for education)
 * @param {number} [stage.endAge] - Ending age in years (for career)
 * @returns {Object} Object with startWeek and endWeek
 */
export function getStageWeekRange(stage) {
  if (!stage) return null;

  const startWeek = stage.startAge * WEEKS_PER_YEAR;
  let endWeek;

  if (stage.duration !== undefined) {
    endWeek = startWeek + (stage.duration * WEEKS_PER_YEAR);
  } else if (stage.endAge !== undefined) {
    endWeek = stage.endAge * WEEKS_PER_YEAR;
  } else {
    // For retirement (no end)
    endWeek = Infinity;
  }

  return {
    startWeek,
    endWeek,
  };
}

/**
 * Check if a week is within a life stage
 * @param {number} weekNumber - Week number (0-indexed)
 * @param {Object} stage - Stage object
 * @returns {boolean} True if week is in stage
 */
export function isWeekInStage(weekNumber, stage) {
  const range = getStageWeekRange(stage);
  if (!range) return false;

  return weekNumber >= range.startWeek && weekNumber < range.endWeek;
}

/**
 * Count leap years between birthdate and a specific week
 * (For more accurate calculations if needed)
 * @param {Date|string} birthdate - The birthdate
 * @param {number} weekNumber - Week number
 * @returns {number} Number of leap years
 */
export function countLeapYears(birthdate, weekNumber) {
  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate;
  const targetYear = birth.getFullYear() + getAgeForWeek(weekNumber);
  let leapYears = 0;

  for (let year = birth.getFullYear(); year <= targetYear; year++) {
    if (isLeapYear(new Date(year, 0, 1))) {
      leapYears++;
    }
  }

  return leapYears;
}
