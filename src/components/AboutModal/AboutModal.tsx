import React, { useState } from 'react';
import './AboutModal.css';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'about' | 'features' | 'usage';

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState<Tab>('about');

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>About Color Picker Pro</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-tabs">
                    <button className={`modal-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
                    <button className={`modal-tab ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>Features</button>
                    <button className={`modal-tab ${activeTab === 'usage' ? 'active' : ''}`} onClick={() => setActiveTab('usage')}>How to Use</button>
                </div>

                <div className="modal-body">
                    {activeTab === 'about' && (
                        <div className="tab-pane">
                            <p>
                                Color Picker is a privacy-first, professional-grade tool designed for frontend developers and designers.
                                Unlike other tools, all image processing happens directly in your browser—your images are never uploaded to any server.
                            </p>
                            <p>
                                We aim to close the gap between design and code by offering instant CSS/Tailwind snippet generation alongside powerful extraction tools.
                            </p>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="tab-pane">
                            <ul className="feature-list">
                                <li>
                                    <strong>Smart Palette Extraction</strong>
                                    <span>Automatically identifies the 5 dominant colors from any uploaded image.</span>
                                </li>
                                <li>
                                    <strong>Precision Magnifier</strong>
                                    <span>A pixel-perfect zoom window to pick colors from detailed/complex images.</span>
                                </li>
                                <li>
                                    <strong>Developer Mode</strong>
                                    <span>Generate vanilla CSS or Tailwind utility classes instantly.</span>
                                </li>
                                <li>
                                    <strong>Color Suggestions</strong>
                                    <span>Algorithmic generation of tints, shades, and accents for your design system.</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'usage' && (
                        <div className="tab-pane">
                            <ol className="usage-list">
                                <li><strong>Upload or Demo</strong>: Drag and drop an image or use the "Try Demo" button.</li>
                                <li><strong>Pick</strong>: Hover over the image to inspect. Click to select a specific pixel.</li>
                                <li><strong>Explore</strong>: Use the generated palette on the left or suggestions on the right.</li>
                                <li><strong>Export</strong>: Go to the "Code" tab to copy ready-to-use snippets for your project.</li>
                            </ol>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <span className="version-tag">v1.0.0</span>
                </div>
            </div>
        </div>
    );
};
