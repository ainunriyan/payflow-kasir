import React, { useState, useEffect } from 'react';
import { X, Settings, Eye, EyeOff } from 'lucide-react';

const CashierSettingsModal = ({ isOpen, onClose }) => {
  const [buttonSettings, setButtonSettings] = useState({
    display: true,
    customer: true,
    discount: true,
    scan: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('cashierButtonSettings');
    if (savedSettings) {
      setButtonSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (buttonName) => {
    const newSettings = {
      ...buttonSettings,
      [buttonName]: !buttonSettings[buttonName]
    };
    setButtonSettings(newSettings);
    localStorage.setItem('cashierButtonSettings', JSON.stringify(newSettings));
    
    // Dispatch event to notify App component
    window.dispatchEvent(new CustomEvent('buttonSettingsChanged', { 
      detail: newSettings 
    }));
  };

  const resetToDefault = () => {
    const defaultSettings = {
      display: true,
      customer: true,
      discount: true,
      scan: true
    };
    setButtonSettings(defaultSettings);
    localStorage.setItem('cashierButtonSettings', JSON.stringify(defaultSettings));
    window.dispatchEvent(new CustomEvent('buttonSettingsChanged', { 
      detail: defaultSettings 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pengaturan Kasir
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-gray-700 mb-3">Tampilkan Button Kasir</h3>
          </div>

          {/* Display Button */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📺
              </div>
              <div>
                <div className="font-medium">Customer Display</div>
                <div className="text-sm text-gray-500">Tampilan untuk customer</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('display')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                buttonSettings.display 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {buttonSettings.display ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {buttonSettings.display ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* Customer Button */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                👥
              </div>
              <div>
                <div className="font-medium">Customer</div>
                <div className="text-sm text-gray-500">Pilih customer & loyalty</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('customer')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                buttonSettings.customer 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {buttonSettings.customer ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {buttonSettings.customer ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* Discount Button */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                🏷️
              </div>
              <div>
                <div className="font-medium">Diskon</div>
                <div className="text-sm text-gray-500">Berikan diskon transaksi</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('discount')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                buttonSettings.discount 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {buttonSettings.discount ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {buttonSettings.discount ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* Scan Button */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                📱
              </div>
              <div>
                <div className="font-medium">Barcode Scanner</div>
                <div className="text-sm text-gray-500">Scan produk dengan kamera</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('scan')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                buttonSettings.scan 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {buttonSettings.scan ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {buttonSettings.scan ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={resetToDefault}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset Default
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashierSettingsModal;