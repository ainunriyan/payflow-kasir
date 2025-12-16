import React, { useState, useEffect } from 'react';
import { Printer, Wifi, AlertCircle } from 'lucide-react';

const PrinterDetector = ({ onPrinterSelect, onClose }) => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  // Thermal printer keywords untuk auto-detect
  const thermalKeywords = [
    'thermal', 'pos', 'receipt', 'epson', 'tm-', 'rp-', 'star', 'tsp',
    'citizen', 'bixolon', 'xprinter', '58mm', '80mm', 'struk', 'kasir'
  ];

  useEffect(() => {
    detectPrinters();
  }, []);

  const detectPrinters = async () => {
    setIsScanning(true);
    setError('');
    
    try {
      // Method 1: Web Serial API (untuk USB thermal printer)
      if ('serial' in navigator) {
        try {
          const ports = await navigator.serial.getPorts();
          const serialPrinters = ports.map((port, index) => ({
            id: `serial-${index}`,
            name: `USB Thermal Printer ${index + 1}`,
            type: 'serial',
            port: port,
            isThermal: true
          }));
          setPrinters(prev => [...prev, ...serialPrinters]);
        } catch (err) {
          console.log('Serial API not available or no permissions');
        }
      }

      // Method 2: Network printer detection (untuk WiFi/Ethernet thermal printer)
      const networkPrinters = await scanNetworkPrinters();
      setPrinters(prev => [...prev, ...networkPrinters]);

      // Method 3: System printers (fallback)
      const systemPrinters = await getSystemPrinters();
      setPrinters(prev => [...prev, ...systemPrinters]);

    } catch (err) {
      setError('Gagal mendeteksi printer: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const scanNetworkPrinters = async () => {
    // Scan common thermal printer IPs
    const commonIPs = [
      '192.168.1.100', '192.168.1.101', '192.168.1.200',
      '192.168.0.100', '192.168.0.101', '192.168.0.200'
    ];
    
    const networkPrinters = [];
    
    for (const ip of commonIPs) {
      try {
        // Test connection to common thermal printer ports
        const response = await fetch(`http://${ip}:9100`, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(1000)
        });
        
        networkPrinters.push({
          id: `network-${ip}`,
          name: `Network Thermal Printer (${ip})`,
          type: 'network',
          ip: ip,
          port: 9100,
          isThermal: true
        });
      } catch (err) {
        // Printer tidak ditemukan di IP ini
      }
    }
    
    return networkPrinters;
  };

  const getSystemPrinters = async () => {
    // Simulasi deteksi system printer (dalam real app, ini akan menggunakan Electron atau native API)
    const mockSystemPrinters = [
      { name: 'Microsoft Print to PDF', isThermal: false },
      { name: 'EPSON TM-T20II Receipt', isThermal: true },
      { name: 'Star TSP143III', isThermal: true },
      { name: 'XPrinter XP-58IIH', isThermal: true }
    ];

    return mockSystemPrinters
      .filter(printer => {
        // Auto-detect thermal printer berdasarkan nama
        const name = printer.name.toLowerCase();
        return thermalKeywords.some(keyword => name.includes(keyword));
      })
      .map((printer, index) => ({
        id: `system-${index}`,
        name: printer.name,
        type: 'system',
        isThermal: printer.isThermal
      }));
  };

  const handlePrinterSelect = (printer) => {
    setSelectedPrinter(printer);
  };

  const handleConnect = async () => {
    if (!selectedPrinter) return;

    try {
      if (selectedPrinter.type === 'serial') {
        // Connect to USB thermal printer
        await selectedPrinter.port.open({ baudRate: 9600 });
        onPrinterSelect({
          ...selectedPrinter,
          print: async (data) => {
            const writer = selectedPrinter.port.writable.getWriter();
            await writer.write(new TextEncoder().encode(data));
            writer.releaseLock();
          }
        });
      } else if (selectedPrinter.type === 'network') {
        // Connect to network thermal printer
        onPrinterSelect({
          ...selectedPrinter,
          print: async (data) => {
            await fetch(`http://${selectedPrinter.ip}:${selectedPrinter.port}`, {
              method: 'POST',
              body: data,
              headers: { 'Content-Type': 'text/plain' }
            });
          }
        });
      } else {
        // Use system printer
        onPrinterSelect({
          ...selectedPrinter,
          print: async () => {
            window.print();
          }
        });
      }
      
      onClose();
    } catch (err) {
      setError('Gagal terhubung ke printer: ' + err.message);
    }
  };

  const requestUSBPermission = async () => {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        const newPrinter = {
          id: `serial-new-${Date.now()}`,
          name: 'USB Thermal Printer (Baru)',
          type: 'serial',
          port: port,
          isThermal: true
        };
        setPrinters(prev => [...prev, newPrinter]);
        setSelectedPrinter(newPrinter);
      } catch (err) {
        setError('Gagal mendapatkan akses USB: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Printer size={24} />
            Deteksi Thermal Printer
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Printer Terdeteksi:</span>
            <button
              onClick={detectPrinters}
              disabled={isScanning}
              className="text-blue-600 text-sm hover:underline disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Refresh'}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {printers.length === 0 && !isScanning ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Tidak ada printer terdeteksi
              </p>
            ) : (
              printers.map(printer => (
                <div
                  key={printer.id}
                  onClick={() => handlePrinterSelect(printer)}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedPrinter?.id === printer.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Printer size={16} className={printer.isThermal ? 'text-green-600' : 'text-gray-400'} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{printer.name}</p>
                      <p className="text-xs text-gray-500">
                        {printer.type === 'serial' ? 'USB' : 
                         printer.type === 'network' ? `Network (${printer.ip})` : 'System'}
                        {printer.isThermal && ' • Thermal'}
                      </p>
                    </div>
                    {printer.type === 'network' && (
                      <Wifi size={14} className="text-blue-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={requestUSBPermission}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200"
          >
            + Tambah USB Printer
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedPrinter}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Hubungkan
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Pastikan thermal printer sudah terhubung dan menyala
        </p>
      </div>
    </div>
  );
};

export default PrinterDetector;