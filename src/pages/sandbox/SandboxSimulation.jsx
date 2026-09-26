import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import Toast from '../../components/Toast';
import AbhaChatbot from './AbhaChatbot';

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

/* ── Input with glow highlight when active + styled hover tooltip ── */
function GuidedInput({ label, tooltip, value, onChange, readOnly, placeholder, style = {}, type = 'text', inputMode }) {
  const [focused, setFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <input
          className="input-field"
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...style,
            boxShadow: focused ? '0 0 0 3px rgba(74,127,248,0.25)' : undefined,
            border: focused ? '1.5px solid #4A7FF8' : undefined,
            transition: 'all 0.2s ease',
            background: readOnly ? 'var(--border-light)' : undefined,
            color: readOnly ? 'var(--text-muted)' : undefined,
          }}
        />
        {tooltip && (
          <div style={{
            position: 'absolute', top: '50%', right: 10,
            transform: 'translateY(-50%)',
            opacity: 0.45, cursor: 'help',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
        )}
        {/* Styled tooltip popup on hover */}
        {showTooltip && tooltip && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0, right: 0,
            background: '#1E293B',
            color: 'white',
            fontSize: 12,
            lineHeight: 1.5,
            padding: '10px 14px',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 50,
            animation: 'fadeSlideUp 0.2s ease',
          }}>
            {tooltip}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: 20,
              width: 12, height: 12,
              background: '#1E293B',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SandboxSimulation({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [screen, setScreen] = useState(0);
  const [aadhaar, setAadhaar] = useState('2345 6789 0123');
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSending, setOtpSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const otpRefs = useRef([]);

  const screens = [
    { title: t('createAbhaNumber'), voice: t('voiceSandboxSim0') },
    { title: t('chooseRegMethod'), voice: t('voiceSandboxSim1') },
    { title: t('enterAadhaar'), voice: t('voiceSandboxSim2') },
    { title: t('enterOtp'), voice: t('voiceSandboxSim3') },
    { title: t('profileTitle'), voice: t('voiceSandboxSim4') },
    { title: t('abhaReady'), voice: t('voiceSandboxSim5') },
  ];

  useEffect(() => { speak(screens[screen].voice); }, [screen]);

  useEffect(() => {
    if (screen === 3) {
      const t = setTimeout(() => setOtp(['4', '8', '2', '1', '9', '3']), 2000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  }, [screen]);

  const handleGenOtp = () => {
    if (!agreed) return;
    setOtpSending(true);
    setTimeout(() => { setOtpSending(false); setScreen(3); }, 1500);
  };

  const handleOtpChange = (i, v) => {
    if (v.length > 1) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const confettiColors = ['#E8900A', '#0F766E', '#22C55E', '#7C3AED', '#DC2626', '#0284C7'];
  const renderConfetti = () => (
    <div className="confetti-container">
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          background: confettiColors[i % confettiColors.length],
          animationDelay: `${Math.random() * 1}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}/>
      ))}
    </div>
  );

  return (
    <div className="page-sim">
      {/* Sim Browser Bar */}
      <div className="sim-browser-bar">
        <button className="back-btn" onClick={screen > 0 ? () => setScreen(s => s - 1) : onBack} style={{ width: 32, height: 32 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="sim-url-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>healthid.ndhm.gov.in</span>
        </div>
        <span className="safe-mode-pill">🛡️ {t('safeMode')}</span>
      </div>

      {/* Safety note */}
      <div style={{ background: '#FFFBEB', padding: '8px 16px', fontSize: 12, color: '#92400E', textAlign: 'center', borderBottom: '1px solid #FDE68A' }}>
        ℹ️ {t('safeNote')}
      </div>

      <div style={{ padding: 20, paddingBottom: 100 }}>

        {/* ── Screen 0: Welcome ── */}
        {screen === 0 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="🏠"
              where={t('simWelcomeWhere')}
              what={t('simWelcomeWhat')}
            />
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <h2 style={{ marginBottom: 8 }}>{t('nhaTitle')}</h2>
              <p className="text-sm text-muted" style={{ marginBottom: 32 }}>{t('nhaSubtitle')}</p>
              <button className="btn btn-teal btn-full" onClick={() => setScreen(1)}>
                {t('createAbhaNumber')}
              </button>
            </div>
          </div>
        )}

        {/* ── Screen 1: Choose Method ── */}
        {screen === 1 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="📋"
              where={t('simChooseWhere')}
              what={t('simChooseWhat')}
            />
            <h3 style={{ marginBottom: 20 }}>{t('chooseRegMethod')}</h3>
            <div className="flex flex-col gap-md">
              <div className="card" onClick={() => setScreen(2)} style={{ cursor: 'pointer', border: '2px solid var(--primary)' }}>
                <div className="flex items-center gap-md">
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                    </svg>
                  </div>
                  <div>
                    <h4>{t('registerAadhaar')}</h4>
                    <p className="text-xs text-muted">{t('aadhaarTip')}</p>
                  </div>
                </div>
              </div>
              <div className="card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <div className="flex items-center gap-md">
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)' }}>{t('registerDL')}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Screen 2: Aadhaar Entry ── */}
        {screen === 2 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="🔢"
              where={t('simAadhaarWhere')}
              what={t('simAadhaarWhat')}
            />
            <h3 style={{ marginBottom: 20 }}>{t('enterAadhaar')}</h3>
            <GuidedInput
              label={t('aadhaarNumber')}
              tooltip={t('aadhaarTooltip')}
              value={aadhaar}
              onChange={e => setAadhaar(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              style={{ fontSize: 20, letterSpacing: 3, fontWeight: 600 }}
            />
            <div className="checkbox-wrap" style={{ marginBottom: 24 }}>
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree">{t('agreeShare')}</label>
            </div>
            {otpSending ? (
              <div className="card-amber" style={{ padding: 16, textAlign: 'center', borderRadius: 'var(--radius)' }}>
                <div className="shimmer" style={{ height: 20, width: '70%', margin: '0 auto 8px' }}/>
                <p className="text-sm" style={{ color: '#92400E' }}>{t('sendingOtp')}</p>
              </div>
            ) : (
              <button className="btn btn-teal btn-full" onClick={handleGenOtp} disabled={!agreed} style={{ opacity: agreed ? 1 : 0.5 }}>
                {t('generateOtp')}
              </button>
            )}
          </div>
        )}

        {/* ── Screen 3: OTP Entry ── */}
        {screen === 3 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="📱"
              where={t('simOtpWhere')}
              what={t('simOtpWhat')}
            />
            <h3 style={{ marginBottom: 8 }}>{t('enterOtp')}</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 24 }}>{t('sentToMobile')}</p>
            <div className="otp-container" style={{ marginBottom: 20 }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="tel"
                  maxLength={1}
                  title="Enter the OTP sent to your registered mobile number. Never share OTP with anyone."
                  className={`otp-box ${d ? 'filled' : ''}`}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  inputMode="numeric"
                  style={{
                    boxShadow: d ? '0 0 0 3px rgba(74,127,248,0.2)' : undefined,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ background: 'var(--danger-bg)', border: '1.5px solid var(--danger)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 24 }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--danger)" stroke="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="17" r="1" fill="white"/>
                </svg>
                <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>{t('realTipLabel')}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.5 }}>{t('realTip')}</p>
            </div>
            <button className="btn btn-teal btn-full" onClick={() => setScreen(4)}>
              {t('verifyOtp')}
            </button>
          </div>
        )}

        {/* ── Screen 4: Profile ── */}
        {screen === 4 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <GuidedBanner
              icon="👤"
              where={t('simProfileWhere')}
              what={t('simProfileWhat')}
            />
            <h3 style={{ marginBottom: 20 }}>{t('profileTitle')}</h3>
            <div className="flex flex-col gap-lg">
              <GuidedInput label={t('fullName')}
                tooltip={t('fullNameTooltip')}
                value="Ramesh Kumar" readOnly />
              <GuidedInput label={t('dateOfBirth')}
                tooltip={t('dobTooltip')}
                value="15-03-1965" readOnly />
              <GuidedInput label={t('gender')}
                tooltip={t('genderTooltip')}
                value="Male" readOnly />
              <GuidedInput label={t('address')}
                tooltip={t('addressTooltip')}
                value="42, MG Road, Pune, Maharashtra" readOnly />
            </div>
            <p className="text-xs text-muted" style={{ marginTop: 12, marginBottom: 24 }}>
              {t('autoFetchNote')}
            </p>
            <button className="btn btn-teal btn-full" onClick={() => setScreen(5)}>
              {t('createAbhaBtn')}
            </button>
          </div>
        )}

        {/* ── Screen 5: ABHA Card ── */}
        {screen === 5 && (
          <div style={{ animation: 'fadeSlideUp 0.35s ease', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>{t('abhaReady')}</h2>

            {/* Guided Banner for sharing */}
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <GuidedBanner
                icon="🏥"
                where={t('simAbhaWhere')}
                what={t('simAbhaWhat')}
              />
            </div>

            {/* ABHA Card */}
            <div className="abha-card" style={{ textAlign: 'left', marginBottom: 24 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>NATIONAL HEALTH AUTHORITY</p>
                  <p style={{ fontSize: 12, opacity: 0.8 }}>Ayushman Bharat Health Account</p>
                </div>
                <div style={{ width: 36, height: 36 }}>
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                    <rect x="14" y="12" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)"/>
                    <path d="M17 16h6M17 20h6M17 24h4" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="abha-card-name">Ramesh Kumar</p>
                  <p className="abha-card-number">91-1234-5678-9012</p>
                  <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>DOB: 15-03-1965 | M</p>
                  <p style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Pune, Maharashtra</p>
                </div>
                <div className="abha-card-qr">
                  <svg viewBox="0 0 50 50" fill="none">
                    <rect x="0" y="0" width="20" height="20" fill="#0F766E" opacity="0.8"/>
                    <rect x="25" y="0" width="10" height="10" fill="#0F766E" opacity="0.6"/>
                    <rect x="40" y="0" width="10" height="10" fill="#0F766E" opacity="0.8"/>
                    <rect x="0" y="25" width="10" height="10" fill="#0F766E" opacity="0.6"/>
                    <rect x="15" y="25" width="10" height="10" fill="#0F766E" opacity="0.4"/>
                    <rect x="30" y="25" width="20" height="20" fill="#0F766E" opacity="0.8"/>
                    <rect x="0" y="40" width="20" height="10" fill="#0F766E" opacity="0.7"/>
                    <rect x="10" y="10" width="5" height="5" fill="#0F766E" opacity="0.3"/>
                    <rect x="35" y="10" width="5" height="15" fill="#0F766E" opacity="0.5"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex gap-md" style={{ marginBottom: 16 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setToast(t('downloadToast'))}>
                {t('downloadCard')}
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setToast(t('shareToast'))}>
                {t('shareHospital')}
              </button>
            </div>

            <button className="btn btn-ghost btn-full" onClick={onBack}>
              {t('backToHome')}
            </button>
          </div>
        )}
      </div>

      {showConfetti && renderConfetti()}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Chatbot trigger — only after ABHA card is generated */}
      {screen === 5 && !showChatbot && (
        <div
          onClick={() => setShowChatbot(true)}
          style={{
            position: 'fixed', bottom: 24, right: 20,
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
