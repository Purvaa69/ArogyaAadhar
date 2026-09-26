import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LanguageToggle from '../../components/LanguageToggle';

export default function ScamQuizLanding({ onNavigate, onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();

  useEffect(() => {
    speak(t('voiceRedFlagLanding'));
  }, []);

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="top-bar-title">{t('redFlagTitle')}</span>
        <LanguageToggle />
      </div>

      <div style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 20 }}>{t('chooseActivity')}</h3>
        <div className="flex flex-col gap-md">
          <div className="card" onClick={() => onNavigate('whatsappSim')} style={{ cursor: 'pointer', border: '2px solid var(--primary)', borderRadius: 16 }}>
            <div className="flex items-center gap-md">
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h4>{t('quizSection')}</h4>
                <p className="text-xs text-muted">{t('quizSectionDesc')}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>

          {/* Let me scam you */}
          <div className="card" onClick={() => onNavigate('letMeScamYou')} style={{ cursor: 'pointer', border: '2px solid #DC2626', borderRadius: 16, background: 'linear-gradient(135deg, #FFF5F5, #FEE2E2)' }}>
            <div className="flex items-center gap-md">
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h4 style={{ color: '#DC2626' }}>{t('letMeScamYou')}</h4>
                <p className="text-xs text-muted">{t('letMeScamYouDesc')}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
