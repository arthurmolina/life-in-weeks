import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Page size dimensions in mm
 */
const PAGE_SIZES = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
};

/**
 * Export configuration options
 */
export const EXPORT_CONFIG = {
  FORMAT: {
    PDF: 'pdf',
    PNG: 'png',
  },
  PAGE_SIZE: {
    A3: 'A3',
    A4: 'A4',
  },
  ORIENTATION: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
  },
};

/**
 * Generates a filename based on options
 */
function generateFilename(format, birthdate) {
  const date = birthdate ? birthdate.replace(/-/g, '') : 'life';
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `life-in-weeks-${date}-${timestamp}.${format}`;
}

/**
 * Captures the grid element as a canvas
 */
async function captureGridAsCanvas(elementId = 'life-grid-export', options = {}) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    backgroundColor: options.backgroundColor || '#ffffff',
    scale: options.scale || 2, // Higher quality
    logging: false,
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY,
    scrollX: -window.scrollX,
    ...options.html2canvasOptions,
  });

  return canvas;
}

/**
 * Exports the life grid as PNG
 */
export async function exportAsPNG(options = {}) {
  try {
    const canvas = await captureGridAsCanvas('life-grid-export', options);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateFilename('png', options.birthdate);

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);

        resolve();
      }, 'image/png');
    });
  } catch (error) {
    console.error('PNG export error:', error);
    throw error;
  }
}

/**
 * Exports the life grid as PDF
 */
export async function exportAsPDF(options = {}) {
  try {
    const {
      pageSize = EXPORT_CONFIG.PAGE_SIZE.A4,
      orientation = EXPORT_CONFIG.ORIENTATION.LANDSCAPE,
      birthdate,
    } = options;

    const canvas = await captureGridAsCanvas('life-grid-export', options);

    // Get page dimensions
    const pageDimensions = PAGE_SIZES[pageSize];
    const isPortrait = orientation === EXPORT_CONFIG.ORIENTATION.PORTRAIT;

    const pageWidth = isPortrait ? pageDimensions.width : pageDimensions.height;
    const pageHeight = isPortrait ? pageDimensions.height : pageDimensions.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation === EXPORT_CONFIG.ORIENTATION.PORTRAIT ? 'p' : 'l',
      unit: 'mm',
      format: pageSize.toLowerCase(),
    });

    // Calculate image dimensions to fit page with margins
    const margin = 10; // 10mm margin
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calculate scaling to fit page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(maxWidth / (imgWidth * 0.264583), maxHeight / (imgHeight * 0.264583));

    const finalWidth = imgWidth * 0.264583 * ratio; // Convert px to mm
    const finalHeight = imgHeight * 0.264583 * ratio;

    // Center image on page
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Save PDF
    pdf.save(generateFilename('pdf', birthdate));
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

/**
 * Main export function that routes to appropriate handler
 */
export async function exportLifeGrid(options = {}) {
  const { format = EXPORT_CONFIG.FORMAT.PDF } = options;

  if (format === EXPORT_CONFIG.FORMAT.PNG) {
    return exportAsPNG(options);
  } else if (format === EXPORT_CONFIG.FORMAT.PDF) {
    return exportAsPDF(options);
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }
}
