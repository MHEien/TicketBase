import { Button } from '@repo/ui/components/ui/button';

export function ButtonBlock({ 
  text, 
  link, 
  variant, 
  size, 
  fullWidth 
}: {
  text: string;
  link: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth: boolean;
}) {
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Button 
          variant={variant} 
          size={size}
          className={fullWidth ? 'w-full' : ''}
          onClick={() => {
            if (link.startsWith('http')) {
              window.open(link, '_blank');
            } else {
              // In admin preview, just show the link
              alert(`Would navigate to: ${link}`);
            }
          }}
        >
          {text}
        </Button>
      </div>
    </div>
  );
}
