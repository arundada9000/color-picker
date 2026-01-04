import { useState, useEffect } from "react";
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
import { ContactModal } from "./components/ContactModal/ContactModal";
import { ToastProvider, useToast } from "./components/Toast/Toast";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import { extractDominantColors, loadImage } from "./utils/imageUtils";
import { hexToRgb } from "./utils/colorUtils";

const DEMO_IMAGE_URL =
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

import { generateSnippet } from "./utils/snippetUtils"; // New Import
import type { Framework, Property, Format } from "./utils/snippetUtils";

const AppContent = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#6366f1");
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
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Snippet Settings State (Lifted Up)
  const [framework, setFramework] = useState<Framework>("css");
  const [property, setProperty] = useState<Property>("bg");
  const [format, setFormat] = useState<Format>("hex");

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem("colorHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (color: string) => {
    setHistory((prev) => {
      const newHistory = [color, ...prev.filter((c) => c !== color)].slice(
        0,
        10
      );
      return newHistory;
    });
  };

  const updateSelectedColor = (color: string) => {
    setSelectedColor(color);
    addToHistory(color);
    if (activeTab === "suggest") {
      setActiveTab("details");
    }
  };

  const processImage = async (source: string | File) => {
    try {
      const url =
        typeof source === "string" ? source : URL.createObjectURL(source);
      setImageSrc(url);
      setIsStandalone(false);
      const img = await loadImage(source);
      const colors = extractDominantColors(img);
      setPalette(colors);
      if (colors.length > 0) updateSelectedColor(colors[0]);
    } catch (error) {
      console.error("Failed to process image", error);
      showToast("Failed to load image", "error");
    }
  };

  const resetApp = () => {
    setImageSrc(null);
    setIsStandalone(false);
    setPalette([]);
    setHistory([]);
    setSelectedColor("#6366f1");
    showToast("App Reset", "info");
  };

  const goHome = () => {
    setImageSrc(null);
    setIsStandalone(false);
    // Do not clear history or palette
  };

  const handlePickScreen = async () => {
    if (!("EyeDropper" in window)) {
      showToast("EyeDropper not supported in this browser", "error");
      return;
    }
    // @ts-ignore
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      updateSelectedColor(result.sRGBHex);
      showToast(`Picked ${result.sRGBHex}`, "success");
    } catch (e) {
      // User canceled
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleCopySnippet = () => {
    const code = generateSnippet(selectedColor, framework, property, format);
    handleCopy(code);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc
      if (e.key === "Escape") {
        setIsAboutOpen(false);
        setIsContactOpen(false);
      }

      // Ctrl+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (!window.getSelection()?.toString()) {
          e.preventDefault();
          if (activeTab === "code") {
            handleCopySnippet();
          } else {
            navigator.clipboard.writeText(selectedColor);
            showToast(`Copied ${selectedColor}`, "success");
          }
        }
      }

      // Ctrl+V (Paste)
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        navigator.clipboard
          .read()
          .then(async (clipboardItems) => {
            if (clipboardItems.length > 0) {
              const item = clipboardItems[0];
              // Find the first image type available in the item
              const imageType = item.types.find((type) =>
                type.startsWith("image/")
              );

              if (imageType) {
                try {
                  const blob = await item.getType(imageType);
                  const file = new File([blob], "pasted-image", {
                    type: imageType,
                  });
                  processImage(file);
                  showToast("Image pasted successfully", "success");
                  return; // Stop processing if image found
                } catch (err) {
                  console.error("Failed to retrieve image blob:", err);
                }
              }
            }

            // Fallback to text if no image found or retrieval failed
            throw new Error("No image found");
          })
          .catch(() => {
            // Fallback: Read text
            navigator.clipboard.readText().then((text) => {
              const hexMatch = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
              if (hexMatch) {
                let hex = hexMatch[0];
                if (!hex.startsWith("#")) hex = "#" + hex;
                updateSelectedColor(hex);
                showToast(`Pasted ${hex}`, "success");
              }
            });
          });
      }

      // / (Focus Input)
      if (e.key === "/") {
        const input = document.getElementById("manual-hex-input");
        if (input) {
          e.preventDefault();
          input.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedColor, activeTab, framework, property, format]); // Added dependencies

  const activeColor = hoverColor || selectedColor;

  return (
    <Layout>
      <ContextMenu
        onPickScreen={handlePickScreen}
        onCopyHex={() => handleCopy(selectedColor)}
        onCopyRgb={() => {
          const rgb = hexToRgb(selectedColor);
          if (rgb) handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        }}
        onCopySnippet={handleCopySnippet}
        onSaveFavorite={() => {
          // Check if already in palette, if not add it
          if (!palette.includes(selectedColor)) {
            setPalette((prev) => [selectedColor, ...prev]);
            showToast("Saved to Palette", "success");
          } else {
            showToast("Already in Palette", "info");
          }
        }}
        onReset={resetApp}
      />

      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "2rem",
          zIndex: 1000,
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setIsAboutOpen(true)}
          className="secondary-btn"
          style={{
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            background: "rgba(30, 30, 36, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          About
        </button>
        <button
          onClick={() => setIsContactOpen(true)}
          className="secondary-btn"
          style={{
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            background: "rgba(30, 30, 36, 0.8)",
            backdropFilter: "blur(10px)",
          }}
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
          <h1 className="hero-title">Chroma</h1>
          <p className="hero-subtitle">
            Professional Image Color Extraction & Conversion
          </p>

          <ImageUploader onImageSelect={processImage} />

          {/* <div className="divider-text">OR</div> */}

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => processImage(DEMO_IMAGE_URL)}
            >
              Try Demo Image
            </button>
            <button
              className="secondary-btn"
              onClick={() => setIsStandalone(true)}
            >
              Open Color Picker
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
                onClick={goHome}
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
                    className={`tab-btn ${activeTab === "details" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "code" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("code")}
                  >
                    Code
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "suggest" ? "active" : ""
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
                    <SnippetGenerator
                      selectedHex={selectedColor}
                      framework={framework}
                      setFramework={setFramework}
                      property={property}
                      setProperty={setProperty}
                      format={format}
                      setFormat={setFormat}
                    />
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
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
