import React, { useState } from "react";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E3278] to-[#5766C6] flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
    
    <div className="text-center mb-8">

      
      <img
        src="/logo1.png"
        alt="Logo"
        className="w-20 h-21 object-contain mx-auto mb-1"
      />
      <h1 className="text-3xl font-bold text-gray-800">Pay Flow</h1>
      <p className="text-gray-600 mt-2">Cashier Management</p>
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
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5568D9] text-white py-3 rounded-lg font-semibold hover:bg-[#4656B5] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline font-semibold">
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
