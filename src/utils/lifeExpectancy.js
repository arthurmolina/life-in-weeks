import { DEFAULT_LIFE_EXPECTANCY } from './constants';

/**
 * Get default life expectancy based on gender
 * @param {string} gender - Gender ('male', 'female', 'other')
 * @returns {number} Life expectancy in years
 */
export function getDefaultLifeExpectancy(gender) {
  return DEFAULT_LIFE_EXPECTANCY[gender] || DEFAULT_LIFE_EXPECTANCY.other;
}

/**
 * Get life expectancy from country data
 * @param {Array} countries - Array of country data
 * @param {string} countryCode - ISO country code
 * @param {string} gender - Gender
 * @returns {number} Life expectancy in years
 */
export function getLifeExpectancyByCountry(countries, countryCode, gender) {
  if (!countries || !countryCode) {
    return getDefaultLifeExpectancy(gender);
  }

  const country = countries.find((c) => c.code === countryCode);

  if (!country || !country.lifeExpectancy) {
    return getDefaultLifeExpectancy(gender);
  }

  const expectancy = country.lifeExpectancy[gender] || country.lifeExpectancy.overall;
  return expectancy || getDefaultLifeExpectancy(gender);
}

/**
 * Calculate effective life expectancy considering custom override
 * @param {Object} params - Parameters
 * @param {Array} params.countries - Country data
 * @param {string} params.countryCode - Country code
 * @param {string} params.gender - Gender
 * @param {number} [params.customLifeExpectancy] - Custom life expectancy override
 * @returns {number} Effective life expectancy
 */
export function calculateLifeExpectancy({
  countries,
  countryCode,
  gender,
  customLifeExpectancy,
}) {
  if (customLifeExpectancy && customLifeExpectancy > 0) {
    return customLifeExpectancy;
  }

  return getLifeExpectancyByCountry(countries, countryCode, gender);
}

/**
 * Load life expectancy data from JSON file
 * @returns {Promise<Array>} Country data
 */
export async function loadLifeExpectancyData() {
  try {
    const response = await fetch('/life-in-weeks/data/life-expectancy.json');
    if (!response.ok) {
      throw new Error('Failed to load life expectancy data');
    }
    const data = await response.json();
    return data.countries || [];
  } catch (error) {
    console.error('Error loading life expectancy data:', error);
    return [];
  }
}
