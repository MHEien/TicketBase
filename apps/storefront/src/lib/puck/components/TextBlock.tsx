export function TextBlock({ text, alignment, size }: {
  text: string;
  alignment: 'left' | 'center' | 'right';
  size: 'sm' | 'md' | 'lg';
}) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`py-8 ${alignmentClasses[alignment]}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`${sizeClasses[size]} text-gray-700 leading-relaxed whitespace-pre-wrap`}
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  );
}
