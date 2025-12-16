import React, { useState } from 'react';
import { X, Download, Upload, Trash2, Archive, Calendar, AlertTriangle } from 'lucide-react';

const DataManagementModal = ({ 
  show, 
  onClose, 
  onExportData, 
  onImportData, 
  onClearOldData,
  formatCurrency,
  formatDate 
}) => {
  const [activeTab, setActiveTab] = useState('backup');
  const [clearDays, setClearDays] = useState(30);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');

  if (!show) return null;

  const handleClearData = (action) => {
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const confirmClearData = () => {
    if (confirmAction === 'clear') {
      onClearOldData(clearDays);
    } else if (confirmAction === 'reset') {
      onClearOldData(0); // Clear all data
    }
    setShowConfirm(false);
    setConfirmAction('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Archive size={24} />
            Manajemen Data
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'backup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Backup & Restore
          </button>
          <button
            onClick={() => setActiveTab('cleanup')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'cleanup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pembersihan Data
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Download size={20} />
                  Export Data
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Unduh semua data transaksi, produk, dan pengaturan sebagai file backup.
                </p>
                <button
                  onClick={onExportData}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Export Data
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Upload size={20} />
                  Import Data
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Restore data dari file backup yang telah diunduh sebelumnya.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload size={16} />
                  Pilih File Backup
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Catatan Penting
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Lakukan backup secara rutin untuk keamanan data</li>
                  <li>• File backup berisi semua data sensitif, simpan dengan aman</li>
                  <li>• Import data akan mengganti semua data yang ada</li>
                  <li>• Pastikan file backup valid sebelum import</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Calendar size={20} />
                  Hapus Data Lama
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  Hapus transaksi yang lebih lama dari jumlah hari yang ditentukan.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-medium">Hapus data lebih dari:</label>
                  <select
                    value={clearDays}
                    onChange={(e) => setClearDays(parseInt(e.target.value))}
                    className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={7}>7 hari</option>
                    <option value={14}>14 hari</option>
                    <option value={30}>30 hari</option>
                    <option value={60}>60 hari</option>
                    <option value={90}>90 hari</option>
                  </select>
                </div>
                <button
                  onClick={() => handleClearData('clear')}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Hapus Data Lama
                </button>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Trash2 size={20} />
                  Reset Semua Data
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  <strong>PERINGATAN:</strong> Ini akan menghapus SEMUA transaksi dan data. 
                  Data produk dan pengaturan akan tetap ada.
                </p>
                <button
                  onClick={() => handleClearData('reset')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Reset Semua Transaksi
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Archive size={20} />
                  Sistem Arsip Otomatis
                </h3>
                <p className="text-sm text-gray-700">
                  Sistem secara otomatis mengarsipkan transaksi yang lebih dari 30 hari 
                  untuk menjaga performa aplikasi. Data yang diarsipkan masih dapat diakses 
                  melalui fitur "Riwayat Harian".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md mx-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-600">
                <AlertTriangle size={24} />
                Konfirmasi Penghapusan
              </h3>
              <p className="text-gray-700 mb-4">
                {confirmAction === 'clear' 
                  ? `Yakin ingin menghapus semua transaksi yang lebih dari ${clearDays} hari?`
                  : 'Yakin ingin menghapus SEMUA transaksi? Tindakan ini tidak dapat dibatalkan!'
                }
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={confirmClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagementModal;