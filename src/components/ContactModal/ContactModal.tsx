import React from 'react';
import './ContactModal.css';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="contact-card" onClick={e => e.stopPropagation()}>
                <button className="contact-close-btn" onClick={onClose}>&times;</button>

                <div className="contact-header">
                    <h3>Let's Connect!</h3>
                    <p>Feel free to reach out for collaborations or just a friendly hello.</p>
                </div>

                <div className="contact-grid">
                    <a href="https://instagram.com/arundada9000" target="_blank" rel="noopener noreferrer" className="contact-item instagram">
                        <span className="icon">📸</span>
                        <span className="label">Instagram</span>
                        <span className="username">@arundada9000</span>
                    </a>

                    <a href="https://facebook.com/arundada9000" target="_blank" rel="noopener noreferrer" className="contact-item facebook">
                        <span className="icon">📘</span>
                        <span className="label">Facebook</span>
                        <span className="username">@arundada9000</span>
                    </a>

                    <a href="https://github.com/arundada9000" target="_blank" rel="noopener noreferrer" className="contact-item github">
                        <span className="icon">💻</span>
                        <span className="label">GitHub</span>
                        <span className="username">@arundada9000</span>
                    </a>

                    <a href="https://youtube.com/@arundada9000" target="_blank" rel="noopener noreferrer" className="contact-item youtube">
                        <span className="icon">▶️</span>
                        <span className="label">YouTube</span>
                        <span className="username">@arundada9000</span>
                    </a>

                    <a href="mailto:arunneupane0000@gmail.com" className="contact-item email">
                        <span className="icon">📧</span>
                        <span className="label">Email</span>
                        <span className="username">arunneupane0000@gmail.com</span>
                    </a>

                    <a href="https://wa.me/9779811420975" target="_blank" rel="noopener noreferrer" className="contact-item whatsapp">
                        <span className="icon">💬</span>
                        <span className="label">WhatsApp</span>
                        <span className="username">+977 9811420975</span>
                    </a>
                </div>

                <div className="contact-footer">
                    <p>Looking forward to hearing from you!</p>
                </div>
            </div>
        </div>
    );
};
