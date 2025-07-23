import { Button } from '../../../components/ui/Button';

export function CTABlock({ title, subtitle, buttonText, buttonLink, backgroundColor }: {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
}) {
  return (
    <section 
      className="py-16 text-white"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <Button
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.location.href = buttonLink}
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
