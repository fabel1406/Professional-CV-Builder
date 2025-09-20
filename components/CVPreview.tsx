import React from 'react';
import type { CVData } from '../types';
import type { Template, FontFamily, TextAlign } from '../App';
import type { Translations } from '../translations';
import EnvelopeIcon from './icons/EnvelopeIcon';
import PhoneIcon from './icons/PhoneIcon';
import MapPinIcon from './icons/MapPinIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';

interface CVPreviewProps {
  id?: string;
  data: CVData;
  template: Template;
  t: Translations;
  fontFamily: FontFamily;
  textAlign: TextAlign;
  accentColor: string;
}

interface TemplateProps {
    id: string;
    data: CVData;
    t: Translations;
    fontFamily: FontFamily;
    textAlign: TextAlign;
    accentColor: string;
}

const getFontClass = (fontFamily: FontFamily) => ({
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}[fontFamily]);

const getTextAlignClass = (textAlign: TextAlign) => ({
  left: 'text-left',
  center: 'text-center',
  justify: 'text-justify',
}[textAlign]);

// Helper to determine if text should be light or dark based on background color
const getTextColorForBackground = (hexColor: string): string => {
  if (!hexColor) return '#000000';
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Using the WCAG formula for luminance
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};


// ============== Modern Template (Original Design) ==============
const ModernTemplate: React.FC<TemplateProps> = ({ id, data, t, fontFamily, textAlign, accentColor }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  const fontClass = getFontClass(fontFamily);
  const textAlignClass = getTextAlignClass(textAlign);
  const textColor = getTextColorForBackground(accentColor);

  return (
    <div id={id} className={`w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden ${fontClass}`}>
      <div className="flex flex-row">
        {/* Left Column */}
        <div className="w-1/3 p-8" style={{ backgroundColor: accentColor, color: textColor }}>
          {personalInfo.photo && (
            <div className="mb-8">
              <img src={personalInfo.photo} alt="Profile" className="rounded-full w-40 h-40 mx-auto object-cover border-4" style={{ borderColor: 'rgba(255, 255, 255, 0.5)'}} />
            </div>
          )}
          <div className="mb-10">
            <h3 className="text-xl font-semibold border-b-2 pb-2 mb-4 uppercase tracking-wider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', opacity: 0.9 }}>{t.contact}</h3>
            <ul className="space-y-3 text-sm" style={{ opacity: 0.9 }}>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-3" style={{ opacity: 0.7 }} />
                <span>{personalInfo.email || t.previewEmail}</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3" style={{ opacity: 0.7 }}/>
                <span>{personalInfo.phone || t.previewPhone}</span>
              </li>
              <li className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-3" style={{ opacity: 0.7 }}/>
                <span>{personalInfo.location || t.previewLocation}</span>
              </li>
               <li className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-3" style={{ opacity: 0.7 }}/>
                <span>{personalInfo.website || t.previewWebsite}</span>
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold border-b-2 pb-2 mb-4 uppercase tracking-wider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', opacity: 0.9 }}>{t.skills}</h3>
            <ul className="space-y-2 text-sm">
              {skills.length > 0 ? skills.map(skill => (
                <li key={skill.id} className="rounded-md px-3 py-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>{skill.name}</li>
              )) : <li>{t.previewSkill}</li>}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold border-b-2 pb-2 mb-4 uppercase tracking-wider" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', opacity: 0.9 }}>{t.languages}</h3>
            <ul className="space-y-2 text-sm">
              {languages.length > 0 ? languages.map(lang => (
                <li key={lang.id}>
                  <p>{lang.name}</p>
                  <p className="text-xs" style={{ opacity: 0.7 }}>{lang.level}</p>
                </li>
              )) : <li><p>{t.previewLang}</p><p className="text-xs" style={{ opacity: 0.7 }}>{t.previewProficiency}</p></li>}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-8 bg-white">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-800 tracking-tight">{personalInfo.name || t.yourName}</h1>
            <h2 className="text-2xl font-light text-slate-600 tracking-wide mt-2">{personalInfo.title || t.yourTitle}</h2>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-700 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">{t.profile}</h3>
            <p className={`text-slate-600 text-sm leading-relaxed ${textAlignClass}`}>{summary || t.previewSummary}</p>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-700 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">{t.experience}</h3>
            <div className="space-y-6">
              {experience.length > 0 ? experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{exp.title || t.previewJobTitle}</h4>
                    <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600 mb-2">{exp.company || t.previewCompany}</p>
                  <p className={`text-slate-600 text-sm leading-relaxed whitespace-pre-wrap ${textAlignClass}`}>{exp.description || t.previewDescription}</p>
                </div>
              )) : (
                <div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{t.previewJobTitle}</h4>
                    <p className="text-sm text-slate-500">{t.previewDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600 mb-2">{t.previewCompany}</p>
                  <p className={`text-slate-600 text-sm leading-relaxed ${textAlignClass}`}>{t.previewDescription}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-700 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">{t.education}</h3>
            <div className="space-y-4">
               {education.length > 0 ? education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{edu.degree || t.previewDegree}</h4>
                     <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600">{edu.institution || t.previewInstitution}</p>
                </div>
              )) : (
                 <div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{t.previewDegree}</h4>
                     <p className="text-sm text-slate-500">{t.previewDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600">{t.previewInstitution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Classic Template ==============
const ClassicTemplate: React.FC<TemplateProps> = ({ id, data, t, fontFamily, textAlign, accentColor }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  const fontClass = getFontClass(fontFamily);
  const textAlignClass = getTextAlignClass(textAlign);
  const skillTextColor = getTextColorForBackground(accentColor);
  
  const Section: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({title, children, className}) => (
      <div className={className}>
          <h3 className="text-xl font-bold text-slate-700 border-b-2 pb-2 mb-4 uppercase tracking-wider" style={{borderColor: accentColor}}>{title}</h3>
          {children}
      </div>
  );

  return (
    <div id={id} className={`w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden p-12 ${fontClass}`}>
      <header className="text-center mb-10">
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="rounded-full w-32 h-32 mx-auto mb-6 object-cover border-4 border-slate-200" />
        )}
        <h1 className="text-5xl font-bold text-slate-800 tracking-tight">{personalInfo.name || t.yourName}</h1>
        <h2 className="text-2xl font-light text-slate-600 tracking-wide mt-2 mb-6">{personalInfo.title || t.yourTitle}</h2>
        <div className="flex justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-600 flex-wrap">
           <span className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2" /> {personalInfo.email || t.previewEmail}</span>
           <span className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2" /> {personalInfo.phone || t.previewPhone}</span>
           <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2" /> {personalInfo.location || t.previewLocation}</span>
           <span className="flex items-center"><GlobeAltIcon className="w-4 h-4 mr-2" /> {personalInfo.website || t.previewWebsite}</span>
        </div>
      </header>
      
      <main>
        <Section title={t.profile} className="mb-8">
          <p className={`text-slate-600 text-sm leading-relaxed ${textAlignClass}`}>{summary || t.previewSummary}</p>
        </Section>
        
        <Section title={t.experience} className="mb-8">
           <div className="space-y-6">
              {experience.length > 0 ? experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{exp.title || t.previewJobTitle}</h4>
                    <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600 mb-2">{exp.company || t.previewCompany}</p>
                  <p className={`text-slate-600 text-sm leading-relaxed whitespace-pre-wrap ${textAlignClass}`}>{exp.description || t.previewDescription}</p>
                </div>
              )) : (
                <div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{t.previewJobTitle}</h4>
                    <p className="text-sm text-slate-500">{t.previewDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600 mb-2">{t.previewCompany}</p>
                  <p className={`text-slate-600 text-sm leading-relaxed ${textAlignClass}`}>{t.previewDescription}</p>
                </div>
              )}
            </div>
        </Section>

        <Section title={t.education} className="mb-8">
          <div className="space-y-4">
               {education.length > 0 ? education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{edu.degree || t.previewDegree}</h4>
                     <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600">{edu.institution || t.previewInstitution}</p>
                </div>
              )) : (
                 <div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-slate-800">{t.previewDegree}</h4>
                     <p className="text-sm text-slate-500">{t.previewDate}</p>
                  </div>
                  <p className="text-md font-medium text-slate-600">{t.previewInstitution}</p>
                </div>
              )}
            </div>
        </Section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title={t.skills}>
                 <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? skills.map(skill => (
                      <span key={skill.id} className="text-sm font-medium px-3 py-1 rounded-full" style={{backgroundColor: accentColor, color: skillTextColor}}>{skill.name}</span>
                    )) : <span className="text-sm text-slate-500">{t.previewSkill}</span>}
                 </div>
            </Section>
            <Section title={t.languages}>
                 <ul className="space-y-2 text-sm">
                    {languages.length > 0 ? languages.map(lang => (
                      <li key={lang.id} className="flex justify-between">
                        <span>{lang.name}</span>
                        <span className="text-slate-500">{lang.level}</span>
                      </li>
                    )) : <li><p>{t.previewLang} - {t.previewProficiency}</p></li>}
                  </ul>
            </Section>
        </div>
      </main>
    </div>
  );
};


