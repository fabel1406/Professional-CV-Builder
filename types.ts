// FIX: Define all necessary types for the application.
export type Template = 'modern' | 'classic' | 'creative' | 'professional';
export type FontFamily = 'Arial' | 'Calibri' | 'Courier New' | 'DejaVu Sans' | 'Garamond' | 'Georgia' | 'Helvetica' | 'Lato' | 'Noto Sans' | 'Noto Serif' | 'Poppins' | 'Times New Roman' | 'Trebuchet MS';
export type TextAlign = 'left' | 'center' | 'justify';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LanguageKey = 'en' | 'es';
export type ReorderableSection = 'experience' | 'education' | 'courses';

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id:string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  courses: Course[];
  skills: Skill[];
  languages: Language[];
}