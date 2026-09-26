import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

export default function ExplorerLearning({ onStartSim, onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [step, setStep] = useState(0);

  const steps = [
    { title: t('explorerStep1Title'), desc: t('explorerStep1Desc'), emoji: '🏥' },
    { title: t('explorerStep2Title'), desc: t('explorerStep2Desc'), emoji: '👨‍👩‍👧‍👦' },
    { title: t('explorerStep3Title'), desc: t('explorerStep3Desc'), emoji: '💊' },
    { title: t('explorerStep4Title'), desc: t('explorerStep4Desc'), emoji: '📋' },
    { title: t('explorerStep5Title'), desc: t('explorerStep5Desc'), emoji: '🔒' },
  ];

  useEffect(() => {
    speak(steps[step].title + '. ' + steps[step].desc);
  }, [step]);

  return (
    <div className="page flex flex-col" style={{ paddingBottom: step === 4 ? 100 : 40 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={step > 0 ? () => setStep(s => s - 1) : onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">{t('step')} {step + 1} {t('of')} 5</span>
        {step < 4 ? (
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 14 }} onClick={() => setStep(s => s + 1)}>
            {t('next')}
          </button>
        ) : (
          <div style={{ width: 40 }}/>
        )}
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
        <div className="progress-bar-fill" style={{ width: `${((step + 1) / 5) * 100}%` }}/>
      </div>

      <div style={{ animation: 'fadeSlideUp 0.35s ease' }} key={step}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{steps[step].emoji}</div>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>{steps[step].title}</h2>
        <p style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.7, marginBottom: 32, color: 'var(--text-muted)' }}>
          {steps[step].desc}
        </p>
      </div>

      {/* Last step CTA — sticky at bottom */}
      {step === 4 && (
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
            {t('checkEligibilityBtn')}
          </button>
        </div>
      )}
    </div>
  );

}
