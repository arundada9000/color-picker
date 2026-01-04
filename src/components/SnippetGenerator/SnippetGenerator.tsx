import React, { useState, useEffect } from 'react';
import './SnippetGenerator.css';
import { generateSnippet } from '../../utils/snippetUtils';
import type { Framework, Property, Format } from '../../utils/snippetUtils';

interface SnippetGeneratorProps {
    selectedHex: string;
    framework: Framework;
    setFramework: (val: Framework) => void;
    property: Property;
    setProperty: (val: Property) => void;
    format: Format;
    setFormat: (val: Format) => void;
}

export const SnippetGenerator: React.FC<SnippetGeneratorProps> = ({
    selectedHex, framework, setFramework, property, setProperty, format, setFormat
}) => {
    const [copied, setCopied] = useState(false);
    const code = generateSnippet(selectedHex, framework, property, format);

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
