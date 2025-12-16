import React, { useState, useEffect } from 'react';
import { UserPlus, User, Lock, Hash, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import SecurityWarningModal from '../SecurityWarningModal';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  const checkAdminExists = async () => {
    try {
      const usersData = await window.storage.get("users");
      if (usersData && usersData.value) {
        const users = JSON.parse(usersData.value);
        const hasAdmin = users.some(user => user.role === "admin");
        setAdminExists(hasAdmin);
        if (hasAdmin) {
          setFormData(prev => ({ ...prev, role: "kasir" }));
        }
      }
    } catch (error) {
      setAdminExists(false);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      setError('PIN tidak cocok');
      return;
    }

    if (!/^\d{4,6}$/.test(formData.pin)) {
      setError('PIN harus 4-6 digit angka');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter untuk keamanan');
      return;
    }

    // Security check untuk admin
    if (formData.role === 'admin' && !adminExists) {
      setShowSecurityWarning(true);
      return;
    }

    if (adminExists && formData.role === 'admin') {
      setError('Admin sudah ada! Hanya bisa membuat akun kasir.');
      return;
    }

    await processRegistration();
  };

  const processRegistration = async () => {
    setLoading(true);

    try {
      await onRegister(
        formData.username,
        formData.password,
        formData.pin,
        formData.fullName,
        formData.role
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityWarningProceed = () => {
    setShowSecurityWarning(false);
    processRegistration();
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-[#2E3278] to-[#7888D9] flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
         <div className="bg-[#5568D9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">

            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Akun</h1>
          <p className="text-gray-600 mt-2">Buat akun kasir baru</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nama lengkap Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Username untuk login"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN (4-6 digit)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                maxLength="6"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: 1234"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">PIN untuk verifikasi akses kasir</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi PIN
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                maxLength="6"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ulangi PIN"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Akun
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={adminExists}
              >
                {!adminExists && <option value="admin">Administrator (Akses Penuh)</option>}
                <option value="kasir">Kasir (Akses Terbatas)</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {adminExists 
                ? "Admin sudah ada. Hanya bisa membuat akun kasir." 
                : "Admin: Semua fitur | Kasir: Kasir, update stok, refund"
              }
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
           className="w-full bg-[#5568D9] text-white py-3 rounded-lg font-semibold hover:bg-[#4656B5] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"

          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Sudah punya akun?{' '}
            <button
              onClick={onSwitchToLogin}
             className="text-[#5568D9] hover:underline font-semibold"

            >
              Login di sini
            </button>
          </p>
        </div>

        {/* Security Warning Modal */}
        <SecurityWarningModal
          show={showSecurityWarning}
          onClose={() => setShowSecurityWarning(false)}
          onProceed={handleSecurityWarningProceed}
        />
      </div>
    </div>
  );
};

export default RegisterForm;