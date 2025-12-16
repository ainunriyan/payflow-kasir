import React, { useState, useEffect } from 'react';
import { X, Save, Smartphone, Wallet } from 'lucide-react';

const PaymentSettingsModal = ({ show, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    qrisCode: '',
    qrisProvider: '',
    gopayNumber: '',
    ovoNumber: '',
    danaNumber: '',
    shopeepayNumber: '',
    bankAccount: '',
    bankName: ''
  });

  useEffect(() => {
    if (show) {
      loadSettings();
    }
  }, [show]);

  const loadSettings = async () => {
    try {
      const data = await window.storage.get('paymentSettings');
      if (data && data.value) {
        setSettings(JSON.parse(data.value));
      }
    } catch (error) {
      console.log('No payment settings found');
    }
  };

  const handleSave = async () => {
    try {
      await window.storage.set('paymentSettings', JSON.stringify(settings));
      onSave(settings);
      alert('Pengaturan pembayaran berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Pengaturan Pembayaran</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* QRIS */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Smartphone size={16} className="text-blue-600" />
              QRIS Code/String
            </label>
            <input
              type="text"
              value={settings.qrisCode}
              onChange={(e) => setSettings({...settings, qrisCode: e.target.value})}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: 00020101021226670016COM.NOBUBANK.WWW01189360050300000898240214220240123456789303UMI51440014ID.CO.QRIS.WWW0215ID20232157845230303UMI5204481253033605802ID5909TOKO KOPI6007JAKARTA61051234562070703A0163044B5A"
            />

            <div className="mt-2">
              <label className="block text-xs font-medium mb-1 text-gray-600">
                Provider QRIS (Opsional)
              </label>
              <select
                value={settings.qrisProvider}
                onChange={(e) => setSettings({...settings, qrisProvider: e.target.value})}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Pilih Provider</option>
                <option value="Midtrans">Midtrans (Gojek)</option>
                <option value="Xendit">Xendit</option>
                <option value="BCA">BCA Business</option>
                <option value="Mandiri">Mandiri Livin Business</option>
                <option value="BRI">BRI Mobile Business</option>
                <option value="BNI">BNI Mobile Business</option>
                <option value="DANA">DANA Merchant</option>
                <option value="Doku">Doku</option>
                <option value="Faspay">Faspay</option>
                <option value="iPaymu">iPaymu</option>
              </select>
            </div>

          </div>

          {/* E-Wallet Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Smartphone size={16} />
              E-Wallet Payments (QR Code)
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Semua e-wallet (GoPay, OVO, DANA, ShopeePay) sekarang menggunakan <strong>QR Code</strong> untuk pembayaran.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-white p-3 rounded border text-center">
                <div className="w-8 h-8 bg-green-500 rounded mx-auto mb-1"></div>
                <p className="text-xs font-medium">GoPay</p>
                <p className="text-xs text-green-600">✓ QR Ready</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="w-8 h-8 bg-purple-500 rounded mx-auto mb-1"></div>
                <p className="text-xs font-medium">OVO</p>
                <p className="text-xs text-purple-600">✓ QR Ready</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-1"></div>
                <p className="text-xs font-medium">DANA</p>
                <p className="text-xs text-blue-600">✓ QR Ready</p>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="w-8 h-8 bg-orange-500 rounded mx-auto mb-1"></div>
                <p className="text-xs font-medium">ShopeePay</p>
                <p className="text-xs text-orange-600">✓ QR Ready</p>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              📱 Customer scan QR code dengan app masing-masing e-wallet
            </p>
          </div>

          {/* Bank Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Bank
              </label>
              <input
                type="text"
                value={settings.bankName}
                onChange={(e) => setSettings({...settings, bankName: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="BCA, BRI, Mandiri, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={settings.bankAccount}
                onChange={(e) => setSettings({...settings, bankAccount: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234567890"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Simpan Pengaturan
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsModal;