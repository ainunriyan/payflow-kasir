import React, { useState, useEffect } from 'react';
import { Key, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import LicenseManager from '../utils/license';

const LicenseModal = ({ show, onClose, onActivated }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);

  useEffect(() => {
    if (show) {
      checkCurrentStatus();
    }
  }, [show]);

  const checkCurrentStatus = () => {
    const status = LicenseManager.getCurrentLicenseStatus();
    setLicenseStatus(status);
    
    if (status.type === 'trial' || status.type === 'none') {
      const trial = LicenseManager.checkTrialStatus();
      setTrialStatus(trial);
    }
  };

  const handleStartTrial = () => {
    const result = LicenseManager.startTrial();
    if (result.success) {
      checkCurrentStatus();
      onActivated();
    } else {
      setError(result.error);
    }
  };

  const handleActivateLicense = async () => {
    if (!licenseKey.trim()) {
      setError('Masukkan kunci lisensi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await LicenseManager.activateLicense(licenseKey);
      if (result.success) {
        onActivated();
        onClose();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Gagal mengaktivasi lisensi');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Key className="text-blue-600" size={24} />
              Aktivasi PayFlow
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Current Status */}
          {licenseStatus && (
            <div className="mb-6 p-4 rounded-lg border">
              {licenseStatus.type === 'full' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-medium">Lisensi Aktif</span>
                </div>
              ) : licenseStatus.type === 'trial' ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock size={20} />
                  <div>
                    <div className="font-medium">
                      {licenseStatus.status === 'expired' ? 'Trial Expired' : 'Trial Aktif'}
                    </div>
                    {licenseStatus.daysLeft > 0 && (
                      <div className="text-sm">
                        Sisa {licenseStatus.daysLeft} hari
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={20} />
                  <span className="font-medium">Tidak Ada Lisensi</span>
                </div>
              )}
            </div>
          )}

          {/* Trial Section */}
          {(!licenseStatus || licenseStatus.type === 'none') && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Coba Gratis 30 Hari
              </h3>
              <p className="text-sm text-blue-600 mb-3">
                Nikmati semua fitur PayFlow selama 30 hari tanpa batasan
              </p>
              <button
                onClick={handleStartTrial}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mulai Trial Gratis
              </button>
            </div>
          )}

          {/* License Activation */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kunci Lisensi
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="PF-XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={24}
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan kunci lisensi yang Anda terima setelah pembelian
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleActivateLicense}
              disabled={loading || !licenseKey.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Mengaktivasi...' : 'Aktivasi Lisensi'}
            </button>
          </div>

          {/* Purchase Info - Only show if no full license */}
          {licenseStatus?.type !== 'full' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Belum Punya Lisensi?
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Dapatkan lisensi PayFlow dengan semua fitur lengkap
              </p>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                  <span>Harga:</span>
                  <span className="font-semibold">Rp 150.000</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Lisensi:</span>
                  <span>Seumur Hidup</span>
                </div>
                <div className="flex justify-between">
                  <span>Support:</span>
                  <span>1 Tahun</span>
                </div>
              </div>
              <button
                onClick={() => window.open('https://wa.me/6281249725276?text=Halo,%20saya%20ingin%20membeli%20lisensi%20PayFlow%20seharga%20Rp%20150.000.%20Mohon%20info%20cara%20pembayarannya.', '_blank')}
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                💬 Beli via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;