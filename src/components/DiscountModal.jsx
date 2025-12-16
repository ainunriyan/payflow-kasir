import React, { useState } from 'react';
import { X, Percent, DollarSign, Tag, Gift } from 'lucide-react';

const DiscountModal = ({ show, onClose, onApply, cartTotal }) => {
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');

  const handleApply = () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      alert('Masukkan nilai diskon yang valid!');
      return;
    }

    const value = parseFloat(discountValue);
    let discountAmount = 0;

    if (discountType === 'percentage') {
      if (value > 100) {
        alert('Diskon persentase tidak boleh lebih dari 100%!');
        return;
      }
      discountAmount = (cartTotal * value) / 100;
    } else {
      if (value >= cartTotal) {
        alert('Diskon nominal tidak boleh lebih dari atau sama dengan total!');
        return;
      }
      discountAmount = value;
    }

    onApply({
      type: discountType,
      value: value,
      amount: discountAmount,
      reason: discountReason || 'Diskon manual'
    });

    // Reset form
    setDiscountValue('');
    setDiscountReason('');
    onClose();
  };

  const getPreviewAmount = () => {
    if (!discountValue) return 0;
    const value = parseFloat(discountValue);
    if (discountType === 'percentage') {
      return (cartTotal * value) / 100;
    }
    return value;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Tag size={24} />
            Berikan Diskon
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Jenis Diskon</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDiscountType('percentage')}
                className={`flex items-center gap-2 p-3 border rounded-lg ${
                  discountType === 'percentage'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Percent size={20} />
                Persentase
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`flex items-center gap-2 p-3 border rounded-lg ${
                  discountType === 'fixed'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <DollarSign size={20} />
                Nominal
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nilai Diskon {discountType === 'percentage' ? '(%)' : '(Rp)'}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={discountType === 'percentage' ? 'Contoh: 10' : 'Contoh: 5000'}
              min="0"
              max={discountType === 'percentage' ? '100' : cartTotal}
            />
          </div>

          {/* Discount Reason */}
          <div>
            <label className="block text-sm font-medium mb-1">Alasan Diskon (Opsional)</label>
            <input
              type="text"
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Member, Promo, dll"
            />
          </div>

          {/* Quick Discount Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Diskon Cepat</label>
            <div className="grid grid-cols-3 gap-2">
              {discountType === 'percentage' ? (
                <>
                  <button
                    onClick={() => setDiscountValue('5')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    5%
                  </button>
                  <button
                    onClick={() => setDiscountValue('10')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    10%
                  </button>
                  <button
                    onClick={() => setDiscountValue('15')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    15%
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDiscountValue('1000')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                  >
                    1K
                  </button>
                  <button
                    onClick={() => setDiscountValue('5000')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                  >
                    5K
                  </button>
                  <button
                    onClick={() => setDiscountValue('10000')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                  >
                    10K
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          {discountValue && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={16} className="text-yellow-600" />
                <span className="font-medium text-yellow-800">Preview Diskon</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Diskon ({discountType === 'percentage' ? `${discountValue}%` : `Rp ${parseFloat(discountValue).toLocaleString('id-ID')}`}):</span>
                  <span>-Rp {getPreviewAmount().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-1">
                  <span>Total:</span>
                  <span>Rp {(cartTotal - getPreviewAmount()).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Tag size={16} />
            Terapkan Diskon
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;