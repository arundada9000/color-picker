import React, { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import { Layout } from "./components/Layout/Layout";
import { ImageUploader } from "./components/ImageUploader/ImageUploader";
import { ImageColorPicker } from "./components/ImageColorPicker/ImageColorPicker";
import { ColorPalette } from "./components/ColorPalette/ColorPalette";
import { ColorConverter } from "./components/ColorConverter/ColorConverter";
import { ColorHistory } from "./components/ColorHistory/ColorHistory";
import { SnippetGenerator } from "./components/SnippetGenerator/SnippetGenerator";
import { ColorSuggestions } from "./components/ColorSuggestions/ColorSuggestions";
import { AboutModal } from "./components/AboutModal/AboutModal";
import { ContactModal } from "./components/ContactModal/ContactModal"; // New Import
import { extractDominantColors, loadImage } from "./utils/imageUtils";

const DEMO_IMAGE_URL =
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("colorHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "code" | "suggest">(
    "details"
  );
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false); // New State

  useEffect(() => {
    localStorage.setItem("colorHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (color: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 10);
    });
  };

  const updateSelectedColor = (color: string) => {
    setSelectedColor(color);
    addToHistory(color);
    // If user is currently in Suggest tab, switch to Details to show values
    if (activeTab === "suggest") {
      setActiveTab("details");
    }
  };

  const processImage = async (source: string | File) => {
    try {
      let url: string;
      if (typeof source === "string") {
        url = source;
      } else {
        url = URL.createObjectURL(source);
      }

      setImageSrc(url);
      setIsStandalone(false);
      const img = await loadImage(source);
      try {
        const extracted = extractDominantColors(img);
        setPalette(extracted);
        if (extracted.length > 0) updateSelectedColor(extracted[0]);
      } catch (e) {
        console.warn("Could not extract colors (CORS potentially)", e);
        setPalette([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDemoClick = () => processImage(DEMO_IMAGE_URL);

  const handleStandaloneClick = () => {
    setImageSrc(null);
    setIsStandalone(true);
    setPalette([]);
    setSelectedColor("#6366f1");
  };

  const resetApp = () => {
    setImageSrc(null);
    setIsStandalone(false);
    setSelectedColor(null);
    setPalette([]);
  };

  const activeColor = hoverColor || selectedColor;

  return (
    // Pass openAbout to Layout or just render modal here.
    // We need to modify Layout to accept onAboutClick if we want it in header,
    // BUT Layout prop interface isn't flexible roughly yet.
    // Let's modify Layout or just add a floating button?
    // Ideally update Layout. Let's do that in a follow up or just hack it here.
    // Actually, Layout wraps children, so we can pass a prop if we update Layout definition.
    // For now, let's put the About button in the footer or header if accessible.
    // Wait, I can pass a custom header prop to Layout? No.
    // I will Render Layout and pass CHILDREN.
    // I will add the About Modal here near Layout.
    <Layout>
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "2rem",
          zIndex: 100,
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setIsAboutOpen(true)}
          className="secondary-btn"
          style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
        >
          About
        </button>
        <button
          onClick={() => setIsContactOpen(true)}
          className="secondary-btn"
          style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
        >
          Contact
        </button>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {!imageSrc && !isStandalone ? (
        <div className="app-container-center">
          <h1 className="app-heading-gradient">Color Picker</h1>
          <p
            style={{
              marginBottom: "3rem",
              color: "var(--color-text-muted)",
              fontSize: "1.2rem",
            }}
          >
            Professional color extraction and conversion tool.
          </p>

          <ImageUploader onImageSelect={processImage} />

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button className="secondary-btn" onClick={handleDemoClick}>
              Try Demo Image
            </button>
            <button className="secondary-btn" onClick={handleStandaloneClick}>
              Use Without Image
            </button>
          </div>

          {history.length > 0 && (
            <div style={{ marginTop: "3rem", textAlign: "left" }}>
              <ColorHistory
                colors={history}
                onColorSelect={updateSelectedColor}
                onClear={() => setHistory([])}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="workspace-grid">
          <div className="workspace-left">
            <div className="picker-header">
              <button
                onClick={resetApp}
                style={{
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Home
              </button>
              {activeColor && (
                <div className="color-indicator-pill">
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: activeColor,
                      border: "1px solid #fff",
                    }}
                  />
                  <span style={{ fontFamily: "monospace" }}>{activeColor}</span>
                </div>
              )}
            </div>

            {imageSrc && (
              <ImageColorPicker
                imageSrc={imageSrc}
                onColorSelect={updateSelectedColor}
                onHover={setHoverColor}
              />
            )}

            <ColorPalette
              colors={palette}
              onColorSelect={updateSelectedColor}
            />

            <ColorHistory
              colors={history}
              onColorSelect={updateSelectedColor}
              onClear={() => setHistory([])}
            />
          </div>

          <div className="workspace-right">
            {selectedColor ? (
              <>
                <h3 style={{ marginBottom: "1rem" }}>Selected Color</h3>

                <div className="tool-tabs">
                  <button
                    className={`tab-btn ${
                      activeTab === "details" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "code" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("code")}
                  >
                    Code
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "suggest" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("suggest")}
                  >
                    Suggest
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === "details" && (
                    <ColorConverter
                      selectedHex={selectedColor}
                      onColorChange={updateSelectedColor}
                    />
                  )}
                  {activeTab === "code" && (
                    <SnippetGenerator selectedHex={selectedColor} />
                  )}
                  {activeTab === "suggest" && (
                    <ColorSuggestions
                      baseColor={selectedColor}
                      onSelect={updateSelectedColor}
                    />
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: "2rem",
                  background: "var(--glass-bg)",
                  borderRadius: "1rem",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                Select a color to view details
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
