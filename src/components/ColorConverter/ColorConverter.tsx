import React, { useState } from 'react';
import './ColorConverter.css';
import { hexToRgb, rgbToHsl, rgbToCmyk } from '../../utils/colorUtils';

interface ColorConverterProps {
    selectedHex: string;
    onColorChange?: (hex: string) => void;
}

export const ColorConverter: React.FC<ColorConverterProps> = ({ selectedHex, onColorChange }) => {
    const [copied, setCopied] = useState<string | null>(null);

    // Derived values
    const rgb = hexToRgb(selectedHex);
    const hsl = rgb ? rgbToHsl(rgb) : null;
    const cmyk = rgb ? rgbToCmyk(rgb) : null;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    if (!rgb || !hsl || !cmyk) return null;

    const formats = [
        { label: 'HEX', value: selectedHex },
        { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    ];

    return (
        <div className="converter-panel">

            <div className="color-preview-wrapper">
                <div className="color-preview" style={{ backgroundColor: selectedHex }}>
                    {onColorChange && (
                        <input
                            type="color"
                            value={selectedHex}
                            onChange={(e) => onColorChange(e.target.value)}
                            title="Click to edit color"
                            className="color-input-hidden"
                        />
                    )}
                </div>
                {onColorChange && (
                    <div className="edit-hint">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        <span>Edit</span>
                    </div>
                )}
            </div>

            <div className="formats-grid">
                {formats.map((fmt) => (
                    <div key={fmt.label} className="format-item">
                        <span className="format-label">{fmt.label}</span>
                        <div className="input-group">
                            <input type="text" readOnly value={fmt.value} onClick={(e) => (e.target as HTMLInputElement).select()} />
                            <button
                                className={`copy-btn ${copied === fmt.label ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(fmt.value, fmt.label)}
                            >
                                {copied === fmt.label ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
