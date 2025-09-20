import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import CVBuilder from './components/CVBuilder';
import { translations } from './translations';
import type { LanguageKey } from './types';

function App() {
  const [view, setView] = useState<'landing' | 'builder'>('landing');
  const [language, setLanguage] = useState<LanguageKey>('en');

  const handleStartBuilding = useCallback(() => {
    setView('builder');
  }, []);

  const handleGoBack = useCallback(() => {
    setView('landing');
  }, []);

  const handleSetLanguage = useCallback((lang: LanguageKey) => {
    setLanguage(lang);
  }, []);
  
  const t = translations[language];

  const commonProps = {
    t,
    language,
    setLanguage: handleSetLanguage,
  };

  return (
    <div className="App bg-slate-100 min-h-screen">
      {view === 'landing' ? (
        <LandingPage onStartBuilding={handleStartBuilding} {...commonProps} />
      ) : (
        <CVBuilder onGoBack={handleGoBack} {...commonProps} />
      )}
    </div>
  );
}

export default App;