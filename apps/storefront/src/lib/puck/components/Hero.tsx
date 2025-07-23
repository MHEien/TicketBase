import { Button } from '../../../components/ui/Button';

export function Hero({ title, subtitle, backgroundImage, showCTA, ctaText, ctaLink }: {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  showCTA: boolean;
  ctaText: string;
  ctaLink: string;
}) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
          backgroundImage ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h1>
        
        {subtitle && (
          <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
            backgroundImage ? 'text-gray-200' : 'text-gray-600'
          }`}>
            {subtitle}
          </p>
        )}
        
        {showCTA && (
          <Button
            size="lg"
            className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-xl"
            onClick={() => window.location.href = ctaLink}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
}
