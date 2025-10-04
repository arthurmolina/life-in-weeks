import { useTranslation } from 'react-i18next';
import Modal from './Modal';

export default function AboutModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('about.title')}>
      <div className="space-y-4">
        {/* Description */}
        <div className="text-gray-700 dark:text-gray-300">
          <p className="mb-4">{t('about.description')}</p>
        </div>

        {/* Credits */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t('footer.credits')}
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium rounded-md transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
