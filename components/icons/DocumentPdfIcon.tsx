import React from 'react';

const DocumentPdfIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 005.625 21h12.75c1.243 0 2.25-1.007 2.25-2.25V11.25a9 9 0 00-9-9z" />
  </svg>
);

export default DocumentPdfIcon;