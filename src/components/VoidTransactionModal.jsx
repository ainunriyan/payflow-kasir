import React, { useState } from 'react';
import { AlertTriangle, X, Lock, Trash2 } from 'lucide-react';

const VoidTransactionModal = ({ 
  show, 
  onClose, 
  transaction, 
  onVoid, 
  formatCurrency, 
  formatDate,
  currentUser 
}) => {
  const [reason, setReason] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const voidReasons = [
    'Kesalahan input harga',
    'Kesalahan pilih produk',
    'Customer membatalkan',
    'Kesalahan pembayaran',
    'Produk tidak tersedia',
    'Lainnya'
  ];

  const handleVoid = async () => {
    if (!reason.trim()) {
      setError('Pilih alasan void transaksi');
      return;
    }

    // Require admin PIN for void
    if (currentUser.role !== 'admin' && !adminPin.trim()) {
      setError('PIN Admin diperlukan untuk void transaksi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validate admin PIN if not admin
      if (currentUser.role !== 'admin') {
        // Simple PIN validation - in production, validate against encrypted PIN
        if (adminPin !== '1234') { // Default admin PIN
          setError('PIN Admin salah');
          setLoading(false);
          return;
        }
      }

      const voidData = {
        voidedAt: new Date().toISOString(),
        voidedBy: currentUser.fullName,
        reason: reason.trim(),
        adminPin: currentUser.role === 'admin' ? 'ADMIN_ACCESS' : 'PIN_VERIFIED'
      };

      await onVoid(transaction.id, voidData);
      
      // Reset form
      setReason('');
      setAdminPin('');
      onClose();
    } catch (error) {
      setError('Gagal void transaksi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle size={24} />
              Void Transaksi
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-red-600 mt-0.5" size={16} />
              <div className="text-sm text-red-700">
                <p className="font-semibold mb-1">Peringatan!</p>
                <p>Void transaksi akan membatalkan transaksi ini secara permanen dan mengembalikan stok produk.</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Detail Transaksi</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>No. Transaksi:</span>
                <span className="font-mono">#{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{transaction.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(transaction.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pembayaran:</span>
                <span>{transaction.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Item yang akan dikembalikan:</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>{item.name} x{item.qty}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Void Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Void *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Pilih alasan...</option>
              {voidReasons.map((r, index) => (
                <option key={index} value={r}>{r}</option>
              ))}
            </select>
            
            {reason === 'Lainnya' && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan alasan void..."
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            )}
          </div>

          {/* Admin PIN (if not admin) */}
          {currentUser.role !== 'admin' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} />
                PIN Admin *
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Masukkan PIN Admin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                maxLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                PIN Admin diperlukan untuk otorisasi void transaksi
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleVoid}
              disabled={loading || !reason.trim() || (currentUser.role !== 'admin' && !adminPin.trim())}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Trash2 size={16} />
                  Void Transaksi
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Transaksi yang di-void tidak dapat dikembalikan
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoidTransactionModal;