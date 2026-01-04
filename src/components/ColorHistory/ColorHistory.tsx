import React from "react";
import "./ColorHistory.css";

interface ColorHistoryProps {
  colors: string[];
  onColorSelect: (hex: string) => void;
  onClear: () => void;
}

export const ColorHistory: React.FC<ColorHistoryProps> = ({
  colors,
  onColorSelect,
  onClear,
}) => {
  if (colors.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>History</h3>
        <button onClick={onClear} className="clear-btn">
          Clear
        </button>
      </div>
      <div className="history-grid">
        {colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            className="history-swatch"
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
