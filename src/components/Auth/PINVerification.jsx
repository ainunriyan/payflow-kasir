import React, { useState, useRef, useEffect } from "react";
import { Lock, AlertCircle, LogOut } from "lucide-react";

const PINVerification = ({ onVerify, onLogout, userName }) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value) {
      const fullPin = [...newPin.slice(0, index), value].join("");
      if (fullPin.length >= 4) {
        handleVerify(fullPin);
      }
    } else if (newPin.join("").length >= 4 && newPin[5]) {
      handleVerify(newPin.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (pinValue) => {
    setLoading(true);
    setError("");

    try {
      await onVerify(pinValue);
    } catch (err) {
      setError(err.message);
      setPin(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPin = pin.join("");
    if (fullPin.length >= 4) {
      handleVerify(fullPin);
    } else {
      setError("PIN minimal 4 digit");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E3278] to-[#7888D9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-[#5568D9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi PIN</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {userName}</p>
          <p className="text-sm text-gray-500 mt-1">
            Masukkan PIN untuk akses kasir
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="password"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || pin.join("").length < 4}
            className="w-full bg-[#5568D9] text-white py-3 rounded-lg font-semibold hover:bg-[#4656B5] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-4">
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
            <LogOut size={20} />
            Logout
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 Untuk keamanan, PIN akan diminta kembali setelah 5 menit tidak
            aktif
          </p>
        </div>
      </div>
    </div>
  );
};

export default PINVerification;
