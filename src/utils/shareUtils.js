import { SOCIAL_PLATFORMS } from './constants';

/**
 * Generate social media share URLs
 */

export function getTwitterShareURL(text, url) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function getWhatsAppShareURL(text, url) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

export function getTelegramShareURL(text, url) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function getFacebookShareURL(url) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getShareURL(platform, text, url) {
  switch (platform) {
    case SOCIAL_PLATFORMS.TWITTER:
      return getTwitterShareURL(text, url);
    case SOCIAL_PLATFORMS.WHATSAPP:
      return getWhatsAppShareURL(text, url);
    case SOCIAL_PLATFORMS.TELEGRAM:
      return getTelegramShareURL(text, url);
    case SOCIAL_PLATFORMS.FACEBOOK:
      return getFacebookShareURL(url);
    default:
      return url;
  }
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
