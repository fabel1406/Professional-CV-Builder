import React from 'react';

const PaintBrushIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043.025a15.998 15.998 0 01-3.388-1.621m7.5 4.242a3 3 0 00-5.78-1.128 2.25 2.25 0 00-2.4-2.245 4.5 4.5 0 018.4 2.245c0 .399-.078.78-.22 1.128zm0 0a15.998 15.998 0 00-3.388 1.621m5.043-.025a15.998 15.998 0 01-1.622 3.385m-5.043.025a15.998 15.998 0 00-1.622 3.385m-3.388-1.621a15.998 15.998 0 001.622 3.385" />
  </svg>
);

export default PaintBrushIcon;
