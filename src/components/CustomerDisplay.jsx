import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Coffee } from 'lucide-react';
import PaymentSuccessAnimation from './PaymentSuccessAnimation';

const CustomerDisplay = ({ cart, total, formatCurrency, storeSettings }) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const handlePaymentCompleted = () => {
      const currentPayment = localStorage.getItem('currentPayment');
      if (currentPayment) {
        const payment = JSON.parse(currentPayment);
        if (payment.status === 'completed') {
          setPaymentInfo(payment);
          setShowSuccessAnimation(true);
        }
      }
    };

    const handlePaymentCleared = () => {
      setShowSuccessAnimation(false);
      setPaymentInfo(null);
    };

    // Listen for payment events
    window.addEventListener('storage', handlePaymentCompleted);
    window.addEventListener('paymentCompleted', handlePaymentCompleted);
    window.addEventListener('paymentCleared', handlePaymentCleared);

    // Check initial state
    handlePaymentCompleted();

    return () => {
      window.removeEventListener('storage', handlePaymentCompleted);
      window.removeEventListener('paymentCompleted', handlePaymentCompleted);
      window.removeEventListener('paymentCleared', handlePaymentCleared);
    };
  }, []);

  return (
    <div className="text-gray-800 p-4 rounded-lg shadow-xl border border-blue-200 w-full max-w-2xl" style={{backgroundColor: '#AAC4F5'}}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex flex-col items-center mb-3">
          {storeSettings.logo ? (
            <img
              src={storeSettings.logo}
              alt="Logo"
              className="w-16 h-16 object-contain rounded-lg mb-2"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
              <Coffee size={32} className="text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-white">
            {storeSettings.storeName || 'PAYFLOW'}
          </h1>
        </div>
        <p className="text-white">Terima kasih telah berbelanja</p>
      </div>

      {/* Cart Items */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={24} className="text-black" />
          <h2 className="text-xl font-semibold text-black">Pesanan Anda</h2>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-black">
              <Package size={48} className="mx-auto mb-4 opacity-70" />
              <p>Belum ada item</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex justify-between items-center py-2 border-b border-white/30">
                <div className="flex-1">
                  <p className="font-medium text-lg text-black">{item.name}</p>
                  <p className="text-gray-700 text-sm">
                    {formatCurrency(item.price)} x {item.qty}
                  </p>
                  {item.note && (
                    <p className="text-orange-600 text-xs italic">
                      📝 {item.note}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-black">
                    {formatCurrency(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Total */}
      <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-800">TOTAL:</span>
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        {showSuccessAnimation ? (
          <PaymentSuccessAnimation
            show={showSuccessAnimation}
            onComplete={() => setShowSuccessAnimation(false)}
          />
        ) : (
          <div className="text-gray-700">
            <p className="text-sm">Silakan lakukan pembayaran</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDisplay;