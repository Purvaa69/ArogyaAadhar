import React from 'react';

/**
 * AppLogo — renders the "Arogya Aadhar" brand heading
 * with teal "Arogya", orange "Aadhar" and ECG heartbeat underline.
 * 
 * Props:
 *  size   — 'sm' | 'md' | 'lg'  (default: 'md')
 *  style  — optional extra style for the wrapper
 */
export default function AppLogo({ size = 'md', style = {} }) {
  const sizes = {
    sm: { fontSize: 18, lineWidth: 120, lineHeight: 10 },
    md: { fontSize: 24, lineWidth: 160, lineHeight: 13 },
    lg: { fontSize: 34, lineWidth: 220, lineHeight: 18 },
  };
  const { fontSize, lineWidth, lineHeight } = sizes[size] || sizes.md;

  /* ECG polyline scaled to lineWidth × lineHeight */
  const w = lineWidth;
  const h = lineHeight;
  const mid = h / 2;
  // baseline flat → small blip → sharp spike up → down → small bump → flat
  const points = [
    `0,${mid}`,
    `${w * 0.30},${mid}`,
    `${w * 0.38},${mid - h * 0.15}`,
    `${w * 0.44},${mid + h * 0.55}`,
    `${w * 0.50},${mid - h * 0.85}`,
    `${w * 0.56},${mid + h * 0.55}`,
    `${w * 0.62},${mid}`,
    `${w * 0.70},${mid}`,
    `${w},${mid}`,
  ].join(' ');

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', ...style }}>
      {/* Brand name text */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize,
          fontWeight: 800,
          color: '#0F8F82',          /* teal */
          fontFamily: 'var(--font-body)',
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}>
          Arogya
        </span>
        <span style={{
          fontSize,
          fontWeight: 800,
          color: '#E07428',          /* orange */
          fontFamily: 'var(--font-body)',
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}>
          Aadhar
        </span>
      </div>

      {/* ECG heartbeat underline */}
      <svg
        width={lineWidth}
        height={lineHeight + 2}
        viewBox={`0 0 ${lineWidth} ${lineHeight + 2}`}
        style={{ marginTop: 1 }}
      >
        <polyline
          points={points}
          fill="none"
          stroke="#E07428"
          strokeWidth={size === 'lg' ? 2 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
