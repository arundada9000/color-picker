import React from 'react';
import './ColorPalette.css';
import { getContrastColor, hexToRgb } from '../../utils/colorUtils';

interface ColorPaletteProps {
    colors: string[];
    onColorSelect: (hex: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, onColorSelect }) => {
    if (colors.length === 0) return null;

    const handleExport = () => {
        const cssContent = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'palette.css';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="palette-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Extracted Palette</h3>
                <button onClick={handleExport} className="export-btn" title="Download CSS">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </button>
            </div>
            <div className="swatch-grid">
                {colors.map((color, index) => {
                    const rgb = hexToRgb(color);
                    const textColor = rgb ? getContrastColor(rgb) : '#000';

                    return (
                        <button
                            key={index}
                            className="swatch-btn"
                            style={{ backgroundColor: color, color: textColor }}
                            onClick={() => onColorSelect(color)}
                            title={color}
                        >
                            <span className="swatch-label">{color}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
