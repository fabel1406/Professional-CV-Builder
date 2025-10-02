

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import CVForm from './CVForm';
import CVPreview from './CVPreview';
import PrintPreviewModal from './PrintPreviewModal';
import type { CVData, Template, FontFamily, TextAlign, LanguageKey, ReorderableSection, FontSize } from '../types';
import type { Translations } from '../translations';
import LayoutTemplateIcon from './icons/LayoutTemplateIcon';
import SparklesIcon from './icons/SparklesIcon';
import EyeIcon from './icons/EyeIcon';
import PrinterIcon from './icons/PrinterIcon';
import AlignLeftIcon from './icons/AlignLeftIcon';
import AlignCenterIcon from './icons/AlignCenterIcon';
import AlignJustifyIcon from './icons/AlignJustifyIcon';
import PaintBrushIcon from './icons/PaintBrushIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import XMarkIcon from './icons/XMarkIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import CheckIcon from './icons/CheckIcon';
import FontSizeIcon from './icons/FontSizeIcon';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';

interface CVBuilderProps {
  t: Translations;
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  onGoBack: () => void;
}

const templatePreviews: Record<Template, string> = {
    modern: "https://i.imgur.com/kLOU9MN.png",
    classic: "https://i.imgur.com/XR0MBpJ.png",
    creative: "https://i.imgur.com/roFeE5X.png",
    professional: "https://i.imgur.com/YJtQvLw.png",
};

const fontOptions: FontFamily[] = [
  'Arial', 'Calibri', 'Courier New', 'DejaVu Sans', 'Garamond', 'Georgia', 'Helvetica',
  'Lato', 'Noto Sans', 'Noto Serif', 'Poppins', 'Times New Roman', 'Trebuchet MS'
];

const fontStacks: Record<FontFamily, string> = {
  'Arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  'Calibri': 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
  'Courier New': '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
  'DejaVu Sans': '"DejaVu Sans", Arial, Verdana, sans-serif',
  'Garamond': 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif',
  'Georgia': 'Georgia, Times, "Times New Roman", serif',
  'Helvetica': '"Helvetica Neue", Helvetica, Arial, sans-serif',
  'Lato': 'Lato, "Helvetica Neue", Helvetica, Arial,sans-serif',
  'Noto Sans': '"Noto Sans", sans-serif',
  'Noto Serif': '"Noto Serif", serif',
  'Poppins': 'Poppins, sans-serif',
  'Times New Roman': '"Times New Roman", Times, serif',
  'Trebuchet MS': '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
};

// Custom hook for managing state with undo/redo capabilities
const useHistoryState = <T extends object>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    const currentState = history[currentIndex];
    const newState = typeof action === 'function'
      ? (action as (prevState: T) => T)(currentState)
      : action;
    
    // Simple deep compare to avoid adding identical states
    if (JSON.stringify(currentState) === JSON.stringify(newState)) {
        return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, history.length]);

  return {
    state: history[currentIndex],
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};

const CVBuilder: React.FC<CVBuilderProps> = ({ t, language, setLanguage, onGoBack }) => {
  const {
    state: cvData,
    setState: setCvData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<CVData>(initialCVData);
  const [template, setTemplate] = useState<Template>('professional');
  const [fontFamily, setFontFamily] = useState<FontFamily>('Helvetica');
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [accentColor, setAccentColor] = useState<string>('#0369a1'); // sky-700 for Professional template
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [sectionsOrder, setSectionsOrder] = useState<ReorderableSection[]>(['experience', 'education', 'courses']);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrint = () => {
    window.print();
  };
  
  const handleGenerateSummary = async () => {
    setNotification(null);
    const filledExperience = cvData.experience.filter(e => e.title && e.company);
    const filledSkills = cvData.skills.filter(s => s.name);

    if (filledExperience.length === 0 && filledSkills.length === 0) {
      setNotification(t.aiEmptyError);
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    setIsGenerating(true);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("API key not found. Make sure it's set in your environment variables.");
        throw new Error("API key is not available.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Based on the following CV data, write a professional and compelling summary of 2-3 sentences in ${language === 'es' ? 'Spanish' : 'English'}:
      Name: ${cvData.personalInfo.name || 'the candidate'}
      Title: ${cvData.personalInfo.title || 'a professional'}
      Experience: ${filledExperience.map(e => `${e.title} at ${e.company}`).join(', ')}
      Skills: ${filledSkills.map(s => s.name).join(', ')}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const summaryText = response.text;

      if (summaryText) {
        setCvData(prev => ({ ...prev, summary: summaryText.trim() }));
      } else {
        throw new Error("Empty summary received from AI.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setNotification(t.aiError);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const LanguageSwitcher: React.FC = () => (
    <div className="flex items-center text-sm">
      <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-l-md ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>EN</button>
      <button onClick={() => setLanguage('es')} className={`px-3 py-1 rounded-r-md ${language === 'es' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>ES</button>
    </div>
  );

  return (
    <>
      {/* Dedicated container for printing */}
      <div className="print-only">
        <CVPreview
          id="cv-for-print"
          data={cvData}
          template={template}
          fontFamily={fontFamily}
          textAlign={textAlign}
          accentColor={accentColor}
          fontSize={fontSize}
          sectionsOrder={sectionsOrder}
          t={t}
        />
      </div>

      {/* Main application container, which will be hidden during printing */}
      <div className="min-h-screen screen-only">
        <header className="bg-white shadow-md sticky top-0 z-20 no-print">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={onGoBack}
                  className="text-slate-600 hover:text-blue-600 p-2 rounded-full transition -ml-2"
                  aria-label={t.goBack}
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{t.appName}</h1>
              </div>
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setPrintModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition"
                  >
                    <EyeIcon className="w-5 h-5"/>
                    {t.printPreviewTitle}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition"
                  >
                      <PrinterIcon className="w-5 h-5" />
                      {t.print}
                  </button>
              </div>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
            <div className="fixed top-24 right-8 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg flex items-center gap-4 animate-slide-in-right" role="alert">
              <p>{notification}</p>
              <button
                  onClick={() => setNotification(null)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Close"
              >
                  <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        
        <div className="container mx-auto p-4">
            <div ref={toolbarRef} className="bg-white p-3 rounded-lg shadow-lg mb-8 sticky top-[61px] z-10 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Undo/Redo Buttons */}
                    <div className="flex items-center">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition"
                            title="Undo"
                        >
                            <UndoIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition"
                            title="Redo"
                        >
                            <RedoIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    {/* Template Dropdown */}
                    <div className="relative">
                        <button onClick={() => setActiveDropdown(activeDropdown === 'template' ? null : 'template')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md shadow-sm hover:bg-slate-200 transition">
                            <LayoutTemplateIcon className="w-5 h-5" />
                            <span>{t.template}</span>
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        {activeDropdown === 'template' && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                                <div className="grid grid-cols-2 gap-2 p-2">
                                    {(['modern', 'classic', 'creative', 'professional'] as Template[]).map(tmpl => (
                                        <div key={tmpl} onClick={() => { setTemplate(tmpl); setActiveDropdown(null); }} className={`p-2 rounded-md cursor-pointer hover:bg-slate-100 ${template === tmpl ? 'ring-2 ring-blue-500' : ''}`}>
                                            <img src={templatePreviews[tmpl]} alt={`${tmpl} template preview`} className="rounded-sm border border-slate-200 mb-1" />
                                            <p className="text-xs text-center font-medium text-slate-600">{t[`template${tmpl.charAt(0).toUpperCase() + tmpl.slice(1)}` as keyof Translations] || tmpl}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                     {/* Style Dropdown */}
                    <div className="relative">
                        <button onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md shadow-sm hover:bg-slate-200 transition">
                            <PaintBrushIcon className="w-5 h-5" />
                            <span>{t.customize}</span>
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                         {activeDropdown === 'style' && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{t.fontFamily}</label>
                                    <div className="max-h-60 overflow-y-auto pr-2 -mr-2">
                                        {fontOptions.map(font => (
                                            <button
                                                key={font}
                                                onClick={() => setFontFamily(font)}
                                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center justify-between transition-colors ${fontFamily === font ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}
                                                style={{ fontFamily: fontStacks[font] }}
                                            >
                                                <span>{font}</span>
                                                {fontFamily === font && <CheckIcon className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2">{t.textAlign}</label>
                                    <div className="flex items-center gap-1 bg-slate-200 rounded-md p-0.5">
                                        {(['left', 'center', 'justify'] as TextAlign[]).map(a => (
                                            <button key={a} onClick={() => setTextAlign(a)} title={a} className={`flex-1 p-1.5 rounded-md transition ${textAlign === a ? 'bg-white shadow' : 'hover:bg-slate-100'}`}>
                                                {a === 'left' && <AlignLeftIcon className="mx-auto w-4 h-4" />}
                                                {a === 'center' && <AlignCenterIcon className="mx-auto w-4 h-4" />}
                                                {a === 'justify' && <AlignJustifyIcon className="mx-auto w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="accent-color" className="block text-xs font-medium text-slate-500 mb-2">{t.accentColor}</label>
                                    <input id="accent-color" type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full h-8 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                         )}
                    </div>
                     {/* Font Size Dropdown */}
                    <div className="relative">
                        <button onClick={() => setActiveDropdown(activeDropdown === 'fontSize' ? null : 'fontSize')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md shadow-sm hover:bg-slate-200 transition">
                            <FontSizeIcon className="w-5 h-5" />
                            <span>{t.fontSize}</span>
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        {activeDropdown === 'fontSize' && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-2">
                                <ul>
                                    {(['sm', 'md', 'lg'] as FontSize[]).map(size => (
                                        <li key={size}>
                                            <button
                                                onClick={() => { setFontSize(size); setActiveDropdown(null); }}
                                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center justify-between transition-colors ${fontSize === size ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}
                                            >
                                                <span>{t[('fontSize' + size.charAt(0).toUpperCase()) as keyof Translations]}</span>
                                                {fontSize === size && <CheckIcon className="w-4 h-4" />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm disabled:bg-purple-300"
                        title={t.aiAssistTooltip}
                    >
                        <SparklesIcon className="w-4 h-4" />
                        {isGenerating ? t.loading : t.generateWithAI}
                    </button>
                    <LanguageSwitcher />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <CVForm 
                  data={cvData} 
                  onUpdate={setCvData} 
                  t={t} 
                  sectionsOrder={sectionsOrder}
                  onSectionsOrderChange={setSectionsOrder}
                />
              </div>

              <div className="lg:col-span-3 relative">
                <div ref={cvPreviewRef} className="sticky top-36">
                  <div className="flex justify-center items-start p-4">
                    <div className="transform scale-[0.8] origin-top">
                      <CVPreview
                        data={cvData}
                        template={template}
                        fontFamily={fontFamily}
                        textAlign={textAlign}
                        accentColor={accentColor}
                        fontSize={fontSize}
                        sectionsOrder={sectionsOrder}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        <PrintPreviewModal isOpen={isPrintModalOpen} onClose={() => setPrintModalOpen(false)} onPrint={handlePrint} t={t}>
           <CVPreview
              data={cvData}
              template={template}
              fontFamily={fontFamily}
              textAlign={textAlign}
              accentColor={accentColor}
              fontSize={fontSize}
              sectionsOrder={sectionsOrder}
              t={t}
            />
        </PrintPreviewModal>
      </div>
    </>
  );
};

// Add initialData here to be self-contained
const initialCVData: CVData = {
  personalInfo: { name: '', title: '', email: '', phone: '', location: '', website: '', photo: '' },
  summary: '',
  experience: [],
  education: [],
  courses: [],
  skills: [],
  languages: [],
};

export default CVBuilder;
