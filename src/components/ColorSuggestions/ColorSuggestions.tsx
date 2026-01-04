import React from 'react';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../../utils/colorUtils';
import './ColorSuggestions.css';

interface ColorSuggestionsProps {
    baseColor: string;
    onSelect: (color: string) => void;
}

// Helper to generate a tint/shade
const adjustLightness = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb);

    // Clamp lightness
    let newL = hsl.l + percent;
    if (newL > 100) newL = 100;
    if (newL < 0) newL = 0;

    const newRgb = hslToRgb({ ...hsl, l: newL });
    return rgbToHex(newRgb);
};

// Helper to shift hue
const shiftHue = (hex: string, degree: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb);
    const newHsl = { ...hsl, h: (hsl.h + degree) % 360 };
    if (newHsl.h < 0) newHsl.h += 360;
    const newRgb = hslToRgb(newHsl);
    return rgbToHex(newRgb);
};

export const ColorSuggestions: React.FC<ColorSuggestionsProps> = ({ baseColor, onSelect }) => {
    const tints = [10, 20, 30].map(p => adjustLightness(baseColor, p));
    const shades = [-10, -20, -30].map(p => adjustLightness(baseColor, p));

    // Harmonies
    const analogous = [shiftHue(baseColor, -30), shiftHue(baseColor, 30)];
    const triadic = [shiftHue(baseColor, 120), shiftHue(baseColor, 240)];
    const splitComp = [shiftHue(baseColor, 150), shiftHue(baseColor, 210)];
    const comp = shiftHue(baseColor, 180);

    return (
        <div className="suggestions-container">
            <section className="suggestion-section">
                <h4>Lighter (Hover)</h4>
                <div className="suggestion-row">
                    {tints.map((c, i) => (
                        <button key={i} className="suggestion-swatch" style={{ background: c }} onClick={() => onSelect(c)} title={`Tint ${i + 1}`} />
                    ))}
                </div>
            </section>

            <section className="suggestion-section">
                <h4>Darker (Active)</h4>
                <div className="suggestion-row">
                    {shades.map((c, i) => (
                        <button key={i} className="suggestion-swatch" style={{ background: c }} onClick={() => onSelect(c)} title={`Shade ${i + 1}`} />
                    ))}
                </div>
            </section>

            <div className="divider" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            <section className="suggestion-section">
                <h4>Harmonies</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '4px' }}>Analogous</span>
                        <div className="suggestion-row">
                            {analogous.map((c, i) => <button key={i} className="suggestion-swatch" style={{ background: c }} onClick={() => onSelect(c)} title="Analogous" />)}
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '4px' }}>Triadic</span>
                        <div className="suggestion-row">
                            {triadic.map((c, i) => <button key={i} className="suggestion-swatch" style={{ background: c }} onClick={() => onSelect(c)} title="Triadic" />)}
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '4px' }}>Split Compl.</span>
                        <div className="suggestion-row">
                            {splitComp.map((c, i) => <button key={i} className="suggestion-swatch" style={{ background: c }} onClick={() => onSelect(c)} title="Split Complementary" />)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="suggestion-section">
                <h4>Accent (Comp)</h4>
                <div className="suggestion-row">
                    <button className="suggestion-swatch accent-swatch" style={{ background: comp }} onClick={() => onSelect(comp)} title="Complementary" />
                </div>
            </section>
        </div>
    );
};
