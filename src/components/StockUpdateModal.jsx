import React, { useState } from "react";
import { X, Package } from "lucide-react";

const StockUpdateModal = ({
  show,
  product,
  onUpdate,
  onClose,
  formatCurrency
}) => {
  const [newStock, setNewStock] = useState(product?.stock || 0);
  const [reason, setReason] = useState("");

  if (!show || !product) return null;

  const handleUpdate = () => {
    if (!reason.trim()) {
      alert("Mohon isi alasan update stok!");
      return;
    }

    if (newStock < 0) {
      alert("Stok tidak boleh negatif!");
      return;
    }

    onUpdate(product.id, newStock, reason.trim());
    setReason("");
    onClose();
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package size={24} />
              Update Stok
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm font-medium text-blue-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Stock */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Stok Saat Ini</p>
              <p className="text-2xl font-bold text-blue-600">{product.stock}</p>
            </div>

            {/* Stock Adjustment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Stok Baru:
              </label>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 border rounded-lg text-center font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan jumlah stok baru"
              />
            </div>

            {/* Stock Change Indicator */}
            <div className="text-center">
              {newStock !== product.stock && (
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  newStock > product.stock 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {newStock > product.stock ? "+" : ""}{newStock - product.stock}
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Alasan Update: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Restock barang, Koreksi stok, dll..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdate}
                disabled={!reason.trim() || newStock === product.stock}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Stok
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

export default StockUpdateModal;