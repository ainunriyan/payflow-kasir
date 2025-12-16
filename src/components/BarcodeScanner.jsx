import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Scan, Plus } from 'lucide-react';

const BarcodeScanner = ({ show, onClose, onScan, products }) => {
  const [scanning, setScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (show && scanning) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [show, scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError('');
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Gunakan input manual.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleManualScan = () => {
    if (!manualBarcode.trim()) {
      setError('Masukkan kode barcode');
      return;
    }
    
    const product = products.find(p => p.barcode === manualBarcode.trim());
    if (product) {
      onScan(product);
      setManualBarcode('');
      onClose();
    } else {
      setError('Produk dengan barcode ini tidak ditemukan');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Scan className="text-blue-600" size={24} />
              Barcode Scanner
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Camera Scanner */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setScanning(true)}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  scanning ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Camera size={16} />
                Kamera
              </button>
              <button
                onClick={() => {
                  setScanning(false);
                  stopCamera();
                }}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  !scanning ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Manual
              </button>
            </div>

            {scanning ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 bg-gray-200 rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-32 border-2 border-red-500 border-dashed rounded-lg"></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Arahkan kamera ke barcode produk
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Masukkan Kode Barcode
                  </label>
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Scan atau ketik barcode..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleManualScan}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Cari Produk
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Produk tidak ditemukan?</p>
            <button
              onClick={() => {
                onClose();
                // Trigger add product modal with barcode
                window.dispatchEvent(new CustomEvent('addProductWithBarcode', { 
                  detail: { barcode: manualBarcode } 
                }));
              }}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Tambah Produk Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;