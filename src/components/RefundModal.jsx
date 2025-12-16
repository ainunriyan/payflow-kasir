import React from "react";
import { X, AlertTriangle } from "lucide-react";

const RefundModal = ({
  show,
  transaction,
  refundItems,
  refundReason,
  setRefundReason,
  updateRefundQty,
  onProcess,
  onClose,
  formatCurrency
}) => {
  if (!show || !transaction) return null;

  const calculateRefundTotal = () => {
    return refundItems
      .filter(item => item.selected && item.refundQty > 0)
      .reduce((sum, item) => sum + (item.price * item.refundQty), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle size={24} />
                Refund Transaksi
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Transaksi #{transaction.id} - {transaction.customerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pilih Item untuk Refund:
              </label>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {refundItems.map((item) => {
                  const maxRefund = item.qty - (item.refundedQty || 0);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.price)} x {item.qty}
                          {item.refundedQty > 0 && (
                            <span className="text-red-500 ml-2">
                              (Sudah refund: {item.refundedQty})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Maksimal refund: {maxRefund}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxRefund}
                          value={item.refundQty}
                          onChange={(e) => {
                            const qty = Math.min(parseInt(e.target.value) || 0, maxRefund);
                            updateRefundQty(item.id, qty);
                          }}
                          className="w-20 px-2 py-1 border rounded text-center"
                          disabled={maxRefund === 0}
                        />
                        <span className="text-sm text-gray-500">qty</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Alasan Refund: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Masukkan alasan refund..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-700">Total Refund:</span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(calculateRefundTotal())}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onProcess}
                disabled={calculateRefundTotal() === 0 || !refundReason.trim()}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proses Refund
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;