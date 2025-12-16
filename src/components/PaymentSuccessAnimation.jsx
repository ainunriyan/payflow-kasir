import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

const PaymentSuccessAnimation = ({ show, onComplete }) => {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
        <Check size={24} className="text-white animate-pulse font-bold" strokeWidth={3} />
      </div>
    </div>
  );
};

export default PaymentSuccessAnimation;