import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ImageColorPicker.css';
import { rgbToHex } from '../../utils/colorUtils';

interface ImageColorPickerProps {
    imageSrc: string;
    onColorSelect: (hex: string) => void;
    onHover?: (hex: string | null) => void;
}

export const ImageColorPicker: React.FC<ImageColorPickerProps> = ({ imageSrc, onColorSelect, onHover }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [magnifierPos, setMagnifierPos] = useState<{ x: number, y: number } | null>(null);
    const [magnifierColor, setMagnifierColor] = useState<string | null>(null);

    // Draw image to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
            // Set canvas size to natural image size for 1:1 pixel mapping
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    }, [imageSrc]);

    const getColorData = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        // Calculate scale factor in case displayed size != natural size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Clamp coordinates
        const clampedX = Math.max(0, Math.min(x, canvas.width - 1));
        const clampedY = Math.max(0, Math.min(y, canvas.height - 1));

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const [r, g, b] = ctx.getImageData(Math.floor(clampedX), Math.floor(clampedY), 1, 1).data;
        const hex = rgbToHex({ r, g, b });

        return { hex, x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const data = getColorData(e);
        if (data) {
            if (onHover) onHover(data.hex);
            setMagnifierPos({ x: data.x, y: data.y });
            setMagnifierColor(data.hex);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const data = getColorData(e);
        if (data) {
            onColorSelect(data.hex);
        }
    };

    const handleMouseLeave = () => {
        if (onHover) onHover(null);
        setMagnifierPos(null);
    };

    return (
        <div className="picker-wrapper" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="image-canvas"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={handleMouseLeave}
            />
            {magnifierPos && magnifierColor && (
                <div
                    className="magnifier"
                    style={{
                        backgroundColor: magnifierColor,
                    }}
                >
                    <div className="magnifier-ring" />
                    <div className="crosshair" />
                </div>
            )}
        </div>
    );
};
