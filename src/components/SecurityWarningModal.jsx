import React from "react";
import { X, Shield, AlertTriangle, Lock } from "lucide-react";

const SecurityWarningModal = ({ show, onClose, onProceed }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle size={24} />
              Peringatan Keamanan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Anda akan membuat akun Administrator pertama
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Akun ini akan memiliki akses penuh ke semua fitur aplikasi termasuk:
                  </p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Manajemen semua produk dan transaksi</li>
                    <li>• Akses ke semua laporan keuangan</li>
                    <li>• Kemampuan membuat/menghapus akun kasir</li>
                    <li>• Pengaturan sistem dan toko</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock size={20} className="text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    Penting untuk Keamanan:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Gunakan password yang kuat (minimal 8 karakter)</li>
                    <li>• Simpan kredential dengan aman</li>
                    <li>• Jangan bagikan akun admin ke orang lain</li>
                    <li>• Setelah admin dibuat, hanya bisa buat akun kasir</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Catatan:</strong> Setelah akun admin pertama dibuat, 
                registrasi publik akan otomatis dinonaktifkan untuk keamanan. 
                Akun kasir baru hanya bisa dibuat melalui menu admin.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onProceed}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Ya, Saya Mengerti
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarningModal;