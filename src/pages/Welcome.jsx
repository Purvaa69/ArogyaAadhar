import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import AppLogo from '../components/AppLogo';

export default function Welcome({ onNext }) {
  const { t } = useLanguage();
  const { speak } = useVoice();

  React.useEffect(() => {
    speak(t('tagline'));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Background photo layer */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/welcome_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(1px) brightness(0.7)',
        transform: 'scale(1.05)',
      }} />

      {/* Gradient overlay: teal → blue → purple */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,188,180,0.72) 0%, rgba(74,127,248,0.68) 45%, rgba(130,80,230,0.75) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 28px 36px', width: '100%' }}>

        {/* Circular Logo */}
        <div style={{
          width: 180, height: 180,
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          padding: 8,
          gap: 2,
          opacity: 0.7,
        }}>
          {/* Shield Logo SVG */}
          <svg viewBox="0 0 80 72" width="64" height="58">
            {/* Shield body */}
            <path d="M40 4 L70 16 L70 40 C70 56 56 68 40 72 C24 68 10 56 10 40 L10 16 Z"
              fill="none" stroke="#0F766E" strokeWidth="2" />
            {/* Indian flag tricolor horizontal lines */}
            <path d="M18 28 L62 28" stroke="#FF9933" strokeWidth="4" strokeLinecap="round" />
            <path d="M18 36 L62 36" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M18 44 L62 44" stroke="#138808" strokeWidth="4" strokeLinecap="round" />
            {/* Center Ashoka chakra small */}
            <circle cx="40" cy="36" r="5" fill="none" stroke="#000080" strokeWidth="1.2" />
            {/* Medical cross overlay */}
            <rect x="36" y="20" width="8" height="32" rx="2" fill="rgba(15,118,110,0.25)" />
            <rect x="24" y="32" width="32" height="8" rx="2" fill="rgba(15,118,110,0.25)" />
            {/* Stethoscope top arc */}
            <path d="M25 12 Q40 6 55 12" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="14" r="3" fill="#0F766E" />
            <circle cx="58" cy="14" r="3" fill="#0F766E" />
            {/* Hands at bottom */}
            <path d="M22 60 Q30 68 40 70 Q50 68 58 60" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* App name inside logo — using AppLogo sm */}
          <AppLogo size="sm" style={{ alignItems: 'center' }} />
        </div>

        {/* App name below logo — white on gradient background */}
        <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{
                fontSize: 32, fontWeight: 800, color: 'white',
                fontFamily: 'var(--font-body)', letterSpacing: -0.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>Arogya</span>
              <span style={{
                fontSize: 32, fontWeight: 800, color: 'rgba(255,220,150,1)',
                fontFamily: 'var(--font-body)', letterSpacing: -0.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>Aadhar</span>
            </div>
            {/* ECG underline in white */}
            <svg width="200" height="14" viewBox="0 0 200 14" style={{ marginTop: 2 }}>
              <polyline
                points="0,7 60,7 76,3 88,14 100,0 112,14 124,7 140,7 200,7"
                fill="none" stroke="rgba(255,220,150,0.9)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.92)',
          marginBottom: 32, lineHeight: 1.5,
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}>
          {t('tagline')}
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.5)',
            fontSize: 14, fontWeight: 600, color: 'white',
            backdropFilter: 'blur(8px)',
            cursor: 'default',
            minWidth: 200,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {t('pillAbha')}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.5)',
            fontSize: 14, fontWeight: 600, color: 'white',
            backdropFilter: 'blur(8px)',
            cursor: 'default',
            minWidth: 200,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {t('pillScam')}
          </div>
        </div>

        {/* CTA Button - Amber/Orange */}
        <button
          onClick={onNext}
          style={{
            width: '100%', maxWidth: 320,
            padding: '16px 32px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
            color: 'white', fontWeight: 700, fontSize: 17,
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 20px rgba(255,152,0,0.4)',
            transition: 'all 0.25s ease',
            letterSpacing: 0.2,
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {t('getStarted')}
        </button>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 20 }}>
          {t('langAvailable')}
        </p>
      </div>
    </div>
  );
}
