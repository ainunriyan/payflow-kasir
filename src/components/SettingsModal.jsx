import React, { useState, useEffect } from 'react';
import { X, Store, Upload, Camera } from 'lucide-react';

const SettingsModal = ({ show, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    storeName: 'PAYFLOW',
    address: '',
    phone: '',
    email: '',
    description: '',
    logo: '',
    autoPrint: true
  });

  useEffect(() => {
    if (show) {
      loadSettings();
    }
  }, [show]);

  const loadSettings = async () => {
    try {
      const settingsData = await window.storage.get('storeSettings');
      if (settingsData && settingsData.value) {
        setSettings(JSON.parse(settingsData.value));
      }
    } catch (error) {
      console.log('Using default settings');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Ukuran gambar maksimal 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await window.storage.set('storeSettings', JSON.stringify(settings));
      onSave(settings);
      alert('Pengaturan toko berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Store className="w-5 h-5" />
            Pengaturan Toko
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Logo Toko</label>
            <div className="flex items-center gap-4">
              {settings.logo ? (
                <div className="relative">
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain bg-gray-100 rounded border"
                  />
                  <button
                    onClick={() => setSettings({ ...settings, logo: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded border flex items-center justify-center">
                  <Camera size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 inline-flex items-center gap-2"
                >
                  <Upload size={16} />
                  Pilih Logo
                </label>
                <p className="text-xs text-gray-500 mt-1">Maks. 1MB, format: JPG, PNG</p>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Toko *</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama toko Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="08123456789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@toko.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alamat Toko</label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Alamat lengkap toko"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi/Tagline</label>
            <input
              type="text"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tagline atau deskripsi singkat toko"
            />
          </div>

          {/* Printer Settings */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Pengaturan Printer</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPrint"
                checked={settings.autoPrint}
                onChange={(e) => setSettings({ ...settings, autoPrint: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoPrint" className="text-sm">
                Cetak struk otomatis setelah pembayaran
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;