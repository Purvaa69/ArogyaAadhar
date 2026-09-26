import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import AbhaChatbot from './AbhaChatbot';

const videos = [
  {
    id: 'jt_dHJNQqX8',
    lang: 'हिंदी',
    flag: '🇮🇳',
    title: 'ABHA बनाएं — हिंदी गाइड',
    desc: 'Step-by-step guide in Hindi',
    color: '#FF9933',
  },
  {
    id: 'dw6qSD8AaxQ',
    lang: 'English',
    flag: '🌐',
    title: 'How to Create ABHA Number',
    desc: 'Official English tutorial',
    color: '#4A7FF8',
  },
  {
    id: '6T-o3dyHx7s',
    lang: 'What is ABHA?',
    flag: '🏥',
    title: 'What is ABHA Health ID?',
    desc: 'Explained in simple terms',
    color: '#0F8F82',
  },
];

export default function SandboxLanding({ onNavigate, onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [showChatbot, setShowChatbot] = useState(false);

  React.useEffect(() => {
    speak(t('voiceSandboxLanding'));
  }, []);

  const openYouTube = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="top-bar-title">{t('createAbha')}</span>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Section: Start */}
        <h3 style={{ marginBottom: 4, marginTop: 8 }}>{t('nextSteps')}</h3>
        <p className="text-sm text-muted" style={{ marginBottom: 16 }}>{t('chooseHowToLearn')}</p>
        <div className="flex flex-col gap-md" style={{ marginBottom: 28 }}>

          <div className="card" onClick={() => onNavigate('sandboxSim')} style={{ cursor: 'pointer', border: '2px solid var(--primary)', borderRadius: 16 }}>
            <div className="flex items-center gap-md">
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h4>{t('interactiveSim')}</h4>
                <p className="text-xs text-muted">{t('interactiveSimDesc')}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Section: Learning Videos */}
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <h3 style={{ margin: 0 }}>{t('learningVideos')}</h3>
        </div>
        <p className="text-sm text-muted" style={{ marginBottom: 16 }}>{t('watchTutorials')}</p>

        <div className="flex flex-col gap-md">
          {videos.map(v => (
            <div
              key={v.id}
              onClick={() => openYouTube(v.id)}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 3px 14px rgba(0,0,0,0.12)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,0.12)';
              }}
            >
              {/* Thumbnail area */}
              <div style={{
                position: 'relative',
                background: `linear-gradient(135deg, ${v.color}22 0%, ${v.color}44 100%)`,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* YouTube thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute',
                  width: 48, height: 48,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.65)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                {/* Language badge */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: v.color,
                  color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 20,
                }}>
                  {v.flag} {v.lang}
                </div>
              </div>
              {/* Info row */}
              <div style={{ padding: '10px 14px', background: 'white' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#202020', marginBottom: 2 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B' }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Chatbot trigger — bottom right */}
      {!showChatbot && (
        <div
          onClick={() => setShowChatbot(true)}
          style={{
            position: 'fixed', bottom: 80, right: 20,
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(74,127,248,0.4)',
            cursor: 'pointer', zIndex: 100,
            animation: 'pulse 2s infinite',
          }}
          title="Ask ABHA Assistant"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      )}

      {showChatbot && <AbhaChatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
}
