import { URL_PARAMS } from './constants';

/**
 * Encode user data to compact URL format
 * Format: YYYY-MM-DD<gender><country><lifeExp>
 * Example: 1990-01-15mBR0 (born Jan 15, 1990, male, Brazil, default life expectancy)
 * @param {Object} state - App state
 * @returns {string} Encoded data string
 */
export function encodeDataParam(state) {
  if (!state.birthdate) return '';

  const date = typeof state.birthdate === 'string'
    ? state.birthdate
    : state.birthdate.toISOString().split('T')[0];

  const genderCode = state.gender?.[0] || 'm'; // m, f, o
  const country = state.country || 'US';
  const lifeExp = state.customLifeExpectancy || 0;

  return `${date}${genderCode}${country}${lifeExp}`;
}

/**
 * Decode data param from URL to state
 * @param {string} param - Encoded data parameter
 * @returns {Object} Decoded state
 */
export function decodeDataParam(param) {
  if (!param || param.length < 12) return {};

  try {
    // Extract date (YYYY-MM-DD = 10 chars)
    const birthdate = param.substring(0, 10);

    // Extract gender (1 char)
    const genderCode = param[10];
    const genderMap = { m: 'male', f: 'female', o: 'other' };
    const gender = genderMap[genderCode] || 'male';

    // Extract country code (2 chars)
    const country = param.substring(11, 13);

    // Extract custom life expectancy (remaining chars)
    const lifeExpStr = param.substring(13);
    const customLifeExpectancy = lifeExpStr && lifeExpStr !== '0'
      ? parseInt(lifeExpStr, 10)
      : null;

    return {
      birthdate,
      gender,
      country,
      customLifeExpectancy,
    };
  } catch (error) {
    console.error('Error decoding data param:', error);
    return {};
  }
}

/**
 * Encode life stages to compact URL format
 * Format: s<start>-<duration>c<start>-<duration>ca<start>-<end>r<start>
 * Example: s6-12c18-4ca22-65r65 (school 6-18, college 18-22, career 22-65, retirement 65+)
 * @param {Object} lifeStages - Life stages object
 * @returns {string} Encoded stages string
 */
export function encodeStagesParam(lifeStages) {
  if (!lifeStages) return '';

  const parts = [];

  if (lifeStages.school) {
    parts.push(`s${lifeStages.school.startAge}-${lifeStages.school.duration}`);
  }

  if (lifeStages.college) {
    parts.push(`c${lifeStages.college.startAge}-${lifeStages.college.duration}`);
  }

  if (lifeStages.career) {
    parts.push(`ca${lifeStages.career.startAge}-${lifeStages.career.endAge}`);
  }

  if (lifeStages.retirement) {
    parts.push(`r${lifeStages.retirement.startAge}`);
  }

  return parts.join('');
}

/**
 * Decode stages param from URL
 * @param {string} param - Encoded stages parameter
 * @returns {Object} Decoded life stages
 */
export function decodeStagesParam(param) {
  if (!param) return null;

  const stages = {};

  try {
    // School: s6-12
    const schoolMatch = param.match(/s(\d+)-(\d+)/);
    if (schoolMatch) {
      stages.school = {
        startAge: parseInt(schoolMatch[1], 10),
        duration: parseInt(schoolMatch[2], 10),
      };
    }

    // College: c18-4 (but not ca which is career)
    const collegeMatch = param.match(/c(\d+)-(\d+)(?!a)/);
    if (collegeMatch) {
      stages.college = {
        startAge: parseInt(collegeMatch[1], 10),
        duration: parseInt(collegeMatch[2], 10),
      };
    }

    // Career: ca22-65
    const careerMatch = param.match(/ca(\d+)-(\d+)/);
    if (careerMatch) {
      stages.career = {
        startAge: parseInt(careerMatch[1], 10),
        endAge: parseInt(careerMatch[2], 10),
      };
    }

    // Retirement: r65
    const retireMatch = param.match(/r(\d+)/);
    if (retireMatch) {
      stages.retirement = {
        startAge: parseInt(retireMatch[1], 10),
      };
    }

    return Object.keys(stages).length > 0 ? stages : null;
  } catch (error) {
    console.error('Error decoding stages param:', error);
    return null;
  }
}

/**
 * Encode marked weeks to URL format
 * Format: <week>:<color>:<label>|<week>:<color>:<label>
 * Example: 520:ff0000:graduation|1040:0000ff:wedding
 * @param {Map} markedWeeks - Map of week markings
 * @returns {string} Encoded markings string
 */
