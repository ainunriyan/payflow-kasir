import React, { useState, useEffect } from 'react';
import { DollarSign, Package, Calculator, X, Save } from 'lucide-react';

const ProductCostModal = ({ show, onClose, products, onSave, formatCurrency }) => {
  const [productCosts, setProductCosts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && products) {
      loadProductCosts();
    }
  }, [show, products]);

  const loadProductCosts = async () => {
    try {
      const costsData = await window.storage.get('productCosts');
      if (costsData && costsData.value) {
        setProductCosts(JSON.parse(costsData.value));
      } else {
        // Initialize with estimated costs (60% of selling price)
        const initialCosts = {};
        products.forEach(product => {
          initialCosts[product.id] = {
            costPrice: Math.round(product.price * 0.6),
            margin: 40
          };
        });
        setProductCosts(initialCosts);
      }
    } catch (error) {
      console.log('No product costs found, using estimates');
      const initialCosts = {};
      products.forEach(product => {
        initialCosts[product.id] = {
          costPrice: Math.round(product.price * 0.6),
          margin: 40
        };
      });
      setProductCosts(initialCosts);
    }
  };

  const updateProductCost = (productId, field, value) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const numValue = parseFloat(value) || 0;
    const updatedCosts = { ...productCosts };

    if (!updatedCosts[productId]) {
      updatedCosts[productId] = { costPrice: 0, margin: 0 };
    }

    if (field === 'costPrice') {
      updatedCosts[productId].costPrice = numValue;
      // Calculate margin
      const margin = product.price > 0 ? ((product.price - numValue) / product.price) * 100 : 0;
      updatedCosts[productId].margin = Math.round(margin * 100) / 100;
    } else if (field === 'margin') {
      updatedCosts[productId].margin = numValue;
      // Calculate cost price
      const costPrice = product.price * (1 - numValue / 100);
      updatedCosts[productId].costPrice = Math.round(costPrice);
    }

    setProductCosts(updatedCosts);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await window.storage.set('productCosts', JSON.stringify(productCosts));
      onSave(productCosts);
      onClose();
    } catch (error) {
      alert('Gagal menyimpan data cost produk');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalProfit = () => {
    return products.reduce((total, product) => {
      const cost = productCosts[product.id];
      if (cost) {
        return total + (product.price - cost.costPrice);
      }
      return total;
    }, 0);
  };

  const getMarginColor = (margin) => {
    if (margin >= 40) return 'text-green-600 bg-green-50';
    if (margin >= 25) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="text-blue-600" size={24} />
              Pengaturan Cost & Margin Produk
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Atur harga pokok penjualan (COGS) untuk analisis laba yang akurat
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Rata-rata Margin</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.length > 0 ? (
                    Object.values(productCosts).reduce((sum, cost) => sum + (cost.margin || 0), 0) / products.length
                  ).toFixed(1) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Estimasi Profit/Unit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(calculateTotalProfit() / products.length || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Product Cost Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Produk</th>
                    <th className="px-4 py-3 text-right">Harga Jual</th>
                    <th className="px-4 py-3 text-right">Harga Pokok</th>
                    <th className="px-4 py-3 text-right">Margin (%)</th>
                    <th className="px-4 py-3 text-right">Profit/Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const cost = productCosts[product.id] || { costPrice: 0, margin: 0 };
                    const profit = product.price - cost.costPrice;
                    
                    return (
                      <tr key={product.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <Package size={16} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={cost.costPrice || ''}
                            onChange={(e) => updateProductCost(product.id, 'costPrice', e.target.value)}
                            className="w-24 px-2 py-1 border rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <input
                              type="number"
                              value={cost.margin || ''}
                              onChange={(e) => updateProductCost(product.id, 'margin', e.target.value)}
                              className="w-16 px-2 py-1 border rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              step="0.1"
                            />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getMarginColor(cost.margin)}`}>
                              {cost.margin?.toFixed(1) || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profit)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips Pengaturan Cost & Margin:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Margin 40%+</strong>: Excellent - Produk sangat menguntungkan</li>
              <li>• <strong>Margin 25-39%</strong>: Good - Margin sehat untuk bisnis</li>
              <li>• <strong>Margin &lt;25%</strong>: Low - Pertimbangkan menaikkan harga atau menurunkan cost</li>
              <li>• Hitung cost termasuk: bahan baku, tenaga kerja, overhead, dan biaya lainnya</li>
              <li>• Review margin secara berkala sesuai perubahan harga supplier</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Data cost akan digunakan untuk analisis laba yang lebih akurat
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Save size={16} />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCostModal;