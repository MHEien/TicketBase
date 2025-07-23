export function ImageBlock({ 
  src, 
  alt, 
  caption, 
  size 
}: {
  src: string;
  alt: string;
  caption?: string;
  size: 'sm' | 'md' | 'lg' | 'full';
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'w-full',
  };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto text-center">
        <img 
          src={src} 
          alt={alt}
          className={`${sizeClasses[size]} mx-auto rounded-lg shadow-md`}
        />
        {caption && (
          <p className="mt-4 text-sm text-muted-foreground italic">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