// ============== Creative Template ==============
const CreativeTemplate: React.FC<TemplateProps> = ({ id, data, t, fontFamily, textAlign, accentColor }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  const fontClass = getFontClass(fontFamily);
  const textAlignClass = getTextAlignClass(textAlign);
  const headerTextColor = getTextColorForBackground(accentColor);

  const MainSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
      <div className="mb-8">
          <h3 className="text-2xl font-bold pb-2 mb-4 uppercase tracking-wider" style={{color: accentColor}}>{title}</h3>
          <div style={{height: '3px', width: '60px', backgroundColor: accentColor, marginBottom: '1rem'}}></div>
          {children}
      </div>
  );

  const SidebarSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
      <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 border-b-2 border-slate-300 pb-2 mb-4 uppercase tracking-wider">{title}</h3>
          {children}
      </div>
  );

  return (
    <div id={id} className={`w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden ${fontClass}`}>
      <header className="p-8 flex flex-col sm:flex-row items-center gap-8" style={{ backgroundColor: accentColor, color: headerTextColor }}>
          {personalInfo.photo && (
              <img src={personalInfo.photo} alt="Profile" className="rounded-full w-36 h-36 object-cover border-4 flex-shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }} />
          )}
          <div className="text-center sm:text-left">
              <h1 className="text-5xl font-bold tracking-tight">{personalInfo.name || t.yourName}</h1>
              <h2 className="text-2xl font-light tracking-wide mt-1">{personalInfo.title || t.yourTitle}</h2>
          </div>
      </header>

      <div className="flex flex-col md:flex-row">
          <main className="w-full md:w-2/3 p-8">
              <MainSection title={t.profile}>
                <p className={`text-slate-600 text-sm leading-relaxed ${textAlignClass}`}>{summary || t.previewSummary}</p>
              </MainSection>
              <MainSection title={t.experience}>
                  <div className="space-y-6">
                    {experience.length > 0 ? experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-lg font-semibold text-slate-800">{exp.title || t.previewJobTitle}</h4>
                          <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md font-medium mb-2" style={{ color: accentColor }}>{exp.company || t.previewCompany}</p>
                        <p className={`text-slate-600 text-sm leading-relaxed whitespace-pre-wrap ${textAlignClass}`}>{exp.description || t.previewDescription}</p>
                      </div>
                    )) : <div>...</div>}
                  </div>
              </MainSection>
              <MainSection title={t.education}>
                 <div className="space-y-4">
                    {education.length > 0 ? education.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-lg font-semibold text-slate-800">{edu.degree || t.previewDegree}</h4>
                          <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-md font-medium" style={{ color: accentColor }}>{edu.institution || t.previewInstitution}</p>
                      </div>
                    )) : <div>...</div>}
                  </div>
              </MainSection>
          </main>
          <aside className="w-full md:w-1/3 p-8 bg-slate-100">
              <SidebarSection title={t.contact}>
                 <ul className="space-y-3 text-slate-700 text-sm">
                    <li className="flex items-center"><EnvelopeIcon className="w-5 h-5 mr-3" style={{color: accentColor}} /><span>{personalInfo.email || t.previewEmail}</span></li>
                    <li className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3" style={{color: accentColor}} /><span>{personalInfo.phone || t.previewPhone}</span></li>
                    <li className="flex items-center"><MapPinIcon className="w-5 h-5 mr-3" style={{color: accentColor}} /><span>{personalInfo.location || t.previewLocation}</span></li>
                    <li className="flex items-center"><GlobeAltIcon className="w-5 h-5 mr-3" style={{color: accentColor}} /><span>{personalInfo.website || t.previewWebsite}</span></li>
                  </ul>
              </SidebarSection>
              <SidebarSection title={t.skills}>
                <ul className="space-y-2 text-sm">
                  {skills.length > 0 ? skills.map(skill => (
                    <li key={skill.id} className="text-slate-700">{skill.name}</li>
                  )) : <li>{t.previewSkill}</li>}
                </ul>
              </SidebarSection>
              <SidebarSection title={t.languages}>
                <ul className="space-y-2 text-sm">
                  {languages.length > 0 ? languages.map(lang => (
                    <li key={lang.id}>
                      <p className="font-semibold">{lang.name}</p>
                      <p className="text-slate-500">{lang.level}</p>
                    </li>
                  )) : <li><p className="font-semibold">{t.previewLang}</p><p className="text-slate-500">{t.previewProficiency}</p></li>}
                </ul>
              </SidebarSection>
          </aside>
      </div>
    </div>
  );
};


const CVPreview: React.FC<CVPreviewProps> = ({ id = "cv-preview", data, template, t, fontFamily, textAlign, accentColor }) => {
  const props = { id, data, t, fontFamily, textAlign, accentColor };
  switch (template) {
    case 'classic':
      return <ClassicTemplate {...props} />;
    case 'creative':
      return <CreativeTemplate {...props} />;
    case 'modern':
    default:
      return <ModernTemplate {...props} />;
  }
};

export default CVPreview;