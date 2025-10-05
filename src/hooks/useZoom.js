import { useState, useCallback, useEffect } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export function useZoom(initialZoom = 1) {
  // Read initial zoom from URL params
  const getInitialZoom = () => {
    const params = new URLSearchParams(window.location.search);
    const zoomParam = params.get('zoom');
    if (zoomParam) {
      const parsed = parseFloat(zoomParam);
      if (!isNaN(parsed) && parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) {
        return parsed;
      }
    }
    return initialZoom;
  };

  const [zoom, setZoom] = useState(getInitialZoom);

  // Update URL params when zoom changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (zoom !== 1) {
      params.set('zoom', zoom.toFixed(1));
    } else {
      params.delete('zoom');
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [zoom]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM,
  };
}
