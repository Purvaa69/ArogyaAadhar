import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import Toast from '../../components/Toast';

/* ── Guided Instructor Banner ─────────────────────────────── */
function GuidedBanner({ where, what, icon = '👆' }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #EEF3FF 0%, #E6EFFF 100%)',
      border: '1.5px solid rgba(74,127,248,0.3)',
      borderRadius: 14,
      padding: '12px 16px',
      marginBottom: 18,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#4A7FF8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 16,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#2D63D8', marginBottom: 2 }}>
          👀 {where}
        </p>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.45 }}>
          ✅ {what}
        </p>
      </div>
    </div>
  );
}

const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala', 'Andhra Pradesh'];

export default function EligibilityCheck({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [phase, setPhase] = useState('form'); // form | checking | result | linking | linkSuccess
  const [state, setState] = useState('');
  const [idType, setIdType] = useState('');
  const [mobile, setMobile] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isEligible, setIsEligible] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    speak(t('checkEligibility'));
  }, []);

  const handleCheck = () => {
    if (!state || !idType) return;
    setPhase('checking');
    speak(t('checking'));
    setTimeout(() => {
      setIsEligible(true);
      setPhase('result');
      speak(t('eligible'));
    }, 2500);
  };

  const handleLink = () => {
    setPhase('linking');
    speak(t('checking'));
    setTimeout(() => {
      setPhase('linkSuccess');
      speak(t('linkSuccess'));
    }, 2500);
  };

  return (
    <div className="page-sim">
      <div className="sim-browser-bar">
        <button className="back-btn" onClick={onBack} style={{ width: 32, height: 32 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="sim-url-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>pmjay.gov.in</span>
        </div>
        <span className="safe-mode-pill">🛡️ {t('safeMode')}</span>
      </div>
      <div style={{ background: '#FFFBEB', padding: '8px 16px', fontSize: 12, color: '#92400E', textAlign: 'center', borderBottom: '1px solid #FDE68A' }}>
        ℹ️ {t('safeNote')}
      </div>

      <div style={{ padding: 20 }}>
        {phase === 'form' && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="📋"
              where={t('eligFormWhere')}
              what={t('eligFormWhat')}
            />
            <h3 style={{ marginBottom: 20 }}>{t('checkEligibility')}</h3>
            <div className="flex flex-col gap-lg">
              <div className="input-group">
                <label className="input-label">{t('selectState')}</label>
                <select className="select-field" value={state} onChange={e => setState(e.target.value)}>
                  <option value="">-- Select --</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">{t('selectIdType')}</label>
                <div className="flex gap-sm flex-wrap">
                  {['aadhaarId', 'abhaId', 'rationCard'].map(id => (
                    <button key={id} className={`chip ${idType === id ? 'active' : ''}`} onClick={() => setIdType(id)}>
                      {t(id)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">{t('enterIdNumber')}</label>
                <input className="input-field" placeholder="Enter number" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">{t('enterMobile')}</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+91</span>
                  <input className="phone-input" placeholder="98765 43210" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" />
                </div>
              </div>
              <button className="btn btn-teal btn-full" onClick={handleCheck} disabled={!state || !idType} style={{ opacity: state && idType ? 1 : 0.5 }}>
                {t('checkNow')}
              </button>
            </div>
          </div>
        )}

        {phase === 'checking' && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease', textAlign: 'center', paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="shimmer" style={{ width: 32, height: 32, borderRadius: '50%' }}/>
            </div>
            <h3>{t('checking')}</h3>
            <div className="progress-bar-wrap" style={{ marginTop: 20, maxWidth: 200, margin: '20px auto' }}>
              <div className="progress-bar-fill" style={{ width: '70%', animation: 'shimmer 1.5s infinite' }}/>
            </div>
          </div>
        )}

        {phase === 'linking' && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease', textAlign: 'center', paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="shimmer" style={{ width: 32, height: 32, borderRadius: '50%' }}/>
            </div>
            <h3>{t('linkingCard')}</h3>
            <p className="text-sm text-muted" style={{ marginTop: 8 }}>{t('checking')}</p>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease', textAlign: 'center' }}>
            <GuidedBanner
              icon="🎉"
              where={t('eligResultWhere')}
              what={t('eligResultWhat')}
            />
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>{t('eligible')}</h2>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary)', marginBottom: 24 }}>{t('coverageAmount')}</p>
            
            <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
              <h4 style={{ marginBottom: 12 }}>{t('coverageDetails')}</h4>
              <div className="flex flex-col gap-sm">
                {[t('coverageCancer'), t('coverageHeart'), t('coverageKidney'), t('coverageChildbirth'), t('coverageICU'), t('coveragePrePost')].map(item => (
                  <div key={item} className="flex items-center gap-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--success)" stroke="none">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="9 12 11 14 15 10" fill="none" stroke="white" strokeWidth="2"/>
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-teal btn-full" style={{ marginBottom: 12 }} onClick={handleLink}>
              {t('linkCard')} →
            </button>
            <button className="btn btn-ghost btn-full" onClick={onBack}>
              {t('backToHome')}
            </button>
          </div>
        )}

        {phase === 'linkSuccess' && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease', textAlign: 'center' }}>
            <GuidedBanner
              icon="🏥"
              where={t('linkedWhere')}
              what={t('linkedWhat')}
            />
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>{t('linkSuccess')}</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 24 }}>{t('coverageAmount')}</p>

            {/* Linked Ayushman tile */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: 'white', textAlign: 'left', marginBottom: 16, border: 'none' }}>
              <div className="flex items-center gap-md" style={{ marginBottom: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Ayushman Bharat PM-JAY</p>
                  <p style={{ fontSize: 12, opacity: 0.8, color: 'white' }}>{t('linked')}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, opacity: 0.85, color: 'white' }}>{t('coverageUpTo')}</p>
            </div>

            <div className="card-amber" style={{ padding: 14, borderRadius: 'var(--radius)', marginBottom: 24 }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                💡 {t('showQr')}
              </p>
            </div>

            <button className="btn btn-ghost btn-full" onClick={onBack}>
              {t('backToHome')}
            </button>
          </div>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
