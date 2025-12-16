import React, { useState, useEffect } from 'react';
import { Coffee, Package, ShoppingCart, QrCode } from 'lucide-react';
import PaymentSuccessAnimation from './PaymentSuccessAnimation';

const CustomerDisplayOnly = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'PAYFLOW',
    logo: ''
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load cart data
        const cartData = localStorage.getItem('currentCart');
        if (cartData) {
          const parsedCart = JSON.parse(cartData);
          setCart(parsedCart);
          
          // Calculate total
          const cartTotal = parsedCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
          setTotal(cartTotal);
        }

        // Load store settings
        const settingsData = localStorage.getItem('storeSettings');
        if (settingsData) {
          setStoreSettings(JSON.parse(settingsData));
        }

        // Load payment info
        const paymentData = localStorage.getItem('currentPayment');
        if (paymentData) {
          const payment = JSON.parse(paymentData);
          setPaymentInfo(payment);
          
          // Show success animation if payment is completed
          if (payment.status === 'completed' && !showSuccessAnimation) {
            setShowSuccessAnimation(true);
          }
        }
      } catch (error) {
        console.log('Error loading data:', error);
      }
    };

    // Load initial data
    loadData();

    // Listen for storage changes (real-time sync)
    const handleStorageChange = (e) => {
      if (e.key === 'currentCart' || e.key === 'storeSettings' || e.key === 'currentPayment') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for payment cleared events
    const handlePaymentCleared = () => {
      setPaymentInfo(null);
      setShowSuccessAnimation(false);
    };
    window.addEventListener('paymentCleared', handlePaymentCleared);

    // Poll for changes every 500ms (fallback for same-origin updates)
    const interval = setInterval(loadData, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('paymentCleared', handlePaymentCleared);
      clearInterval(interval);
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateQRCode = (paymentMethod, amount) => {
    // Generate QR code data based on payment method
    const qrData = {
      merchant: storeSettings.storeName || 'PAYFLOW',
      amount: amount,
      method: paymentMethod,
      timestamp: Date.now()
    };
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        <div className="text-gray-800 p-6 rounded-lg shadow-xl border border-blue-200" style={{backgroundColor: '#AAC4F5'}}>
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
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/30">
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

          {/* Payment Section */}
          {paymentInfo && (
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/40">
              {paymentInfo.status === 'completed' ? (
                // Payment Completed
                <div className="text-center">
                  <div className="bg-green-500 text-white p-3 rounded-lg mb-3">
                    <h3 className="text-lg font-semibold">✅ Pembayaran Berhasil!</h3>
                  </div>
                  <p className="text-black font-medium">
                    {paymentInfo.methodName || paymentInfo.method.toUpperCase()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    Total: {formatCurrency(total)}
                  </p>
                  {paymentInfo.method === 'cash' && paymentInfo.cashPaid && (
                    <div className="mt-3 space-y-1">
                      <p className="text-gray-700 text-sm">
                        Uang Diterima: {formatCurrency(paymentInfo.cashPaid)}
                      </p>
                      <p className="text-gray-700 text-sm">
                        Kembalian: {formatCurrency(paymentInfo.change || 0)}
                      </p>
                    </div>
                  )}
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    Terima kasih atas kunjungan Anda!
                  </p>
                </div>
              ) : paymentInfo.method === 'cash' ? (
                // Cash Payment Process
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    💰 Pembayaran Tunai
                  </h3>
                  <div className="space-y-2">
                    <p className="text-black font-medium">
                      Total: {formatCurrency(total)}
                    </p>
                    {paymentInfo.cashPaid && (
                      <>
                        <p className="text-gray-700 text-sm">
                          Uang Diterima: {formatCurrency(paymentInfo.cashPaid)}
                        </p>
                        <p className="text-gray-700 text-sm">
                          Kembalian: {formatCurrency(paymentInfo.change || 0)}
                        </p>
                      </>
                    )}
                    <p className="text-blue-600 text-sm mt-2">
                      {paymentInfo.cashPaid ? 'Menunggu konfirmasi...' : 'Menunggu pembayaran tunai...'}
                    </p>
                  </div>
                </div>
              ) : (
                // Non-Cash Payment (QR Code)
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    📱 Scan QR Code untuk Pembayaran
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg mb-3">
                      <img 
                        src={generateQRCode(paymentInfo.method, total)}
                        alt="QR Code Payment"
                        className="w-32 h-32"
                      />
                    </div>
                    <p className="text-black font-medium">
                      {paymentInfo.methodName || paymentInfo.method.toUpperCase()}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Total: {formatCurrency(total)}
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      Menunggu pembayaran...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6">
            {showSuccessAnimation ? (
              <PaymentSuccessAnimation
                show={showSuccessAnimation}
                onComplete={() => setShowSuccessAnimation(false)}
              />
            ) : (
              <div className="text-gray-700">
                <p className="text-sm">
                  {paymentInfo 
                    ? paymentInfo.status === 'completed'
                      ? 'Transaksi selesai'
                      : paymentInfo.method === 'cash'
                        ? 'Silakan lakukan pembayaran tunai'
                        : 'Silakan scan QR code di atas'
                    : 'Silakan lakukan pembayaran'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplayOnly;