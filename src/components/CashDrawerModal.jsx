import React, { useState, useEffect } from 'react';
import { DollarSign, X, Plus, Minus, Calculator, Printer } from 'lucide-react';

const CashDrawerModal = ({ 
  show, 
  onClose, 
  formatCurrency, 
  currentUser,
  onCashOperation 
}) => {
  const [operation, setOperation] = useState('open'); // open, add, remove, count
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [cashCount, setCashCount] = useState({
    notes: {
      100000: 0, 50000: 0, 20000: 0, 10000: 0, 5000: 0, 2000: 0, 1000: 0
    },
    coins: {
      1000: 0, 500: 0, 200: 0, 100: 0, 50: 0
    }
  });
  const [drawerStatus, setDrawerStatus] = useState('closed');
  const [lastOperation, setLastOperation] = useState(null);

  useEffect(() => {
    if (show) {
      loadDrawerStatus();
    }
  }, [show]);

  const loadDrawerStatus = () => {
    const status = localStorage.getItem('cashDrawerStatus') || 'closed';
    const lastOp = localStorage.getItem('lastCashOperation');
    setDrawerStatus(status);
    if (lastOp) {
      setLastOperation(JSON.parse(lastOp));
    }
  };

  const denominations = {
    notes: [100000, 50000, 20000, 10000, 5000, 2000, 1000],
    coins: [1000, 500, 200, 100, 50]
  };

  const calculateCashTotal = () => {
    let total = 0;
    
    // Count notes
    Object.entries(cashCount.notes).forEach(([denom, count]) => {
      total += parseInt(denom) * count;
    });
    
    // Count coins
    Object.entries(cashCount.coins).forEach(([denom, count]) => {
      total += parseInt(denom) * count;
    });
    
    return total;
  };

  const updateCashCount = (type, denomination, change) => {
    setCashCount(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [denomination]: Math.max(0, prev[type][denomination] + change)
      }
    }));
  };

  const handleOpenDrawer = () => {
    // Send command to open cash drawer
    openCashDrawer();
    
    const operationData = {
      type: 'open',
      timestamp: new Date().toISOString(),
      user: currentUser.fullName,
      reason: 'Manual open drawer'
    };
    
    setDrawerStatus('open');
    localStorage.setItem('cashDrawerStatus', 'open');
    localStorage.setItem('lastCashOperation', JSON.stringify(operationData));
    
    onCashOperation(operationData);
    alert('Cash drawer dibuka');
  };

  const handleCashOperation = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    if (!reason.trim()) {
      alert('Masukkan alasan operasi kas');
      return;
    }

    const operationData = {
      type: operation,
      amount: parseFloat(amount),
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
      user: currentUser.fullName
    };

    onCashOperation(operationData);
    localStorage.setItem('lastCashOperation', JSON.stringify(operationData));
    
    // Reset form
    setAmount('');
    setReason('');
    
    alert(`Operasi kas ${operation === 'add' ? 'penambahan' : 'pengurangan'} berhasil`);
  };

  const handleCashCount = () => {
    const total = calculateCashTotal();
    
    const countData = {
      type: 'count',
      total: total,
      breakdown: cashCount,
      timestamp: new Date().toISOString(),
      user: currentUser.fullName
    };

    onCashOperation(countData);
    localStorage.setItem('lastCashOperation', JSON.stringify(countData));
    
    alert(`Penghitungan kas selesai. Total: ${formatCurrency(total)}`);
  };

  // Function to send command to cash drawer (ESC/POS command)
  const openCashDrawer = () => {
    try {
      // ESC/POS command to open cash drawer
      const escPos = '\x1B\x70\x00\x19\xFA'; // ESC p 0 25 250
      
      // Try to send to printer (if connected)
      const savedPrinter = localStorage.getItem('selectedThermalPrinter');
      if (savedPrinter) {
        const printerInfo = JSON.parse(savedPrinter);
        
        if (printerInfo.type === 'network' && printerInfo.ip) {
          // Send to network printer
          fetch(`http://${printerInfo.ip}:${printerInfo.port || 9100}`, {
            method: 'POST',
            body: escPos,
            headers: { 'Content-Type': 'text/plain' }
          }).catch(() => {
            console.log('Failed to send drawer command to network printer');
          });
        }
      }
      
      // Also try Web Serial API for USB printers
      if ('serial' in navigator) {
        navigator.serial.requestPort().then(async (port) => {
          await port.open({ baudRate: 9600 });
          const writer = port.writable.getWriter();
          await writer.write(new TextEncoder().encode(escPos));
          await writer.close();
          await port.close();
        }).catch(() => {
          console.log('Serial port not available');
        });
      }
    } catch (error) {
      console.log('Cash drawer command failed:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="text-green-600" size={24} />
              Cash Drawer Management
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Drawer Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status Cash Drawer:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                drawerStatus === 'open' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {drawerStatus === 'open' ? 'Terbuka' : 'Tertutup'}
              </span>
            </div>
            {lastOperation && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Operasi terakhir: {lastOperation.type} oleh {lastOperation.user}</p>
                <p>{new Date(lastOperation.timestamp).toLocaleString('id-ID')}</p>
              </div>
            )}
          </div>

          {/* Operation Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setOperation('open')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  operation === 'open'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Buka Drawer
              </button>
              <button
                onClick={() => setOperation('add')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  operation === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Tambah Kas
              </button>
              <button
                onClick={() => setOperation('remove')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  operation === 'remove'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Kurangi Kas
              </button>
              <button
                onClick={() => setOperation('count')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  operation === 'count'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Hitung Kas
              </button>
            </div>
          </div>

          {/* Open Drawer */}
          {operation === 'open' && (
            <div className="mb-6">
              <div className="text-center p-8">
                <Printer size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Buka cash drawer secara manual
                </p>
                <button
                  onClick={handleOpenDrawer}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Buka Cash Drawer
                </button>
              </div>
            </div>
          )}

          {/* Add/Remove Cash */}
          {(operation === 'add' || operation === 'remove') && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah {operation === 'add' ? 'Penambahan' : 'Pengurangan'}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih alasan...</option>
                  {operation === 'add' ? (
                    <>
                      <option value="Modal awal">Modal awal</option>
                      <option value="Penambahan kas">Penambahan kas</option>
                      <option value="Koreksi kas">Koreksi kas</option>
                      <option value="Lainnya">Lainnya</option>
                    </>
                  ) : (
                    <>
                      <option value="Pengambilan kas">Pengambilan kas</option>
                      <option value="Bayar supplier">Bayar supplier</option>
                      <option value="Biaya operasional">Biaya operasional</option>
                      <option value="Koreksi kas">Koreksi kas</option>
                      <option value="Lainnya">Lainnya</option>
                    </>
                  )}
                </select>
              </div>

              <button
                onClick={handleCashOperation}
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  operation === 'add' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {operation === 'add' ? 'Tambah Kas' : 'Kurangi Kas'}
              </button>
            </div>
          )}

          {/* Cash Count */}
          {operation === 'count' && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Penghitungan Kas Manual</h3>
              
              {/* Notes */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Uang Kertas</h4>
                <div className="space-y-2">
                  {denominations.notes.map(denom => (
                    <div key={denom} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{formatCurrency(denom)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCashCount('notes', denom, -1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-12 text-center font-mono">
                          {cashCount.notes[denom]}
                        </span>
                        <button
                          onClick={() => updateCashCount('notes', denom, 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={12} />
                        </button>
                        <span className="w-24 text-right text-sm">
                          {formatCurrency(denom * cashCount.notes[denom])}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coins */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Uang Koin</h4>
                <div className="space-y-2">
                  {denominations.coins.map(denom => (
                    <div key={denom} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{formatCurrency(denom)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCashCount('coins', denom, -1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-12 text-center font-mono">
                          {cashCount.coins[denom]}
                        </span>
                        <button
                          onClick={() => updateCashCount('coins', denom, 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={12} />
                        </button>
                        <span className="w-24 text-right text-sm">
                          {formatCurrency(denom * cashCount.coins[denom])}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Kas:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(calculateCashTotal())}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCashCount}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Calculator size={16} />
                Simpan Penghitungan
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashDrawerModal;