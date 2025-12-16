import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-lock after 5 minutes of inactivity
  useEffect(() => {
    if (currentUser && isPINVerified) {
      let timeout;

      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsPINVerified(false);
        }, 5 * 60 * 1000); // 5 minutes
      };

      const events = ["mousedown", "keydown", "scroll", "touchstart"];
      events.forEach((event) => {
        document.addEventListener(event, resetTimer);
      });

      resetTimer();

      return () => {
        clearTimeout(timeout);
        events.forEach((event) => {
          document.removeEventListener(event, resetTimer);
        });
      };
    }
  }, [currentUser, isPINVerified]);

  const checkAuth = async () => {
    try {
      const userData = await window.storage.get("currentUser");
      if (userData && userData.value) {
        setCurrentUser(JSON.parse(userData.value));
      }
    } catch (error) {
      console.log("No user logged in");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, pin, fullName, role = "kasir") => {
    try {
      // Check if user already exists
      let users = [];

      try {
        const usersData = await window.storage.get("users");
        if (usersData && usersData.value) {
          users = JSON.parse(usersData.value);
        }
      } catch (error) {
        // Jika key 'users' tidak ditemukan, buat array kosong
        console.log("Membuat database users baru");
        users = [];
      }

      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        throw new Error("Username sudah digunakan");
      }

      // Validate PIN (must be 4-6 digits)
      if (!/^\d{4,6}$/.test(pin)) {
        throw new Error("PIN harus berisi 4-6 digit angka");
      }

      const newUser = {
        id: Date.now(),
        username,
        password, // In production, hash this!
        pin, // In production, hash this!
        fullName,
        createdAt: new Date().toISOString(),
        role: users.length === 0 ? "admin" : role, // First user is admin, others as specified
      };

      users.push(newUser);
      await window.storage.set("users", JSON.stringify(users));

      return { success: true, user: newUser };
    } catch (error) {
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      let usersData;

      try {
        usersData = await window.storage.get("users");
      } catch (error) {
        throw new Error(
          "Belum ada user terdaftar. Silakan register terlebih dahulu."
        );
      }

      if (!usersData || !usersData.value) {
        throw new Error(
          "Belum ada user terdaftar. Silakan register terlebih dahulu."
        );
      }

      const users = JSON.parse(usersData.value);
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        throw new Error("Username atau password salah");
      }

      setCurrentUser(user);
      await window.storage.set("currentUser", JSON.stringify(user));
      setIsPINVerified(false); // Require PIN verification after login

      return { success: true, user };
    } catch (error) {
      throw error;
    }
  };

  const verifyPIN = async (pin) => {
    if (!currentUser) {
      throw new Error("User tidak ditemukan");
    }

    if (currentUser.pin === pin) {
      setIsPINVerified(true);
      return { success: true };
    } else {
      throw new Error("PIN salah");
    }
  };

  const logout = async () => {
    try {
      await window.storage.delete("currentUser");
      setCurrentUser(null);
      setIsPINVerified(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const lockScreen = () => {
    setIsPINVerified(false);
  };

  const value = {
    currentUser,
    isPINVerified,
    loading,
    register,
    login,
    verifyPIN,
    logout,
    lockScreen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
