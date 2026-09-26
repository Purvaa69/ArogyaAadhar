import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LanguageToggle from '../../components/LanguageToggle';

const scenarios = [
  {
    type: 'sms',
    sender: '+91-14555-PMJAY',
    channel: 'SMS',
    parts: [
      { text: 'URGENT: ', isFlag: true, flagId: 'urgent' },
      { text: 'Your PM-JAY card is about to expire. ' },
      { text: 'Pay ₹250 renewal fee ', isFlag: true, flagId: 'fee' },
      { text: 'immediately at ' },
      { text: 'pmjay-renew.co.in', isFlag: true, flagId: 'url' },
      { text: ' or your ₹5 lakh coverage will be cancelled. ' },
      { text: 'Share your OTP', isFlag: true, flagId: 'otp' },
      { text: ' with our agent who will call you. Helpline: 14555-ext-99' },
    ],
    flags: {
      urgent: { label: 'Urgent tone', explanation: 'Scammers create panic so you act without thinking. Real government messages are never threatening.' },
      fee: { label: 'Asks for money', explanation: 'PM-JAY is completely FREE. No government scheme asks for renewal fees.' },
      url: { label: 'Fake URL', explanation: 'Real government sites end in .gov.in — not .co.in. This is a phishing domain.' },
      otp: { label: 'Asks for OTP', explanation: 'No government official will ever ask for your OTP. This is the #1 sign of fraud.' },
    },
    allFlagCategories: ['Urgent tone', 'Fake URL', 'Asks for OTP', 'Asks for money', 'Fake helpline', 'Impersonation'],
    correctCategories: ['Urgent tone', 'Fake URL', 'Asks for OTP', 'Asks for money'],
  },
  {
    type: 'whatsapp',
    sender: 'ABDM Official Help',
    channel: 'WhatsApp',
    parts: [
      { text: '🏥 Dear Citizen,\n\nYour ABHA Health ID has been ' },
      { text: 'BLOCKED due to suspicious activity', isFlag: true, flagId: 'scare' },
      { text: '. To reactivate, ' },
      { text: 'click this link: abdm-verify.com/reactivate', isFlag: true, flagId: 'link' },
      { text: '\n\nYou must verify within ' },
      { text: '24 hours', isFlag: true, flagId: 'urgency' },
      { text: ' or your health records will be permanently deleted.\n\n' },
      { text: 'Send your Aadhaar number and OTP', isFlag: true, flagId: 'data' },
      { text: ' to this chat for quick verification.\n\n— ABDM Helpdesk' },
    ],
    flags: {
      scare: { label: 'Scare tactic', explanation: 'ABHA accounts don\'t get "blocked". This is a scare tactic to make you panic.' },
      link: { label: 'Fake URL', explanation: 'Real ABDM links use healthid.ndhm.gov.in — not random domains like abdm-verify.com.' },
      urgency: { label: 'Urgent deadline', explanation: 'Artificial deadlines create panic. Real government services don\'t threaten permanent deletion.' },
      data: { label: 'Asks for Aadhaar + OTP', explanation: 'Never share Aadhaar and OTP together. This is exactly how identity theft happens.' },
    },
    allFlagCategories: ['Scare tactic', 'Fake URL', 'Urgent deadline', 'Asks for Aadhaar + OTP', 'Fake sender name', 'Impersonation'],
    correctCategories: ['Scare tactic', 'Fake URL', 'Urgent deadline', 'Asks for Aadhaar + OTP'],
  },
  {
    type: 'email',
    sender: 'noreply@ayushman-bharat.co.in',
    channel: 'Email',
    parts: [
      { text: 'From: NHA Health Services <' },
      { text: 'noreply@ayushman-bharat.co.in', isFlag: true, flagId: 'domain' },
      { text: '>\nSubject: Complete Your PM-JAY Registration — ' },
      { text: 'Action Required Immediately', isFlag: true, flagId: 'urgency' },
      { text: '\n\nDear Beneficiary,\n\nOur records show your PM-JAY registration is incomplete. To receive your ' },
      { text: '₹5,00,000 cash benefit directly in your bank account', isFlag: true, flagId: 'cash' },
      { text: ', please complete verification.\n\n' },
      { text: 'Processing fee: ₹499 (one-time)', isFlag: true, flagId: 'fee' },
      { text: '\n\nPay via UPI: pmjay.registration@ybl\n\nRegards,\nNational Health Authority' },
    ],
    flags: {
      domain: { label: 'Fake email domain', explanation: 'Government emails come from .gov.in domains, not .co.in domains.' },
      urgency: { label: 'Urgent tone', explanation: 'Creating urgency is a classic phishing technique.' },
      cash: { label: 'False promise of cash', explanation: 'PM-JAY provides hospitalisation coverage, not direct cash transfers to bank accounts.' },
      fee: { label: 'Asks for fee', explanation: 'All PM-JAY services are completely free. Any fee request is a scam.' },
    },
    allFlagCategories: ['Fake email domain', 'Urgent tone', 'False promise of cash', 'Asks for fee', 'Fake UPI ID', 'Impersonation'],
    correctCategories: ['Fake email domain', 'Urgent tone', 'False promise of cash', 'Asks for fee'],
  },
];

