import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';

const schemeOptions = ['PM-JAY', 'ABHA', 'Jan Aushadhi', 'CGHS', 'Other'];
const contactMethods = ['WhatsApp', 'Phone Call', 'SMS', 'In Person', 'Email', 'Website'];
const statesList = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];

export default function ReportScam({ onBack, onPostSuccess }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);

  // Step 0: Personal details
  const [age, setAge] = useState(55);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [scheme, setScheme] = useState('');
  const [contact, setContact] = useState('');

  // Step 1: Upload + AI + Post
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [story, setStory] = useState('');
  const [fraudMsg, setFraudMsg] = useState('');
  const [posting, setPosting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAiResult(null);
      setAiError('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setAiResult(null);
    setAiError('');
    setStory('');
    setFraudMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    setAnalyzing(true);
    setAiError('');
    setAiResult(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setAiResult(data);
      setStory(data.description || '');
      setFraudMsg(data.fraudMessage || '');

      if (data.category && !contact) {
        const categoryMap = {
          'WhatsApp': 'WhatsApp',
          'Call': 'Phone Call',
          'Fake Link': 'Website',
          'SMS': 'SMS',
          'Email': 'Email',
          'In Person': 'In Person',
        };
        setContact(categoryMap[data.category] || 'WhatsApp');
      }
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAiError('Failed to analyze. Make sure the backend server is running on port 5000.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      const contactToType = {
        'WhatsApp': 'WhatsApp', 'Phone Call': 'Call', 'SMS': 'SMS',
        'In Person': 'In Person', 'Email': 'Email', 'Website': 'Fake Link',
      };

      const payload = {
        type: aiResult?.category || contactToType[contact] || 'WhatsApp',
        location: district || state || 'India',
        story: story || 'A scam was reported by a community member.',
        fraudMessage: fraudMsg || '"Suspicious activity reported."',
        tags: aiResult?.tags || ['Reported by community'],
        imageUrl: aiResult?.imageUrl || null,
        state, district, scheme,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to post');
      setSubmitted(true);
      speak(t('thankYou'));
      if (onPostSuccess) onPostSuccess();
    } catch (err) {
      console.error('Post failed:', err);
      setAiError('Failed to post. Make sure the backend is running.');
    } finally {
      setPosting(false);
    }
  };

  // ─── Success screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="page flex flex-col items-center justify-center" style={{ textAlign: 'center', minHeight: '80vh' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-bg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>{t('thankYou')}</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>Your story is now live in the community feed and will help protect others.</p>

        <div className="card" style={{ width: '100%', marginBottom: 16 }}>
          <div className="flex justify-between" style={{ marginBottom: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <p className="font-bold" style={{ fontSize: 24, color: 'var(--primary)' }}>2,847</p>
              <p className="text-xs text-muted">People reached</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="font-bold" style={{ fontSize: 24, color: 'var(--primary)' }}>43</p>
              <p className="text-xs text-muted">Stories today</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="font-bold" style={{ fontSize: 24, color: 'var(--primary)' }}>12</p>
              <p className="text-xs text-muted">In your district</p>
            </div>
          </div>
        </div>

        <button className="btn btn-success btn-full" style={{ marginBottom: 12 }} onClick={() => {}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          Share on WhatsApp
        </button>

        <p className="text-xs text-muted" style={{ marginTop: 12 }}>🚨 Your story is now visible in the Community Siren feed!</p>

        <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={onBack}>
          ← Back to Community
        </button>
      </div>
    );
  }

  // ─── 2-step flow: 0=Personal Details, 1=Upload+AI+Post ────────────────────
  const totalSteps = 2;

  return (
    <div className="page">
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <button className="back-btn" onClick={step === 0 ? onBack : () => setStep(0)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="step-indicator">{t('step')} {step + 1} {t('of')} {totalSteps}</span>
        <div style={{ width: 40 }}/>
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
        <div className="progress-bar-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}/>
      </div>

      {/* ─── Step 0: Personal Details ──────────────────────────────────────── */}
      {step === 0 && (
        <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
          <h3 style={{ marginBottom: 6 }}>Personal Details</h3>

          <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 20 }}>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>
              🔒 Your identity will be kept anonymous. Only your story helps others.
            </p>
          </div>

          <div className="flex flex-col gap-lg">
            <div className="input-group">
              <label className="input-label">Age</label>
              <div className="flex items-center gap-md">
                <button className="counter-btn" onClick={() => setAge(a => Math.max(18, a - 1))}>−</button>
                <span style={{ fontSize: 28, fontWeight: 700, minWidth: 60, textAlign: 'center' }}>{age}</span>
                <button className="counter-btn" onClick={() => setAge(a => Math.min(100, a + 1))}>+</button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">State</label>
              <select className="select-field" value={state} onChange={e => setState(e.target.value)}>
                <option value="">-- Select --</option>
                {statesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">District</label>
              <input className="input-field" placeholder="Enter district" value={district} onChange={e => setDistrict(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Which scheme was misused?</label>
              <div className="flex flex-wrap gap-sm">
                {schemeOptions.map(s => (
                  <button key={s} className={`chip ${scheme === s ? 'active' : ''}`} onClick={() => setScheme(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">How did the scammer contact you?</label>
              <div className="flex flex-wrap gap-sm">
                {contactMethods.map(c => (
                  <button key={c} className={`chip ${contact === c ? 'active' : ''}`} onClick={() => setContact(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => setStep(1)}>
            Next →
          </button>
        </div>
      )}

      {/* ─── Step 1: Upload Screenshot → Analyze with AI → Post ────────────── */}
      {step === 1 && (
        <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
          <h3 style={{ marginBottom: 8 }}>Upload & Analyze</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 20 }}>
            Upload a screenshot of the scam. AI will auto-detect the fraud details.
          </p>

          {/* Upload area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--primary)',
                borderRadius: 'var(--radius)',
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--primary-bg)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className="font-medium" style={{ color: 'var(--primary)', marginBottom: 4 }}>Tap to upload screenshot</p>
              <p className="text-xs text-muted">JPG, PNG, WEBP — Max 10MB</p>
            </div>
          ) : (
            <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src={previewUrl}
                alt="Scam screenshot"
                style={{ width: '100%', maxHeight: 280, objectFit: 'contain', display: 'block', background: '#f8f9fa' }}
              />
              <button
                onClick={removeFile}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(220,38,38,0.9)', color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}
              >✕</button>
              <div style={{ padding: '8px 12px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>Screenshot uploaded</span>
              </div>
            </div>
          )}

          {/* Analyze with AI button — only shows after upload, before AI result */}
          {previewUrl && !aiResult && (
            <button
              className="btn btn-primary btn-full"
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                marginTop: 16,
                background: analyzing ? 'var(--primary-bg)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: analyzing ? 'var(--primary)' : 'white',
                border: 'none',
              }}
            >
              {analyzing ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    width: 18, height: 18, border: '2px solid var(--primary)',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }}/>
                  Analyzing with AI...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  ⚡ Analyze with AI
                </span>
              )}
            </button>
          )}

          {/* Error */}
          {aiError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: 12, marginTop: 12 }}>
              <p className="text-sm" style={{ color: '#DC2626' }}>❌ {aiError}</p>
            </div>
          )}

          {/* AI Results + Post */}
          {aiResult && (
            <div style={{ marginTop: 16, animation: 'fadeSlideUp 0.35s ease' }}>
              {/* AI category + tags */}
              <div style={{
                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                border: '1px solid #C7D2FE', borderRadius: 'var(--radius)',
                padding: 14, marginBottom: 12,
              }}>
                <div className="flex items-center gap-sm" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span className="font-medium text-sm" style={{ color: '#4338CA' }}>AI Analysis Complete</span>
                </div>
                <div className="flex items-center gap-sm" style={{ marginBottom: 6 }}>
                  <span className="text-xs text-muted">Detected Category:</span>
                  <span className="badge badge-warning" style={{ fontSize: 11 }}>{aiResult.category}</span>
                </div>
                {aiResult.tags && (
                  <div className="flex flex-wrap gap-xs" style={{ marginTop: 8 }}>
                    {aiResult.tags.map(tag => (
                      <span key={tag} className="badge badge-danger" style={{ fontSize: 10, textTransform: 'none' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI-generated description (editable) */}
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label">📝 AI-Generated Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  style={{ resize: 'vertical', borderColor: '#A5B4FC' }}
                />
              </div>

              {/* AI-detected fraud message (editable) */}
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label">💬 Detected Fraud Message</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={fraudMsg}
                  onChange={e => setFraudMsg(e.target.value)}
                  style={{ resize: 'vertical', borderColor: '#A5B4FC' }}
                />
              </div>

              {/* Reminder */}
              <div className="card-warning" style={{ padding: 14, borderRadius: 'var(--radius)', marginBottom: 16 }}>
                <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                  🛡️ By sharing, you're protecting thousands from falling for the same scam.
                </p>
              </div>

              {/* Post button */}
              <button
                className="btn btn-primary btn-full"
                onClick={handlePost}
                disabled={posting}
                style={{
                  background: posting ? 'var(--primary-bg)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: posting ? 'var(--primary)' : 'white',
                  border: 'none', fontSize: 16, fontWeight: 700, padding: '14px 20px',
                }}
              >
                {posting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{
                      width: 18, height: 18, border: '2px solid var(--primary)',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      display: 'inline-block', animation: 'spin 0.8s linear infinite',
                    }}/>
                    Posting...
                  </span>
                ) : (
                  '🚨 Post Alert to Community'
                )}
              </button>
            </div>
          )}

          {/* Back button */}
          {!aiResult && (
            <div className="flex gap-md" style={{ marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
            </div>
          )}
          {aiResult && (
            <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => { setAiResult(null); }}>
              ← Re-upload Screenshot
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
