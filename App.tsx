import React, { useState, useEffect } from 'react';
import type { CVData } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import PrintPreviewModal from './components/PrintPreviewModal';
import { translations, Translations } from './translations';
import AlignLeftIcon from './components/icons/AlignLeftIcon';
import AlignCenterIcon from './components/icons/AlignCenterIcon';
import AlignJustifyIcon from './components/icons/AlignJustifyIcon';
import PaintBrushIcon from './components/icons/PaintBrushIcon';
import DocumentArrowDownIcon from './components/icons/DocumentArrowDownIcon';
import DocumentPdfIcon from './components/icons/DocumentPdfIcon';
import PrinterIcon from './components/icons/PrinterIcon';

declare var htmlDocx: any;

const initialCVData: CVData = {
  personalInfo: {
    name: 'Jane Doe',
    title: 'Senior Frontend Developer',
    photo: 'https://picsum.photos/200',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
  },
  summary:
    'Innovative and deadline-driven Frontend Developer with 5+ years of experience designing and developing user-centered digital products from initial concept to final, polished deliverable.',
  experience: [
    {
      id: 'exp1',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description:
        '- Led the development of a new e-commerce platform, resulting in a 30% increase in user engagement.\n- Mentored junior developers and conducted code reviews to ensure code quality and consistency.\n- Collaborated with UX/UI designers to translate wireframes into high-quality, responsive web pages.',
    },
     {
      id: 'exp2',
      title: 'Frontend Developer',
      company: 'Web Innovators',
      startDate: 'Jun 2017',
      endDate: 'Dec 2019',
      description:
        '- Developed and maintained client websites using React, Redux, and TypeScript.\n- Improved website performance by 20% through code optimization and lazy loading techniques.\n- Worked closely with the backend team to integrate RESTful APIs.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'University of Technology',
      startDate: 'Sep 2013',
      endDate: 'May 2017',
    },
  ],
  skills: [
    { id: 'skill1', name: 'React & Next.js' },
    { id: 'skill2', name: 'TypeScript' },
    { id: 'skill3', name: 'Tailwind CSS' },
    { id: 'skill4', name: 'Node.js' },
    { id: 'skill5', name: 'UI/UX Design' },
  ],
  languages: [
    { id: 'lang1', name: 'English', level: 'Native' },
    { id: 'lang2', name: 'Spanish', level: 'Professional Working Proficiency' },
  ],
};

export type Template = 'modern' | 'classic' | 'creative';
export type LanguageKey = 'en' | 'es';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type TextAlign = 'left' | 'center' | 'justify';


