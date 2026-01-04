import { rgbToHex } from './colorUtils';

/**
 * Loads an image from a URL or File object.
 */
export const loadImage = (source: string | File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        if (source instanceof File) {
            img.src = URL.createObjectURL(source);
        } else {
            img.src = source;
        }

        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

/**
 * Extracts dominant colors from an image using canvas analysis.
 * Simplistic quantization approach.
 */
export const extractDominantColors = (img: HTMLImageElement, count: number = 5): string[] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    // Resize for performance
    const width = 100;
    const height = 100 * (img.height / img.width);
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const colorMap: Record<string, number> = {};

    // sample every 4th pixel to save time
    for (let i = 0; i < imageData.length; i += 4 * 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Quantize colors (round to nearest 10) to group similar shades
        const round = (n: number) => Math.round(n / 20) * 20;
        const key = `${round(r)},${round(g)},${round(b)}`;

        colorMap[key] = (colorMap[key] || 0) + 1;
    }

    // Sort by frequency
    const sortedColors = Object.entries(colorMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count)
        .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            return rgbToHex({ r, g, b });
        });

    return sortedColors;
};
