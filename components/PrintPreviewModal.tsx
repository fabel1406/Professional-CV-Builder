import React from 'react';
import type { Translations } from '../translations';
import XMarkIcon from './icons/XMarkIcon';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  children: React.ReactNode;
  t: Translations;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ isOpen, onClose, onPrint, children, t }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" 
      aria-labelledby="print-preview-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="bg-slate-200 rounded-lg shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 no-print flex-shrink-0">
          <h2 id="print-preview-title" className="text-xl font-bold text-slate-800">{t.printPreviewTitle}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition"
            aria-label="Close print preview"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-8 overflow-auto">
            <div 
              id="cv-preview-wrapper-for-print"
              className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg"
            >
              {children}
            </div>
        </main>

        <footer className="p-4 border-t border-slate-300 no-print flex-shrink-0">
          <div className="text-center text-sm text-slate-600 mb-4">
            <p>{t.pdfHelperText}</p>
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={onClose}
              className="bg-slate-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-600 transition duration-300 ease-in-out shadow-sm mr-4"
            >
              {t.cancel}
            </button>
            <button
              onClick={onPrint}
              className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out shadow-sm"
            >
              {t.printNow}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrintPreviewModal;