import { Button } from '@repo/ui/components/ui/button';

export function Hero({ 
  title, 
  subtitle, 
  backgroundImage, 
  showCTA, 
  ctaText, 
  ctaLink 
}: {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  showCTA: boolean;
  ctaText: string;
  ctaLink: string;
}) {
  return (
    <section 
      className="relative py-20 px-4 text-center text-white"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">{subtitle}</p>
        {showCTA && (
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
}
