import React, { useRef, useEffect, useState } from 'react';
import type { Translations } from '../translations';
import type { LanguageKey } from '../types';
import LayoutTemplateIcon from './icons/LayoutTemplateIcon';
import SparklesIcon from './icons/SparklesIcon';
import EyeIcon from './icons/EyeIcon';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';

interface LandingPageProps {
  onStartBuilding: () => void;
  t: Translations;
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
}

const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, options);
    return () => observer.current?.disconnect();
  }, [options]);

  const observe = (element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  };

  return { observe, entries };
};

// Moved LanguageSwitcher outside the component for better performance and to prevent re-creation on every render.
interface LanguageSwitcherProps {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => (
    <div className="flex items-center text-sm bg-blue-500 p-0.5 rounded-full">
      <button 
        onClick={() => setLanguage('en')} 
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${language === 'en' ? 'bg-white text-blue-600' : 'bg-transparent text-white hover:bg-white/20'}`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('es')} 
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${language === 'es' ? 'bg-white text-blue-600' : 'bg-transparent text-white hover:bg-white/20'}`}
        aria-pressed={language === 'es'}
      >
        ES
      </button>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onStartBuilding, t, language, setLanguage }) => {
  const { observe, entries } = useIntersectionObserver({ threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  const animatedElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    animatedElementsRef.current.forEach(el => observe(el));
  }, [observe]);
  
  useEffect(() => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-section');
      }
    });
  }, [entries]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !animatedElementsRef.current.includes(el)) {
        animatedElementsRef.current.push(el);
    }
  };
  
  // Added a click handler for smooth scrolling navigation.
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-700">
      <header className="bg-blue-600 text-white sticky top-0 z-20 shadow-lg">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.headerTitle}</h1>
          <div className="flex items-center gap-6">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <div className="hidden md:flex items-center gap-6">
                <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-blue-200 transition">{t.featuresTitle.replace(/[?¿]/g, '')}</a>
                <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="hover:text-blue-200 transition">{t.howItWorksTitle}</a>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white pt-20 pb-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-extrabold mb-4 animate-fade-in-down">{t.heroTitle}</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8 animate-fade-in-up">{t.heroSubtitle}</p>
          <button onClick={onStartBuilding} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transform hover:scale-105 transition-all duration-300 shadow-xl text-lg">
            {t.heroCTA}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={addToRefs} className="py-20 bg-slate-50 opacity-0">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-12">{t.featuresTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 inline-block mb-4">
                <LayoutTemplateIcon className="w-8 h-8"/>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature1Title}</h4>
              <p className="text-slate-600">{t.feature1Desc}</p>
            </div>
             <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 text-purple-600 rounded-full p-4 inline-block mb-4">
                <SparklesIcon className="w-8 h-8"/>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature4Title}</h4>
              <p className="text-slate-600">{t.feature4Desc}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-green-100 text-green-600 rounded-full p-4 inline-block mb-4">
                <EyeIcon className="w-8 h-8"/>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature3Title}</h4>
              <p className="text-slate-600">{t.feature3Desc}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 text-orange-600 rounded-full p-4 inline-block mb-4">
                <ArrowDownTrayIcon className="w-8 h-8"/>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.step3Title}</h4>
              <p className="text-slate-600">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" ref={addToRefs} className="py-20 opacity-0">
         <div className="container mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-16">{t.howItWorksTitle}</h3>
            <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-300"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 border-4 border-white">1</div>
                        <h4 className="text-xl font-semibold mb-2">{t.step1Title}</h4>
                        <p className="text-slate-600">{t.step1Desc}</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 border-4 border-white">2</div>
                        <h4 className="text-xl font-semibold mb-2">{t.step2Title}</h4>
                        <p className="text-slate-600">{t.step2Desc}</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 border-4 border-white">3</div>
                        <h4 className="text-xl font-semibold mb-2">{t.step3Title}</h4>
                        <p className="text-slate-600">{t.step3Desc}</p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Template Showcase */}
      <section ref={addToRefs} className="py-20 bg-slate-50 opacity-0">
          <div className="container mx-auto px-6 text-center">
              <h3 className="text-4xl font-bold mb-12">{t.templatesTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:-translate-y-2">
                      <img src="https://i.imgur.com/kLOU9MN.png" alt="Modern Template" className="rounded-md mb-4" />
                      <h4 className="text-xl font-semibold">{t.templateModern}</h4>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:-translate-y-2">
                      <img src="https://i.imgur.com/XR0MBpJ.png" alt="Classic Template" className="rounded-md mb-4" />
                      <h4 className="text-xl font-semibold">{t.templateClassic}</h4>
                  </div>
                   <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:-translate-y-2">
                      <img src="https://i.imgur.com/roFeE5X.png" alt="Creative Template" className="rounded-md mb-4" />
                      <h4 className="text-xl font-semibold">{t.templateCreative}</h4>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:-translate-y-2">
                      <img src="https://i.imgur.com/YJtQvLw.png" alt="Professional Template" className="rounded-md mb-4" />
                      <h4 className="text-xl font-semibold">{t.templateProfessional}</h4>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Final CTA */}
      <section ref={addToRefs} className="py-20 bg-blue-600 text-white text-center opacity-0">
          <div className="container mx-auto px-6">
              <h3 className="text-4xl font-bold mb-4">{t.finalCTATitle}</h3>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">{t.finalCTADesc}</p>
              <button onClick={onStartBuilding} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transform hover:scale-105 transition-all duration-300 shadow-xl text-lg">
                  {t.heroCTA}
              </button>
          </div>
      </section>
      
      <footer className="py-6 bg-slate-800 text-slate-400 text-center text-sm">
          <p>{t.footerText}</p>
      </footer>
    </div>
  );
};

export default LandingPage;