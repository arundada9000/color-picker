import { hexToRgb, rgbToHsl } from './colorUtils';

export type Framework = 'css' | 'tailwind';
export type Property = 'bg' | 'text' | 'border';
export type Format = 'hex' | 'rgb' | 'hsl';

export const generateSnippet = (selectedHex: string, framework: Framework, property: Property, format: Format): string => {
    const rgb = hexToRgb(selectedHex);
    const hsl = rgb ? rgbToHsl(rgb) : null;

    let colorValue = selectedHex;
    if (format === 'rgb' && rgb) colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (format === 'hsl' && hsl) colorValue = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    if (framework === 'tailwind') {
        const prefix = property === 'bg' ? 'bg' : property === 'text' ? 'text' : 'border';
        // Tailwind arbitrary value syntax, simpler for dynamic color picker
        // Ideally we would match rounded values but dynamic is what we need here
        // We sanitize spaces for tailwind class syntax if needed, but arbitrary values usually take raw string in brackets
        // if it doesn't contain spaces. RGB/HSL has spaces.
        // Tailwind 3+ supports spaces in arbitrary values using underscores: bg-[rgb(0_0_0)]
        let safeValue = colorValue;
        if (colorValue.includes(' ')) {
            safeValue = colorValue.replace(/ /g, '_');
        }
        return `${prefix}-[${safeValue}]`;
    } else {
        const propName = property === 'bg' ? 'background-color' : property === 'text' ? 'color' : 'border-color';
        return `${propName}: ${colorValue};`;
    }
};
