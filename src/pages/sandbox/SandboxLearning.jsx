import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

const illustrations = [
  // Step 1 - Health ID
  <svg viewBox="0 0 200 160" fill="none" key="s1">
    <rect x="40" y="20" width="120" height="80" rx="12" fill="#0F766E" opacity="0.15"/>
    <rect x="50" y="30" width="100" height="60" rx="8" fill="#0F766E" opacity="0.25"/>
    <text x="100" y="55" textAnchor="middle" fontSize="11" fill="#0F766E" fontWeight="600">ABHA</text>
    <text x="100" y="72" textAnchor="middle" fontSize="8" fill="#0F766E">91-XXXX-XXXX-XXXX</text>
    <rect x="60" y="110" width="80" height="30" rx="6" fill="#E8900A" opacity="0.2"/>
    <text x="100" y="129" textAnchor="middle" fontSize="9" fill="#E8900A" fontWeight="600">14-digit Health ID</text>
  </svg>,
  // Step 2 - Requirements
  <svg viewBox="0 0 200 160" fill="none" key="s2">
    <rect x="30" y="30" width="60" height="80" rx="8" fill="#0F766E" opacity="0.15"/>
    <text x="60" y="65" textAnchor="middle" fontSize="9" fill="#0F766E" fontWeight="600">Aadhaar</text>
    <text x="60" y="80" textAnchor="middle" fontSize="8" fill="#0F766E">Card</text>
    <text x="100" y="75" fontSize="24" fill="#0F766E">+</text>
    <rect x="110" y="30" width="60" height="80" rx="8" fill="#22C55E" opacity="0.15"/>
    <rect x="130" y="45" width="20" height="35" rx="4" fill="#22C55E" opacity="0.3"/>
    <text x="140" y="100" textAnchor="middle" fontSize="8" fill="#22C55E" fontWeight="600">Mobile</text>
    <circle cx="100" cy="140" r="12" fill="#E8900A" opacity="0.2"/>
    <text x="100" y="144" textAnchor="middle" fontSize="14" fill="#E8900A">✓</text>
  </svg>,
  // Step 3 - Safe
  <svg viewBox="0 0 200 160" fill="none" key="s3">
    <path d="M100 20 L140 40 L140 80 C140 110 100 135 100 135 C100 135 60 110 60 80 L60 40 Z" fill="#0F766E" stroke="#0F766E" strokeWidth="2" opacity="0.3"/>
    <path d="M100 35 L130 50 L130 80 C130 100 100 120 100 120 C100 120 70 100 70 80 L70 50 Z" fill="#0F766E" opacity="0.1"/>
    <text x="100" y="75" textAnchor="middle" fontSize="24" fill="#0F766E">🔒</text>
    <text x="100" y="95" textAnchor="middle" fontSize="8" fill="#0F766E" fontWeight="600">NHA Secured</text>
    <text x="100" y="150" textAnchor="middle" fontSize="8" fill="#22C55E" fontWeight="600">Gov. of India Protected</text>
  </svg>,
  // Step 4 - Digital card
  <svg viewBox="0 0 200 160" fill="none" key="s4">
    <rect x="45" y="15" width="110" height="70" rx="10" fill="#0F766E"/>
    <rect x="45" y="78" width="110" height="4" fill="linear-gradient(90deg, #FF9933, white, #138808)"/>
    <text x="100" y="40" textAnchor="middle" fontSize="10" fill="white" fontWeight="600">ABHA Health Card</text>
    <text x="100" y="55" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">Ramesh Kumar</text>
    <text x="100" y="68" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">91-1234-5678-9012</text>
    <rect x="55" y="83" width="90" height="3" rx="1.5" fill="#FF9933"/>
    <rect x="55" y="83" width="30" height="3" rx="1.5" fill="#FF9933"/>
    <rect x="85" y="83" width="30" height="3" rx="1.5" fill="white"/>
    <rect x="115" y="83" width="30" height="3" rx="1.5" fill="#138808"/>
    <path d="M70 105 L90 105 L90 120 L70 120 Z" fill="#22C55E" opacity="0.2" rx="4"/>
    <text x="80" y="116" textAnchor="middle" fontSize="7" fill="#22C55E">QR</text>
    <text x="140" y="116" textAnchor="middle" fontSize="8" fill="#0F766E" fontWeight="500">Show at OPD →</text>
    <text x="100" y="150" textAnchor="middle" fontSize="9" fill="#E8900A" fontWeight="600">🏥 Any hospital, instantly</text>
  </svg>,
];

export default function SandboxLearning({ onStartSim, onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [step, setStep] = useState(0);

  const steps = [
    { title: t('sandboxStep1Title'), desc: t('sandboxStep1Desc') },
    { title: t('sandboxStep2Title'), desc: t('sandboxStep2Desc') },
    { title: t('sandboxStep3Title'), desc: t('sandboxStep3Desc') },
    { title: t('sandboxStep4Title'), desc: t('sandboxStep4Desc') },
  ];

  useEffect(() => {
    speak(steps[step].title + '. ' + steps[step].desc);
  }, [step]);

  return (
    <div className="page flex flex-col" style={{ paddingBottom: step === 3 ? 100 : 40 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={step > 0 ? () => setStep(s => s - 1) : onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">{t('step')} {step + 1} {t('of')} 4</span>
        {step < 3 ? (
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 14 }} onClick={() => setStep(s => s + 1)}>
            {t('next')}
          </button>
        ) : (
          <div style={{ width: 40 }}/>
        )}
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
        <div className="progress-bar-fill" style={{ width: `${((step + 1) / 4) * 100}%` }}/>
      </div>

      <div style={{ animation: 'fadeSlideUp 0.35s ease' }} key={step}>
        <div className="illustration" style={{ marginBottom: 24 }}>
          {illustrations[step]}
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>{steps[step].title}</h2>
        <p style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          {steps[step].desc}
        </p>
      </div>

      {/* Last step CTA — sticky at bottom so it's always visible */}
      {step === 3 && (
        <div style={{
          position: 'fixed', bottom: 70, left: '50%',
          transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430,
          padding: '16px 20px',
          background: 'white',
          borderTop: '1px solid var(--border-light)',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          zIndex: 20,
        }}>
          <button className="btn btn-primary btn-full" onClick={onStartSim} style={{ fontSize: 17 }}>
            {t('startSimulation')}
          </button>
        </div>
      )}
    </div>
  );
}
