import React, { useState } from 'react';
import { X, Printer, Calendar, TrendingUp, BarChart3, FileText } from 'lucide-react';
import SalesChart from './SalesChart';
import ThermalReportModal from './ThermalReportModal';

const DailyReportModal = ({ 
  show, 
  reportDate,
  setReportDate,
  getDailyReport,
  formatCurrency,
  formatDate,
  formatDateOnly,
  getPaymentMethodName,
  storeSettings,  // ← TAMBAHKAN PROP INI
  onPrint,
  onClose 
}) => {
  const [showThermalReport, setShowThermalReport] = useState(false);
  
  if (!show) return null;

  const report = getDailyReport(reportDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 no-print">
          <h3 className="font-bold text-xl">Laporan Transaksi Harian</h3>
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Printer size={20} />
              Cetak A4
            </button>
            <button
              onClick={() => setShowThermalReport(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FileText size={20} />
              Cetak Struk
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="mb-4 no-print">
          <label className="block text-sm font-medium mb-2">Pilih Tanggal:</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="print-area">
          {/* GANTI BAGIAN HEADER INI */}
          <div className="text-center mb-6 border-b pb-4">
            {/* Logo */}
            {storeSettings?.logo && (
              <div className="flex justify-center mb-4">
                <img 
                  src={storeSettings.logo} 
                  alt="Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            )}
            
            {/* Store Info */}
            <h1 className="text-2xl font-bold">
              {storeSettings?.storeName || 'KASIR UMKM'}
            </h1>
            {storeSettings?.address && (
              <p className="text-sm text-gray-600 mt-1">{storeSettings.address}</p>
            )}
            {storeSettings?.phone && (
              <p className="text-sm text-gray-600">Telp: {storeSettings.phone}</p>
            )}
            
            <p className="text-lg font-semibold mt-4">LAPORAN TRANSAKSI HARIAN</p>
            <p className="text-sm text-gray-600 mt-1">{formatDateOnly(reportDate)}</p>
            <p className="text-xs text-gray-500 mt-1">Dicetak: {formatDate(new Date().toISOString())}</p>
          </div>

          {/* Bagian laporan tetap sama seperti sebelumnya */}
          {report.totalTransactions === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Tidak ada transaksi pada tanggal ini
            </p>
          ) : (
            <>
              {/* Summary */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="text-white" size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Total Transaksi</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{report.totalTransactions}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-white" size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Total Penjualan</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(report.totalSales)}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">↩</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Total Refund</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(report.refundAmount || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">#</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Jumlah Refund</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{report.totalRefunds || 0}</p>
                </div>
              </div>

              {/* Grafik untuk Laporan Harian */}
              {report.paymentSummary && Object.keys(report.paymentSummary).length > 0 && (
                <div className="mb-6 no-print">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SalesChart 
                      reportData={{
                        paymentSummary: report.paymentSummary || {},
                        productSummary: report.productSummary || []
                      }} 
                      formatCurrency={formatCurrency}
                      chartType="payment"
                    />
                    <SalesChart 
                      reportData={{
                        paymentSummary: report.paymentSummary || {},
                        productSummary: report.productSummary || []
                      }} 
                      formatCurrency={formatCurrency}
                      chartType="products"
                    />
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 border-b pb-2">Ringkasan Per Metode Pembayaran</h4>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Metode</th>
                      <th className="px-4 py-2 text-center">Jumlah Transaksi</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.paymentSummary).map(([method, data]) => (
                      <tr key={method} className="border-t">
                        <td className="px-4 py-2">{getPaymentMethodName(method)}</td>
                        <td className="px-4 py-2 text-center">{data.count}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(data.amount)}</td>
                      </tr>
                    ))}
                    <tr className="border-t font-bold bg-gray-50">
                      <td className="px-4 py-2">TOTAL</td>
                      <td className="px-4 py-2 text-center">{report.totalTransactions}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(report.totalSales)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Product Summary */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 border-b pb-2">Ringkasan Produk Terjual</h4>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Produk</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.productSummary.map((product, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2 text-center">{product.qty}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Transaction Details */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 border-b pb-2">Detail Transaksi</h4>
                <div className="space-y-3">
                  {report.transactions.map(transaction => (
                    <div key={transaction.id} className={`border p-3 rounded ${
                      transaction.type === "refund" ? "bg-red-50 border-red-200" : ""
                    }`}>
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">#{transaction.id}</p>
                            {transaction.type === "refund" && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                REFUND
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                          {transaction.type === "refund" && transaction.originalTransactionId && (
                            <p className="text-xs text-red-600 mt-1">
                              Refund dari #{transaction.originalTransactionId}
                            </p>
                          )}
                          {transaction.reason && (
                            <p className="text-xs text-red-600 mt-1">
                              Alasan: {transaction.reason}
                            </p>
                          )}
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs text-purple-600">{transaction.customerName}</span>
                            {transaction.tableNumber !== '-' && (
                              <span className="text-xs text-green-600">Meja {transaction.tableNumber}</span>
                            )}
                            {transaction.paymentMethod && (
                              <span className="text-xs text-blue-600">{getPaymentMethodName(transaction.paymentMethod)}</span>
                            )}
                          </div>
                        </div>
                        <p className={`font-bold ${
                          transaction.type === "refund" ? "text-red-600" : "text-blue-600"
                        }`}>
                          {transaction.type === "refund" ? "-" : ""}{formatCurrency(transaction.total)}
                        </p>
                      </div>
                      <div className="text-sm space-y-1">
                        {transaction.items.map((item, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between">
                              <span>{item.name} x{item.qty}</span>
                              <span>{formatCurrency(item.price * item.qty)}</span>
                            </div>
                            {item.note && (
                              <p className="text-xs text-yellow-600 italic ml-4">📝 {item.note}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">Kasir</p>
                    <p className="mt-8">(_________________)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Pemilik/Manager</p>
                    <p className="mt-8">(_________________)</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Thermal Report Modal */}
      <ThermalReportModal
        show={showThermalReport}
        report={report}
        reportDate={reportDate}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        formatDateOnly={formatDateOnly}
        getPaymentMethodName={getPaymentMethodName}
        storeSettings={storeSettings}
        onClose={() => setShowThermalReport(false)}
      />
    </div>
  );
};

export default DailyReportModal;