import { useState } from 'react'
import { ImagePlus } from 'lucide-react'

/**
 * An <img> that lazy-loads, fades in, and — if the file doesn't exist yet —
 * shows an elegant placeholder telling you exactly which file to add.
 */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', eager = false, style, position }) {
  const [status, setStatus] = useState('loading')
  const fileName = src?.split('/').pop()

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {status === 'error' || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-blush-200 via-blush-100 to-blush-300 p-3 text-center text-rose-ink/70">
          <ImagePlus className="h-6 w-6 opacity-70" strokeWidth={1.4} />
          <span className="font-display text-sm italic sm:text-base">Your photo here</span>
          {fileName && (
            <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[10px] tracking-tight">
              public/images/{fileName}
            </span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          style={position ? { objectPosition: position } : undefined}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
      {status === 'loading' && src && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-br from-blush-200 to-blush-100" />
      )}
    </div>
  )
}
