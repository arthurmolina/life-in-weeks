import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (measurementId) {
    ReactGA.initialize(measurementId);
  }
};

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track custom events
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track week click
export const trackWeekClick = (weekNumber) => {
  trackEvent('Grid', 'Week Click', `Week ${weekNumber}`);
};

// Track marking
export const trackWeekMarking = (weekNumber, hasLabel) => {
  trackEvent('Grid', 'Week Marked', hasLabel ? 'With Label' : 'Without Label', weekNumber);
};

// Track life stages toggle
export const trackLifeStagesToggle = (enabled) => {
  trackEvent('Settings', 'Life Stages Toggle', enabled ? 'Enabled' : 'Disabled');
};

// Track export
export const trackExport = (format) => {
  trackEvent('Export', 'Download', format);
};

// Track share
export const trackShare = (platform) => {
  trackEvent('Share', 'Share Click', platform);
};

// Track language change
export const trackLanguageChange = (language) => {
  trackEvent('Settings', 'Language Change', language);
};

// Track theme change
export const trackThemeChange = (theme) => {
  trackEvent('Settings', 'Theme Change', theme);
};
