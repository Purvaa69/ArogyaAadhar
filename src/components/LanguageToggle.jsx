import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, changeLang } = useLanguage();
  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
    { code: 'mr', label: 'मरा' },
  ];

  return (
    <div className="lang-toggle">
      {langs.map(l => (
        <button
          key={l.code}
          className={`lang-option ${lang === l.code ? 'active' : ''}`}
          onClick={() => changeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