const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [template, setTemplate] = useState<Template>('modern');
  const [lang, setLang] = useState<LanguageKey>('es');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [accentColor, setAccentColor] = useState<string>('#4F46E5');
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const handleOpenPrintPreview = () => setIsPrintPreviewOpen(true);
  const handleClosePrintPreview = () => setIsPrintPreviewOpen(false);
  const handlePrint = () => {
    window.print();
  };

  const handleExportToWord = () => {
    if (typeof htmlDocx === 'undefined') {
      alert('The export library is not available. Please try again later.');
      return;
    }

    const cvElement = document.getElementById('cv-live-preview');
    if (!cvElement) {
      alert('Could not find the CV content to export.');
      return;
    }

    const cvHtml = cvElement.outerHTML;
    
    // NOTE: Complex CSS (especially from frameworks like Tailwind) will not be 
    // perfectly translated. The export focuses on content and basic structure, 
    // providing an editable version of the CV.
    const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${cvHtml}</body></html>`;
    const fileBuffer = htmlDocx.asBlob(content);

    const url = URL.createObjectURL(fileBuffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isPrintPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPrintPreviewOpen]);

  const t: Translations = translations[lang];

  const templates: { id: Template; name: string }[] = [
    { id: 'modern', name: t.modern },
    { id: 'classic', name: t.classic },
    { id: 'creative', name: t.creative },
  ];
  
  const fontOptions: { id: FontFamily; name: string }[] = [
    { id: 'sans', name: t.sansSerif },
    { id: 'serif', name: t.serif },
    { id: 'mono', name: t.monospace },
  ];
  
  const alignmentOptions: { id: TextAlign; icon: React.ReactNode; label: string }[] = [
      { id: 'left', icon: <AlignLeftIcon />, label: "Align Left" },
      { id: 'center', icon: <AlignCenterIcon />, label: "Align Center" },
      { id: 'justify', icon: <AlignJustifyIcon />, label: "Justify" },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800 no-print">
        <header className="bg-white shadow-md p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-slate-800">{t.appTitle}</h1>
            <div className="flex items-center gap-2 flex-wrap">
               <div>
                <label htmlFor="lang-select" className="sr-only">Select Language</label>
                <select 
                  id="lang-select"
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as LanguageKey)}
                  className="bg-slate-100 border-slate-200 border rounded-md py-1.5 pl-2 pr-8 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
                {templates.map((templateItem) => (
                  <button
                    key={templateItem.id}
                    onClick={() => setTemplate(templateItem.id)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                      template === templateItem.id
                        ? 'bg-blue-500 text-white shadow'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                    aria-pressed={template === templateItem.id}
                  >
                    {templateItem.name}
                  </button>
                ))}
              </div>
               {/* Font Selector */}
              <div>
                 <label htmlFor="font-select" className="sr-only">{t.font}</label>
                 <select 
                  id="font-select"
                  value={fontFamily} 
                  onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                  className="bg-slate-100 border-slate-200 border rounded-md py-1.5 pl-2 pr-8 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Select font family"
                >
                  {fontOptions.map(font => (
                      <option key={font.id} value={font.id}>{font.name}</option>
                  ))}
                </select>
              </div>
               {/* Text Alignment */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                  {alignmentOptions.map((align) => (
                      <button
                      key={align.id}
                      onClick={() => setTextAlign(align.id)}
                      className={`p-1.5 rounded-md transition-colors duration-200 ${
                          textAlign === align.id
                          ? 'bg-blue-500 text-white shadow'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                      aria-label={align.label}
                      aria-pressed={textAlign === align.id}
                      >
                      {align.icon}
                      </button>
                  ))}
              </div>
              {/* Color Picker */}
              <div className="flex items-center gap-2 bg-slate-100 border-slate-200 border rounded-md py-1 pl-2 pr-2 text-sm font-semibold text-slate-700">
                 <label htmlFor="color-picker" className="flex items-center gap-1 cursor-pointer" title={t.color}>
                   <PaintBrushIcon className="w-4 h-4" />
                   <span className="sr-only">{t.color}</span>
                 </label>
                 <input
                  id="color-picker"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-6 h-6 p-0 border-none rounded cursor-pointer"
                  aria-label="Select accent color"
                  style={{ backgroundColor: 'transparent' }}
                 />
              </div>
              <button
                onClick={handleExportToWord}
                className="bg-sky-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-sky-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-2"
                aria-label={t.exportWord}
                title={t.exportWord}
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t.exportWord}</span>
              </button>
              <button
                onClick={handleOpenPrintPreview}
                className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-2"
                aria-label={t.saveAsPdf}
                title={t.saveAsPdf}
              >
                <DocumentPdfIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t.saveAsPdf}</span>
              </button>
               <button
                onClick={handleOpenPrintPreview}
                className="bg-green-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-2"
                 aria-label={t.print}
                 title={t.print}
              >
                <PrinterIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">{t.print}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CVForm data={cvData} onUpdate={setCvData} t={t} />
          </div>
          <div className="flex justify-center items-start lg:sticky top-24">
              <div className="transform scale-90 lg:scale-100 origin-top">
                  <CVPreview id="cv-live-preview" data={cvData} template={template} t={t} fontFamily={fontFamily} textAlign={textAlign} accentColor={accentColor} />
              </div>
          </div>
        </main>

        {isPrintPreviewOpen && (
          <PrintPreviewModal
            isOpen={isPrintPreviewOpen}
            onClose={handleClosePrintPreview}
            onPrint={handlePrint}
            t={t}
          >
             <CVPreview id="cv-modal-preview" data={cvData} template={template} t={t} fontFamily={fontFamily} textAlign={textAlign} accentColor={accentColor} />
          </PrintPreviewModal>
        )}
      </div>

      <div className="hidden print:block">
        <CVPreview id="cv-print-version" data={cvData} template={template} t={t} fontFamily={fontFamily} textAlign={textAlign} accentColor={accentColor} />
      </div>
    </>
  );
};

export default App;