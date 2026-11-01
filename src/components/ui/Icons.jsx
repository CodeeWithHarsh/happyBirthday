/* Small decorative SVGs used across sections */

export function HeartShape({ className = '', style, filled = true, strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} aria-hidden="true">
      <path
        d="M16 28.5S3 20.6 3 11.6C3 7.4 6.2 4.5 9.8 4.5c2.6 0 4.8 1.5 6.2 3.6 1.4-2.1 3.6-3.6 6.2-3.6 3.6 0 6.8 2.9 6.8 7.1 0 9-13 16.9-13 16.9z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0C12.6 7 17 11.4 24 12 17 12.6 12.6 17 12 24 11.4 17 7 12.6 0 12 7 11.4 11.4 7 12 0Z" fill="currentColor" />
    </svg>
  )
}
