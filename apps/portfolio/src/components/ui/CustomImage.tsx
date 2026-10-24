import React, { useState, useEffect, useRef } from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
}

export const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            if (imageRef.current) {
              observerRef.current?.unobserve(imageRef.current);
            }
          }
        });
      },
      { rootMargin: '100px' } // Load slightly before coming into viewport
    );

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto'
  };

  return (
    <div
      ref={imageRef}
      className={`relative w-full overflow-hidden rounded-[20px] bg-surface border border-neutral-border select-none ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Blurred Canvas-like Gradient Placeholder to prevent layout shift */}
      <div
        className={`absolute inset-0 w-full h-full bg-gradient-to-tr from-surface via-[#181818] to-neutral-border transition-opacity duration-1000 ease-premium ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {shouldLoad && !error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-premium ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
          }`}
        />
      )}

      {/* Structured Fallback UI on Error or if the image is a vector data URL placeholder */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <svg
            className="w-8 h-8 text-secondary mb-3 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs uppercase tracking-wider text-secondary">{alt}</span>
          <span className="text-[10px] text-secondary opacity-40 mt-1">visual mock ready</span>
        </div>
      )}
    </div>
  );
};
