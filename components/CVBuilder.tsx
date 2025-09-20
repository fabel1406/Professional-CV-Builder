import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import CVForm from './CVForm';
import CVPreview from './CVPreview';
import PrintPreviewModal from './PrintPreviewModal';
import type { CVData, Template, FontFamily, TextAlign, LanguageKey } from '../types';
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

interface CVBuilderProps {
  t: Translations;
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  onGoBack: () => void;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ t, language, setLanguage, onGoBack }) => {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [template, setTemplate] = useState<Template>('modern');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState<boolean>(false);
  
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };
  
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
      const prompt = `Based on the following CV data, write a professional and compelling summary of 2-3 sentences in ${language === 'es' ? 'Spanish' : 'English'}:
      Name: ${cvData.personalInfo.name}
      Title: ${cvData.personalInfo.title}
      Experience: ${cvData.experience.map(e => `${e.title} at ${e.company}`).join(', ')}
      Skills: ${cvData.skills.map(s => s.name).join(', ')}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const summaryText = response.text;
      if (summaryText) {
        setCvData(prev => ({ ...prev, summary: summaryText.trim() }));
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please check your API key and try again.");
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
    <div className="min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-10 no-print">
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
                <LanguageSwitcher />
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

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><LayoutTemplateIcon />{t.customize}</h2>
            
            {/* Template */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">{t.template}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['modern', 'classic', 'creative'] as Template[]).map(tmpl => (
                  <button key={tmpl} onClick={() => setTemplate(tmpl)} className={`capitalize text-sm py-2 px-3 rounded-md transition ${template === tmpl ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>{t[`template${tmpl.charAt(0).toUpperCase() + tmpl.slice(1)}` as keyof Translations] || tmpl}</button>
                ))}
              </div>
            </div>

            {/* Font Family */}
             <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">{t.fontFamily}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['sans', 'serif', 'mono'] as FontFamily[]).map(f => (
                   <button key={f} onClick={() => setFontFamily(f)} className={`capitalize text-sm py-2 px-3 rounded-md transition ${fontFamily === f ? 'bg-blue-500 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>{f}</button>
                ))}
              </div>
            </div>

            {/* Text Align */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">{t.textAlign}</label>
              <div className="flex items-center gap-2 bg-slate-200 rounded-md p-1">
                 {(['left', 'center', 'justify'] as TextAlign[]).map(a => (
                   <button key={a} onClick={() => setTextAlign(a)} className={`flex-1 p-2 rounded-md transition ${textAlign === a ? 'bg-white shadow' : 'hover:bg-slate-100'}`}>
                     {a === 'left' && <AlignLeftIcon className="mx-auto" />}
                     {a === 'center' && <AlignCenterIcon className="mx-auto" />}
                     {a === 'justify' && <AlignJustifyIcon className="mx-auto" />}
                   </button>
                 ))}
              </div>
            </div>

             {/* Accent Color */}
             <div>
               <label htmlFor="accent-color" className="block text-sm font-medium text-slate-600 mb-2">{t.accentColor}</label>
               <div className="relative">
                <PaintBrushIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="accent-color" type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full h-10 pl-10 pr-2 py-1 border border-slate-300 rounded-md" />
               </div>
            </div>
          </div>
                    
          <CVForm 
            data={cvData} 
            onUpdate={setCvData} 
            t={t} 
            onGenerateSummary={handleGenerateSummary} 
            isGenerating={isGenerating} 
          />
        </div>

        <div className="lg:col-span-2 relative">
          <div ref={cvPreviewRef} className="sticky top-24">
            <div className="flex justify-center items-start p-4">
              <div className="transform scale-[0.8] origin-top">
                <CVPreview
                  data={cvData}
                  template={template}
                  fontFamily={fontFamily}
                  textAlign={textAlign}
                  accentColor={accentColor}
                  t={t}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PrintPreviewModal isOpen={isPrintModalOpen} onClose={() => setPrintModalOpen(false)} onPrint={handlePrint} t={t}>
         <CVPreview
            id="cv-for-print"
            data={cvData}
            template={template}
            fontFamily={fontFamily}
            textAlign={textAlign}
            accentColor={accentColor}
            t={t}
          />
      </PrintPreviewModal>
    </div>
  );
};

// Add initialData here to be self-contained
const initialCVData: CVData = {
  personalInfo: { name: '', title: '', email: '', phone: '', location: '', website: '', photo: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
};

export default CVBuilder;