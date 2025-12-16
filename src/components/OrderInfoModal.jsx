import React from 'react';
import { X, User, Grid3x3 } from 'lucide-react';

const OrderInfoModal = ({ 
  show, 
  customerName, 
  setCustomerName, 
  tableNumber, 
  setTableNumber, 
  total,
  formatCurrency,
  onSubmit, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Informasi Pesanan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Pembayaran:</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User size={16} />
              Atas Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama pemesan"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Grid3x3 size={16} />
              Nomor Meja (Opsional)
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Contoh: 1, 2A, atau kosongkan"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => setTableNumber(num)}
                className="py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Meja {num}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Lanjut ke Pembayaran
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoModal;