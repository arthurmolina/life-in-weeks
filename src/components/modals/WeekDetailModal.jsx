import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppState } from '../../contexts';
import { getWeekDateRange, getAgeForWeek, trackWeekMarking } from '../../utils';
import Modal from './Modal';

export default function WeekDetailModal({ isOpen, onClose, weekNumber }) {
  const { t, i18n } = useTranslation();
  const { birthdate, markedWeeks, addWeekMarking, removeWeekMarking } = useAppState();

  const existingMarking = markedWeeks.get(weekNumber);

  const [formData, setFormData] = useState({
    color: existingMarking?.color || '#3b82f6',
    label: existingMarking?.label || '',
  });

  useEffect(() => {
    if (existingMarking) {
      setFormData({
        color: existingMarking.color || '#3b82f6',
        label: existingMarking.label || '',
      });
    }
  }, [existingMarking]);

  if (!birthdate) return null;

  const { startDate, endDate } = getWeekDateRange(birthdate, weekNumber);
  const age = getAgeForWeek(weekNumber);

  const handleSave = () => {
    if (formData.label || formData.color !== '#3b82f6') {
      trackWeekMarking(weekNumber, !!formData.label);
      addWeekMarking(weekNumber, formData);
    }
    onClose();
  };

  const handleDelete = () => {
    removeWeekMarking(weekNumber);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPt = i18n.language === 'pt';
  const dateFormat = isPt ? 'dd/MM/yyyy' : 'MMM d, yyyy';
  const locale = isPt ? ptBR : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('weekDetail.title', { number: weekNumber + 1 })}>
      <div className="space-y-4">
        {/* Week Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            {format(startDate, dateFormat, { locale })} - {format(endDate, dateFormat, { locale })}
          </p>
          <p>{t('weekDetail.age', { age })}</p>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('weekDetail.color')}
          </label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('weekDetail.label')}
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder={t('weekDetail.labelPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {t('common.save')}
          </button>
          {existingMarking && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
            >
              {t('common.delete')}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium rounded-md transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
