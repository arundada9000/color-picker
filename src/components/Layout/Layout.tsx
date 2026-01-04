import React from "react";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span>Chroma</span>
        </div>
        <nav>
          {/* Actions can be injected here or handled in specific views */}
        </nav>
      </header>
      <main className="layout-content">{children}</main>
      <footer className="layout-footer">
        <p>&copy; 2026 Color Picker</p>
      </footer>
    </div>
  );
};
