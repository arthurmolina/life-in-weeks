import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';
import { exportLifeGrid, EXPORT_CONFIG } from '../../utils/exportUtils';
import { trackExport } from '../../utils';
import Modal from './Modal';

export default function ExportModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { birthdate } = useAppState();

  const [format, setFormat] = useState(EXPORT_CONFIG.FORMAT.PDF);
  const [pageSize, setPageSize] = useState(EXPORT_CONFIG.PAGE_SIZE.A4);
  const [orientation, setOrientation] = useState(EXPORT_CONFIG.ORIENTATION.LANDSCAPE);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      trackExport(format);
      await exportLifeGrid({
        format,
        pageSize,
        orientation,
        birthdate,
        backgroundColor: document.documentElement.classList.contains('dark')
          ? '#1f2937' // dark mode bg
          : '#ffffff',
      });

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 500);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message || 'Failed to export. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('export.title')}
        </h3>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('export.format')}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormat(EXPORT_CONFIG.FORMAT.PDF)}
              className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                format === EXPORT_CONFIG.FORMAT.PDF
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => setFormat(EXPORT_CONFIG.FORMAT.PNG)}
              className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                format === EXPORT_CONFIG.FORMAT.PNG
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              PNG
            </button>
          </div>
        </div>

        {/* Page Size (only for PDF) */}
        {format === EXPORT_CONFIG.FORMAT.PDF && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('export.pageSize')}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPageSize(EXPORT_CONFIG.PAGE_SIZE.A4)}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                  pageSize === EXPORT_CONFIG.PAGE_SIZE.A4
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                A4
              </button>
              <button
                type="button"
                onClick={() => setPageSize(EXPORT_CONFIG.PAGE_SIZE.A3)}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                  pageSize === EXPORT_CONFIG.PAGE_SIZE.A3
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                A3
              </button>
            </div>
          </div>
        )}

        {/* Orientation (only for PDF) */}
        {format === EXPORT_CONFIG.FORMAT.PDF && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('export.orientation')}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOrientation(EXPORT_CONFIG.ORIENTATION.LANDSCAPE)}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                  orientation === EXPORT_CONFIG.ORIENTATION.LANDSCAPE
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {t('export.landscape')}
              </button>
              <button
                type="button"
                onClick={() => setOrientation(EXPORT_CONFIG.ORIENTATION.PORTRAIT)}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                  orientation === EXPORT_CONFIG.ORIENTATION.PORTRAIT
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {t('export.portrait')}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? t('export.exporting') : t('export.download')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
