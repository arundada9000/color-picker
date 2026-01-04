import React, { useState } from 'react';
import './SnippetGenerator.css';
import { hexToRgb, rgbToHsl } from '../../utils/colorUtils';

interface SnippetGeneratorProps {
    selectedHex: string;
}

type Framework = 'css' | 'tailwind';
type Property = 'bg' | 'text' | 'border';
type Format = 'hex' | 'rgb' | 'hsl';

export const SnippetGenerator: React.FC<SnippetGeneratorProps> = ({ selectedHex }) => {
    const [framework, setFramework] = useState<Framework>('css');
    const [property, setProperty] = useState<Property>('bg');
    const [format, setFormat] = useState<Format>('hex');
    const [copied, setCopied] = useState(false);

    const getCode = () => {
        const rgb = hexToRgb(selectedHex);
        const hsl = rgb ? rgbToHsl(rgb) : null;

        let colorValue = selectedHex;
        if (format === 'rgb' && rgb) colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (format === 'hsl' && hsl) colorValue = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        if (framework === 'tailwind') {
            const prefix = property === 'bg' ? 'bg' : property === 'text' ? 'text' : 'border';
            // Tailwind arbitrary value syntax
            return `${prefix}-[${colorValue}]`;
        } else {
            const propName = property === 'bg' ? 'background-color' : property === 'text' ? 'color' : 'border-color';
            return `${propName}: ${colorValue};`;
        }
    };

    const code = getCode();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="snippet-panel">
            <h3>Code Generator</h3>

            <div className="controls-grid">
                <label>
                    <span>Framework</span>
                    <select value={framework} onChange={(e) => setFramework(e.target.value as Framework)}>
                        <option value="css">Vanilla CSS</option>
                        <option value="tailwind">Tailwind CSS</option>
                    </select>
                </label>

                <label>
                    <span>Property</span>
                    <select value={property} onChange={(e) => setProperty(e.target.value as Property)}>
                        <option value="bg">Background</option>
                        <option value="text">Text / Font</option>
                        <option value="border">Border</option>
                    </select>
                </label>

                <label>
                    <span>Format</span>
                    <select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                        <option value="hsl">HSL</option>
                    </select>
                </label>
            </div>

            <div className="code-display">
                <code>{code}</code>
                <button onClick={handleCopy} className={`copy-btn-large ${copied ? 'copied' : ''}`}>
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
        </div>
    );
};
