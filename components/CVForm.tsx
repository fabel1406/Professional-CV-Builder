import React from 'react';
import type { CVData, Experience, Education, Skill, Language } from '../types';
import type { Translations } from '../translations';
import TrashIcon from './icons/TrashIcon';

interface CVFormProps {
  data: CVData;
  onUpdate: (newData: CVData) => void;
  t: Translations;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string, type?: string, name?:string }> = ({ label, value, onChange, placeholder, type="text", name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
  </div>
);


const CVForm: React.FC<CVFormProps> = ({ data, onUpdate, t }) => {

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({
          ...data,
          personalInfo: { ...data.personalInfo, photo: event.target?.result as string },
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...data, summary: e.target.value });
  };
  
  const handleDynamicChange = <T extends Experience | Education | Skill | Language>(
    section: keyof CVData,
    index: number,
    field: keyof T,
    value: string
  ) => {
      const sectionData = data[section] as T[];
      const updatedItems = sectionData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      onUpdate({ ...data, [section]: updatedItems });
  };

  const addDynamicItem = <T,>(section: keyof CVData, newItem: T) => {
    const sectionData = data[section] as T[];
    onUpdate({ ...data, [section]: [...sectionData, newItem] });
  };
  
  const removeDynamicItem = (section: keyof CVData, index: number) => {
    const sectionData = data[section] as any[];
    onUpdate({ ...data, [section]: sectionData.filter((_, i) => i !== index) });
  };

  const renderSectionHeader = (title: string, onAdd: () => void) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
      <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm">+ {t.add}</button>
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="border-b border-slate-200 pb-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{t.personalInfo}</h3>
        <InputField label={t.fullName} name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} placeholder={t.fullNamePlaceholder} />
        <InputField label={t.professionalTitle} name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} placeholder={t.professionalTitlePlaceholder} />
        <InputField label={t.email} name="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} placeholder={t.emailPlaceholder} type="email" />
        <InputField label={t.phone} name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder={t.phonePlaceholder} type="tel" />
        <InputField label={t.location} name="location" value={data.personalInfo.location} onChange={handlePersonalInfoChange} placeholder={t.locationPlaceholder} />
        <InputField label={t.website} name="website" value={data.personalInfo.website} onChange={handlePersonalInfoChange} placeholder={t.websitePlaceholder} />
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t.photo}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>
      
      <div className="border-b border-slate-200 pb-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">{t.summary}</h3>
        <TextAreaField label={t.summaryLabel} value={data.summary} onChange={handleSummaryChange} placeholder={t.summaryPlaceholder}/>
      </div>
      
      <div className="border-b border-slate-200 pb-6 mb-6">
        {renderSectionHeader(t.experience, () => addDynamicItem('experience', { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' }))}
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 border border-slate-200 rounded-md mb-4 relative">
            <button onClick={() => removeDynamicItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
            <InputField label={t.jobTitle} value={exp.title} onChange={e => handleDynamicChange<Experience>('experience', index, 'title', e.target.value)} />
            <InputField label={t.company} value={exp.company} onChange={e => handleDynamicChange<Experience>('experience', index, 'company', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t.startDate} value={exp.startDate} onChange={e => handleDynamicChange<Experience>('experience', index, 'startDate', e.target.value)} placeholder={t.startDatePlaceholder} />
              <InputField label={t.endDate} value={exp.endDate} onChange={e => handleDynamicChange<Experience>('experience', index, 'endDate', e.target.value)} placeholder={t.endDatePlaceholder} />
            </div>
            <TextAreaField label={t.description} value={exp.description} onChange={e => handleDynamicChange<Experience>('experience', index, 'description', e.target.value)} placeholder={t.descriptionPlaceholder} />
          </div>
        ))}
      </div>
      
      <div className="border-b border-slate-200 pb-6 mb-6">
        {renderSectionHeader(t.education, () => addDynamicItem('education', { id: Date.now().toString(), degree: '', institution: '', startDate: '', endDate: '' }))}
        {data.education.map((edu, index) => (
           <div key={edu.id} className="p-4 border border-slate-200 rounded-md mb-4 relative">
            <button onClick={() => removeDynamicItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
            <InputField label={t.degree} value={edu.degree} onChange={e => handleDynamicChange<Education>('education', index, 'degree', e.target.value)} />
            <InputField label={t.institution} value={edu.institution} onChange={e => handleDynamicChange<Education>('education', index, 'institution', e.target.value)} />
             <div className="grid grid-cols-2 gap-4">
               <InputField label={t.startDate} value={edu.startDate} onChange={e => handleDynamicChange<Education>('education', index, 'startDate', e.target.value)} placeholder={t.eduStartDatePlaceholder} />
               <InputField label={t.endDate} value={edu.endDate} onChange={e => handleDynamicChange<Education>('education', index, 'endDate', e.target.value)} placeholder={t.eduEndDatePlaceholder} />
            </div>
          </div>
        ))}
      </div>
      
       <div className="border-b border-slate-200 pb-6 mb-6">
        {renderSectionHeader(t.skills, () => addDynamicItem('skills', { id: Date.now().toString(), name: '' }))}
        {data.skills.map((skill, index) => (
           <div key={skill.id} className="flex items-center gap-2 mb-2">
            <input type="text" value={skill.name} onChange={e => handleDynamicChange<Skill>('skills', index, 'name', e.target.value)} placeholder={t.skillPlaceholder} className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
            <button onClick={() => removeDynamicItem('skills', index)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-5 h-5"/></button>
          </div>
        ))}
      </div>

       <div className="pb-6 mb-6">
        {renderSectionHeader(t.languages, () => addDynamicItem('languages', { id: Date.now().toString(), name: '', level: '' }))}
        {data.languages.map((lang, index) => (
           <div key={lang.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center">
             <div className="md:col-span-2">
                <input type="text" value={lang.name} onChange={e => handleDynamicChange<Language>('languages', index, 'name', e.target.value)} placeholder={t.languageNamePlaceholder} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
             </div>
             <div className="flex items-center gap-2">
                 <input type="text" value={lang.level} onChange={e => handleDynamicChange<Language>('languages', index, 'level', e.target.value)} placeholder={t.languageLevelPlaceholder} className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
                <button onClick={() => removeDynamicItem('languages', index)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-5 h-5"/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVForm;
