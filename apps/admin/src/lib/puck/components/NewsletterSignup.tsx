import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';

export function NewsletterSignup({ 
  title, 
  subtitle, 
  placeholder, 
  buttonText, 
  backgroundColor,
  showBenefits,
  benefits 
}: {
  title: string;
  subtitle?: string;
  placeholder: string;
  buttonText: string;
  backgroundColor: string;
  showBenefits: boolean;
  benefits: string[];
}) {
  return (
    <section 
      className="py-16 text-white"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">{subtitle}</p>
          )}
        </div>

        {/* Benefits */}
        {showBenefits && benefits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-sm opacity-90">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Signup Form */}
        <div className="max-w-md mx-auto">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder={placeholder}
              className="w-full px-4 py-4 text-gray-900 bg-white rounded-lg text-lg"
            />
            <Button
              size="lg"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 rounded-lg text-lg"
            >
              {buttonText}
            </Button>
          </div>
        </div>

        <p className="text-sm opacity-75 mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
