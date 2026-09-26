import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import Toast from '../../components/Toast';

// Hardcoded PM-JAY empanelled hospitals for Pune, Kothrud area with real geolocations
const hospitalData = {
  MAHARASHTRA: {
    PUNE: [
      {
        name: 'Shashwat Hospital Kothrud Pune',
        address: '22, Happy Colony Kothrud Pune,',
        phone: '9146348428',
        lat: 18.5074,
        lng: 73.8077,
        services: ['General Surgery', 'Orthopaedics', 'Gynaecology', 'ENT'],
        beds: 35,
        mitraHours: '9:00 AM – 6:00 PM',
      },
      {
        name: 'Deoyani Hospital',
        address: 'Dhanukar Colony Lane No 4 Kothrud Pune,',
        phone: '9623633178',
        lat: 18.5058,
        lng: 73.8105,
        services: ['General Medicine', 'Paediatrics', 'Cardiology', 'Dermatology'],
        beds: 28,
        mitraHours: '8:00 AM – 8:00 PM',
      },
      {
        name: 'Pmc Jayabai Sutar Hospital',
        address: 'Late Jayabai Sutar Hospital Near Vegetable Market Gujrat Colony Kothrud,',
        phone: '9689931315',
        lat: 18.5042,
        lng: 73.8120,
        services: ['Emergency', 'General Medicine', 'Maternity', 'Burns'],
        beds: 52,
        mitraHours: '24 hours',
      },
      {
        name: 'Sahyadri Super Speciality Hospital',
        address: 'Plot No. 30-C, Erandwane, Karve Road, Pune,',
        phone: '020-67215000',
        lat: 18.5018,
        lng: 73.8277,
        services: ['Cardiac Surgery', 'Neurosurgery', 'Oncology', 'Nephrology'],
        beds: 45,
        mitraHours: '9:00 AM – 5:00 PM',
      },
      {
        name: 'Aditya Birla Memorial Hospital',
        address: 'Aditya Birla Hospital Marg, Thergaon, Pune,',
        phone: '020-30717171',
        lat: 18.6126,
        lng: 73.7638,
        services: ['Joint Replacement', 'Dialysis', 'ICU', 'Urology'],
        beds: 38,
        mitraHours: '8:00 AM – 6:00 PM',
      },
    ],
  },
};

const statesList = ['MAHARASHTRA', 'DELHI', 'KARNATAKA', 'TAMIL NADU', 'UTTAR PRADESH', 'GUJARAT', 'RAJASTHAN'];
const districtMap = {
  MAHARASHTRA: ['PUNE', 'MUMBAI', 'NAGPUR', 'NASHIK', 'AURANGABAD'],
  DELHI: ['NEW DELHI', 'CENTRAL DELHI', 'SOUTH DELHI'],
  KARNATAKA: ['BENGALURU', 'MYSURU', 'HUBLI'],
  'TAMIL NADU': ['CHENNAI', 'COIMBATORE', 'MADURAI'],
  'UTTAR PRADESH': ['LUCKNOW', 'VARANASI', 'AGRA'],
  GUJARAT: ['AHMEDABAD', 'SURAT', 'VADODARA'],
  RAJASTHAN: ['JAIPUR', 'JODHPUR', 'UDAIPUR'],
};

