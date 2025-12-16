import React from 'react';
import { Clock, AlertTriangle, X, Key } from 'lucide-react';

const TrialReminderModal = ({ show, onClose, daysLeft, onBuyLicense }) => {
  if (!show) return null;

  const isExpiringSoon = daysLeft <= 7;
  const isExpired = daysLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {isExpired ? (
                <AlertTriangle className="text-red-600" size={24} />
              ) : (
                <Clock className="text-orange-600" size={24} />
              )}
              <h2 className="text-xl font-bold text-gray-800">
                {isExpired ? 'Trial Expired' : 'Trial Reminder'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-center mb-6">
            {isExpired ? (
              <div>
                <div className="text-6xl mb-2">⏰</div>
                <p className="text-lg font-semibold text-red-600 mb-2">
                  Trial PayFlow Anda telah berakhir
                </p>
                <p className="text-gray-600">
                  Untuk melanjutkan menggunakan semua fitur PayFlow, silakan aktivasi lisensi penuh.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-2">⏳</div>
                <p className="text-lg font-semibold text-orange-600 mb-2">
                  Trial berakhir dalam {daysLeft} hari
                </p>
                <p className="text-gray-600">
                  {isExpiringSoon 
                    ? 'Segera aktivasi lisensi untuk melanjutkan menggunakan PayFlow tanpa gangguan.'
                    : 'Jangan lupa aktivasi lisensi sebelum trial berakhir.'
                  }
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">
              🎯 Dapatkan Lisensi Penuh
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Harga:</span>
                <span className="font-semibold">Rp 150.000</span>
              </div>
              <div className="flex justify-between">
                <span>Lisensi:</span>
                <span>Seumur Hidup</span>
              </div>
              <div className="flex justify-between">
                <span>Support:</span>
                <span>1 Tahun</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onBuyLicense}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Aktivasi Lisensi
            </button>
            
            {!isExpired && (
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Ingatkan Lagi Nanti
              </button>
            )}
          </div>

          <button
            onClick={() => window.open('https://wa.me/6281249725276?text=Halo,%20saya%20ingin%20membeli%20lisensi%20PayFlow%20seharga%20Rp%20150.000.%20Mohon%20info%20cara%20pembayarannya.', '_blank')}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
          >
            💬 Beli via WhatsApp - Rp 150.000
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Hubungi support: +62 812-4972-5276
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialReminderModal;