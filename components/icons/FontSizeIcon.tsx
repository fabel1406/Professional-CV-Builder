
import React from 'react';

const FontSizeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        {/* Small T */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12v6" />
        {/* Large T */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 6h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 6v12" />
    </svg>
);

export default FontSizeIcon;
