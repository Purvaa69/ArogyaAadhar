import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

export default function CriteriaInfo({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [tab, setTab] = useState('rural');

  useEffect(() => {
    speak(t('voiceCriteriaInfo'));
  }, []);

  return (
    <div className="page flex flex-col" style={{ paddingBottom: 40, animation: 'fadeSlideUp 0.35s ease' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">{t('criteriaInfo')}</span>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ padding: 16 }}>
        <h2 style={{ marginBottom: 20 }}>{t('criteriaInfoTitle')}</h2>

        <div className="flex gap-sm" style={{ marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
          <button 
            className={`chip ${tab === 'rural' ? 'active' : ''}`} 
            onClick={() => setTab('rural')}
            style={{ borderRadius: 'var(--radius)', padding: '8px 16px', fontWeight: 600 }}
          >
            {t('ruralBeneficiaries')}
          </button>
          <button 
            className={`chip ${tab === 'urban' ? 'active' : ''}`} 
            onClick={() => setTab('urban')}
            style={{ borderRadius: 'var(--radius)', padding: '8px 16px', fontWeight: 600 }}
          >
            {t('urbanBeneficiaries')}
          </button>
          <button 
            className={`chip ${tab === 'exclusion' ? 'active' : ''}`} 
            onClick={() => setTab('exclusion')}
            style={{ borderRadius: 'var(--radius)', padding: '8px 16px', fontWeight: 600 }}
          >
            {t('exclusion')}
          </button>
        </div>

        {tab === 'rural' && (
          <div className="card" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <h4 style={{ marginBottom: 12, color: 'var(--primary)' }}>{t('ruralTitle')}</h4>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: 'var(--text)' }}>
              <li>{t('rural1')}</li>
              <li>{t('rural2')}</li>
              <li>{t('rural3')}</li>
              <li>{t('rural4')}</li>
              <li>{t('rural5')}</li>
            </ul>
          </div>
        )}

        {tab === 'urban' && (
          <div className="card" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <h4 style={{ marginBottom: 12, color: '#0284C7' }}>{t('urbanTitle')}</h4>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: 'var(--text)' }}>
              <li>{t('urban1')}</li>
              <li>{t('urban2')}</li>
              <li>{t('urban3')}</li>
              <li>{t('urban4')}</li>
              <li>{t('urban5')}</li>
              <li>{t('urban6')}</li>
              <li>{t('urban7')}</li>
              <li>{t('urban8')}</li>
              <li>{t('urban9')}</li>
              <li>{t('urban10')}</li>
              <li>{t('urban11')}</li>
            </ul>
          </div>
        )}

        {tab === 'exclusion' && (
          <div className="card card-danger" style={{ animation: 'fadeSlideUp 0.3s ease', border: '1px solid var(--danger)' }}>
            <h4 style={{ marginBottom: 12, color: 'var(--danger)' }}>{t('exclusionTitle')}</h4>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: 'var(--text)' }}>
              <li>{t('excl1')}</li>
              <li>{t('excl2')}</li>
              <li>{t('excl3')}</li>
              <li>{t('excl4')}</li>
              <li>{t('excl5')}</li>
              <li>{t('excl6')}</li>
              <li>{t('excl7')}</li>
              <li>{t('excl8')}</li>
              <li>{t('excl9')}</li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