export default function HospitalFinder({ onBack }) {
  const { t } = useLanguage();
  const { speak } = useVoice();

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showMitraInfo, setShowMitraInfo] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    speak(t('findHospital'));
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Find hospitals near user's current location
  const handleFindNearMe = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setToast('Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Get all hospitals from all regions
        const allHospitals = [];
        Object.values(hospitalData).forEach(state => {
          Object.values(state).forEach(districtHospitals => {
            allHospitals.push(...districtHospitals);
          });
        });

        // Calculate distances and sort
        const withDistance = allHospitals.map(h => ({
          ...h,
          distance: getDistance(latitude, longitude, h.lat, h.lng),
        })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        setSelectedState('MAHARASHTRA');
        setSelectedDistrict('PUNE');
        setResults(withDistance);
        setLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setToast('Unable to get your location. Please search manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search hospitals by state/district
  const handleSearch = () => {
    const stateHospitals = hospitalData[selectedState];
    if (stateHospitals && stateHospitals[selectedDistrict]) {
      const hospitals = stateHospitals[selectedDistrict].map(h => ({
        ...h,
        distance: userLocation
          ? getDistance(userLocation.lat, userLocation.lng, h.lat, h.lng)
          : null,
      }));
      setResults(hospitals);
    } else {
      // No data for this state/district, show Pune hospitals as demo
      setToast('Showing demo results for Pune, Maharashtra');
      const demo = hospitalData.MAHARASHTRA.PUNE.map(h => ({
        ...h,
        distance: null,
      }));
      setResults(demo);
    }
  };

  // Open Google Maps directions
  const openDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Open phone dialer
  const callHospital = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  // ─── Hospital Detail View ─────────────────────────────────────────────────
  if (selectedHospital) {
    const h = selectedHospital;
    return (
      <div className="page-sim">
        <div className="top-bar">
          <button className="back-btn" onClick={() => setSelectedHospital(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span className="top-bar-title" style={{ fontSize: 16 }}>{h.name}</span>
          <div style={{ width: 40 }}/>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ animation: 'fadeSlideUp 0.35s ease' }}>
            <span className="badge badge-success" style={{ marginBottom: 12, display: 'inline-flex' }}>✓ {t('pmjayBadge')}</span>

            {/* Google Map embed */}
            <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 16, border: '1px solid var(--border)', height: 200 }}>
              <iframe
                title="Hospital Location"
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${h.lat},${h.lng}&z=15&output=embed`}
              />
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 6 }}>{t('addressLabel')}</h4>
              <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.5 }}>{h.address}</p>
              {h.distance && (
                <p className="text-xs" style={{ color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>📏 {h.distance} km away</p>
              )}
            </div>
            
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 12 }}>{t('services')}</h4>
              <div className="flex flex-wrap gap-sm">
                {h.services.map(s => (
                  <span key={s} className="chip" style={{ cursor: 'default', fontSize: 13 }}>{s}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 8 }}>{t('ayushmanMitra')}</h4>
              <p className="text-sm" style={{ marginBottom: 4, color: 'var(--text)' }}>Hours: {h.mitraHours}</p>
              <p className="text-sm text-muted">📞 {h.phone}</p>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 8 }}>{t('bedAvailability')}</h4>
              <div className="flex items-center gap-md">
                <div style={{ flex: 1 }}>
                  <div className="progress-bar-wrap" style={{ height: 10 }}>
                    <div className="progress-bar-fill" style={{ width: `${(h.beds / 80) * 100}%`, background: h.beds > 30 ? 'var(--success)' : 'var(--warning)' }}/>
                  </div>
                </div>
                <span className="font-semibold" style={{ color: h.beds > 30 ? 'var(--success)' : 'var(--warning)' }}>{h.beds} available</span>
              </div>
            </div>

            <div style={{ background: 'var(--primary-bg)', border: '2px solid var(--primary)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
              <p className="font-semibold" style={{ color: 'var(--primary)', fontSize: 15 }}>
                💳 {t('showQrDesk')}
              </p>
            </div>

            <button className="btn btn-primary btn-full" style={{ marginBottom: 12 }} onClick={() => openDirections(h)}>
              📍 {t('getDirections')}
            </button>

            <button className="btn btn-outline btn-full" style={{ marginBottom: 16 }} onClick={() => callHospital(h.phone)}>
              {t('callHospital')}
            </button>

            {/* Teaching moment */}
            <div className="card-warning" style={{ padding: 16, borderRadius: 'var(--radius)', cursor: 'pointer' }} onClick={() => setShowMitraInfo(!showMitraInfo)}>
              <div className="flex items-center gap-sm" style={{ marginBottom: showMitraInfo ? 10 : 0 }}>
                <span style={{ fontSize: 20 }}>🤝</span>
                <h4 style={{ fontSize: 15, color: '#92400E' }}>{t('whatIsMitra')}</h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" style={{ marginLeft: 'auto', transform: showMitraInfo ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {showMitraInfo && (
                <p className="text-sm" style={{ color: '#92400E', lineHeight: 1.6 }}>
                  {t('mitraExplanation')}
                </p>
              )}
            </div>
          </div>
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ─── Results View ─────────────────────────────────────────────────────────
  if (results) {
    return (
      <div className="page-sim" style={{ paddingBottom: 80 }}>
        {/* PM-JAY branded header */}
        <div style={{
          background: 'linear-gradient(135deg, #00B4D8, #6C63FF, #9B5DE5)',
          padding: '16px 16px 24px',
          borderRadius: '0 0 24px 24px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button className="back-btn" onClick={() => setResults(null)} style={{ position: 'absolute', left: 16, top: 16, color: 'white' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'white',
            margin: '8px auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            <span style={{ fontSize: 32 }}>🏥</span>
          </div>
          <p style={{ color: 'white', fontSize: 11, fontWeight: 600, opacity: 0.9 }}>PM-JAY</p>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          {/* Result count */}
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0891B2', marginBottom: 16 }}>
            {results.length} {t('hospitalSearchResults')}
          </p>

          {/* Hospital cards */}
          <div className="flex flex-col gap-md">
            {results.map((h, i) => (
              <div
                key={i}
                onClick={() => setSelectedHospital(h)}
                style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  animation: `fadeSlideUp 0.35s ease ${i * 0.06}s both`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
              >
                <div className="flex items-start gap-md">
                  {/* Hospital icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 26 }}>🏥</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', marginBottom: 4, lineHeight: 1.3 }}>
                      {h.name}
                    </h4>
                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4, marginBottom: 6 }}>
                      {h.address}
                    </p>
                    {h.distance && (
                      <span style={{ fontSize: 11, color: '#0891B2', fontWeight: 600, background: '#E0F7FA', padding: '2px 8px', borderRadius: 10 }}>
                        📏 {h.distance} km
                      </span>
                    )}
                  </div>

                  {/* Accessibility icon */}
                  <div style={{ flexShrink: 0, color: '#0891B2', opacity: 0.5 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="4" r="2"/>
                      <path d="M12 6v6m-4 4h8m-8-4l4 4m0 0l4-4"/>
                    </svg>
                  </div>
                </div>

                {/* Phone + Directions */}
                <div className="flex items-center justify-between" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={e => { e.stopPropagation(); callHospital(h.phone); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#2563EB', fontWeight: 600, fontSize: 14,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    📞 {h.phone}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); openDirections(h); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 12px', borderRadius: 20,
                      background: '#EEF2FF', border: '1px solid #C7D2FE',
                      color: '#4338CA', fontWeight: 600, fontSize: 12,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}
                  >
                    {t('directions')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ─── Search Form View ─────────────────────────────────────────────────────
  return (
    <div className="page-sim">
      {/* PM-JAY branded header */}
      <div style={{
        background: 'linear-gradient(135deg, #00B4D8, #6C63FF, #9B5DE5)',
        padding: '16px 16px 32px',
        borderRadius: '0 0 24px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <button className="back-btn" onClick={onBack} style={{ position: 'absolute', left: 16, top: 16, color: 'white' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', background: 'white',
          margin: '8px auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: 36 }}>🏥</span>
        </div>
        <p style={{ color: 'white', fontSize: 12, fontWeight: 600, opacity: 0.9 }}>PM-JAY</p>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* Title */}
        <h3 style={{ textAlign: 'center', color: '#0891B2', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          {t('findHospitalsTitle')}
        </h3>

        {/* Find Near Me button */}
        <button
          onClick={handleFindNearMe}
          disabled={locating}
          style={{
            width: '100%', padding: '14px 20px',
            borderRadius: 12, border: '2px solid #0891B2',
            background: 'white', color: '#0891B2',
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)',
          }}
        >
          {locating ? (
            <>
              <span style={{
                width: 18, height: 18, border: '2px solid #0891B2',
                borderTopColor: 'transparent', borderRadius: '50%',
                display: 'inline-block', animation: 'spin 0.8s linear infinite',
              }}/>
              {t('locating')}
            </>
          ) : (
            <>
              {t('findNearMe')}
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', color: '#9CA3AF', fontWeight: 600, marginBottom: 16 }}>{t('or')}</p>

        {/* State */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>
            {t('state')}<span style={{ color: '#DC2626' }}>*</span>
          </label>
          <select
            value={selectedState}
            onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: '1.5px solid #D1D5DB', fontSize: 15, fontWeight: 600,
              color: '#1E293B', background: 'white', cursor: 'pointer',
              fontFamily: 'var(--font-body)', appearance: 'auto',
            }}
          >
            <option value="">{t('selectStatePlaceholder')}</option>
            {statesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* District */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>{t('district')}</label>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: '1.5px solid #D1D5DB', fontSize: 15, fontWeight: 600,
              color: '#1E293B', background: 'white', cursor: 'pointer',
              fontFamily: 'var(--font-body)', appearance: 'auto',
              opacity: selectedState ? 1 : 0.5,
            }}
          >
            <option value="">{t('selectDistrictPlaceholder')}</option>
            {(districtMap[selectedState] || []).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Pincode */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>{t('pincode')}</label>
          <input
            type="text"
            value={pincode}
            onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="411038"
            maxLength={6}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: '1.5px solid #D1D5DB', fontSize: 15, fontWeight: 600,
              color: '#1E293B', background: 'white',
              fontFamily: 'var(--font-body)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={!selectedState}
          style={{
            width: '100%', padding: '14px 20px',
            borderRadius: 30,
            background: (!selectedState) ? '#D1D5DB' : 'linear-gradient(135deg, #00B4D8, #6C63FF)',
            color: 'white', border: 'none',
            fontSize: 16, fontWeight: 800,
            cursor: selectedState ? 'pointer' : 'not-allowed',
            letterSpacing: 1,
            fontFamily: 'var(--font-body)',
            boxShadow: selectedState ? '0 4px 16px rgba(108,99,255,0.3)' : 'none',
          }}
        >
          {t('findHospitalsBtn')}
        </button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
