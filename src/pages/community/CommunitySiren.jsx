import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LanguageToggle from '../../components/LanguageToggle';
import ReportScam from './ReportScam';

const mockStories = [
  {
    id: 1, type: 'WhatsApp', time: '2 hours ago', location: 'Pune', upvotes: 34, likes: 12,
    story: 'Someone sent me a WhatsApp message saying my ABHA card will expire and I need to pay ₹500 for renewal.',
    fraudMessage: '"Your ABHA card is expiring tomorrow. Pay ₹500 at this link to renew: abha-renew.in. Share OTP sent to your phone."',
    tags: ['Fake URL', 'Asks for money', 'OTP demand'],
  },
  {
    id: 2, type: 'Call', time: '5 hours ago', location: 'Mumbai', upvotes: 56, likes: 23,
    story: 'Got a call from someone claiming to be from PM-JAY helpline. They asked for my Aadhaar number and bank details to "activate" my health insurance.',
    fraudMessage: '"This is PM-JAY helpline. Your Ayushman card is not linked. Share your Aadhaar and bank account number for instant activation."',
    tags: ['Impersonation', 'Asks for Aadhaar', 'Fake helpline'],
  },
  {
    id: 3, type: 'Fake Link', time: '1 day ago', location: 'Delhi', upvotes: 89, likes: 45,
    story: 'Received an SMS with a link to download my ABHA card. The link opened a fake website that looked exactly like the NHA portal.',
    fraudMessage: '"Download your ABHA Health Card now: healthid-ndhm.co.in/download. Enter Aadhaar for verification."',
    tags: ['Fake URL', 'Sarkari impersonation', 'Phishing'],
  },
  {
    id: 4, type: 'WhatsApp', time: '2 days ago', location: 'Pune', upvotes: 22, likes: 8,
    story: 'A person came to our colony claiming to be an ABHA agent. He was collecting ₹200 per person for "free" ABHA card creation.',
    fraudMessage: '"Government has started door-to-door ABHA registration. Fee is only ₹200. Give your Aadhaar photocopy."',
    tags: ['Asks for money', 'Fake agent', 'Door-to-door fraud'],
  },
];

export default function CommunitySiren({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Most helpful');
  const [stories, setStories] = useState(mockStories);
  const [showReport, setShowReport] = useState(false);
  const [upvoted, setUpvoted] = useState(new Set());
  const [userPosts, setUserPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    speak(t('communityTitle'));
  }, []);

  // Fetch user-posted stories from backend
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setUserPosts(data);
      }
    } catch (err) {
      // Backend might not be running, silently fail
      console.log('Backend not available, showing only mock stories');
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Combine mock + user posts
  const allStories = [...userPosts, ...stories];

  const filters = [t('all'), 'WhatsApp', t('call') === 'कॉल' ? 'Call' : 'Call', t('fakeLink') === 'फर्जी लिंक' ? 'Fake Link' : 'Fake Link'];
  const sorts = [t('mostHelpful'), t('mostRecent'), t('nearMe')];

  // Apply search filter
  const searched = searchQuery.trim()
    ? allStories.filter(s => {
        const q = searchQuery.toLowerCase();
        return (
          (s.story && s.story.toLowerCase().includes(q)) ||
          (s.fraudMessage && s.fraudMessage.toLowerCase().includes(q)) ||
          (s.type && s.type.toLowerCase().includes(q)) ||
          (s.location && s.location.toLowerCase().includes(q)) ||
          (s.tags && s.tags.some(tag => tag.toLowerCase().includes(q)))
        );
      })
    : allStories;

  const filtered = filter === 'All' || filter === t('all') ? searched : searched.filter(s => s.type === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === t('mostHelpful') || sort === 'Most helpful') return b.upvotes - a.upvotes;
    return 0;
  });

  const handleUpvote = async (id) => {
    // Check if it's a user post (id >= 100)
    if (id >= 100) {
      try {
        await fetch(`/api/posts/${id}/upvote`, { method: 'POST' });
        fetchPosts(); // Refresh from backend
      } catch (err) {
        console.error('Failed to upvote:', err);
      }
      return;
    }

    // Mock story upvote (local state)
    const next = new Set(upvoted);
    if (next.has(id)) {
      next.delete(id);
      setStories(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes - 1 } : s));
    } else {
      next.add(id);
      setStories(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
    }
    setUpvoted(next);
  };

  const handlePostSuccess = () => {
    // Refresh posts when a new post is created
    fetchPosts();
  };

  if (showReport) {
    return <ReportScam onBack={() => { setShowReport(false); fetchPosts(); }} onPostSuccess={handlePostSuccess} />;
  }

  return (
    <div className="page" style={{ paddingTop: 0, paddingBottom: 140 }}>
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="top-bar-title">{t('communityTitle')}</span>
        <LanguageToggle />
      </div>

      <div style={{ padding: '16px 0' }}>
        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchScams')}
            style={{
              width: '100%', padding: '11px 14px 11px 40px',
              borderRadius: 12, border: '1.5px solid var(--border)',
              fontSize: 14, color: 'var(--text)', background: 'var(--card-bg)',
              fontFamily: 'var(--font-body)', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'var(--text-muted)', color: 'white', border: 'none',
                width: 20, height: 20, borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              }}
            >✕</button>
          )}
        </div>
        {/* Filters */}
        <div className="tab-bar" style={{ marginBottom: 12, padding: '0 0 0 0' }}>
          {['All', 'WhatsApp', 'Call', 'Fake Link'].map(f => (
            <button key={f} className={`tab-item ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-xs" style={{ marginBottom: 20 }}>
          {sorts.map(s => (
            <button key={s} className={`chip ${sort === s ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setSort(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Stories */}
        <div className="flex flex-col gap-lg">
          {sorted.map((story, i) => (
            <div key={story.id} className="feed-card" style={{ animation: `fadeSlideUp 0.35s ease ${i * 0.05}s both` }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <div className="flex items-center gap-sm">
                  <span className="badge badge-warning">{story.type}</span>
                  <span className="text-xs text-muted">{story.time}</span>
                  {story.id >= 100 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 6px',
                      borderRadius: 4, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      AI Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted">📍 {story.location}</span>
              </div>

              <p className="text-sm" style={{ color: 'var(--text)', marginBottom: 10, lineHeight: 1.5 }}>
                {story.story}
              </p>

              <div className="fraud-message-bubble" style={{ marginBottom: 10 }}>
                {story.fraudMessage}
              </div>

              {/* Show uploaded image if available */}
              {story.imageUrl && (
                <div style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img
                    src={story.imageUrl}
                    alt="Scam screenshot"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block', background: '#f8f9fa' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-xs" style={{ marginBottom: 10 }}>
                {story.tags.map(tag => (
                  <span key={tag} className="badge badge-danger" style={{ fontSize: 10, textTransform: 'none' }}>{tag}</span>
                ))}
              </div>

              <div className="feed-actions">
                <button className="feed-action-btn" onClick={() => handleUpvote(story.id)} style={{ color: upvoted.has(story.id) ? 'var(--primary)' : undefined }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={upvoted.has(story.id) ? 'var(--primary)' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  {story.upvotes}
                </button>
                <button className="feed-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {story.likes}
                </button>
                <button className="feed-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                    <line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                  {t('report')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '0 20px', zIndex: 90 }}>
        <button className="btn btn-primary btn-full" onClick={() => setShowReport(true)} style={{ boxShadow: 'var(--shadow-lg)' }}>
          {t('shareExperience')}
        </button>
      </div>
    </div>
  );
}
