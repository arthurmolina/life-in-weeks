import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts';

export default function SEOHead() {
  const { t, i18n } = useTranslation();
  const { birthdate, currentAge } = useAppState();

  const currentLanguage = i18n.language || 'en';
  const baseURL = window.location.origin + window.location.pathname;
  const currentURL = window.location.href;

  // Generate dynamic title and description based on state
  const title = birthdate && currentAge
    ? `${t('app.title')} - ${currentAge.years} ${t('seo.yearsOld')}`
    : t('app.title');

  const description = birthdate && currentAge
    ? t('seo.descriptionWithAge', {
        years: currentAge.years,
        weeks: currentAge.weeks,
      })
    : t('seo.description');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLanguage} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={currentURL} />

      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`${baseURL}?l=en`} />
      <link rel="alternate" hrefLang="pt" href={`${baseURL}?l=pt`} />
      <link rel="alternate" hrefLang="x-default" href={baseURL} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
      <meta property="og:locale" content={currentLanguage === 'pt' ? 'pt_BR' : 'en_US'} />
      <meta property="og:site_name" content={t('app.title')} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentURL} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${window.location.origin}/og-image.png`} />

      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Arthur Molina" />
      <meta name="keywords" content={t('seo.keywords')} />

      {/* Theme Color (matches dark/light mode) */}
      <meta
        name="theme-color"
        content={document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'}
      />
    </Helmet>
  );
}