export function encodeMarkingsParam(markedWeeks) {
  if (!markedWeeks || markedWeeks.size === 0) return '';

  const parts = [];

  markedWeeks.forEach((marking, weekNumber) => {
    const color = marking.color.replace('#', '');
    const label = encodeURIComponent(marking.label || '');
    parts.push(`${weekNumber}:${color}:${label}`);
  });

  return parts.join('|');
}

/**
 * Decode markings param from URL
 * @param {string} param - Encoded markings parameter
 * @returns {Map} Decoded markings map
 */
export function decodeMarkingsParam(param) {
  if (!param) return new Map();

  const markings = new Map();

  try {
    const parts = param.split('|');

    parts.forEach((part) => {
      const [weekStr, color, labelEncoded] = part.split(':');
      const weekNumber = parseInt(weekStr, 10);

      if (!isNaN(weekNumber)) {
        markings.set(weekNumber, {
          color: `#${color}`,
          label: decodeURIComponent(labelEncoded || ''),
          note: '', // Notes stored in localStorage, not URL
        });
      }
    });

    return markings;
  } catch (error) {
    console.error('Error decoding markings param:', error);
    return new Map();
  }
}

/**
 * Encode complete app state to URL
 * @param {Object} state - App state
 * @returns {string} URL with encoded parameters
 */
export function encodeStateToURL(state) {
  const params = new URLSearchParams();

  // Data param (required)
  const dataParam = encodeDataParam(state);
  if (dataParam) {
    params.set(URL_PARAMS.DATA, dataParam);
  }

  // Life stages param (optional)
  if (state.showLifeStages && state.lifeStages) {
    const stagesParam = encodeStagesParam(state.lifeStages);
    if (stagesParam) {
      params.set(URL_PARAMS.STAGES, stagesParam);
    }
  }

  // Marked weeks param (optional)
  if (state.markedWeeks && state.markedWeeks.size > 0) {
    const markingsParam = encodeMarkingsParam(state.markedWeeks);
    if (markingsParam) {
      params.set(URL_PARAMS.MARKINGS, markingsParam);
    }
  }

  // Name param
  if (state.name) {
    params.set(URL_PARAMS.NAME, encodeURIComponent(state.name));
  }

  // Hide form param
  if (!state.showForm) {
    params.set(URL_PARAMS.HIDE_FORM, '1');
  }

  // Hide legend param
  if (!state.showLegend) {
    params.set(URL_PARAMS.HIDE_LEGEND, '1');
  }

  // Theme param
  if (state.theme) {
    params.set(URL_PARAMS.THEME, state.theme === 'dark' ? 'd' : 'l');
  }

  // Language param
  if (state.language) {
    params.set(URL_PARAMS.LANGUAGE, state.language);
  }

  return `?${params.toString()}`;
}

/**
 * Decode URL parameters to app state
 * @param {string} url - URL or search string
 * @returns {Object} Decoded state
 */
export function decodeURLToState(url) {
  try {
    const params = new URLSearchParams(url);

    const state = {};

    // Decode data param
    if (params.has(URL_PARAMS.DATA)) {
      Object.assign(state, decodeDataParam(params.get(URL_PARAMS.DATA)));
    }

    // Decode life stages
    if (params.has(URL_PARAMS.STAGES)) {
      state.lifeStages = decodeStagesParam(params.get(URL_PARAMS.STAGES));
      state.showLifeStages = !!state.lifeStages;
    }

    // Decode markings
    if (params.has(URL_PARAMS.MARKINGS)) {
      state.markedWeeks = decodeMarkingsParam(params.get(URL_PARAMS.MARKINGS));
    }

    // Decode name
    if (params.has(URL_PARAMS.NAME)) {
      state.name = decodeURIComponent(params.get(URL_PARAMS.NAME));
    }

    // Decode hide form
    state.showForm = params.get(URL_PARAMS.HIDE_FORM) !== '1';

    // Decode hide legend
    state.showLegend = params.get(URL_PARAMS.HIDE_LEGEND) !== '1';

    // Decode theme
    const themeParam = params.get(URL_PARAMS.THEME);
    state.theme = themeParam === 'd' ? 'dark' : 'light';

    // Decode language
    state.language = params.get(URL_PARAMS.LANGUAGE) || 'en';

    return state;
  } catch (error) {
    console.error('Error decoding URL to state:', error);
    return {};
  }
}

/**
 * Get current URL with updated state
 * @param {Object} state - App state
 * @returns {string} Complete URL
 */
export function getShareableURL(state) {
  const baseURL = window.location.origin + window.location.pathname;
  const queryString = encodeStateToURL(state);
  return baseURL + queryString;
}
