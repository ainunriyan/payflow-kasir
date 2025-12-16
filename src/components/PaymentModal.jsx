import React, { useState, useEffect } from 'react';
import { X, Banknote, Smartphone, Wallet, CreditCard, Clock, CheckCircle } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

const PaymentModal = ({ 
  show,
  paymentMethod,
  cashAmount,
  setCashAmount,
  customerName,
  tableNumber,
  total,
  calculateChange,
  formatCurrency,
  onMethodSelect,
  onCashPayment,
  onBack,
  onClose,
  paymentSettings
}) => {
  const [paymentTimeout, setPaymentTimeout] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  useEffect(() => {
    if (paymentMethod && paymentMethod !== 'cash' && paymentMethod !== '') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            alert('Waktu pembayaran habis. Silakan coba lagi.');
            onBack();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [paymentMethod, onBack]);
  
  const checkPaymentMethodConfig = (methodId, settings) => {
    if (methodId === 'cash') return true;
    if (methodId === 'qris') return settings?.qrisCode;
    // E-wallets now use QR codes - always available
    if (methodId === 'gopay' || methodId === 'ovo' || methodId === 'dana' || methodId === 'shopeepay') return true;
    if (methodId === 'debit' || methodId === 'credit') return settings?.bankAccount;
    return false;
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!show) return null;

  const paymentMethods = [
    { id: 'cash', name: 'Tunai / Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'qris', name: 'QRIS', icon: Smartphone, color: 'bg-blue-500' },
    { id: 'gopay', name: 'GoPay', icon: Wallet, color: 'bg-green-600' },
    { id: 'ovo', name: 'OVO', icon: Wallet, color: 'bg-purple-600' },
    { id: 'dana', name: 'DANA', icon: Wallet, color: 'bg-blue-600' },
    { id: 'shopeepay', name: 'ShopeePay', icon: Wallet, color: 'bg-orange-500' },
    { id: 'debit', name: 'Kartu Debit', icon: CreditCard, color: 'bg-gray-600' },
    { id: 'credit', name: 'Kartu Kredit', icon: CreditCard, color: 'bg-yellow-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Pilih Metode Pembayaran</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nama:</span>
            <span className="font-semibold text-purple-600">{customerName}</span>
          </div>
          {tableNumber && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Meja:</span>
              <span className="font-semibold text-green-600">{tableNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>

        {paymentMethod === '' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                const isConfigured = checkPaymentMethodConfig(method.id, paymentSettings);
                
                return (
                  <button
                    key={method.id}
                    onClick={() => isConfigured ? onMethodSelect(method.id) : alert(`${method.name} belum dikonfigurasi. Hubungi admin.`)}
                    className={`${isConfigured ? method.color : 'bg-gray-400'} text-white p-4 rounded-lg hover:opacity-90 transition-all flex flex-col items-center gap-2 relative`}
                    disabled={!isConfigured && method.id !== 'cash'}
                  >
                    <Icon size={32} />
                    <span className="text-sm font-medium text-center">{method.name}</span>
                    {!isConfigured && method.id !== 'cash' && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">!</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Split Payment Option */}
            <div className="border-t pt-4">
              <button
                onClick={() => onMethodSelect('split')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                <span className="font-medium">Pembayaran Kombinasi</span>
              </button>
            </div>
          </div>
        ) : paymentMethod === 'cash' ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Jumlah Uang yang Diterima:</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => {
                  setCashAmount(e.target.value);
                  // Update payment info real-time
                  const cash = parseFloat(e.target.value) || 0;
                  const paymentInfo = {
                    method: 'cash',
                    methodName: 'Tunai / Cash',
                    total: total,
                    cashPaid: cash > 0 ? cash : null,
                    change: cash > 0 ? cash - total : 0,
                    timestamp: Date.now()
                  };
                  localStorage.setItem('currentPayment', JSON.stringify(paymentInfo));
                }}
                placeholder="Masukkan jumlah uang"
                className="w-full px-4 py-3 text-xl border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>

            {cashAmount && parseFloat(cashAmount) >= total && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Kembalian:</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateChange())}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {[10000, 20000, 50000, 100000, 150000, 200000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setCashAmount(amount.toString());
                    // Update payment info when quick amount selected
                    const paymentInfo = {
                      method: 'cash',
                      methodName: 'Tunai / Cash',
                      total: total,
                      cashPaid: amount,
                      change: amount - total,
                      timestamp: Date.now()
                    };
                    localStorage.setItem('currentPayment', JSON.stringify(paymentInfo));
                  }}
                  className="py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={onCashPayment}
                disabled={!cashAmount || parseFloat(cashAmount) < total}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proses Pembayaran
              </button>
              <button
                onClick={onBack}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : (
          // Digital payment methods - show payment info
          <div className="space-y-4">
            {/* Payment Timer */}
            {paymentMethod !== 'cash' && (
              <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Waktu tersisa: {formatTime(timeLeft)}
                </span>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <h4 className="font-semibold text-lg mb-2">Pembayaran {paymentMethods.find(m => m.id === paymentMethod)?.name}</h4>
              <p className="text-2xl font-bold text-blue-600 mb-4">{formatCurrency(total)}</p>
              
              {paymentMethod === 'qris' && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-3">QRIS Payment:</p>
                  {paymentSettings?.qrisCode ? (
                    <div>
                      <QRCodeGenerator text={paymentSettings.qrisCode} size={200} />
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✅ QR QRIS Resmi - Bisa discan langsung
                      </p>
                      <p className="text-xs text-gray-500">Dari: {paymentSettings.qrisProvider || 'Payment Gateway'}</p>
                    </div>
                  ) : (
                    <div>
                      <QRCodeGenerator text={`DEMO-QRIS-${Date.now()}-${total}-${customerName}`} size={200} />
                      <p className="text-xs text-yellow-600 mt-2 font-medium">
                        ⚠️ QR Demo Mode - Untuk testing saja
                      </p>
                      <p className="text-xs text-gray-500">Setup QRIS resmi di Pengaturan Pembayaran</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Nominal: {formatCurrency(total)}
                  </p>
                </div>
              )}
              
              {(paymentMethod === 'gopay' || paymentMethod === 'ovo' || paymentMethod === 'dana' || paymentMethod === 'shopeepay') && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-3">Scan QR Code {paymentMethods.find(m => m.id === paymentMethod)?.name}:</p>
                  <div className="bg-white p-4 rounded border">
                    <QRCodeGenerator 
                      text={`${paymentMethod.toUpperCase()}://pay?amount=${total}&merchant=${encodeURIComponent(customerName)}&note=${encodeURIComponent(`Pembayaran ${paymentMethods.find(m => m.id === paymentMethod)?.name} - ${formatCurrency(total)}`)}`} 
                      size={200} 
                    />
                    <p className="text-sm text-gray-600 mt-3">Nominal: {formatCurrency(total)}</p>
                    <p className="text-xs text-gray-500">Customer: {customerName}</p>
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      ✅ Scan dengan app {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Atau buka app → Scan → Arahkan ke QR Code
                    </p>
                  </div>
                </div>
              )}
              
              {(paymentMethod === 'debit' || paymentMethod === 'credit') && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Transfer ke rekening:</p>
                  {paymentSettings?.bankName && paymentSettings?.bankAccount ? (
                    <div>
                      <p className="font-bold">{paymentSettings.bankName}</p>
                      <p className="font-mono text-lg">{paymentSettings.bankAccount}</p>
                    </div>
                  ) : (
                    <p className="text-red-600 font-medium">Rekening belum diatur - Hubungi admin</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Simulate payment verification
                  const confirmed = window.confirm('Apakah pembayaran sudah diterima?');
                  if (confirmed) {
                    onMethodSelect(paymentMethod);
                  }
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Konfirmasi Pembayaran Diterima
              </button>
              <button
                onClick={onBack}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;