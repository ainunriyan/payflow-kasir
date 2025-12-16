import React, { useState } from "react";
import { X, Receipt, User, Grid3x3, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import PrinterDetector from "./PrinterDetector";

const ReceiptModal = ({
  show,
  transaction,
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  storeSettings,
  onClose,
}) => {
  const [showPrinterDetector, setShowPrinterDetector] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(() => {
    // Load saved printer from localStorage
    const saved = localStorage.getItem('selectedThermalPrinter');
    return saved ? JSON.parse(saved) : null;
  });

  if (!show || !transaction) return null;

  const handlePrint = async () => {
    if (selectedPrinter && selectedPrinter.print) {
      try {
        const receiptText = generateThermalReceipt();
        await selectedPrinter.print(receiptText);
      } catch (err) {
        alert('Gagal mencetak: ' + err.message);
        window.print();
      }
    } else {
      setShowPrinterDetector(true);
    }
  };

  const generateThermalReceipt = () => {
    let receipt = '';
    receipt += `${(storeSettings?.storeName || 'KASIR UMKM').toUpperCase()}\n`;
    if (storeSettings?.address) receipt += `${storeSettings.address}\n`;
    if (storeSettings?.phone) receipt += `Tel: ${storeSettings.phone}\n`;
    receipt += '--------------------------------\n';
    receipt += `${formatDate(transaction.date)}\n`;
    receipt += `No: #${transaction.id}\n`;
    receipt += '--------------------------------\n';
    receipt += `Nama: ${transaction.customerName}\n`;
    if (transaction.tableNumber && transaction.tableNumber !== '-') {
      receipt += `Meja: ${transaction.tableNumber}\n`;
    }
    receipt += '--------------------------------\n';
    
    transaction.items.forEach(item => {
      receipt += `${item.name}\n`;
      receipt += `${item.qty} x ${formatCurrency(item.price).padStart(20)}\n`;
      receipt += `${formatCurrency(item.price * item.qty).padStart(32)}\n`;
      if (item.note) receipt += `Note: ${item.note}\n`;
    });
    
    receipt += '--------------------------------\n';
    receipt += `TOTAL: ${formatCurrency(transaction.total).padStart(25)}\n`;
    if (transaction.paymentMethod) {
      receipt += `Pembayaran: ${getPaymentMethodName(transaction.paymentMethod)}\n`;
    }
    if (transaction.paymentMethod === 'cash') {
      receipt += `Tunai: ${formatCurrency(transaction.cashPaid).padStart(25)}\n`;
      receipt += `Kembalian: ${formatCurrency(transaction.change).padStart(21)}\n`;
    }
    receipt += '--------------------------------\n';
    receipt += 'Terima kasih!\n';
    if (storeSettings?.description) {
      receipt += `${storeSettings.description}\n`;
    }
    receipt += '\n\n\n';
    
    return receipt;
  };

  const handlePrinterSelect = (printer) => {
    setSelectedPrinter(printer);
    // Save printer to localStorage
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
        const receiptText = generateThermalReceipt();
        await printer.print(receiptText);
      } catch (err) {
        alert('Gagal mencetak: ' + err.message);
      }
    }, 500);
  };

  const handleChangePrinter = () => {
    setShowPrinterDetector(true);
  };

  const handleRemovePrinter = () => {
    setSelectedPrinter(null);
    localStorage.removeItem('selectedThermalPrinter');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Receipt size={24} />
              Struk Pembayaran
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Thermal Receipt Format - Hidden on screen, visible on print */}
          <div className="hidden print:block thermal-print" style={{ width: '58mm', fontSize: '10px', fontFamily: 'Courier New, monospace', margin: '0', padding: '2mm' }}>
            <div className="text-center">
              <div className="font-bold text-sm" style={{ letterSpacing: '0.5px' }}>
                {(storeSettings?.storeName || 'KASIR UMKM').toUpperCase()}
              </div>
              {storeSettings?.address && (
                <div className="text-xs mt-1">{storeSettings.address}</div>
              )}
              {storeSettings?.phone && (
                <div className="text-xs">Tel: {storeSettings.phone}</div>
              )}
              
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              
              <div className="text-xs">{formatDate(transaction.date)}</div>
              <div className="text-xs">No: #{transaction.id}</div>
              
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              
              {/* Customer Info */}
              <div className="text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Nama:</span>
                  <span>{transaction.customerName}</span>
                </div>
                {transaction.tableNumber && transaction.tableNumber !== "-" && (
                  <div className="flex justify-between">
                    <span>Meja:</span>
                    <span>{transaction.tableNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              
              {/* Items */}
              <div className="text-left text-xs space-y-1">
                {transaction.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between">
                      <span className="truncate pr-1">{item.name}</span>
                      <span>{item.qty}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{formatCurrency(item.price)}</span>
                      <span>{formatCurrency(item.price * item.qty)}</span>
                    </div>
                    {item.note && (
                      <div className="text-xs italic">Note: {item.note}</div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              
              {/* Total */}
              <div className="text-left text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(transaction.total)}</span>
                </div>
                {transaction.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Pembayaran:</span>
                    <span>{getPaymentMethodName(transaction.paymentMethod)}</span>
                  </div>
                )}
                {transaction.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span>Tunai:</span>
                      <span>{formatCurrency(transaction.cashPaid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kembalian:</span>
                      <span>{formatCurrency(transaction.change)}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              
              <div className="text-xs text-center">
                Terima kasih!
              </div>
              <div className="text-xs text-center mt-1">
                {storeSettings?.description || "Aplikasi Kasir UMKM"}
              </div>
              
              {/* Trial Watermark */}
              {(() => {
                const fullLicense = localStorage.getItem('payflow_license');
                const trialLicense = localStorage.getItem('payflow_trial');
                
                // Show watermark if no full license OR if trial is active
                if (!fullLicense) {
                  return (
                    <div className="text-xs text-center mt-2 font-bold">
                      ** TRIAL VERSION **
                    </div>
                  );
                }
                return null;
              })()}
              
              <div style={{ height: '20px' }}></div>
            </div>
          </div>

          {/* Regular Receipt Format - Visible on screen, hidden on print */}
          <div className="print:hidden border-t border-b border-dashed py-4 space-y-2">
            {/* Logo */}
            {storeSettings?.logo && (
              <div className="flex justify-center mb-3">
                <img
                  src={storeSettings.logo}
                  alt="Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}

            {/* Store Info */}
            <p className="text-center font-bold text-lg">
              {storeSettings?.storeName || "KASIR UMKM"}
            </p>
            {storeSettings?.description && (
              <p className="text-center text-xs text-gray-600 italic">
                {storeSettings.description}
              </p>
            )}
            {storeSettings?.address && (
              <p className="text-center text-xs text-gray-600">
                {storeSettings.address}
              </p>
            )}
            {storeSettings?.phone && (
              <p className="text-center text-xs text-gray-600">
                Telp: {storeSettings.phone}
              </p>
            )}
            {storeSettings?.email && (
              <p className="text-center text-xs text-gray-600">
                Email: {storeSettings.email}
              </p>
            )}

            <div className="border-t border-dashed pt-2 mt-2">
              <p className="text-center text-sm text-gray-600">
                {formatDate(transaction.date)}
              </p>
              <p className="text-center text-sm">No: #{transaction.id}</p>
            </div>
          </div>

          {/* QR CODE + LOGO - only visible on screen */}
          <div className="print:hidden flex flex-col items-center mt-6">
            <div className="relative">
              {/* QR Code */}
              <QRCodeCanvas
                value={`http://192.168.100.13:3000/verify/${transaction.id}`}
                size={150}
                level="H"
                includeMargin={true}
              />

              {/* Logo di tengah */}
              {storeSettings?.logo && (
                <img
                  src={storeSettings.logo}
                  alt="Logo Tengah"
                  className="w-10 h-10 object-contain rounded-full absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Scan untuk verifikasi transaksi
            </p>
          </div>

          {/* Regular format - only visible on screen */}
          <div className="print:hidden">
            <div className="py-4 border-b border-dashed space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <User size={14} />
                  Nama:
                </span>
                <span className="font-semibold">{transaction.customerName}</span>
              </div>
              {transaction.tableNumber && transaction.tableNumber !== "-" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Grid3x3 size={14} />
                    Meja:
                  </span>
                  <span className="font-semibold">{transaction.tableNumber}</span>
                </div>
              )}
            </div>

            <div className="py-4 space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">
                        {item.qty} x {formatCurrency(item.price)}
                      </p>
                      {item.note && (
                        <p className="text-xs text-yellow-600 italic mt-1">
                          📝 {item.note}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-4 space-y-2">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span className="text-blue-600">
                  {formatCurrency(transaction.total)}
                </span>
              </div>

              {transaction.paymentMethod && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Metode Pembayaran:</span>
                  <span className="font-medium">
                    {getPaymentMethodName(transaction.paymentMethod)}
                  </span>
                </div>
              )}

              {transaction.paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tunai:</span>
                    <span>{formatCurrency(transaction.cashPaid)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>Kembalian:</span>
                    <span>{formatCurrency(transaction.change)}</span>
                  </div>
                </>
              )}

              <p className="text-center text-sm text-gray-600 mt-4 pt-4 border-t">
                Terima kasih atas kunjungan Anda!
              </p>
            </div>
          </div>

          {/* Printer Status */}
          {selectedPrinter && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">{selectedPrinter.name}</p>
                    <p className="text-xs text-green-600">
                      {selectedPrinter.type === 'serial' ? 'USB' : 
                       selectedPrinter.type === 'network' ? `Network (${selectedPrinter.ip})` : 'System'}
                      {storeSettings?.autoPrint && ' • Auto Print: ON'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemovePrinter}
                  className="text-red-500 hover:text-red-700 text-xs">
                  Hapus
                </button>
              </div>
            </div>
          )}
          
          {/* Auto Print Status */}
          {!selectedPrinter && storeSettings?.autoPrint && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Auto Print Aktif</p>
                  <p className="text-xs text-yellow-600">
                    Pilih printer thermal untuk auto print
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-1 mt-4">
            {selectedPrinter ? (
              <>
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-green-600 text-white py-2 px-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1">
                  <Printer size={14} />
                  Thermal
                </button>
                <button
                  onClick={handleChangePrinter}
                  className="bg-orange-500 text-white py-2 px-2 rounded hover:bg-orange-600 text-xs">
                  Ganti
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowPrinterDetector(true)}
                className="flex-1 bg-green-600 text-white py-2 px-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1">
                <Printer size={14} />
                Pilih Printer
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white py-2 px-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
              <Receipt size={14} />
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-400">
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Printer Detector Modal */}
      {showPrinterDetector && (
        <PrinterDetector
          onPrinterSelect={handlePrinterSelect}
          onClose={() => setShowPrinterDetector(false)}
        />
      )}
    </>
  );
};

export default ReceiptModal;