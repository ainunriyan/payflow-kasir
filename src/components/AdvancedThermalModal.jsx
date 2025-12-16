import React from "react";
import { X, Printer } from "lucide-react";

const AdvancedThermalModal = ({
  show,
  reportData,
  reportTitle,
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  storeSettings,
  onClose
}) => {
  if (!show || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 no-print">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Laporan Thermal</h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-green-700"
              >
                <Printer size={16} />
                Cetak
              </button>
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
              LAPORAN PERIODE
            </div>
            <div className="text-xs" style={{ marginTop: '2px' }}>
              {reportTitle}
            </div>
            <div className="text-xs" style={{ marginTop: '1px' }}>
              Cetak: {formatDate(new Date().toISOString()).split(' ')[1]}
            </div>
            
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            
            {reportData.totalTransactions === 0 ? (
              <div className="text-xs text-center py-4">
                Tidak ada transaksi
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="text-left text-xs space-y-1 mb-2">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Transaksi:</span>
                    <span>{reportData.totalTransactions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Penjualan:</span>
                    <span>{formatCurrency(reportData.totalSales)}</span>
                  </div>
                  {(reportData.refundAmount || 0) > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Refund:</span>
                        <span>-{formatCurrency(reportData.refundAmount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Jumlah Refund:</span>
                        <span>{reportData.totalRefunds}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-dashed border-gray-400 my-1"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }} className="font-bold">
                    <span>Net Sales:</span>
                    <span>{formatCurrency(reportData.totalSales - (reportData.refundAmount || 0))}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Payment Methods */}
                <div className="text-left text-xs mb-2">
                  <div className="font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
                    METODE PEMBAYARAN:
                  </div>
                  {Object.entries(reportData.paymentSummary || {}).map(([method, data]) => (
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
                  <div className="font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
                    PRODUK TERLARIS:
                  </div>
                  {(reportData.productSummary || []).slice(0, 5).map((product, idx) => (
                    <div key={idx} className="mb-1">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </span>
                        <span>{product.qty}x</span>
                      </div>
                      <div className="text-right">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Daily Analysis (for period reports) */}
                {reportData.dailyAnalysis && reportData.dailyAnalysis.length > 0 && (
                  <>
                    <div className="text-left text-xs mb-2">
                      <div className="font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
                        ANALISIS HARIAN:
                      </div>
                      {reportData.dailyAnalysis.slice(0, 7).map((day, idx) => (
                        <div key={idx} className="mb-1">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-xs">
                              {new Date(day.date).toLocaleDateString('id-ID', { 
                                day: '2-digit', 
                                month: 'short' 
                              })}
                            </span>
                            <span>{day.transactions}tx</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Penjualan:</span>
                            <span>{formatCurrency(day.sales)}</span>
                          </div>
                          {day.refunds > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Refund:</span>
                              <span className="text-red-600">-{formatCurrency(day.refunds)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {reportData.dailyAnalysis.length > 7 && (
                        <div className="text-xs text-gray-500 text-center">
                          ... dan {reportData.dailyAnalysis.length - 7} hari lainnya
                        </div>
                      )}
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-2"></div>
                  </>
                )}

                {/* Recent Transactions */}
                {reportData.transactions && reportData.transactions.length > 0 && (
                  <div className="text-left text-xs mb-2">
                    <div className="font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
                      TRANSAKSI TERBARU:
                    </div>
                    {reportData.transactions.slice(0, 5).map(transaction => (
                      <div key={transaction.id} className="mb-2 pb-1 border-b border-dotted border-gray-300">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>#{transaction.id.toString().slice(-4)}</span>
                          <span className={transaction.type === "refund" ? "text-red-600" : ""}>
                            {transaction.type === "refund" ? "-" : ""}{formatCurrency(transaction.total)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="text-xs text-gray-600">
                          <span>{formatDate(transaction.date).split(' ')[0]}</span>
                          <span>{transaction.customerName}</span>
                        </div>
                        {transaction.type === "refund" && (
                          <div className="text-xs text-red-600">REFUND</div>
                        )}
                      </div>
                    ))}
                    {reportData.transactions.length > 5 && (
                      <div className="text-xs text-gray-500 text-center">
                        ... dan {reportData.transactions.length - 5} transaksi lainnya
                      </div>
                    )}
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default AdvancedThermalModal;