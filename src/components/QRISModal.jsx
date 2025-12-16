import React, { useState, useEffect } from 'react';
import { X, Smartphone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

const QRISModal = ({ 
  show, 
  paymentMethodName, 
  total, 
  customerName, 
  tableNumber,
  formatCurrency,
  onConfirm, 
  onClose 
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [paymentStatus, setPaymentStatus] = useState('waiting'); // waiting, confirmed, expired
  
  useEffect(() => {
    if (show) {
      setTimeLeft(300);
      setPaymentStatus('waiting');
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [show]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleConfirm = () => {
    setPaymentStatus('confirmed');
    setTimeout(() => {
      onConfirm();
    }, 1000);
  };
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Scan {paymentMethodName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="text-center space-y-4">
          {/* Timer */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            timeLeft > 60 ? 'bg-green-50 border-green-200' : 
            timeLeft > 30 ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          } border`}>
            <Clock size={16} className={timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600'} />
            <span className={`text-sm font-medium ${
              timeLeft > 60 ? 'text-green-800' : 
              timeLeft > 30 ? 'text-yellow-800' : 
              'text-red-800'
            }`}>
              {paymentStatus === 'expired' ? 'Waktu Habis' : `Waktu tersisa: ${formatTime(timeLeft)}`}
            </span>
          </div>
          
          {paymentStatus === 'waiting' && (
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="w-64 h-64 mx-auto bg-gray-50 p-4 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Scan QR Code untuk Pembayaran</p>
                  <div className="w-48 h-48 bg-white rounded border flex items-center justify-center">
                    <QRCodeGenerator text={`Pembayaran ${paymentMethodName} - Nominal: ${formatCurrency(total)} - Customer: ${customerName} ${tableNumber ? '- Meja: ' + tableNumber : ''}`} size={180} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {paymentStatus === 'confirmed' && (
            <div className="bg-green-50 p-8 rounded-lg border border-green-200">
              <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-green-800 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-green-600">Transaksi sedang diproses...</p>
            </div>
          )}
          
          {paymentStatus === 'expired' && (
            <div className="bg-red-50 p-8 rounded-lg border border-red-200">
              <AlertCircle size={64} className="text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-2">Waktu Pembayaran Habis</h3>
              <p className="text-red-600">Silakan ulangi proses pembayaran</p>
            </div>
          )}

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-bold">
              ✅ {paymentMethodName === 'QRIS' ? 
                'Scan dengan app e-wallet apapun yang support QRIS' : 
                `Scan dengan app ${paymentMethodName}`
              }
            </p>
            <p className="text-xs text-green-600 mt-1">
              {paymentMethodName === 'QRIS' ? 
                'DANA, GoPay, OVO, ShopeePay, LinkAja, dll' :
                `Buka app ${paymentMethodName} → Scan → Arahkan ke QR Code`
              }
            </p>
          </div>

          <div className="flex gap-2">
            {paymentStatus === 'waiting' && (
              <>
                <button
                  onClick={handleConfirm}
                  disabled={timeLeft <= 0}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Konfirmasi Pembayaran Diterima
                </button>
                <button
                  onClick={onClose}
                  className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </>
            )}
            
            {paymentStatus === 'expired' && (
              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRISModal;