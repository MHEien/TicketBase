"use client";

import { useState } from 'react';

interface PaymentMethodProps {
  apiKey: string;
  webhookUrl: string;
  amount: number;
  currency: string;
  orderId?: string;
  customerEmail?: string;
  onSuccess?: (paymentId: string) => void;
}

export default function PaymentMethodComponent({
  apiKey,
  webhookUrl,
  amount,
  currency,
  orderId,
  customerEmail,
  onSuccess
}: PaymentMethodProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    // This is a stub implementation - in a real plugin, this would use the Stripe SDK
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful payment
      const fakePaymentId = `pi_${Math.random().toString(36).substring(2, 10)}`;
      
      if (onSuccess) {
        onSuccess(fakePaymentId);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              id="card-number"
              type="text"
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              disabled={processing}
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                Expiry (MM/YY)
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                disabled={processing}
                required
              />
            </div>
            
            <div className="w-1/2">
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                disabled={processing}
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay ${(amount / 100).toFixed(2)} ${currency}`}
          </button>
        </div>
      </form>
    </div>
  );
} 