import React from 'react';

// WhatsApp phone number for Smart Kissan support
const WHATSAPP_NUMBER = '918169464773';
const WHATSAPP_MESSAGE = 'Hello Smart Kissan! I need help with my farm.';

export const WhatsAppButton = ({ className = '', bottomOffset = 'bottom-24 md:bottom-8' }) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-cta"
            className={`fixed right-4 z-50 flex items-center justify-center rounded-full shadow-lg
                        transition-all duration-300 hover:scale-110 active:scale-95 ${bottomOffset} ${className}`}
            style={{ background: '#25D366', width: 56, height: 56 }}
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
        >
            {/* WhatsApp SVG Icon */}
            <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.347.617 4.64 1.791 6.657L2.667 29.333l6.88-1.76a13.29 13.29 0 006.457 1.654h.003c7.36 0 13.327-5.973 13.327-13.333 0-3.56-1.387-6.907-3.907-9.427a13.267 13.267 0 00-9.423-3.8zm0 24a11.003 11.003 0 01-5.6-1.533l-.4-.24-4.08 1.04 1.08-3.947-.267-.413A10.974 10.974 0 015.013 16c0-6.067 4.933-11 11-11 2.94 0 5.707 1.147 7.787 3.23A10.937 10.937 0 0127.003 16c0 6.067-4.933 11-11 11zm6.04-8.24c-.333-.167-1.96-.967-2.267-1.077-.306-.107-.527-.16-.747.16-.22.32-.853 1.08-1.047 1.307-.193.213-.387.24-.72.08-.333-.16-1.413-.52-2.693-1.657-.993-.884-1.663-1.974-1.857-2.307-.193-.333-.02-.513.147-.68.15-.147.333-.387.5-.58.167-.193.22-.333.333-.547.107-.22.054-.413-.027-.58-.08-.16-.747-1.8-1.02-2.467-.267-.64-.547-.56-.747-.56l-.64-.013c-.22 0-.573.08-.873.387-.3.307-1.147 1.12-1.147 2.733s1.174 3.173 1.34 3.393c.16.22 2.307 3.52 5.587 4.94.78.333 1.39.534 1.866.68.787.254 1.5.22 2.067.133.63-.093 1.96-.8 2.24-1.573.28-.773.28-1.433.2-1.573-.08-.12-.3-.2-.627-.36z" />
            </svg>

            {/* Pulse ring animation */}
            <span
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: '#25D366' }}
            />
        </a>
    );
};

export default WhatsAppButton;
