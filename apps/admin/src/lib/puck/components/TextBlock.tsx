export function TextBlock({ 
  text, 
  alignment, 
  size 
}: {
  text: string;
  alignment: 'left' | 'center' | 'right';
  size: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`py-8 px-4 ${alignmentClasses[alignment]}`}>
      <div className="max-w-4xl mx-auto">
        <p className={`${sizeClasses[size]} whitespace-pre-wrap`}>
          {text}
        </p>
      </div>
    </div>
  );
}
