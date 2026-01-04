import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import './ContextMenu.css';

interface ContextMenuProps {
    onPickScreen: () => void;
    onCopyHex: () => void;
    onCopyRgb: () => void;
    onCopySnippet: () => void;
    onSaveFavorite: () => void;
    onReset: () => void;
}

const Icons = {
    EyeDropper: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    Hex: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    Palette: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10c0 1.28-.76 2.5-2 3.25V15c-1.66 0-3 1.34-3 3 0 .76.62 1.39 1.25 2L15 22h-3z"></path></svg>,
    Code: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    Reset: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    onPickScreen, onCopyHex, onCopyRgb, onCopySnippet, onSaveFavorite, onReset
}) => {
    const [visible, setVisible] = useState(false);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setVisible(true);
            setClickPosition({ x: e.pageX, y: e.pageY });
        };

        const handleClose = () => setVisible(false);

        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('resize', handleClose);
        window.addEventListener('scroll', handleClose);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('resize', handleClose);
            window.removeEventListener('scroll', handleClose);
        };
    }, []);

    // Smart Positioning Logic
    useLayoutEffect(() => {
        if (visible && menuRef.current) {
            const { innerWidth, innerHeight } = window;
            const menuRect = menuRef.current.getBoundingClientRect();

            let top = clickPosition.y;
            let left = clickPosition.x;

            // Check if it fits on right
            if (left + menuRect.width > innerWidth) {
                left = left - menuRect.width;
            }

            // Check if it fits on bottom
            // Note: clickPosition.y is PageY, but we need calculation relative to viewport for edge check?
            // Actually, we use fixed position or absolute relative to body. 
            // If body is tall, pageY works. But viewport check uses clientY.
            // Let's approximate: 
            // If the calculated top + height goes somewhat beyond viewport bottom scroll, we shift up.

            // Simpler Viewport Check:
            // Convert pageY to viewport relative Y for check
            const viewportY = clickPosition.y - window.scrollY;
            if (viewportY + menuRect.height > innerHeight) {
                top = top - menuRect.height;
            }

            setMenuPosition({ top, left });
        }
    }, [visible, clickPosition]);

    if (!visible) return null;

    return (
        <>
            <div className="context-menu-overlay" onClick={() => setVisible(false)} onContextMenu={(e) => { e.preventDefault(); setVisible(false); }} />
            <div
                className="context-menu"
                ref={menuRef}
                style={{ top: menuPosition.top, left: menuPosition.left }}
                onClick={() => setVisible(false)}
            >
                <div className="menu-item" onClick={onPickScreen}>
                    <span className="icon"><Icons.EyeDropper /></span> Pick from Screen
                </div>
                <div className="menu-divider" />
                <div className="menu-item" onClick={onCopyHex}>
                    <span className="icon">#</span> Copy HEX
                </div>
                <div className="menu-item" onClick={onCopyRgb}>
                    <span className="icon"><Icons.Palette /></span> Copy RGB
                </div>
                <div className="menu-item" onClick={onCopySnippet}>
                    <span className="icon"><Icons.Code /></span> Copy Snippet
                </div>
                <div className="menu-item" onClick={onSaveFavorite}>
                    <span className="icon"><Icons.Star /></span> Save to Palette
                </div>
                <div className="menu-divider" />
                <div className="menu-item danger" onClick={onReset}>
                    <span className="icon"><Icons.Reset /></span> Reset App
                </div>
            </div>
        </>
    );
};
