import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section 
      className="py-16 text-white"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
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
          {status === 'success' ? (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-lg font-semibold">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-4 text-gray-900 bg-white rounded-lg focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none text-lg"
                  disabled={status === 'loading'}
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                disabled={status === 'loading'}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                {status === 'loading' ? 'Subscribing...' : buttonText}
              </Button>
              
              {status === 'error' && (
                <div className="flex items-center justify-center space-x-2 text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{message}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-sm opacity-75 mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
