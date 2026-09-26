import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/* ── Covered diseases / treatments under Ayushman Bharat PM-JAY ── */
const COVERED_CONDITIONS = {
  // Cancer
  'cancer': { covered: true, detail: 'Yes ✅ Cancer treatment is covered under PM-JAY — including chemotherapy, radiotherapy, and surgical oncology at empanelled hospitals.' },
  'tumour': { covered: true, detail: 'Yes ✅ Tumour removal and oncological surgery are covered under PM-JAY.' },
  'tumor': { covered: true, detail: 'Yes ✅ Tumour removal and oncological surgery are covered under PM-JAY.' },
  // Heart
  'heart': { covered: true, detail: 'Yes ✅ Heart surgery (bypass, valve replacement, angioplasty) is covered under PM-JAY up to ₹5 lakh/year.' },
  'bypass': { covered: true, detail: 'Yes ✅ Coronary artery bypass grafting (CABG) is a covered PM-JAY procedure.' },
  'angioplasty': { covered: true, detail: 'Yes ✅ Angioplasty is covered under PM-JAY at empanelled hospitals.' },
  // Kidney
  'kidney': { covered: true, detail: 'Yes ✅ Kidney dialysis and kidney transplant are covered under PM-JAY.' },
  'dialysis': { covered: true, detail: 'Yes ✅ Kidney dialysis is covered under PM-JAY — patients can receive regular dialysis sessions at empanelled centres.' },
  'renal': { covered: true, detail: 'Yes ✅ Renal (kidney) treatments including dialysis and surgery are covered under PM-JAY.' },
  // Ortho
  'knee': { covered: true, detail: 'Yes ✅ Knee replacement surgery is covered under PM-JAY at empanelled hospitals.' },
  'hip': { covered: true, detail: 'Yes ✅ Hip replacement is a covered PM-JAY surgical procedure.' },
  'fracture': { covered: true, detail: 'Yes ✅ Fracture treatment and orthopaedic surgery are covered under PM-JAY.' },
  // Childbirth / Maternity
  'delivery': { covered: true, detail: 'Yes ✅ Childbirth and maternity hospitalisation are covered under PM-JAY.' },
  'maternity': { covered: true, detail: 'Yes ✅ Maternity and delivery care are covered under PM-JAY.' },
  'pregnancy': { covered: true, detail: 'Yes ✅ Antenatal care hospitalisations and delivery are covered under PM-JAY.' },
  'caesarean': { covered: true, detail: 'Yes ✅ Caesarean section (C-section) delivery is covered under PM-JAY.' },
  // Respiratory
  'lungs': { covered: true, detail: 'Yes ✅ Lung surgery and respiratory conditions requiring hospitalisation are covered under PM-JAY.' },
  'tuberculosis': { covered: true, detail: 'Yes ✅ Tuberculosis (TB) complicated enough to require hospitalisation is covered under PM-JAY.' },
  'tb': { covered: true, detail: 'Yes ✅ Tuberculosis hospitalisation is covered under PM-JAY.' },
  'asthma': { covered: true, detail: '⚠️ Asthma outpatient care is not covered, but severe acute asthma requiring ICU/hospitalisation IS covered under PM-JAY.' },
  // ICU
  'icu': { covered: true, detail: 'Yes ✅ ICU stays are fully covered under PM-JAY, including critical care and ventilator support.' },
  // Diabetes
  'diabetes': { covered: false, detail: '⚠️ Routine diabetes management (medicines, check-ups) is NOT covered. However, diabetic complications requiring surgery or hospitalisation (e.g. foot surgery, dialysis) ARE covered under PM-JAY.' },
  // Mental health
  'mental': { covered: true, detail: 'Yes ✅ Mental health conditions requiring inpatient hospitalisation are covered under PM-JAY.' },
  'depression': { covered: true, detail: 'Yes ✅ Severe depression and other mental health conditions requiring hospitalisation are covered.' },
  // Other common
  'cataract': { covered: true, detail: 'Yes ✅ Cataract surgery is one of the most common PM-JAY procedures and is fully covered.' },
  'eye': { covered: true, detail: 'Yes ✅ Eye surgeries including cataract are covered under PM-JAY.' },
  'appendix': { covered: true, detail: 'Yes ✅ Appendectomy (appendix removal) is covered under PM-JAY.' },
  'surgery': { covered: true, detail: 'Yes ✅ Most major surgeries at empanelled hospitals are covered under PM-JAY up to ₹5 lakh/year.' },
};

