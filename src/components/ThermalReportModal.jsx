import React, { useState } from "react";
import { X, Printer } from "lucide-react";
import PrinterDetector from "./PrinterDetector";

const ThermalReportModal = ({
  show,
  report,
  reportDate,
  formatCurrency,
  formatDate,
  formatDateOnly,
  getPaymentMethodName,
  storeSettings,
  onClose
}) => {
  const [showPrinterDetector, setShowPrinterDetector] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(() => {
    const saved = localStorage.getItem('selectedThermalPrinter');
    return saved ? JSON.parse(saved) : null;
  });

  if (!show) return null;

  const handlePrint = async () => {
    if (selectedPrinter && selectedPrinter.print) {
      try {
        const reportText = generateThermalReport();
        await selectedPrinter.print(reportText);
      } catch (err) {
        alert('Gagal mencetak: ' + err.message);
        window.print();
      }
    } else {
      setShowPrinterDetector(true);
    }
  };

  const generateThermalReport = () => {
    let report_text = '';
    report_text += `${(storeSettings?.storeName || 'KASIR UMKM').toUpperCase()}\n`;
    if (storeSettings?.address) report_text += `${storeSettings.address}\n`;
    if (storeSettings?.phone) report_text += `Tel: ${storeSettings.phone}\n`;
    report_text += '--------------------------------\n';
    report_text += 'LAPORAN HARIAN\n';
    report_text += `${formatDateOnly(reportDate)}\n`;
    report_text += `Cetak: ${formatDate(new Date().toISOString()).split(' ')[1]}\n`;
    report_text += '--------------------------------\n';
    
    if (report.totalTransactions === 0) {
      report_text += 'Tidak ada transaksi\n';
    } else {
      report_text += `Total Transaksi: ${report.totalTransactions}\n`;
      report_text += `Total Penjualan: ${formatCurrency(report.totalSales)}\n`;
      if (report.refundAmount > 0) {
        report_text += `Total Refund: -${formatCurrency(report.refundAmount)}\n`;
        report_text += `Jumlah Refund: ${report.totalRefunds}\n`;
      }
      report_text += '--------------------------------\n';
      report_text += `Net Sales: ${formatCurrency(report.totalSales - (report.refundAmount || 0))}\n`;
      report_text += '--------------------------------\n';
      
      report_text += 'METODE PEMBAYARAN:\n';
      Object.entries(report.paymentSummary).forEach(([method, data]) => {
        report_text += `${getPaymentMethodName(method)}: ${formatCurrency(data.amount)}\n`;
      });
      
      report_text += '--------------------------------\n';
      report_text += 'PRODUK TERLARIS:\n';
      report.productSummary.slice(0, 5).forEach(product => {
        report_text += `${product.name}\n`;
        report_text += `${product.qty}x - ${formatCurrency(product.revenue)}\n`;
      });
    }
    
    report_text += '--------------------------------\n';
    report_text += 'Terima kasih!\n';
    if (storeSettings?.description) {
      report_text += `${storeSettings.description}\n`;
    }
    report_text += '\n\n\n';
    
    return report_text;
  };

  const handlePrinterSelect = (printer) => {
    setSelectedPrinter(printer);
    localStorage.setItem('selectedThermalPrinter', JSON.stringify({
      id: printer.id,
      name: printer.name,
      type: printer.type,
      ip: printer.ip,
      port: printer.port,
      isThermal: printer.isThermal
    }));
    setShowPrinterDetector(false);
    setTimeout(async () => {
      try {
        const reportText = generateThermalReport();
        await printer.print(reportText);
      } catch (err) {
        alert('Gagal mencetak: ' + err.message);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 no-print">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Laporan Thermal</h3>
            <div className="flex gap-2">
              {selectedPrinter ? (
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-green-700"
                >
                  <Printer size={16} />
                  Cetak Thermal
                </button>
              ) : (
                <button
                  onClick={() => setShowPrinterDetector(true)}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-green-700"
                >
                  <Printer size={16} />
                  Pilih Printer
                </button>
              )}
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Format untuk printer thermal/struk (58mm/80mm)
          </p>
        </div>

        {/* Thermal Receipt Format */}
        <div className="print-area thermal-print bg-white" style={{ width: '58mm', fontSize: '11px', fontFamily: 'Courier New, monospace' }}>
          <div className="p-2 text-center">
            {/* Store Info */}
            <div className="text-center mb-2">
              <div className="font-bold text-sm" style={{ letterSpacing: '0.5px' }}>
                {(storeSettings?.storeName || 'KASIR UMKM').toUpperCase()}
              </div>
              {storeSettings?.address && (
                <div className="text-xs mt-1" style={{ lineHeight: '1.2' }}>
                  {storeSettings.address}
                </div>
              )}
              {storeSettings?.phone && (
                <div className="text-xs" style={{ lineHeight: '1.2' }}>
                  Tel: {storeSettings.phone}
                </div>
              )}
            </div>
            
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            
            <div className="font-bold text-xs" style={{ letterSpacing: '1px' }}>
              LAPORAN HARIAN
            </div>
            <div className="text-xs" style={{ marginTop: '2px' }}>
              {formatDateOnly(reportDate)}
            </div>
            <div className="text-xs" style={{ marginTop: '1px' }}>
              Cetak: {formatDate(new Date().toISOString()).split(' ')[1]}
            </div>
            
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            
            {report.totalTransactions === 0 ? (
              <div className="text-xs text-center py-4">
                Tidak ada transaksi
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="text-left text-xs space-y-1 mb-2">
                  <div className="flex justify-between">
                    <span>Total Transaksi:</span>
                    <span>{report.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Penjualan:</span>
                    <span>{formatCurrency(report.totalSales)}</span>
                  </div>
                  {(report.refundAmount || 0) > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Total Refund:</span>
                        <span>-{formatCurrency(report.refundAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah Refund:</span>
                        <span>{report.totalRefunds}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-dashed border-gray-400 my-1"></div>
                  <div className="flex justify-between font-bold">
                    <span>Net Sales:</span>
                    <span>{formatCurrency(report.totalSales - (report.refundAmount || 0))}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Payment Methods */}
                <div className="text-left text-xs mb-2">
                  <div className="font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
                    METODE PEMBAYARAN:
                  </div>
                  {Object.entries(report.paymentSummary).map(([method, data]) => (
                    <div key={method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                      <span style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getPaymentMethodName(method)}:
                      </span>
                      <span style={{ textAlign: 'right', minWidth: '35%' }}>
                        {formatCurrency(data.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Top Products */}
                <div className="text-left text-xs mb-2">
                  <div className="font-bold mb-1">PRODUK TERLARIS:</div>
                  {report.productSummary.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="mb-1">
                      <div className="flex justify-between">
                        <span className="truncate pr-1">{product.name}</span>
                        <span>{product.qty}x</span>
                      </div>
                      <div className="text-right">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Transaction List (Simplified) */}
                <div className="text-left text-xs mb-2">
                  <div className="font-bold mb-1">RIWAYAT TRANSAKSI:</div>
                  {report.transactions.slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="mb-2 pb-1 border-b border-dotted border-gray-300">
                      <div className="flex justify-between">
                        <span>#{transaction.id.toString().slice(-4)}</span>
                        <span className={transaction.type === "refund" ? "text-red-600" : ""}>
                          {transaction.type === "refund" ? "-" : ""}{formatCurrency(transaction.total)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{formatDate(transaction.date).split(' ')[1]}</span>
                        <span>{transaction.customerName}</span>
                      </div>
                      {transaction.type === "refund" && (
                        <div className="text-xs text-red-600">REFUND</div>
                      )}
                    </div>
                  ))}
                  {report.transactions.length > 10 && (
                    <div className="text-xs text-gray-500 text-center">
                      ... dan {report.transactions.length - 10} transaksi lainnya
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            
            <div className="text-xs text-center">
              Terima kasih!
            </div>
            <div className="text-xs text-center mt-1">
              {storeSettings?.description || "Aplikasi Kasir UMKM"}
            </div>
            
            {/* Spacing for thermal printer */}
            <div style={{ height: '20px' }}></div>
          </div>
        </div>

        {/* Printer Detector Modal */}
        {showPrinterDetector && (
          <PrinterDetector
            onPrinterSelect={handlePrinterSelect}
            onClose={() => setShowPrinterDetector(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ThermalReportModal;