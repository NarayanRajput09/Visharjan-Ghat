import { useState } from 'react';
import { Waves, ImageOff } from 'lucide-react';

type Props = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  aspectRatio?: string;
};

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className = '',
  overlay = false,
  aspectRatio = 'aspect-video',
}: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-slate-900`}>
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => {
            if (fallbackSrc && src !== fallbackSrc) {
              // try fallback image
              setError(false);
            } else {
              setError(true);
            }
            setLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400">
          <Waves className="w-8 h-8 text-teal-400/60 mb-2" />
          <span className="text-xs text-center font-medium text-slate-400">{alt}</span>
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <ImageOff className="w-3 h-3" /> Visual preview
          </span>
        </div>
      )}

      {/* Subtle Navy Overlay when text is over hero or preview */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/50 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