/* ── Scam safety patterns ── */
const SCAM_PATTERNS = ['otp', 'share', 'fee', 'pay', 'payment', 'link', 'click'];

function detectDisease(text) {
  const lower = text.toLowerCase();
  for (const [keyword, info] of Object.entries(COVERED_CONDITIONS)) {
    if (lower.includes(keyword)) return info;
  }
  return null;
}

function detectScamQuery(text) {
  const lower = text.toLowerCase();
  return SCAM_PATTERNS.some(p => lower.includes(p));
}

const SCAM_SAFETY_RESPONSE =
  '🚨 **Important Safety Warning:**\n\n' +
  '• Never share your OTP with anyone — not even "government officials"\n' +
  '• Real ABHA or PM-JAY services are **completely FREE** — no fees, no registration charges\n' +
  '• Never click unverified links claiming to be government portals\n' +
  '• If in doubt, call the official helpline: **14555**\n\n' +
  'If someone asked you for OTP or money claiming to help with ABHA/PM-JAY, it is a scam. Report at cybercrime.gov.in';

export default function AbhaChatbot({ onClose }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const msgEndRef = useRef(null);

  const qaMap = {
    [t('chatQ1')]: t('chatA1'),
    [t('chatQ2')]: t('chatA2'),
    [t('chatQ3')]: t('chatA3'),
    [t('chatQ4')]: t('chatA4'),
    'Is cancer covered?': COVERED_CONDITIONS.cancer.detail,
    'Is heart surgery covered?': COVERED_CONDITIONS.heart.detail,
    'Is kidney dialysis covered?': COVERED_CONDITIONS.dialysis.detail,
    'Is cataract covered?': COVERED_CONDITIONS.cataract.detail,
    'How to avoid scams?': SCAM_SAFETY_RESPONSE,
  };

  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => {
      setMessages([{ type: 'bot', text: t('chatbotGreeting') }]);
      setTyping(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      let response = '';

      // 1. Check exact QA map
      if (qaMap[text]) {
        response = qaMap[text];
      }
      // 2. Check disease coverage query
      else if (detectDisease(text)) {
        const info = detectDisease(text);
        response = info.detail + '\n\n_Ayushman Bharat PM-JAY covers 1,929 medical procedures at empanelled hospitals. To check your eligibility, tap "Check Eligibility" in the main menu._';
      }
      // 3. Scam safety query
      else if (detectScamQuery(text)) {
        response = SCAM_SAFETY_RESPONSE;
      }
      // 4. Hospital query
      else if (text.toLowerCase().includes('hospital')) {
        response = t('chatA3');
      }
      // 5. Default
      else {
        response = 'I can help with:\n• What ABHA can do for you\n• Which conditions PM-JAY covers\n• How to use your ABHA at hospitals\n• Staying safe from scams\n\nTry asking: "Is diabetes covered?" or "Is cataract covered?"';
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setTyping(false);
    }, 1200);
  };

  const suggestions = [
    t('chatQ1'), t('chatQ2'), t('chatQ3'), t('chatQ4'),
    'Is cancer covered?', 'Is heart surgery covered?',
    'Is kidney dialysis covered?', 'How to avoid scams?',
  ];
  const usedQuestions = messages.filter(m => m.type === 'user').map(m => m.text);
  const availableSuggestions = suggestions.filter(s => !usedQuestions.includes(s));

  return (
    <div className="chatbot-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="chatbot-panel">
        <div className="chatbot-header">
          <div className="flex items-center gap-sm">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h4 style={{ fontSize: 16, margin: 0 }}>{t('chatbotTitle')}</h4>
              <p className="text-xs" style={{ color: 'var(--success)', margin: 0 }}>● Online — ABHA + PM-JAY Expert</p>
            </div>
          </div>
          <button className="back-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages" style={{ minHeight: 260 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>
              {msg.text.split('\n').map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          ))}
          {typing && (
            <div className="chat-typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Suggestion chips */}
        {availableSuggestions.length > 0 && (
          <div className="chat-suggestions">
            {availableSuggestions.slice(0, 5).map(q => (
              <button key={q} className="chat-suggestion-btn" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Free-text input */}
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          borderTop: '1px solid var(--border-light)',
          background: 'white',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about your ABHA or PM-JAY..."
            style={{
              flex: 1, border: '1.5px solid var(--border)', borderRadius: 10,
              padding: '9px 12px', fontSize: 14,
              fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: input.trim() ? 'var(--primary)' : 'var(--border-light)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
