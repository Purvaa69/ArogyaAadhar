import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import BottomNav from './components/BottomNav';
import VoiceAssistButton from './components/VoiceAssistButton';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import SandboxLearning from './pages/sandbox/SandboxLearning';
import SandboxLanding from './pages/sandbox/SandboxLanding';
import SandboxSimulation from './pages/sandbox/SandboxSimulation';
import ExplorerLearning from './pages/explorer/ExplorerLearning';
import CriteriaInfo from './pages/explorer/CriteriaInfo';
import EligibilityCheck from './pages/explorer/EligibilityCheck';
import HospitalFinder from './pages/explorer/HospitalFinder';
import RedFlagDetector from './pages/redflag/RedFlagDetector';
import ScamQuizLanding from './pages/redflag/ScamQuizLanding';
import ScamQuiz from './pages/redflag/ScamQuiz';
import LetMeScamYou from './pages/redflag/LetMeScamYou';
import CommunitySiren from './pages/community/CommunitySiren';

function AppContent() {
  const [screen, setScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const { t } = useLanguage();

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen('home');
  };

  const handleNavigate = (target) => {
    setScreen(target);
    if (['home', 'learn', 'scams', 'alerts'].includes(target)) {
      setActiveNav(target);
    }
  };

  const navMap = {
    home: 'home',
    learn: 'sandboxLanding',
    scams: 'redflag',
    alerts: 'community',
  };

  const handleNavClick = (id) => {
    setActiveNav(id);
    setScreen(navMap[id] || id);
  };

  const showNav = !['welcome', 'login'].includes(screen);
  const showVoice = !['welcome'].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <Welcome onNext={() => setScreen('login')} />;
      case 'login':
        return <Login onLogin={handleLogin} onBack={() => setScreen('welcome')} />;
      case 'home':
        return <Home user={user} onNavigate={handleNavigate} />;

      // Sandbox Module
      case 'sandbox':
      case 'sandboxLearn':
        return <SandboxLearning onStartSim={() => setScreen('sandboxLanding')} onBack={() => setScreen('home')} />;
      case 'sandboxLanding':
        return <SandboxLanding onNavigate={setScreen} onBack={() => setScreen('home')} />;
      case 'sandboxSim':
        return <SandboxSimulation onBack={() => setScreen('sandboxLanding')} />;

      // Explorer Module
      case 'explorer':
        return <ExplorerLearning onStartSim={() => setScreen('explorerLanding')} onBack={() => setScreen('home')} />;
      case 'explorerLanding':
        return (
          <div className="page" style={{ padding: 0, paddingBottom: 80 }}>
            <div className="top-bar">
              <button className="back-btn" onClick={() => setScreen('home')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <span className="top-bar-title">{t('explorerLandingTitle')}</span>
              <div style={{ width: 40 }} />
            </div>
            <div style={{ padding: 20 }}>
              <div className="flex flex-col gap-md">
                <div className="card" onClick={() => setScreen('criteriaInfo')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('criteriaInfo')}</h4>
                      <p className="text-xs text-muted">{t('criteriaInfoDesc')}</p>
                    </div>
                  </div>
                </div>
                <div className="card" onClick={() => setScreen('video')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('learningVideosExplorer')}</h4>
                      <p className="text-xs text-muted">{t('learningVideosExplorerDesc')}</p>
                    </div>
                  </div>
                </div>
                <div className="card" onClick={() => setScreen('explorerSim')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('simulation')}</h4>
                      <p className="text-xs text-muted">{t('simulationDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'criteriaInfo':
        return <CriteriaInfo onBack={() => setScreen('explorerLanding')} />;
      case 'video':
        return (
          <div className="page" style={{ padding: 0, paddingBottom: 80 }}>
            <div className="top-bar">
              <button className="back-btn" onClick={() => setScreen('explorerLanding')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <span className="top-bar-title">{t('learningVideosExplorer')}</span>
              <div style={{ width: 40 }} />
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 8 }}>ABDM Scheme Explained</h3>
              <p className="text-sm text-muted" style={{ marginBottom: 20 }}>Watch this video to understand the Ayushman Bharat Digital Mission</p>
              <div
                onClick={() => window.open('https://youtu.be/3UV3oHKMKsk', '_blank')}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 3px 14px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #0F766E22 0%, #0F766E44 100%)',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src="https://img.youtube.com/vi/3UV3oHKMKsk/hqdefault.jpg"
                    alt="ABDM Scheme Video"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    width: 64, height: 64,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.65)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: '#0F766E',
                    color: 'white', fontSize: 12, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 20,
                  }}>
                    🏥 ABDM Scheme
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'white' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#202020', marginBottom: 4 }}>Ayushman Bharat Digital Mission (ABDM)</div>
                  <div style={{ fontSize: 13, color: '#6B6B6B' }}>Learn about India's digital health ecosystem</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'explorerSim':
        return (
          <div className="page" style={{ padding: 0, paddingBottom: 80 }}>
            <div className="top-bar">
              <button className="back-btn" onClick={() => setScreen('explorerLanding')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <span className="top-bar-title">{t('explorerSimTitle')}</span>
              <div style={{ width: 40 }} />
            </div>
            <div style={{ padding: 20 }}>
              <div className="flex flex-col gap-md">
                <div className="card" onClick={() => setScreen('eligibility')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('pmjayEligCheck')}</h4>
                      <p className="text-xs text-muted">{t('pmjayEligDesc')}</p>
                    </div>
                  </div>
                </div>
                <div className="card" onClick={() => setScreen('eligibility')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('linkAyushmanAbha')}</h4>
                      <p className="text-xs text-muted">{t('linkAyushmanAbhaDesc')}</p>
                    </div>
                  </div>
                </div>
                <div className="card" onClick={() => setScreen('hospital')} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-md">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--coral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4>{t('findPmjayHospital')}</h4>
                      <p className="text-xs text-muted">{t('findPmjayHospitalDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'eligibility':
        return <EligibilityCheck onBack={() => setScreen('explorerSim')} />;
      case 'hospital':
        return <HospitalFinder onBack={() => setScreen('explorerSim')} />;

      // Red Flag Module
      case 'redflag':
        return <ScamQuizLanding onNavigate={setScreen} onBack={() => setScreen('home')} />;
      case 'quiz':
        return <ScamQuiz onBack={() => setScreen('redflag')} />;
      case 'whatsappSim':
        return <RedFlagDetector onBack={() => setScreen('redflag')} />;
      case 'letMeScamYou':
        return <LetMeScamYou onBack={() => setScreen('redflag')} />;

      // Community Module
      case 'community':
        return <CommunitySiren onBack={() => setScreen('home')} />;

      default:
        return <Home user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-frame">
      {renderScreen()}
      {showNav && <BottomNav active={activeNav} onNavigate={handleNavClick} />}
      {showVoice && <VoiceAssistButton />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <AppContent />
      </VoiceProvider>
    </LanguageProvider>
  );
}
