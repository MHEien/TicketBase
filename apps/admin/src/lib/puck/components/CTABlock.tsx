import { Button } from '@repo/ui/components/ui/button';

export function CTABlock({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  backgroundColor 
}: {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
}) {
  return (
    <section 
      className="py-16 px-4 text-white text-center"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <Button 
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4"
          onClick={() => {
            if (buttonLink.startsWith('http')) {
              window.open(buttonLink, '_blank');
            } else {
              alert(`Would navigate to: ${buttonLink}`);
            }
          }}
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
