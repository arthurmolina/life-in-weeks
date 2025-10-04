import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { useAppState } from '../../contexts';
import { getShareableURL, getShareURL, copyToClipboard, SOCIAL_PLATFORMS, trackShare } from '../../utils';
import Modal from './Modal';

export default function ShareModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const appState = useAppState();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareURL = getShareableURL(appState);
  const shareText = appState.currentAge
    ? t('share.withAge', {
        years: appState.currentAge.years,
        weeksLeft: appState.totalWeeks - appState.currentWeekNumber,
      })
    : t('share.defaultText');

  const handleCopy = async () => {
    const success = await copyToClipboard(shareURL);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform) => {
    trackShare(platform);
    const url = getShareURL(platform, shareText, shareURL);
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('share.title')}>
      <div className="space-y-4">
        {/* URL Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('share.shareLink')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareURL}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              {copied ? t('share.copied') : t('share.copy')}
            </button>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('share.shareViaSocial')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSocialShare(SOCIAL_PLATFORMS.TWITTER)}
              className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <span>𝕏</span> X (Twitter)
            </button>
            <button
              onClick={() => handleSocialShare(SOCIAL_PLATFORMS.FACEBOOK)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <span>f</span> Facebook
            </button>
            <button
              onClick={() => handleSocialShare(SOCIAL_PLATFORMS.WHATSAPP)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span> WhatsApp
            </button>
            <button
              onClick={() => handleSocialShare(SOCIAL_PLATFORMS.TELEGRAM)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <span>✈️</span> Telegram
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div>
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {showQR ? t('share.hideQR') : t('share.showQR')}
          </button>

          {showQR && (
            <div className="mt-3 flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG value={shareURL} size={200} />
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-4">
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
