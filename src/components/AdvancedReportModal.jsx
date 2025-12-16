import React, { useState } from "react";
import { X, FileText, Calendar, TrendingUp, TrendingDown, BarChart3, Printer } from "lucide-react";
import SalesChart from "./SalesChart";
import AdvancedThermalModal from "./AdvancedThermalModal";

const AdvancedReportModal = ({
  show,
  reportType,
  setReportType,
  reportStartDate,
  setReportStartDate,
  reportEndDate,
  setReportEndDate,
  getAdvancedReport,
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  storeSettings,
  onClose
}) => {
  const [reportData, setReportData] = useState(null);
  const [showThermalReport, setShowThermalReport] = useState(false);

  if (!show) return null;

  const generateReport = () => {
    const data = getAdvancedReport(reportStartDate, reportEndDate, reportType);
    setReportData(data);
  };

  const getReportTitle = () => {
    const date = new Date(reportStartDate);
    switch (reportType) {
      case "daily":
        return `Laporan Harian - ${date.toLocaleDateString("id-ID")}`;
      case "weekly":
        const endWeek = new Date(date);
        endWeek.setDate(date.getDate() + 6);
        return `Laporan Mingguan - ${date.toLocaleDateString("id-ID")} s/d ${endWeek.toLocaleDateString("id-ID")}`;
      case "monthly":
        return `Laporan Bulanan - ${date.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
      case "yearly":
        return `Laporan Tahunan - ${date.getFullYear()}`;
      case "custom":
        return `Laporan Custom - ${new Date(reportStartDate).toLocaleDateString("id-ID")} s/d ${new Date(reportEndDate).toLocaleDateString("id-ID")}`;
      default:
        return "Laporan";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 no-print">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText size={24} />
              Laporan Periode
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tipe Laporan:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
                <option value="custom">Custom Periode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {reportType === "custom" ? "Tanggal Mulai:" : "Tanggal:"}
              </label>
              <input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {reportType === "custom" && (
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal Selesai:</label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Generate Laporan
              </button>
            </div>
          </div>

          {reportData && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Printer size={16} />
                Cetak A4
              </button>
              <button
                onClick={() => setShowThermalReport(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FileText size={16} />
                Cetak Struk
              </button>
            </div>
          )}
        </div>

        {reportData && (
          <div className="print-area p-6">
            {/* Header Laporan */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                {storeSettings.logo && (
                  <img
                    src={storeSettings.logo}
                    alt="Logo"
                    className="max-w-16 h-auto object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{storeSettings.storeName || "PAYFLOW"}</h1>
                  {storeSettings.address && (
                    <p className="text-sm text-gray-600">{storeSettings.address}</p>
                  )}
                  {storeSettings.phone && (
                    <p className="text-sm text-gray-600">Tel: {storeSettings.phone}</p>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold">{getReportTitle()}</h2>
              <p className="text-sm text-gray-600">
                Dicetak pada: {formatDate(new Date().toISOString())}
              </p>
            </div>

            {/* Ringkasan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Penjualan</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(reportData.totalSales)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200 shadow-sm">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Transaksi</p>
                <p className="text-xl font-bold text-green-600">
                  {reportData.totalTransactions}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border border-red-200 shadow-sm">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingDown className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Refund</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(reportData.refundAmount)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center border border-purple-200 shadow-sm">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Jumlah Refund</p>
                <p className="text-xl font-bold text-purple-600">
                  {reportData.totalRefunds}
                </p>
              </div>
            </div>

            {/* Grafik Penjualan */}
            <div className="mb-8">
              <SalesChart 
                reportData={reportData} 
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Metode Pembayaran */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Metode Pembayaran</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Metode</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Jumlah</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.paymentSummary).map(([method, data]) => (
                      <tr key={method}>
                        <td className="border border-gray-300 px-4 py-2">
                          {getPaymentMethodName(method)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {data.count}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrency(data.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Produk Terlaris */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Produk Terlaris</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Produk</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Qty Terjual</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.productSummary.slice(0, 10).map((product, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {product.qty}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analisis Harian (untuk laporan periode) */}
            {reportType !== "daily" && reportData.dailyAnalysis.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Analisis Per Hari</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Tanggal</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Transaksi</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Penjualan</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Refund</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dailyAnalysis.map((day, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(day.date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {day.transactions}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatCurrency(day.sales)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-red-600">
                            {formatCurrency(day.refunds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Advanced Thermal Report Modal */}
      <AdvancedThermalModal
        show={showThermalReport}
        reportData={reportData}
        reportTitle={getReportTitle()}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getPaymentMethodName={getPaymentMethodName}
        storeSettings={storeSettings}
        onClose={() => setShowThermalReport(false)}
      />
    </div>
  );
};

export default AdvancedReportModal;