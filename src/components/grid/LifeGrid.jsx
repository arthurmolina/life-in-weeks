import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState, useTheme } from '../../contexts';
import { useZoom, useFullscreen, useKeyboardShortcuts } from '../../hooks';
import { WEEKS_PER_YEAR, trackWeekClick, trackLanguageChange, trackThemeChange } from '../../utils';
import { StatisticsPanel } from '../stats';
import Week from './Week';
import GridLegend from './GridLegend';
import { WeekDetailModal, AboutModal } from '../modals';

export default function LifeGrid() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const {
    name,
    totalWeeks,
    currentWeekNumber,
    markedWeeks,
    birthdate,
    lifeStages,
    showLifeStages,
    showLegend,
    showForm,
    showStatistics,
    toggleLegend,
    toggleForm,
    toggleStatistics,
  } = useAppState();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const gridContainerRef = useRef(null);
  const { zoom, zoomIn, zoomOut, resetZoom, canZoomIn, canZoomOut } = useZoom();
  const { isFullscreen, toggleFullscreen } = useFullscreen(gridContainerRef);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i);

  const handleWeekClick = (weekNumber) => {
    trackWeekClick(weekNumber);
    setSelectedWeek(weekNumber);
  };

  const handleCloseModal = () => {
    setSelectedWeek(null);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    trackLanguageChange(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    trackThemeChange(newTheme);
    toggleTheme();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'l', action: toggleLegend },
    { key: 's', action: toggleStatistics },
    { key: 'p', action: toggleForm },
    { key: 'f', action: toggleFullscreen },
    { key: '+', action: zoomIn },
    { key: '=', action: zoomIn }, // Alternative for +
    { key: '-', action: zoomOut },
    { key: '0', action: resetZoom },
    { key: '?', action: () => setShowKeyboardHelp(true) },
    { key: 'escape', action: () => setShowKeyboardHelp(false) },
  ]);

  return (
    <>
      {/* Header with Title and Toggle Controls */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name ? t('app.titleWithName', { name }) : t('app.title')}
        </h1>
        <div className="flex items-center gap-2">
          {/* Legend Toggle */}
          <button
            onClick={toggleLegend}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={showLegend ? t('grid.toggles.hideLegend') : t('grid.toggles.showLegend')}
          >
            🗺️
          </button>

          {/* Statistics Toggle */}
          <button
            onClick={toggleStatistics}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={showStatistics ? t('grid.toggles.hideStatistics') : t('grid.toggles.showStatistics')}
          >
            📊
          </button>

          {/* Panel Toggle */}
          <button
            onClick={toggleForm}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={showForm ? t('grid.toggles.hidePanel') : t('grid.toggles.showPanel')}
          >
            📋
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={t('header.changeLanguage')}
          >
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={t('header.toggleTheme')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* About Button */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={t('header.about')}
          >
            ?
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="w-10 h-10 flex items-center justify-center text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={t('keyboard.help')}
          >
            ⌘
          </button>
        </div>
      </div>

      {!birthdate ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('grid.enterBirthdate')}
          </p>
        </div>
      ) : (
        <>
          {/* Statistics Panel */}
          {showStatistics && <StatisticsPanel />}

          {/* Wrapper for export with ID for html2canvas */}
          <div ref={gridContainerRef} id="life-grid-export" className="space-y-4 relative mt-4">
            {showLegend && <GridLegend />}

            {/* Zoom and Fullscreen Controls */}
            <div className="flex justify-end gap-2 mb-2">
              <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={zoomOut}
                  disabled={!canZoomOut}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('keyboard.zoomOut')}
                >
                  −
                </button>
                <button
                  onClick={resetZoom}
                  className="px-2 h-8 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title={t('keyboard.resetZoom')}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  disabled={!canZoomIn}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t('keyboard.zoomIn')}
                >
                  +
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
                title={t('keyboard.fullscreen')}
              >
                {isFullscreen ? '⊗' : '⊕'}
              </button>
            </div>

            <div className="w-full overflow-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-gridFadeIn">
              <div className="flex flex-wrap gap-1">
                {weeks.map((weekNumber) => (
                  <Week
                    key={weekNumber}
                    weekNumber={weekNumber}
                    currentWeekNumber={currentWeekNumber}
                    marking={markedWeeks.get(weekNumber)}
                    lifeStages={lifeStages}
                    showLifeStages={showLifeStages}
                    onClick={handleWeekClick}
                    birthdate={birthdate}
                    isLastWeek={weekNumber === totalWeeks - 1}
                    zoom={zoom}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <WeekDetailModal
        isOpen={selectedWeek !== null}
        onClose={handleCloseModal}
        weekNumber={selectedWeek}
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowKeyboardHelp(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('keyboard.title')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">L</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.legend')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">S</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.statistics')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">P</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.panel')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">F</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.fullscreen')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">+ / =</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.zoomIn')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">−</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.zoomOut')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">0</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.resetZoom')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">?</span>
                <span className="text-gray-900 dark:text-white">{t('keyboard.help')}</span>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
