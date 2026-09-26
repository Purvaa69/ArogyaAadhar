import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Login({ onLogin, onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [phase, setPhase] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(28);
  const otpRefs = useRef([]);

  useEffect(() => {
    speak(t('loginTitle') + '. ' + t('loginSubtitle'));
  }, []);

  useEffect(() => {
    if (phase === 'otp') {
      speak(t('otpTitle'));
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setPhase('otp');
      setResendTimer(28);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    onLogin({ phone: phone || '9876547823', name: 'Ramesh' });
  };

  const handleGuest = () => {
    onLogin({ phone: '', name: 'Guest' });
  };

  /* ---------- OTP Screen ---------- */
  if (phase === 'otp') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F4F6FB',
        padding: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Back button */}
        <button
          onClick={() => setPhase('phone')}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'white',
            border: '1.5px solid #E2E0DC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', marginBottom: 32,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Title */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#202020', marginBottom: 8, lineHeight: 1.2 }}>
          Verify your number
        </h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 36 }}>
          Sent to +91 {phone.slice(-4) || '4655'}
        </p>

        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-start', marginBottom: 20 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              inputMode="numeric"
              style={{
                width: 46, height: 54,
                borderRadius: 12,
                border: digit ? '2px solid #4A7FF8' : '1.5px solid #D0D0D0',
                background: 'white',
                textAlign: 'center',
                fontSize: 22, fontWeight: 700,
                color: '#202020',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-body)',
                boxShadow: digit ? '0 0 0 3px rgba(74,127,248,0.15)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Resend timer */}
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 24, textAlign: 'center' }}>
          {resendTimer > 0 ? (
            `Resend in 0:${resendTimer.toString().padStart(2, '0')}`
          ) : (
            <button
              style={{ color: '#4A7FF8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-body)' }}
              onClick={() => setResendTimer(28)}
            >
              Resend OTP
            </button>
          )}
        </p>

        {/* Safety warning pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          borderRadius: 12,
          background: '#EEF3FF',
          border: '1.5px solid rgba(74,127,248,0.25)',
          marginBottom: 32,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A7FF8" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#202020' }}>
            {t('otpWarning')}
          </span>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          style={{
            width: '100%',
            padding: '17px 24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4A7FF8 0%, #2D63D8 100%)',
            color: 'white', fontWeight: 700, fontSize: 16,
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 6px 24px rgba(74,127,248,0.35)',
            letterSpacing: 0.2,
          }}
        >
          {t('verify')}
        </button>
      </div>
    );
  }

  /* ---------- Phone Screen ---------- */
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F6FB',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top row: back + language */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <button
          onClick={onBack}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'white',
            border: '1.5px solid #E2E0DC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <LanguageToggle />
      </div>

      {/* Heading */}
      <h1 style={{
        fontSize: 30, fontWeight: 800,
        color: '#202020',
        marginBottom: 8, lineHeight: 1.2,
        letterSpacing: -0.5,
      }}>
        {t('loginTitle')}
      </h1>
      <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32 }}>
        {t('loginSubtitle')}
      </p>

      {/* Phone Input */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'white',
        borderRadius: 14,
        border: '1.5px solid #E2E0DC',
        overflow: 'hidden',
        marginBottom: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <span style={{
          padding: '16px 14px',
          fontSize: 16, fontWeight: 700,
          color: '#202020',
          borderRight: '1.5px solid #E2E0DC',
          background: '#F8F7F5',
          whiteSpace: 'nowrap',
        }}>
          +91
        </span>
        <input
          type="tel"
          placeholder="98765 43210"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          inputMode="numeric"
          maxLength={10}
          style={{
            flex: 1, border: 'none', outline: 'none',
            padding: '16px',
            fontSize: 16, letterSpacing: 1,
            fontFamily: 'var(--font-body)',
            background: 'transparent',
            color: '#202020',
          }}
        />
      </div>

      {/* Send OTP Button */}
      <button
        onClick={handleSendOtp}
        style={{
          width: '100%',
          padding: '17px 24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #4A7FF8 0%, #2D63D8 100%)',
          color: 'white', fontWeight: 700, fontSize: 16,
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 6px 24px rgba(74,127,248,0.35)',
          marginBottom: 24,
          letterSpacing: 0.2,
        }}
      >
        {t('sendOtp')}
      </button>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        color: '#A0A0A0', fontSize: 13, marginBottom: 20,
      }}>
        <div style={{ flex: 1, height: 1, background: '#E2E0DC' }} />
        {t('orContinue')}
        <div style={{ flex: 1, height: 1, background: '#E2E0DC' }} />
      </div>

      {/* Ghost buttons row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'auto' }}>
        <button
          onClick={handleGuest}
          style={{
            flex: 1, padding: '14px',
            borderRadius: 14,
            background: 'white',
            border: '1.5px solid #4A7FF8',
            color: '#4A7FF8', fontWeight: 700, fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {t('guestExplorer')}
        </button>
        <button
          style={{
            flex: 1, padding: '14px',
            borderRadius: 14,
            background: 'white',
            border: '1.5px solid #4A7FF8',
            color: '#4A7FF8', fontWeight: 700, fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {t('helpLogin')}
        </button>
      </div>

      {/* Trust Badges */}
      <div style={{ marginTop: 40, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B6B6B' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7FF8" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {t('trustData')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B6B6B' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7FF8" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {t('trustAadhaar')}
        </div>
      </div>
    </div>
  );
}
