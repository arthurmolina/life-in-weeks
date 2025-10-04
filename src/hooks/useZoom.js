import { useState, useCallback } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export function useZoom(initialZoom = 1) {
  const [zoom, setZoom] = useState(initialZoom);

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
