import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Ojoa Global Homes',
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1C3D] via-[#132B57] to-[#0B1C3D] text-white/80 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Building2 className="h-8 w-8 text-[#C6A254] mb-2" strokeWidth={1.5} />
        <span className="text-xs tracking-wide text-white/75 max-w-[18ch] truncate">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
