import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const questions = [
  {
    q: "You get a call asking for ₹250 to renew your Ayushman card. What should you do?",
    options: [
      "Pay the amount quickly to keep the card active.",
      "Disconnect immediately. PM-JAY services are completely free.",
      "Bargain to pay only ₹100."
    ],
    answer: 1,
    explanation: "All Ayushman Bharat (PM-JAY) schemes and ABHA generation are absolutely FREE. No government official will ever ask for a renewal fee."
  },
  {
    q: "A WhatsApp message from an unknown number offers a link 'ayushman-update.co.in' saying your coverage is ending today.",
    options: [
      "Click the link to verify your status.",
      "Forward it to your family just in case.",
      "Ignore and delete. Official websites end in '.gov.in'."
    ],
    answer: 2,
    explanation: "Scammers use fake domains like .co.in or .com. Real Indian government portals end with .gov.in (like ayushmanbharat.mp.gov.in or pmjay.gov.in)."
  },
  {
    q: "Someone calls and says, 'Share the OTP you just received to link your ABHA card with your bank for a ₹500 cashback.'",
    options: [
      "Share the OTP for the cashback.",
      "Refuse and disconnect. ABHA is not given for cashbacks.",
      "Ask them to send the cashback first."
    ],
    answer: 1,
    explanation: "Never share an OTP. ABHA provides a health ledger, not direct bank transaction cashbacks."
  },
  {
    q: "An agent approaches you claiming they can upgrade your PM-JAY coverage from ₹5 Lakh to ₹10 Lakh if you pay a ₹1000 processing fee.",
    options: [
      "Pay the fee, it's a good investment.",
      "Ask for their ID card.",
      "Report them. PM-JAY is strictly fixed at ₹5 Lakh per family per year."
    ],
    answer: 2,
    explanation: "There are no 'upgrades' for PM-JAY insurance. The ₹5 Lakh coverage amount is standard for all eligible families and cannot be bought."
  },
  {
    q: "You receive an SMS alert about your ABHA account from a standard 10-digit mobile number.",
    options: [
      "It is a scam. Official SMS comes from sender IDs like NHAIND.",
      "It might be a local officer's personal phone.",
      "Reply to the SMS to check if it's real."
    ],
    answer: 0,
    explanation: "Government agencies use verified Sender IDs (e.g., NHAIND, PMJAY) for SMS alerts, not regular 10-digit mobile numbers."
  },
  {
    q: "A caller claims to be from the Health Ministry and asks for your 12-digit Aadhaar number to 'activate' your PM-JAY card over the phone.",
    options: [
      "Give the Aadhaar number since they are from the Ministry.",
      "Never share Aadhaar numbers over random calls.",
      "Read out only the last 4 digits."
    ],
    answer: 1,
    explanation: "Never share sensitive identifiers over cold calls. Always use official government portals (beneficiary.nha.gov.in) to check or activate status."
  },
  {
    q: "You receive a message with an APK file named 'Ayushman_App.apk' asking you to install it to get your digital health card.",
    options: [
      "Install it because it's convenient.",
      "Delete it. Only install official apps directly from the Google Play Store or Apple App Store.",
      "Send it to a friend to test it."
    ],
    answer: 1,
    explanation: "APKs sent over WhatsApp or SMS often contain malware that can steal your bank details and read your OTPs."
  },
  {
    q: "An empanelled hospital demands a ₹2000 'admission fee' before accepting your Ayushman card in an emergency.",
    options: [
      "Pay the fee to avoid delays.",
      "Wait for the doctor to intervene.",
      "Refuse and call the 14555 helpline. PM-JAY treatment is 100% cashless."
    ],
    answer: 2,
    explanation: "PM-JAY covers pre-hospitalisation to post-hospitalisation expenses. Hospitals cannot charge admission or registration fees to verified beneficiaries."
  },
  {
    q: "An email from 'nha-support123@gmail.com' asks you to fill a form with your Aadhaar details to receive PM-JAY benefits.",
    options: [
      "Fill the form quickly.",
      "Ignore it. Government agencies do not use @gmail.com or @yahoo.com emails.",
      "Reply asking for proof."
    ],
    answer: 1,
    explanation: "Official NHA or PM-JAY communications will always come from a verified '@nha.gov.in' or similar official email domain."
  },
  {
    q: "Someone on Facebook offers to make a 'VIP Ayushman Card' for you to skip hospital lines.",
    options: [
      "Buy it to save time in the future.",
      "Ask how much it costs.",
      "Report the post. There is no such thing as a VIP PM-JAY Card."
    ],
    answer: 2,
    explanation: "All Ayushman cards are equal. Scammers invent 'VIP status' to trick people into paying money."
  }
];

