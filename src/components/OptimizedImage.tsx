import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!imageRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '50px'
      }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [priority]);

  // Generowanie srcSet dla różnych rozmiarów i formatów
  const generateSrcSet = (imagePath: string) => {
    const sizes = [320, 640, 960, 1280];
    const formats = ['webp', 'jpg'];
    
    return formats.map(format => 
      sizes.map(size => 
        `${imagePath}?w=${size}&fm=${format} ${size}w`
      ).join(', ')
    ).join(', ');
  };

  // Opisy alternatywne dla dostępności
  const generateAltText = (alt: string) => {
    if (!alt) return '';
    // Dodaj kontekst jeśli alt jest krótki
    return alt.length < 20 ? `Image of ${alt}` : alt;
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? width/height : 'auto' }}>
      {/* Placeholder podczas ładowania */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: width && height ? width/height : 'auto' }}
        />
      )}
      
      {/* Właściwy obrazek */}
      {(priority || isInView) && (
        <img
          ref={imageRef}
          src={src}
          alt={generateAltText(alt)}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoading(false)}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
    </div>
  );
}
