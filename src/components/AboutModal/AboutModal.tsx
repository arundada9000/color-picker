import React, { useState } from "react";
import "./AboutModal.css";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "about" | "features" | "usage";

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<Tab>("about");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About Color Picker Pro</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`modal-tab ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            Features
          </button>
          <button
            className={`modal-tab ${activeTab === "usage" ? "active" : ""}`}
            onClick={() => setActiveTab("usage")}
          >
            How to Use
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "about" && (
            <div className="tab-pane">
              <p>
                Color Picker is a privacy-first, professional-grade tool
                designed for frontend developers and designers. Unlike other
                tools, all image processing happens directly in your
                browser,your images are never uploaded to any server.
              </p>
              <p>
                We aim to close the gap between design and code by offering
                instant CSS/Tailwind snippet generation alongside powerful
                extraction tools.
              </p>
            </div>
          )}

          {activeTab === "features" && (
            <div className="tab-pane">
              <ul className="feature-list">
                <li>
                  <strong>Smart Context Menu</strong>
                  <span>
                    Right-click anywhere to Copy, Save, or Pick from Screen.
                  </span>
                </li>
                <li>
                  <strong>Precision Magnifier</strong>
                  <span>Pixel-perfect zoom window for detailed selection.</span>
                </li>
                <li>
                  <strong>Developer Mode</strong>
                  <span>Generate CSS/Tailwind snippets instantly.</span>
                </li>
                <li>
                  <strong>Keyboard Power</strong>
                  <span>
                    Full keyboard support for pros (Ctrl+C, Ctrl+V, /).
                  </span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="tab-pane">
              <div className="shortcuts-grid">
                <div className="shortcut-item">
                  <kbd>Ctrl</kbd> + <kbd>C</kbd>
                  <span>Smart Copy (Hex or Code)</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Ctrl</kbd> + <kbd>V</kbd>
                  <span>Paste Color Hex</span>
                </div>
                <div className="shortcut-item">
                  <kbd>/</kbd>
                  <span>Focus Input</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Esc</kbd>
                  <span>Close Modals</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Right Click</kbd>
                  <span>Power Menu</span>
                </div>
              </div>
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