export default function ScamQuiz({ onBack }) {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[currentIdx];

  const handleSelect = (idx) => {
    if (isRevealed) return;
    setSelectedOpt(idx);
  };

  const handleCheck = () => {
    if (selectedOpt === null) return;
    setIsRevealed(true);
    if (selectedOpt === q.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsRevealed(false);
    setCurrentIdx(i => i + 1);
  };

  if (currentIdx >= questions.length) {
    return (
      <div className="page" style={{ paddingBottom: 80, animation: 'fadeSlideUp 0.35s ease' }}>
        <div className="top-bar">
          <button className="back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span className="top-bar-title">Quiz Results</span>
          <div style={{ width: 40 }}/>
        </div>
        <div style={{ padding: 20, textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏆</div>
          <h2 style={{ marginBottom: 12 }}>Quiz Complete!</h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 24 }}>
            You scored {score} out of {questions.length}
          </p>
          <button className="btn btn-primary btn-full" onClick={onBack}>Back to scams menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">Question {currentIdx + 1}/{questions.length}</span>
        <div style={{ width: 40 }}/>
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
        <div className="progress-bar-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}/>
      </div>

      <div style={{ padding: 20, animation: 'fadeSlideUp 0.35s ease' }} key={currentIdx}>
        <h3 style={{ marginBottom: 24, lineHeight: 1.5 }}>{q.q}</h3>
        
        <div className="flex flex-col gap-sm" style={{ marginBottom: 24 }}>
          {q.options.map((opt, i) => {
            let btnClass = 'card';
            if (isRevealed) {
              if (i === q.answer) {
                btnClass = 'card card-success';
              } else if (i === selectedOpt && i !== q.answer) {
                btnClass = 'card card-danger';
              }
            } else if (selectedOpt === i) {
              btnClass = 'card active';
            }

            return (
              <div 
                key={i} 
                className={btnClass} 
                style={{ cursor: 'pointer', border: selectedOpt === i && !isRevealed ? '2px solid var(--primary)' : undefined }}
                onClick={() => handleSelect(i)}
              >
                <div className="flex items-center gap-sm">
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isRevealed && i === q.answer ? '✓' : isRevealed && i === selectedOpt ? '✗' : selectedOpt === i ? '•' : ''}
                  </div>
                  <span style={{ flex: 1 }}>{opt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {isRevealed && (
          <div style={{ background: 'var(--primary-bg)', padding: 16, borderRadius: 'var(--radius)', animation: 'fadeSlideUp 0.3s ease', marginBottom: 24 }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary-deep)', marginBottom: 8 }}>Explanation:</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{q.explanation}</p>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', maxWidth: 480, margin: '0 auto' }}>
        {!isRevealed ? (
          <button className="btn btn-primary btn-full" onClick={handleCheck} disabled={selectedOpt === null} style={{ opacity: selectedOpt === null ? 0.5 : 1 }}>
            Check Answer
          </button>
        ) : (
          <button className="btn btn-teal btn-full" onClick={handleNext}>
            {currentIdx === questions.length - 1 ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
