import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import LanguageToggle from '../components/LanguageToggle';
import AppLogo from '../components/AppLogo';

export default function Home({ user, onNavigate }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  React.useEffect(() => {
    speak(t('voiceHome'));
  }, []);

  const modules = [
    {
      id: 'sandbox',
      title: t('createAbha'),
      desc: t('createAbhaDesc'),
      image: '/module_abha.png',
    },
    {
      id: 'explorer',
      title: t('ayushmanSchemes'),
      desc: t('ayushmanDesc'),
      image: '/module_ayushman.png',
    },
    {
      id: 'redflag',
      title: t('redFlagDetector'),
      desc: t('redFlagDesc'),
      image: '/module_redflag.png',
    },
    {
      id: 'community',
      title: t('communitySiren'),
      desc: t('communityDesc'),
      image: '/module_community.png',
    },
  ];

  return (
    <div style={{ paddingBottom: 90, background: '#F4F6FB', minHeight: '100vh' }}>

      {/* Top Bar with Text Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'white',
        borderBottom: '1px solid #EDEBE8',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h1 style={{
          fontSize: 26, fontWeight: 900,
          fontFamily: 'var(--font-body)',
          letterSpacing: -0.5,
          lineHeight: 1,
          margin: 0,
        }}>
          <span style={{ color: '#000000ff' }}>Arogya</span>{' '}
          <span style={{ color: '#000000ff' }}>Aadhar</span>
        </h1>
        <LanguageToggle />
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* Welcome Card — Image */}
        <img
          src="/finall.png"
          alt="Welcome"
          style={{
            width: 'calc(120% + 32px)',
            marginTop: -60,
            marginLeft: -55,
            marginRight: -58,
            marginBottom: 10,
            display: 'block',
          }}
        />

        {/* Section Title */}
        <h2 style={{
          fontSize: 26, fontWeight: 800,
          color: '#000000ff',
          marginBottom: 14,
          marginTop: -80,
          letterSpacing: -0.3,
        }}>
          {t('exploreHealthcare')}
        </h2>

        {/* Module Grid — Photo cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 24,
        }}>
          {modules.map(mod => (
            <div
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                height: 195,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
            >
              {/* Background photo */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${mod.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              {/* Dark gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(20,40,90,0.35) 0%, rgba(20,40,90,0.82) 100%)',
              }} />
              {/* Text */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: 4 }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35, fontWeight: 600 }}>
                  {mod.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scam Alert Card — moved below Healthcare */}
        <div style={{
          background: '#FFF5F5',
          borderRadius: 18,
          padding: '16px 18px',
          marginBottom: 16,
          border: '1px solid rgba(220,38,38,0.15)',
          boxShadow: '0 2px 10px rgba(220,38,38,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {/* Warning triangle */}
            <div style={{
              width: 32, height: 32,
              borderRadius: 8,
              background: '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626" stroke="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: '#DC2626', fontSize: 15 }}>
              {t('todayScamAlert')}
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#202020', lineHeight: 1.5, marginBottom: 12 }}>
            {t('scamAlertText')}
          </p>
          <button
            onClick={() => onNavigate('community')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '8px 16px',
              borderRadius: '100px',
              background: 'transparent',
              border: '1.5px solid #DC2626',
              color: '#DC2626', fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('seeAllWarnings')} →
          </button>
        </div>
      </div>
    </div>
  );
}