export default function RedFlagDetector({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [round, setRound] = useState(0);
  const [highlighted, setHighlighted] = useState(new Set());
  const [selectedFlags, setSelectedFlags] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const scenario = scenarios[round];

  useEffect(() => {
    speak(`${t('round')} ${round + 1}. ${t('tapSuspicious')}`);
  }, [round]);

  const toggleHighlight = (flagId) => {
    if (revealed) return;
    const next = new Set(highlighted);
    if (next.has(flagId)) next.delete(flagId); else next.add(flagId);
    setHighlighted(next);
  };

  const toggleFlag = (flag) => {
    if (revealed) return;
    const next = new Set(selectedFlags);
    if (next.has(flag)) next.delete(flag); else next.add(flag);
    setSelectedFlags(next);
  };

  const checkAnswer = () => {
    setRevealed(true);
    const allFlagIds = Object.keys(scenario.flags);
    const foundSpans = allFlagIds.filter(id => highlighted.has(id)).length;
    const correctCats = scenario.correctCategories.filter(c => selectedFlags.has(c)).length;
    const totalPossible = allFlagIds.length + scenario.correctCategories.length;
    const earned = foundSpans + correctCats;
    setScores(prev => [...prev, { found: earned, total: totalPossible }]);
    speak(revealed ? '' : `You found ${earned} out of ${totalPossible} red flags.`);
  };

  const nextRound = () => {
    if (round < 2) {
      setRound(r => r + 1);
      setHighlighted(new Set());
      setSelectedFlags(new Set());
      setRevealed(false);
    } else {
      setShowSummary(true);
    }
  };

  const totalScore = scores.reduce((a, s) => a + s.found, 0);
  const totalPossible = scores.reduce((a, s) => a + s.total, 0);

  if (showSummary) {
    return (
      <div className="page" style={{ animation: 'fadeSlideUp 0.35s ease' }}>
        <button className="back-btn" onClick={onBack} style={{ marginBottom: 16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>

        <div className="score-card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>{t('score')}</p>
          <div className="score-value">{totalScore}/{totalPossible}</div>
          <p className="score-label">{t('redFlagsIdentified')}</p>
        </div>

        <h3 style={{ marginBottom: 16 }}>{t('goldenRules')}</h3>
        <div className="flex flex-col gap-md" style={{ marginBottom: 24 }}>
          {[t('rule1'), t('rule2'), t('rule3'), t('rule4')].map((rule, i) => (
            <div key={i} className="golden-rule">
              <div className="golden-rule-number">{i + 1}</div>
              <p className="text-sm font-medium" style={{ color: '#92400E' }}>{rule}</p>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-full" onClick={onBack}>
          {t('backToHome')}
        </button>
      </div>
    );
  }

  const msgClass = scenario.type === 'sms' ? 'scam-sms' : scenario.type === 'whatsapp' ? 'scam-whatsapp' : 'scam-email';

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">{t('round')} {round + 1}/3</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="badge badge-warning">{scenario.channel}</div>
          <LanguageToggle />
        </div>
      </div>

      <h3 style={{ marginBottom: 4 }}>{t('spotScam')}</h3>
      <p className="text-sm text-muted" style={{ marginBottom: 16 }}>{t('tapSuspicious')}</p>

      {/* Channel icon */}
      <div className="flex items-center gap-sm" style={{ marginBottom: 10 }}>
        {scenario.type === 'whatsapp' && (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.054 23.28l5.6-1.47A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </div>
        )}
        {scenario.type === 'sms' && (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
        )}
        {scenario.type === 'email' && (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
        )}
        <span className="text-sm font-medium">{scenario.sender}</span>
      </div>

      {/* Message */}
      <div className={msgClass} style={{ marginBottom: 20 }}>
        {scenario.parts.map((part, i) => (
          part.isFlag ? (
            <span
              key={i}
              className={`red-flag-span ${highlighted.has(part.flagId) ? 'highlighted' : ''} ${revealed ? (highlighted.has(part.flagId) ? 'revealed-correct' : 'revealed-missed') : ''}`}
              onClick={() => toggleHighlight(part.flagId)}
            >
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        ))}
      </div>

      {/* Reveal explanations */}
      {revealed && (
        <div className="flex flex-col gap-sm" style={{ marginBottom: 20, animation: 'fadeSlideUp 0.35s ease' }}>
          {Object.entries(scenario.flags).map(([id, flag]) => (
            <div key={id} style={{ background: highlighted.has(id) ? 'var(--success-bg)' : 'var(--danger-bg)', border: `1px solid ${highlighted.has(id) ? 'var(--success)' : 'var(--danger)'}`, borderRadius: 'var(--radius-sm)', padding: 10 }}>
              <div className="flex items-center gap-xs" style={{ marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: highlighted.has(id) ? 'var(--success)' : 'var(--danger)' }}>
                  {highlighted.has(id) ? t('found') : t('missed')}
                </span>
                <span className="text-xs font-semibold"> — {flag.label}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text)', lineHeight: 1.4 }}>{flag.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Flag categories */}
      <h4 style={{ marginBottom: 10 }}>{t('selectFlags')}</h4>
      <div className="flex flex-wrap gap-sm" style={{ marginBottom: 20 }}>
        {scenario.allFlagCategories.map(flag => {
          const isCorrect = scenario.correctCategories.includes(flag);
          const isSelected = selectedFlags.has(flag);
          let chipClass = 'chip';
          if (revealed) {
            if (isSelected && isCorrect) chipClass = 'chip chip-success';
            else if (isSelected && !isCorrect) chipClass = 'chip chip-danger';
            else if (!isSelected && isCorrect) chipClass = 'chip chip-amber';
          } else if (isSelected) {
            chipClass = 'chip active';
          }
          return (
            <button key={flag} className={chipClass} onClick={() => toggleFlag(flag)}>
              {revealed && isSelected && isCorrect && '✓ '}
              {revealed && isSelected && !isCorrect && '✗ '}
              {flag}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button className="btn btn-primary btn-full" onClick={checkAnswer}>
          {t('checkAnswer')}
        </button>
      ) : (
        <button className="btn btn-teal btn-full" onClick={nextRound}>
          {round < 2 ? t('nextRound') : t('seeResults')}
        </button>
      )}
    </div>
  );
}
