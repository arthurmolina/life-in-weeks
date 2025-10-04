import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';
import { loadLifeExpectancyData } from '../../utils';
import ShareModal from '../modals/ShareModal';
import ExportModal from '../modals/ExportModal';
import LifeStagesSection from './LifeStagesSection';

export default function LifeForm() {
  const { t, i18n } = useTranslation();
  const {
    name,
    birthdate,
    gender,
    country,
    customLifeExpectancy,
    countries,
    setUserData,
    setCountries,
    showForm,
  } = useAppState();

  const [formData, setFormData] = useState({
    name: name || '',
    birthdate: birthdate || '',
    gender: gender || 'male',
    country: country || 'US',
    customLifeExpectancy: customLifeExpectancy || '',
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load countries on mount
  useEffect(() => {
    loadLifeExpectancyData().then(setCountries);
  }, [setCountries]);

  // Sync form data when context values change (from URL params)
  useEffect(() => {
    setFormData({
      name: name || '',
      birthdate: birthdate || '',
      gender: gender || 'male',
      country: country || 'US',
      customLifeExpectancy: customLifeExpectancy || '',
    });
  }, [name, birthdate, gender, country, customLifeExpectancy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({
      name: formData.name,
      birthdate: formData.birthdate,
      gender: formData.gender,
      country: formData.country,
      customLifeExpectancy: formData.customLifeExpectancy
        ? parseInt(formData.customLifeExpectancy, 10)
        : null,
    });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  if (!showForm) return null;

  const currentLanguage = i18n.language || 'en';

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.name')}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('form.namePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Birthdate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.birthdate')}
          </label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.gender.label')}
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="male">{t('form.gender.male')}</option>
            <option value="female">{t('form.gender.female')}</option>
            <option value="other">{t('form.gender.other')}</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.country')}
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {countries.map((c) => {
              const lifeExp = formData.gender === 'female'
                ? c.lifeExpectancy.female
                : formData.gender === 'male'
                ? c.lifeExpectancy.male
                : c.lifeExpectancy.overall;
              const countryName = c.name[currentLanguage] || c.name.en;
              return (
                <option key={c.code} value={c.code}>
                  {countryName} ({lifeExp} {t('form.years')})
                </option>
              );
            })}
          </select>
        </div>

        {/* Custom Life Expectancy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.lifeExpectancy')}
          </label>
          <input
            type="number"
            name="customLifeExpectancy"
            value={formData.customLifeExpectancy}
            onChange={handleChange}
            placeholder={t('form.lifeExpectancyHelp')}
            min="1"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Life Stages Section */}
        <LifeStagesSection />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {t('form.update')}
          </button>
          {birthdate && (
            <>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
              >
                {t('form.share')}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
              >
                {t('form.export')}
              </button>
            </>
          )}
        </div>
      </form>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  );
}
