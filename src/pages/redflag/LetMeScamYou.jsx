import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

// n8n webhook URL for scam simulation
const WEBHOOK_URL = 'https://hunter-18.app.n8n.cloud/webhook/send-scam-alert';

export default function LetMeScamYou({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    speak(t('voiceLetMeScamYou'));
  }, []);

  const isValidPhone = /^[6-9]\d{9}$/.test(phoneNumber);

  const handleActivate = async () => {
    if (!isValidPhone) return;
    if (!agreed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber}`,
          timestamp: new Date().toISOString(),
          source: 'ArogyaAadhar_ScamSim',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err.message === 'Failed to fetch'
          ? 'Network error. Please check your internet connection and try again.'
          : `Something went wrong: ${err.message}. Please try again later.`
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setPhoneNumber('');
    setErrorMsg('');
    setAgreed(false);
  };

  // ──── Success Screen ────
  if (status === 'success') {
    return (
      <div className="page" style={{ paddingBottom: 80, animation: 'fadeSlideUp 0.35s ease' }}>
        <div className="top-bar">
          <button className="back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span className="top-bar-title">{t('scamSentTitle')}</span>
          <div style={{ width: 40 }}/>
        </div>

        <div style={{ padding: 20, textAlign: 'center', marginTop: 30 }}>
          {/* Animated checkmark */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
            animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h2 style={{ marginBottom: 8 }}>{t('scamMsgSent')}</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            {t('scamSentDesc')} <strong>+91 {phoneNumber}</strong>. 
            {t('scamSentInstruction')}
          </p>

          <div style={{
            background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
            border: '2px solid #F59E0B',
            borderRadius: 16, padding: 20, textAlign: 'left', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <h4 style={{ color: '#92400E' }}>{t('whatToExpect')}</h4>
            </div>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#78350F', lineHeight: 2 }}>
              <li>{t('expect1')}</li>
              <li>{t('expect2')}</li>
              <li>{t('expect3')}</li>
              <li>{t('expect4')}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-sm">
            <button className="btn btn-teal btn-full" onClick={onBack}>
              {t('backToScamsMenu')}
            </button>
            <button className="btn btn-ghost btn-full" onClick={handleReset}>
              {t('tryAnotherNumber')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──── Main Screen ────
  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="top-bar-title" style={{ color: '#DC2626' }}>{t('letMeScamYou')}</span>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ padding: 20 }}>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 50%, #EF4444 100%)',
          borderRadius: 20, padding: 24, marginBottom: 24,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: 120 }}>🕵️</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎭</div>
            <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>{t('scamSimTitle')}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7 }}>
              {t('scamSimDesc')}
            </p>
          </div>
        </div>

        {/* How it works — Step-by-step Instructions */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              width: 28, height: 28, borderRadius: '50%', 
              background: 'var(--primary-bg)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontSize: 14 
            }}>📋</span>
            {t('howItWorks')}
          </h4>

          {[
            {
              step: 1,
              icon: '📱',
              title: t('step1Title'),
              desc: t('step1Desc'),
              color: '#4A7FF8',
              bg: '#EEF3FF',
            },
            {
              step: 2,
              icon: '🤖',
              title: t('step2Title'),
              desc: t('step2Desc'),
              color: '#DC2626',
              bg: '#FEE2E2',
            },
            {
              step: 3,
              icon: '💬',
              title: t('step3Title'),
              desc: t('step3Desc'),
              color: '#22C55E',
              bg: '#DCFCE7',
            },
            {
              step: 4,
              icon: '🛡️',
              title: t('step4Title'),
              desc: t('step4Desc'),
              color: '#7C6CF8',
              bg: '#F0EFFF',
            },
          ].map(({ step, icon, title, desc, color, bg }) => (
            <div key={step} style={{
              display: 'flex', gap: 14, marginBottom: 14,
              animation: `fadeSlideUp ${0.2 + step * 0.1}s ease`,
            }}>
              <div style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: 14,
                background: bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20,
                border: `2px solid ${color}20`,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 2 }}>
                  {t('step').toUpperCase()} {step}
                </div>
                <h4 style={{ fontSize: 15, marginBottom: 2 }}>{title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div style={{
          background: 'linear-gradient(135deg, #EEF3FF, #E0E7FF)',
          border: '2px solid var(--primary)',
          borderRadius: 16, padding: 16, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
            <div>
              <p style={{ fontSize: 13, color: 'var(--primary-deep)', fontWeight: 600, marginBottom: 4 }}>
                {t('importantInfo')}
              </p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                {t('importantInfoDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Phone Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6, display: 'block' }}>
            {t('whatsappNumber')}
          </label>
          <div className="phone-input-wrapper">
            <div className="phone-prefix">🇮🇳 +91</div>
            <input
              className="phone-input"
              type="tel"
              maxLength={10}
              placeholder={t('enterPhoneNumber')}
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              disabled={status === 'loading'}
            />
          </div>
          {phoneNumber.length > 0 && !isValidPhone && (
            <p style={{ color: '#DC2626', fontSize: 13, marginTop: 6 }}>
              {t('invalidPhone')}
            </p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div 
          style={{ 
            display: 'flex', gap: 12, alignItems: 'flex-start', 
            marginBottom: 24, cursor: 'pointer',
            padding: 14, borderRadius: 14,
            background: agreed ? '#F0FDF4' : 'var(--surface)',
            border: `2px solid ${agreed ? '#22C55E' : 'var(--border)'}`,
            transition: 'all 0.25s ease',
          }}
          onClick={() => setStatus('idle') || setAgreed(!agreed)}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            border: `2px solid ${agreed ? '#22C55E' : '#D1D5DB'}`,
            background: agreed ? '#22C55E' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', marginTop: 1,
          }}>
            {agreed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t('consentText')}
          </p>
        </div>

        {/* Error Display */}
        {status === 'error' && (
          <div style={{
            background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: 14,
            padding: 16, marginBottom: 20,
            animation: 'fadeSlideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>❌</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>
                  {t('failedToSend')}
                </p>
                <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5 }}>
                  {errorMsg}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Activate Button */}
        <button
          className="btn btn-full"
          onClick={handleActivate}
          disabled={!isValidPhone || !agreed || status === 'loading'}
          style={{
            background: (!isValidPhone || !agreed || status === 'loading')
              ? '#D1D5DB'
              : 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            color: 'white',
            boxShadow: (!isValidPhone || !agreed || status === 'loading')
              ? 'none'
              : '0 6px 28px rgba(220, 38, 38, 0.35)',
            fontSize: 17, fontWeight: 700, padding: '16px 24px',
            borderRadius: 16, border: 'none',
            cursor: (!isValidPhone || !agreed || status === 'loading') ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {status === 'loading' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}/>
              {t('sendingScamMsg')}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {t('activateScamAgent')}
            </div>
          )}
        </button>

        {status !== 'loading' && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 12 }}>
            {t('msgWillBeSent')}
          </p>
        )}
      </div>
    </div>
  );
}
