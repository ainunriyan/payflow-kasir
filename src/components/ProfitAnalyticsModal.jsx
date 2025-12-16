import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart3, Calendar, X, Download, Eye } from 'lucide-react';
import SalesChart from './SalesChart';

const ProfitAnalyticsModal = ({ show, onClose, transactions, products, formatCurrency, formatDate }) => {
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [profitData, setProfitData] = useState(null);

  useEffect(() => {
    if (show) {
      calculateProfitAnalytics();
    }
  }, [show, dateRange, startDate, endDate, transactions, products]);

  const calculateProfitAnalytics = () => {
    const filteredTransactions = getFilteredTransactions();
    
    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalProfit = 0;
    let productProfits = {};
    let dailyProfits = {};

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'refund') return;

      const transactionDate = new Date(transaction.date).toDateString();
      
      transaction.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const itemRevenue = item.price * item.qty;
        
        // Estimate COGS as 60% of selling price (can be customized)
        const estimatedCOGS = product ? (item.price * 0.6 * item.qty) : (item.price * 0.6 * item.qty);
        const itemProfit = itemRevenue - estimatedCOGS;

        totalRevenue += itemRevenue;
        totalCOGS += estimatedCOGS;
        totalProfit += itemProfit;

        // Product-wise profit
        if (!productProfits[item.id]) {
          productProfits[item.id] = {
            name: item.name,
            revenue: 0,
            cogs: 0,
            profit: 0,
            qty: 0,
            margin: 0
          };
        }
        productProfits[item.id].revenue += itemRevenue;
        productProfits[item.id].cogs += estimatedCOGS;
        productProfits[item.id].profit += itemProfit;
        productProfits[item.id].qty += item.qty;

        // Daily profit
        if (!dailyProfits[transactionDate]) {
          dailyProfits[transactionDate] = {
            date: transactionDate,
            revenue: 0,
            cogs: 0,
            profit: 0,
            transactions: 0
          };
        }
        dailyProfits[transactionDate].revenue += itemRevenue;
        dailyProfits[transactionDate].cogs += estimatedCOGS;
        dailyProfits[transactionDate].profit += itemProfit;
      });

      if (dailyProfits[transactionDate]) {
        dailyProfits[transactionDate].transactions++;
      }
    });

    // Calculate margins
    Object.keys(productProfits).forEach(productId => {
      const product = productProfits[productId];
      product.margin = product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0;
    });

    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    setProfitData({
      totalRevenue,
      totalCOGS,
      totalProfit,
      profitMargin,
      productProfits: Object.values(productProfits).sort((a, b) => b.profit - a.profit),
      dailyProfits: Object.values(dailyProfits).sort((a, b) => new Date(a.date) - new Date(b.date)),
      transactionCount: filteredTransactions.length
    });
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startFilter, endFilter;

    switch (dateRange) {
      case 'today':
        startFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        startFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endFilter = now;
        break;
      case 'month':
        startFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        endFilter = now;
        break;
      case 'custom':
        startFilter = new Date(startDate);
        endFilter = new Date(endDate);
        endFilter.setHours(23, 59, 59);
        break;
      default:
        startFilter = new Date(0);
        endFilter = now;
    }

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startFilter && transactionDate <= endFilter;
    });
  };

  const exportProfitReport = () => {
    if (!profitData) return;

    const reportData = {
      period: dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange,
      summary: {
        totalRevenue: profitData.totalRevenue,
        totalCOGS: profitData.totalCOGS,
        totalProfit: profitData.totalProfit,
        profitMargin: profitData.profitMargin,
        transactionCount: profitData.transactionCount
      },
      productProfits: profitData.productProfits,
      dailyProfits: profitData.dailyProfits,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit-analysis-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={24} />
              Analytics Laba Penjualan
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Date Range Selector */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              {[
                { value: 'today', label: 'Hari Ini' },
                { value: 'week', label: '7 Hari' },
                { value: 'month', label: 'Bulan Ini' },
                { value: 'custom', label: 'Custom' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dateRange === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {dateRange === 'custom' && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
                <span>-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            <button
              onClick={exportProfitReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          {profitData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-600">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(profitData.totalRevenue)}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="text-red-600" size={20} />
                    <span className="text-sm font-medium text-red-600">Total COGS</span>
                  </div>
                  <p className="text-2xl font-bold text-red-800">
                    {formatCurrency(profitData.totalCOGS)}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-600">Total Profit</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(profitData.totalProfit)}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="text-purple-600" size={20} />
                    <span className="text-sm font-medium text-purple-600">Profit Margin</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">
                    {profitData.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Daily Profit Chart */}
              {profitData.dailyProfits.length > 1 && (
                <div className="bg-white p-6 rounded-lg border mb-6">
                  <h3 className="text-lg font-semibold mb-4">Trend Laba Harian</h3>
                  <SalesChart
                    reportData={{ dailyAnalysis: profitData.dailyProfits }}
                    formatCurrency={formatCurrency}
                    chartType="profit"
                  />
                </div>
              )}

              {/* Product Profit Analysis */}
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h3 className="text-lg font-semibold mb-4">Analisis Laba per Produk</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Produk</th>
                        <th className="px-4 py-2 text-right">Qty Terjual</th>
                        <th className="px-4 py-2 text-right">Revenue</th>
                        <th className="px-4 py-2 text-right">COGS</th>
                        <th className="px-4 py-2 text-right">Profit</th>
                        <th className="px-4 py-2 text-right">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitData.productProfits.slice(0, 10).map((product, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-right">{product.qty}</td>
                          <td className="px-4 py-3 text-right text-blue-600">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className="px-4 py-3 text-right text-red-600">
                            {formatCurrency(product.cogs)}
                          </td>
                          <td className="px-4 py-3 text-right text-green-600 font-semibold">
                            {formatCurrency(product.profit)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              product.margin >= 30 ? 'bg-green-100 text-green-700' :
                              product.margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {product.margin.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights & Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">💡 Insights & Rekomendasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">📈 Performa Bisnis:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Profit margin: {profitData.profitMargin.toFixed(1)}% 
                        {profitData.profitMargin >= 30 ? ' (Excellent!)' : 
                         profitData.profitMargin >= 20 ? ' (Good)' : ' (Needs improvement)'}
                      </li>
                      <li>• Total transaksi: {profitData.transactionCount}</li>
                      <li>• Rata-rata profit per transaksi: {formatCurrency(profitData.totalProfit / profitData.transactionCount || 0)}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">🎯 Rekomendasi:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {profitData.profitMargin < 20 && (
                        <li>• Pertimbangkan menaikkan harga atau menurunkan COGS</li>
                      )}
                      <li>• Fokus promosi pada produk dengan margin tinggi</li>
                      <li>• Analisis produk dengan margin rendah</li>
                      <li>• Monitor trend laba harian untuk optimasi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalyticsModal;