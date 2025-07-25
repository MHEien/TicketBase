import { Button } from '../../../components/ui/Button';

export function ButtonBlock({ text, href, variant, size, fullWidth }: {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
}) {
  const handleClick = () => {
    if (href.startsWith('http') || href.startsWith('https')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={fullWidth ? 'w-full' : 'text-center'}>
          <Button
            variant={variant}
            size={size}
            className={fullWidth ? 'w-full' : ''}
            onClick={handleClick}
          >
            {text}
          </Button>
        </div>
      </div>
    </div>
  );
}
