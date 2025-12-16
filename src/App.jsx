import "./storage";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Package,
  History,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Search,
  Camera,
  FileText,
  Calendar,
  User,
  Grid3x3,
  X,
  LogOut,
  Lock as LockIcon,
  Settings,
  Wallet,
  Percent,
  Gift,
  Users,
  Key,
  TrendingUp,
  Calculator,
} from "lucide-react";

// Import Auth components
import { useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import PINVerification from "./components/Auth/PINVerification";

// Import all modal components
import NoteModal from "./components/NoteModal";
import OrderInfoModal from "./components/OrderInfoModal";
import PaymentModal from "./components/PaymentModal";
import QRISModal from "./components/QRISModal";
import ReceiptModal from "./components/ReceiptModal";
import DailyReportModal from "./components/DailyReportModal";
import SplashScreen from "./components/SplashScreen";
import StoreSettingsModal from "./components/SettingsModal";
import CashierSettingsModal from "./components/CashierSettingsModal";
import PaymentSettingsModal from "./components/PaymentSettingsModal";
import RefundModal from "./components/RefundModal";
import AdvancedReportModal from "./components/AdvancedReportModal";
import StockUpdateModal from "./components/StockUpdateModal";
import SalesChart from "./components/SalesChart";
import TableReservationModal from "./components/TableReservationModal";
import CategoryFilter from "./components/CategoryFilter";
import DataManagementModal from "./components/DataManagementModal";
import BackupReminderModal from "./components/BackupReminderModal";
import CustomerDisplay from "./components/CustomerDisplay";
import CustomerDisplayOnly from "./components/CustomerDisplayOnly";
import TaxSettingsModal from "./components/TaxSettingsModal";
import DiscountModal from "./components/DiscountModal";
import PromotionModal from "./components/PromotionModal";
import LicenseModal from "./components/LicenseModal";
import CustomerManagementModal from "./components/CustomerManagementModal";
import UpdateNotificationModal from "./components/UpdateNotificationModal";
import ProfitAnalyticsModal from "./components/ProfitAnalyticsModal";
import ProductCostModal from "./components/ProductCostModal";
import TrialReminderModal from "./components/TrialReminderModal";
import BarcodeScanner from "./components/BarcodeScanner";
import SplitBillModal from "./components/SplitBillModal";
import VoidTransactionModal from "./components/VoidTransactionModal";
import CashDrawerModal from "./components/CashDrawerModal";

// Import utilities
import LicenseManager from "./utils/license";
import EncryptionManager from "./utils/encryption";
import DatabaseManager from "./utils/database";
import UpdateManager from "./utils/updater";

const App = () => {
  // Auth states
  const {
    currentUser,
    isPINVerified,
    loading: authLoading,
    login,
    register,
    verifyPIN,
    logout,
    lockScreen,
  } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // License & Update states
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showCustomerManagement, setShowCustomerManagement] = useState(false);
  
  // Profit Analytics states
  const [showProfitAnalytics, setShowProfitAnalytics] = useState(false);
  const [showProductCostModal, setShowProductCostModal] = useState(false);
  const [productCosts, setProductCosts] = useState({});
  
  // Trial reminder states
  const [showTrialReminder, setShowTrialReminder] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  
  // New features states
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showVoidTransaction, setShowVoidTransaction] = useState(false);
  const [selectedTransactionForVoid, setSelectedTransactionForVoid] = useState(null);
  const [showCashDrawer, setShowCashDrawer] = useState(false);
  
  // Button visibility settings
  const [buttonSettings, setButtonSettings] = useState({
    display: true,
    customer: true,
    discount: true,
    scan: true
  });

  // Splash screen state (HARUS DI SINI)
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4100);
    return () => clearTimeout(timer);
  }, []);

  // Existing states (jangan dihapus, tetap ada)
  const [activeTab, setActiveTab] = useState("kasir");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal states (jangan dihapus, tetap ada)
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [showOrderInfoModal, setShowOrderInfoModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [itemNote, setItemNote] = useState("");
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // State untuk fitur refund
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [refundReason, setRefundReason] = useState("");

  // State untuk laporan advanced
  const [reportType, setReportType] = useState("daily");
  const [reportStartDate, setReportStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reportEndDate, setReportEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAdvancedReportModal, setShowAdvancedReportModal] = useState(false);

  // State untuk update stok (kasir)
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);

  // State untuk reservasi meja
  const [showTableReservationModal, setShowTableReservationModal] =
    useState(false);

  // State untuk manajemen data
  const [showDataManagementModal, setShowDataManagementModal] = useState(false);

  // State untuk filter tanggal riwayat
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  // State untuk backup reminder
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState(null);

  // State untuk fitur baru
  const [showCustomerDisplay, setShowCustomerDisplay] = useState(false);
  const navRef = useRef(null);
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [taxSettings, setTaxSettings] = useState({ enabled: false, rate: 11, type: 'inclusive', name: 'PPN' });
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [promotions, setPromotions] = useState([]);

  // State untuk filter kategori
  const [selectedCategory, setSelectedCategory] = useState("all");

  //state baru untuk Settings
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCashierSettings, setShowCashierSettings] = useState(false);
  const [showPaymentSettingsModal, setShowPaymentSettingsModal] =
    useState(false);
  const [paymentSettings, setPaymentSettings] = useState({});
  const [storeSettings, setStoreSettings] = useState({
    storeName: "PAYFLOW",
    address: "",
    phone: "",
    logo: "",
    email: "",
    description: "",
    autoPrint: true,
  });

  const categories = [
    "Makanan Berat",
    "Coffee",
    "Non Coffee",
    "Ice Cream",
    "Refreshment",
    "Makanan Ringan",
    "Dessert",
    "Topping",
    "Lainnya",
  ];

  const paymentMethods = [
    { id: "cash", name: "Tunai / Cash" },
    { id: "qris", name: "QRIS" },
    { id: "gopay", name: "GoPay" },
    { id: "ovo", name: "OVO" },
    { id: "dana", name: "DANA" },
    { id: "shopeepay", name: "ShopeePay" },
    { id: "debit", name: "Kartu Debit" },
    { id: "credit", name: "Kartu Kredit" },
  ];

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Makanan Berat",
    price: "",
    stock: "",
    image: "",
    barcode: "",
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await DatabaseManager.init();
      await DatabaseManager.migrateFromLocalStorage();
      
      // Check license status
      const license = LicenseManager.getCurrentLicenseStatus();
      setLicenseStatus(license);
      
      // Show license modal if no valid license
      if (license.status === 'inactive' || (license.type === 'trial' && license.status === 'expired')) {
        setShowLicenseModal(true);
      }
      
      // Check for updates
      const update = await UpdateManager.autoCheckForUpdates();
      if (update) {
        setUpdateInfo(update);
        setShowUpdateModal(true);
      }
      
      // Load app data
      loadData();
      loadStoreSettings();
      initializeDefaultProducts();
      checkBackupReminder();
      autoResetDailyTransactions();
      loadTaxSettings();
      loadPromotions();
      loadProductCosts();
      loadButtonSettings();
      
      // Check trial reminder
      checkTrialReminder();
      
      // Add global error handler
      const handleGlobalError = (event) => {
        if (event.error && event.error.message && event.error.message.includes('offsetLeft')) {
          console.log('Chart mouse event error caught and ignored');
          event.preventDefault();
        }
      };
      
      window.addEventListener('error', handleGlobalError);
      
      return () => {
        window.removeEventListener('error', handleGlobalError);
      };
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  };

  // Check backup reminder setiap kali user login
  useEffect(() => {
    if (currentUser && isPINVerified) {
      checkBackupReminder();
      checkTrialReminder();
    }
  }, [currentUser, isPINVerified]);
  
  // Check trial reminder function
  const checkTrialReminder = () => {
    const license = LicenseManager.getCurrentLicenseStatus();
    if (license.type === 'trial') {
      setTrialDaysLeft(license.daysLeft);
      
      // Show reminder if 7 days or less, or every 3 days
      const lastReminder = localStorage.getItem('lastTrialReminder');
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      
      if (license.daysLeft <= 7 || !lastReminder || (now - parseInt(lastReminder)) > threeDays) {
        setShowTrialReminder(true);
        localStorage.setItem('lastTrialReminder', now.toString());
      }
    } else if (license.type === 'none' || license.status === 'expired') {
      setTrialDaysLeft(0);
      setShowTrialReminder(true);
    }
  };

  // Initialize default products if none exist
  const initializeDefaultProducts = async () => {
    try {
      const productsData = await window.storage.get("products");
      if (
        !productsData ||
        !productsData.value ||
        JSON.parse(productsData.value).length === 0
      ) {
        // Start with empty products - customer will add their own
        await saveProducts([]);
      }
    } catch (error) {
      console.log("Error initializing products:", error);
    }
  };

  // Security functions
  const checkAdminExists = async () => {
    try {
      const usersData = await window.storage.get("users");
      if (usersData && usersData.value) {
        const users = JSON.parse(usersData.value);
        return users.some((user) => user.role === "admin");
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Role-based access control functions
  const isAdmin = () => currentUser?.role === "admin";
  const isKasir = () => currentUser?.role === "kasir";

  const hasAccess = (feature) => {
    if (isAdmin()) return true;

    const kasirAccess = [
      "kasir",
      "checkout",
      "payment",
      "receipt",
      "stock-update",
      "refund",
      "view-transactions",
      "daily-report",
    ];

    return kasirAccess.includes(feature);
  };

  // Reset tab jika kasir mencoba akses tab yang tidak diizinkan
  useEffect(() => {
    if (currentUser && isPINVerified) {
      // Kasir sekarang bisa akses laporan harian, jadi hapus pembatasan ini
      // if (isKasir() && (activeTab === "laporan")) {
      //   setActiveTab("kasir");
      // }
    }
  }, [currentUser, isPINVerified, activeTab, isKasir]);

  // Tambahkan function baru ini setelah loadData
  const loadStoreSettings = async () => {
    try {
      const settingsData = await window.storage.get("storeSettings");
      if (settingsData && settingsData.value) {
        setStoreSettings(JSON.parse(settingsData.value));
      }

      const paymentData = await window.storage.get("paymentSettings");
      if (paymentData && paymentData.value) {
        setPaymentSettings(JSON.parse(paymentData.value));
      }
    } catch (error) {
      console.log("Using default store settings");
    }
  };

  const loadTaxSettings = async () => {
    try {
      const taxData = await window.storage.get("taxSettings");
      if (taxData && taxData.value) {
        setTaxSettings(JSON.parse(taxData.value));
      }
    } catch (error) {
      console.log("Using default tax settings");
    }
  };

  const loadPromotions = async () => {
    try {
      const promoData = await window.storage.get("promotions");
      if (promoData && promoData.value) {
        setPromotions(JSON.parse(promoData.value));
      }
    } catch (error) {
      console.log("No promotions found");
    }
  };

  const loadProductCosts = async () => {
    try {
      const costsData = await window.storage.get("productCosts");
      if (costsData && costsData.value) {
        setProductCosts(JSON.parse(costsData.value));
      }
    } catch (error) {
      console.log("No product costs found");
    }
  };
  
  const loadButtonSettings = () => {
    try {
      const savedSettings = localStorage.getItem('cashierButtonSettings');
      if (savedSettings) {
        setButtonSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log("Using default button settings");
    }
  };
  
  // Listen for button settings changes
  useEffect(() => {
    const handleSettingsChange = (event) => {
      setButtonSettings(event.detail);
    };
    
    window.addEventListener('buttonSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('buttonSettingsChanged', handleSettingsChange);
  }, []);

  const handleSaveSettings = (newSettings) => {
    setStoreSettings(newSettings);
    setShowSettingsModal(false);
  };

  const handleSavePaymentSettings = (newSettings) => {
    setPaymentSettings(newSettings);
    setShowPaymentSettingsModal(false);
  };

  const loadData = async () => {
    try {
      const productsData = await window.storage.get("products");
      const transactionsData = await window.storage.get("transactions");

      if (productsData) setProducts(JSON.parse(productsData.value));
      if (transactionsData) {
        const transactions = JSON.parse(transactionsData.value);
        // Migrasi data lama untuk kompatibilitas dengan fitur refund
        const migratedTransactions = transactions.map((t) => ({
          ...t,
          status: t.status || "completed",
          refunds: t.refunds || [],
          items: t.items.map((item) => ({
            ...item,
            refunded: item.refunded || false,
            refundedQty: item.refundedQty || 0,
          })),
        }));
        setTransactions(migratedTransactions);
      }
      
      // Auto-archive old transactions (keep last 30 days)
      await archiveOldTransactions();
    } catch (error) {
      console.log("Memuat data baru");
    }
  };

  const saveProducts = async (newProducts) => {
    await window.storage.set("products", JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const saveTransactions = async (newTransactions) => {
    await window.storage.set("transactions", JSON.stringify(newTransactions));
    setTransactions(newTransactions);
  };

  // Fungsi untuk mengarsipkan transaksi lama (simpan 30 hari terakhir)
  const archiveOldTransactions = async () => {
    try {
      const transactionsData = await window.storage.get("transactions");
      if (transactionsData) {
        const allTransactions = JSON.parse(transactionsData.value);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Pisahkan transaksi baru dan lama
        const recentTransactions = allTransactions.filter(t => 
          new Date(t.date) >= thirtyDaysAgo
        );
        const oldTransactions = allTransactions.filter(t => 
          new Date(t.date) < thirtyDaysAgo
        );
        
        // Simpan transaksi lama ke archive jika ada
        if (oldTransactions.length > 0) {
          const existingArchive = await window.storage.get("transactionArchive").catch(() => null);
          const archivedTransactions = existingArchive ? JSON.parse(existingArchive.value) : [];
          const updatedArchive = [...archivedTransactions, ...oldTransactions];
          await window.storage.set("transactionArchive", JSON.stringify(updatedArchive));
        }
        
        // Update transaksi aktif hanya dengan yang 30 hari terakhir
        if (recentTransactions.length !== allTransactions.length) {
          await window.storage.set("transactions", JSON.stringify(recentTransactions));
        }
      }
    } catch (error) {
      console.log("Error archiving old transactions:", error);
    }
  };

  // Fungsi untuk mendapatkan semua transaksi (termasuk arsip)
  const getAllTransactions = async () => {
    try {
      const [currentData, archiveData] = await Promise.all([
        window.storage.get("transactions").catch(() => null),
        window.storage.get("transactionArchive").catch(() => null)
      ]);
      
      const currentTransactions = currentData ? JSON.parse(currentData.value) : [];
      const archivedTransactions = archiveData ? JSON.parse(archiveData.value) : [];
      
      return [...currentTransactions, ...archivedTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } catch (error) {
      return transactions;
    }
  };

  // Fungsi untuk export data
  const handleExportData = async () => {
    try {
      const [productsData, transactionsData, archiveData, settingsData, paymentData] = await Promise.all([
        window.storage.get("products").catch(() => null),
        window.storage.get("transactions").catch(() => null),
        window.storage.get("transactionArchive").catch(() => null),
        window.storage.get("storeSettings").catch(() => null),
        window.storage.get("paymentSettings").catch(() => null)
      ]);

      const exportData = {
        products: productsData ? JSON.parse(productsData.value) : [],
        transactions: transactionsData ? JSON.parse(transactionsData.value) : [],
        transactionArchive: archiveData ? JSON.parse(archiveData.value) : [],
        storeSettings: settingsData ? JSON.parse(settingsData.value) : {},
        paymentSettings: paymentData ? JSON.parse(paymentData.value) : {},
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `payflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update last backup date
      await window.storage.set("lastBackupDate", new Date().toISOString());
      setLastBackupDate(new Date().toISOString());
      
      alert('Data berhasil diexport!');
    } catch (error) {
      alert('Gagal export data: ' + error.message);
    }
  };

  // Fungsi untuk import data
  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validasi struktur data
      if (!importData.version || !importData.exportDate) {
        throw new Error('File backup tidak valid');
      }

      // Konfirmasi import
      const confirmImport = window.confirm(
        `Yakin ingin import data dari ${new Date(importData.exportDate).toLocaleDateString('id-ID')}?\n\n` +
        `Data yang akan diimport:\n` +
        `- ${importData.products?.length || 0} produk\n` +
        `- ${importData.transactions?.length || 0} transaksi aktif\n` +
        `- ${importData.transactionArchive?.length || 0} transaksi arsip\n\n` +
        `PERINGATAN: Semua data saat ini akan diganti!`
      );

      if (!confirmImport) return;

      // Import data
      if (importData.products) {
        await window.storage.set("products", JSON.stringify(importData.products));
        setProducts(importData.products);
      }
      if (importData.transactions) {
        await window.storage.set("transactions", JSON.stringify(importData.transactions));
        setTransactions(importData.transactions);
      }
      if (importData.transactionArchive) {
        await window.storage.set("transactionArchive", JSON.stringify(importData.transactionArchive));
      }
      if (importData.storeSettings) {
        await window.storage.set("storeSettings", JSON.stringify(importData.storeSettings));
        setStoreSettings(importData.storeSettings);
      }
      if (importData.paymentSettings) {
        await window.storage.set("paymentSettings", JSON.stringify(importData.paymentSettings));
        setPaymentSettings(importData.paymentSettings);
      }

      alert('Data berhasil diimport!');
      setShowDataManagementModal(false);
    } catch (error) {
      alert('Gagal import data: ' + error.message);
    }

    // Reset input file
    event.target.value = '';
  };

  // Fungsi untuk membersihkan data lama
  const handleClearOldData = async (days) => {
    try {
      if (days === 0) {
        // Reset semua transaksi
        await window.storage.set("transactions", JSON.stringify([]));
        await window.storage.delete("transactionArchive");
        setTransactions([]);
        alert('Semua transaksi berhasil dihapus!');
      } else {
        // Hapus transaksi lebih dari X hari
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredTransactions = transactions.filter(t => 
          new Date(t.date) >= cutoffDate
        );
        
        await window.storage.set("transactions", JSON.stringify(filteredTransactions));
        setTransactions(filteredTransactions);
        
        // Hapus juga dari arsip
        const archiveData = await window.storage.get("transactionArchive").catch(() => null);
        if (archiveData) {
          const archivedTransactions = JSON.parse(archiveData.value);
          const filteredArchive = archivedTransactions.filter(t => 
            new Date(t.date) >= cutoffDate
          );
          await window.storage.set("transactionArchive", JSON.stringify(filteredArchive));
        }
        
        const deletedCount = transactions.length - filteredTransactions.length;
        alert(`${deletedCount} transaksi lama berhasil dihapus!`);
      }
      
      setShowDataManagementModal(false);
    } catch (error) {
      alert('Gagal menghapus data: ' + error.message);
    }
  };

  // Fungsi untuk cek backup reminder
  const checkBackupReminder = async () => {
    try {
      const backupData = await window.storage.get("lastBackupDate").catch(() => null);
      const lastBackup = backupData ? backupData.value : null;
      setLastBackupDate(lastBackup);

      // Cek apakah perlu menampilkan reminder
      if (!lastBackup) {
        // Belum pernah backup, tapi jangan langsung tampilkan
        // Biarkan user familiar dulu dengan aplikasi
        const firstLoginData = await window.storage.get("firstLoginDate").catch(() => null);
        if (!firstLoginData) {
          await window.storage.set("firstLoginDate", new Date().toISOString());
        } else {
          const firstLogin = new Date(firstLoginData.value);
          const daysSinceFirst = Math.floor((new Date() - firstLogin) / (1000 * 60 * 60 * 24));
          if (daysSinceFirst >= 3) {
            setShowBackupReminder(true);
          }
        }
      } else {
        const lastBackupDate = new Date(lastBackup);
        const daysSinceBackup = Math.floor((new Date() - lastBackupDate) / (1000 * 60 * 60 * 24));
        
        // Tampilkan reminder jika sudah 7 hari atau lebih
        if (daysSinceBackup >= 7) {
          setShowBackupReminder(true);
        }
      }
    } catch (error) {
      console.log('Error checking backup reminder:', error);
    }
  };

  // Fungsi untuk handle backup dari reminder
  const handleBackupFromReminder = async () => {
    await handleExportData();
    await window.storage.set("lastBackupDate", new Date().toISOString());
    setLastBackupDate(new Date().toISOString());
    setShowBackupReminder(false);
  };

  // Fungsi untuk remind later
  const handleRemindLater = async () => {
    // Set reminder untuk 1 hari lagi
    const nextReminder = new Date();
    nextReminder.setDate(nextReminder.getDate() + 1);
    await window.storage.set("nextBackupReminder", nextReminder.toISOString());
    setShowBackupReminder(false);
  };

  // Auto reset transaksi harian
  const autoResetDailyTransactions = async () => {
    try {
      const lastResetData = await window.storage.get("lastResetDate").catch(() => null);
      const today = new Date().toDateString();
      
      if (!lastResetData || lastResetData.value !== today) {
        // Reset transaksi hari ini jika belum direset
        const filtered = transactions.filter(t => 
          new Date(t.date).toDateString() !== today
        );
        await saveTransactions(filtered);
        await window.storage.set("lastResetDate", today);
      }
    } catch (error) {
      console.log('Error auto reset:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Ukuran gambar maksimal 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      alert("Mohon isi semua field");
      return;
    }

    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? newProduct : p
      );
    } else {
      updatedProducts = [...products, newProduct];
    }

    await saveProducts(updatedProducts);
    setProductForm({
      name: "",
      category: "Makanan Berat",
      price: "",
      stock: "",
      image: "",
    });
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      await saveProducts(updatedProducts);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || "",
      barcode: product.barcode || "",
    });
    setShowProductForm(true);
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Stok habis!");
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === product.id && !item.note
    );
    let newCart;
    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        alert("Stok tidak mencukupi!");
        return;
      }
      newCart = cart.map((item) =>
        item.id === product.id && !item.note
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, qty: 1, cartId: Date.now(), note: "" }];
    }
    setCart(newCart);
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    // Clear payment info when new items added
    localStorage.removeItem('currentPayment');
    // Trigger customer display update
    window.dispatchEvent(new CustomEvent('paymentCleared'));
  };

  const updateCartQty = (cartId, change) => {
    const item = cart.find((i) => i.cartId === cartId);
    const product = products.find((p) => p.id === item.id);
    const newQty = item.qty + change;

    if (newQty <= 0) {
      removeFromCart(cartId);
      return;
    }

    const totalQtyInCart = cart
      .filter((i) => i.id === item.id)
      .reduce((sum, i) => sum + (i.cartId === cartId ? newQty : i.qty), 0);

    if (totalQtyInCart > product.stock) {
      alert("Stok tidak mencukupi!");
      return;
    }

    const newCart = cart.map((i) => (i.cartId === cartId ? { ...i, qty: newQty } : i));
    setCart(newCart);
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    // Clear payment info when cart updated
    localStorage.removeItem('currentPayment');
    window.dispatchEvent(new CustomEvent('paymentCleared'));
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((item) => item.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    // Clear payment info when item removed
    localStorage.removeItem('currentPayment');
    window.dispatchEvent(new CustomEvent('paymentCleared'));
  };

  const handleAddNote = (item) => {
    setSelectedCartItem(item);
    setItemNote(item.note || "");
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    const newCart = cart.map((item) =>
      item.cartId === selectedCartItem.cartId
        ? { ...item, note: itemNote.trim() }
        : item
    );
    setCart(newCart);
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    // Clear payment info when note updated
    localStorage.removeItem('currentPayment');
    window.dispatchEvent(new CustomEvent('paymentCleared'));
    setShowNoteModal(false);
    setSelectedCartItem(null);
    setItemNote("");
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const calculateTax = (subtotal) => {
    if (!taxSettings.enabled) return 0;
    if (taxSettings.type === 'inclusive') {
      return (subtotal * taxSettings.rate) / (100 + taxSettings.rate);
    } else {
      return (subtotal * taxSettings.rate) / 100;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = appliedDiscount ? appliedDiscount.amount : 0;
    const afterDiscount = subtotal - discount;
    const tax = taxSettings.type === 'exclusive' ? calculateTax(afterDiscount) : 0;
    return afterDiscount + tax;
  };

  const applyDiscount = (discount) => {
    setAppliedDiscount(discount);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const saveTaxSettings = async (settings) => {
    await window.storage.set("taxSettings", JSON.stringify(settings));
    setTaxSettings(settings);
  };

  const savePromotions = async (promos) => {
    await window.storage.set("promotions", JSON.stringify(promos));
    setPromotions(promos);
  };

  const calculateChange = () => {
    const cash = parseFloat(cashAmount) || 0;
    const total = calculateTotal();
    return cash - total;
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    setShowOrderInfoModal(true);
  };

  const handleOrderInfoSubmit = () => {
    if (!customerName.trim()) {
      alert("Mohon isi nama pemesan!");
      return;
    }
    setShowOrderInfoModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);

    // Save payment info to localStorage for customer display
    const paymentInfo = {
      method: method,
      methodName: getPaymentMethodName(method),
      total: calculateTotal(),
      timestamp: Date.now()
    };
    localStorage.setItem('currentPayment', JSON.stringify(paymentInfo));

    if (
      method === "qris" ||
      method === "gopay" ||
      method === "ovo" ||
      method === "dana" ||
      method === "shopeepay"
    ) {
      setShowQRISModal(true);
    } else if (method === "cash") {
      // Cash will show input form - keep basic payment info
    } else {
      // For debit/credit, process directly
      processPayment(method);
    }
  };

  const processPayment = async (method, cashPaid = 0) => {
    const total = calculateTotal();
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        note: item.note || "",
        refunded: false,
        refundedQty: 0,
      })),
      total: total,
      paymentMethod: method,
      cashPaid: method === "cash" ? cashPaid : total,
      change: method === "cash" ? cashPaid - total : 0,
      customerName: customerName.trim() || "Umum",
      tableNumber: tableNumber.trim() || "-",
      status: "completed",
      refunds: [],
    };

    const updatedProducts = products.map((product) => {
      const totalQty = cart
        .filter((item) => item.id === product.id)
        .reduce((sum, item) => sum + item.qty, 0);

      if (totalQty > 0) {
        return { ...product, stock: product.stock - totalQty };
      }
      return product;
    });

    await saveProducts(updatedProducts);
    await saveTransactions([transaction, ...transactions]);

    // Update payment status to completed
    const completedPaymentInfo = {
      method: method,
      methodName: getPaymentMethodName(method),
      total: total,
      cashPaid: method === 'cash' ? cashPaid : total,
      change: method === 'cash' ? cashPaid - total : 0,
      status: 'completed',
      timestamp: Date.now()
    };
    localStorage.setItem('currentPayment', JSON.stringify(completedPaymentInfo));
    
    // Trigger payment completed event for customer display
    window.dispatchEvent(new CustomEvent('paymentCompleted', { detail: completedPaymentInfo }));

    setLastTransaction(transaction);
    setShowPaymentModal(false);
    setShowQRISModal(false);
    setPaymentMethod("");
    setCashAmount("");
    setShowReceipt(true);
    setCart([]);
    localStorage.setItem('currentCart', JSON.stringify([]));
    
    // Auto print to thermal printer if available and enabled
    setTimeout(async () => {
      try {
        if (!storeSettings.autoPrint) return;
        
        const savedPrinter = localStorage.getItem('selectedThermalPrinter');
        if (savedPrinter) {
          const printerInfo = JSON.parse(savedPrinter);
          if (printerInfo && printerInfo.type) {
            const receiptText = generateThermalReceiptText(transaction);
            
            // Try to print using different methods based on printer type
            if (printerInfo.type === 'network' && printerInfo.ip) {
              // Network printer - send to IP
              await fetch(`http://${printerInfo.ip}:${printerInfo.port || 9100}`, {
                method: 'POST',
                body: receiptText,
                headers: { 'Content-Type': 'text/plain' }
              }).catch(() => {});
            } else if (printerInfo.type === 'serial') {
              // USB/Serial printer - use Web Serial API if available
              if ('serial' in navigator) {
                try {
                  const port = await navigator.serial.requestPort();
                  await port.open({ baudRate: 9600 });
                  const writer = port.writable.getWriter();
                  await writer.write(new TextEncoder().encode(receiptText));
                  await writer.close();
                  await port.close();
                } catch (serialError) {
                  console.log('Serial print failed:', serialError);
                }
              }
            } else {
              // Fallback to system print
              window.print();
            }
          }
        }
      } catch (error) {
        console.log('Auto print failed:', error);
      }
    }, 500);
    
    // Show success status for 5 seconds, then clear
    setTimeout(() => {
      localStorage.removeItem('currentPayment');
      window.dispatchEvent(new CustomEvent('paymentCleared'));
    }, 5000);
    
    setTableNumber("");
    setCustomerName("");
  };

  const handleCashPayment = () => {
    const cash = parseFloat(cashAmount);
    const total = calculateTotal();

    if (!cash || cash < total) {
      alert("Jumlah uang tidak cukup!");
      return;
    }

    // Update payment info with cash details
    const paymentInfo = {
      method: 'cash',
      methodName: 'Tunai / Cash',
      total: total,
      cashPaid: cash,
      change: cash - total,
      timestamp: Date.now()
    };
    localStorage.setItem('currentPayment', JSON.stringify(paymentInfo));

    processPayment("cash", cash);
  };

  const handleQRISConfirm = () => {
    processPayment(paymentMethod);
  };

  // Fungsi untuk refund
  const handleRefundClick = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundItems(
      transaction.items.map((item) => ({
        ...item,
        refundQty: 0,
        selected: false,
      }))
    );
    setRefundReason("");
    setShowRefundModal(true);
  };

  const updateRefundQty = (itemId, qty) => {
    setRefundItems(
      refundItems.map((item) =>
        item.id === itemId
          ? { ...item, refundQty: qty, selected: qty > 0 }
          : item
      )
    );
  };

  const processRefund = async () => {
    const selectedItems = refundItems.filter(
      (item) => item.selected && item.refundQty > 0
    );

    if (selectedItems.length === 0) {
      alert("Pilih item yang akan di-refund!");
      return;
    }

    if (!refundReason.trim()) {
      alert("Mohon isi alasan refund!");
      return;
    }

    const refundTotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.refundQty,
      0
    );

    const refundTransaction = {
      id: Date.now(),
      originalTransactionId: selectedTransaction.id,
      date: new Date().toISOString(),
      items: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.refundQty,
        note: item.note || "",
      })),
      total: refundTotal,
      reason: refundReason.trim(),
      type: "refund",
      customerName: selectedTransaction.customerName,
      tableNumber: selectedTransaction.tableNumber,
    };

    // Update stok produk (kembalikan stok)
    const updatedProducts = products.map((product) => {
      const refundedItem = selectedItems.find((item) => item.id === product.id);
      if (refundedItem) {
        return { ...product, stock: product.stock + refundedItem.refundQty };
      }
      return product;
    });

    // Update transaksi asli
    const updatedTransactions = transactions.map((t) => {
      if (t.id === selectedTransaction.id) {
        const updatedItems = t.items.map((item) => {
          const refundedItem = selectedItems.find((ri) => ri.id === item.id);
          if (refundedItem) {
            return {
              ...item,
              refundedQty: (item.refundedQty || 0) + refundedItem.refundQty,
              refunded:
                (item.refundedQty || 0) + refundedItem.refundQty >= item.qty,
            };
          }
          return item;
        });

        return {
          ...t,
          items: updatedItems,
          refunds: [...(t.refunds || []), refundTransaction],
        };
      }
      return t;
    });

    // Tambahkan transaksi refund ke daftar transaksi
    const allTransactions = [refundTransaction, ...updatedTransactions];

    await saveProducts(updatedProducts);
    await saveTransactions(allTransactions);

    alert(`Refund berhasil! Total: ${formatCurrency(refundTotal)}`);
    setShowRefundModal(false);
    setSelectedTransaction(null);
    setRefundItems([]);
    setRefundReason("");
  };

  // Fungsi untuk update stok (kasir)
  const handleStockUpdate = (productId, newStock, reason) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, stock: newStock };
      }
      return product;
    });

    saveProducts(updatedProducts);

    // Log aktivitas update stok
    const stockLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: "stock_update",
      productId,
      productName: products.find((p) => p.id === productId)?.name,
      oldStock: products.find((p) => p.id === productId)?.stock,
      newStock,
      reason,
      updatedBy: currentUser.fullName,
    };

    // Simpan log (bisa ditambahkan ke storage terpisah jika diperlukan)
    console.log("Stock Update Log:", stockLog);

    alert(
      `Stok ${stockLog.productName} berhasil diupdate dari ${stockLog.oldStock} menjadi ${newStock}`
    );
    setShowStockUpdateModal(false);
    setSelectedProductForStock(null);
  };

  const handleStockUpdateClick = (product) => {
    setSelectedProductForStock(product);
    setShowStockUpdateModal(true);
  };

  const getDailyTransactions = (date) => {
    const targetDate = new Date(date).toDateString();
    return transactions.filter(
      (t) => new Date(t.date).toDateString() === targetDate
    );
  };

  const getDailyReport = (date) => {
    const dailyTrans = getDailyTransactions(date);
    const totalSales = dailyTrans.reduce(
      (sum, t) => sum + (t.type === "refund" ? -t.total : t.total),
      0
    );
    const totalTransactions = dailyTrans.filter(
      (t) => t.type !== "refund"
    ).length;
    const totalRefunds = dailyTrans.filter((t) => t.type === "refund").length;
    const refundAmount = dailyTrans
      .filter((t) => t.type === "refund")
      .reduce((sum, t) => sum + t.total, 0);

    const paymentSummary = {};
    dailyTrans
      .filter((t) => t.type !== "refund")
      .forEach((t) => {
        const method = t.paymentMethod || "Lainnya";
        if (!paymentSummary[method]) {
          paymentSummary[method] = { count: 0, amount: 0 };
        }
        paymentSummary[method].count++;
        paymentSummary[method].amount += t.total;
      });

    const productSummary = {};
    dailyTrans.forEach((t) => {
      const multiplier = t.type === "refund" ? -1 : 1;
      t.items.forEach((item) => {
        if (!productSummary[item.id]) {
          productSummary[item.id] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSummary[item.id].qty += item.qty * multiplier;
        productSummary[item.id].revenue += item.price * item.qty * multiplier;
      });
    });

    return {
      transactions: dailyTrans,
      totalSales,
      totalTransactions,
      totalRefunds,
      refundAmount,
      paymentSummary,
      productSummary: Object.values(productSummary).sort(
        (a, b) => b.revenue - a.revenue
      ),
    };
  };

  // Fungsi untuk laporan periode
  const getAdvancedReport = (startDate, endDate, type) => {
    let filteredTransactions = [];

    if (type === "daily") {
      filteredTransactions = getDailyTransactions(startDate);
    } else if (type === "weekly") {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      filteredTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= start && transDate <= end;
      });
    } else if (type === "monthly") {
      const targetMonth = new Date(startDate).getMonth();
      const targetYear = new Date(startDate).getFullYear();

      filteredTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return (
          transDate.getMonth() === targetMonth &&
          transDate.getFullYear() === targetYear
        );
      });
    } else if (type === "yearly") {
      const targetYear = new Date(startDate).getFullYear();

      filteredTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate.getFullYear() === targetYear;
      });
    } else if (type === "custom") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filteredTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= start && transDate <= end;
      });
    }

    const totalSales = filteredTransactions.reduce(
      (sum, t) => sum + (t.type === "refund" ? -t.total : t.total),
      0
    );
    const totalTransactions = filteredTransactions.filter(
      (t) => t.type !== "refund"
    ).length;
    const totalRefunds = filteredTransactions.filter(
      (t) => t.type === "refund"
    ).length;
    const refundAmount = filteredTransactions
      .filter((t) => t.type === "refund")
      .reduce((sum, t) => sum + t.total, 0);

    const paymentSummary = {};
    filteredTransactions
      .filter((t) => t.type !== "refund")
      .forEach((t) => {
        const method = t.paymentMethod || "Lainnya";
        if (!paymentSummary[method]) {
          paymentSummary[method] = { count: 0, amount: 0 };
        }
        paymentSummary[method].count++;
        paymentSummary[method].amount += t.total;
      });

    const productSummary = {};
    filteredTransactions.forEach((t) => {
      const multiplier = t.type === "refund" ? -1 : 1;
      t.items.forEach((item) => {
        if (!productSummary[item.id]) {
          productSummary[item.id] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSummary[item.id].qty += item.qty * multiplier;
        productSummary[item.id].revenue += item.price * item.qty * multiplier;
      });
    });

    // Analisis per hari untuk grafik
    const dailyAnalysis = {};
    filteredTransactions.forEach((t) => {
      const dateKey = new Date(t.date).toDateString();
      if (!dailyAnalysis[dateKey]) {
        dailyAnalysis[dateKey] = { sales: 0, transactions: 0, refunds: 0 };
      }
      if (t.type === "refund") {
        dailyAnalysis[dateKey].refunds += t.total;
      } else {
        dailyAnalysis[dateKey].sales += t.total;
        dailyAnalysis[dateKey].transactions += 1;
      }
    });

    return {
      transactions: filteredTransactions,
      totalSales,
      totalTransactions,
      totalRefunds,
      refundAmount,
      paymentSummary,
      productSummary: Object.values(productSummary).sort(
        (a, b) => b.revenue - a.revenue
      ),
      dailyAnalysis: Object.entries(dailyAnalysis).map(([date, data]) => ({
        date,
        ...data,
      })),
    };
  };

  const handlePrintDailyReport = () => {
    window.print();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProductsByCategory = (category) => {
    return filteredProducts.filter((p) => p.category === category);
  };

  const getProductCounts = () => {
    const counts = { total: products.length };
    categories.forEach((category) => {
      counts[category] = products.filter((p) => p.category === category).length;
    });
    return counts;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTotalSales = () => {
    return transactions.reduce((sum, t) => sum + t.total, 0);
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(
        (t) => new Date(t.date).toDateString() === today && t.type !== "refund"
      )
      .reduce((sum, t) => sum + t.total, 0);
  };

  const getTodayRefunds = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(
        (t) => new Date(t.date).toDateString() === today && t.type === "refund"
      )
      .reduce((sum, t) => sum + t.total, 0);
  };

  const getTotalRefunds = () => {
    return transactions
      .filter((t) => t.type === "refund")
      .reduce((sum, t) => sum + t.total, 0);
  };

  const getPaymentMethodName = (methodId) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    return method ? method.name : methodId;
  };

  const generateThermalReceiptText = (transaction) => {
    let receipt = '';
    receipt += `${(storeSettings?.storeName || 'PAYFLOW').toUpperCase()}\n`;
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

  // 6. AUTH HANDLERS (TAMBAHKAN DI SINI!!!)
  // ============================================
  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (
    username,
    password,
    pin,
    fullName,
    role = "kasir"
  ) => {
    try {
      // Security check: Jika sudah ada admin dan mencoba buat admin lagi
      const adminExists = await checkAdminExists();
      if (adminExists && role === "admin") {
        throw new Error("Admin sudah ada! Hanya bisa membuat akun kasir.");
      }

      const result = await register(username, password, pin, fullName, role);
      if (result.success) {
        alert("Registrasi berhasil! Silakan login.");
        setShowRegister(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyPIN = async (pin) => {
    try {
      await verifyPIN(pin);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      await logout();
    }
  };

  const handleLockScreen = () => {
    if (window.confirm("Kunci layar kasir?")) {
      lockScreen();
    }
  };

  // New features handlers
  const handleBarcodeScanned = (product) => {
    addToCart(product);
  };

  const handleSplitBillComplete = (splitData) => {
    // Process each split as separate transaction
    splitData.forEach(async (split, index) => {
      const transaction = {
        id: Date.now() + index,
        date: new Date().toISOString(),
        items: split.items,
        total: split.amount,
        paymentMethod: 'split_bill',
        customerName: split.customerName,
        tableNumber: tableNumber.trim() || "-",
        status: "completed",
        refunds: [],
        splitBill: true,
        originalSplitId: Date.now()
      };
      
      const newTransactions = [transaction, ...transactions];
      await saveTransactions(newTransactions);
    });
    
    // Clear cart and close modals
    setCart([]);
    localStorage.setItem('currentCart', JSON.stringify([]));
    alert('Split bill berhasil diproses!');
  };

  const handleVoidTransaction = async (transactionId, voidData) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Return stock
    const updatedProducts = products.map(product => {
      const returnedQty = transaction.items
        .filter(item => item.id === product.id)
        .reduce((sum, item) => sum + item.qty, 0);
      
      if (returnedQty > 0) {
        return { ...product, stock: product.stock + returnedQty };
      }
      return product;
    });

    // Mark transaction as voided
    const updatedTransactions = transactions.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'voided', voidData }
        : t
    );

    await saveProducts(updatedProducts);
    await saveTransactions(updatedTransactions);
    
    setSelectedTransactionForVoid(null);
    setShowVoidTransaction(false);
  };

  const handleCashOperation = (operationData) => {
    // Save cash operation to history
    const cashHistory = JSON.parse(localStorage.getItem('cashHistory') || '[]');
    cashHistory.unshift(operationData);
    localStorage.setItem('cashHistory', JSON.stringify(cashHistory.slice(0, 100))); // Keep last 100 operations
  };

  // Check if URL contains customer-display-only
  if (window.location.pathname === '/customer-display' || window.location.search.includes('display=customer')) {
    return <CustomerDisplayOnly />;
  }

  // Splash Return
  if (showSplash) return <SplashScreen />;

  // 7. AUTH CHECKING
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not logged in
  if (!currentUser) {
    if (showRegister) {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Show PIN verification if logged in but not verified
  if (!isPINVerified) {
    return (
      <PINVerification
        onVerify={handleVerifyPIN}
        onLogout={handleLogout}
        userName={currentUser.fullName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Hide scrollbar */
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
          .print-area {
            font-size: 12px;
            line-height: 1.4;
          }
          .print-area table {
            border-collapse: collapse;
            width: 100%;
          }
          .print-area th, .print-area td {
            border: 1px solid #000;
            padding: 4px 8px;
          }
          /* Thermal printer styles */
          @media print {
            .thermal-print {
              width: 58mm !important;
              font-size: 9px !important;
              font-family: 'Courier New', monospace !important;
              margin: 0 !important;
              padding: 2mm !important;
              line-height: 1.2 !important;
              text-align: center !important;
            }
            .thermal-print * {
              max-width: 100% !important;
              word-wrap: break-word !important;
            }
            @page {
              size: 58mm auto;
              margin: 0;
            }
            /* Auto print when thermal format is detected */
            body.thermal-printing {
              margin: 0;
              padding: 0;
            }
          }
        }
      `}</style>

      {/* Header */}
      <div className="bg-gray-50 text-gray-800 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo */}
            {storeSettings.logo && (
              <img
                src={storeSettings.logo}
                alt="Logo"
                className="max-w-24 h-auto object-contain bg-gray-50 rounded-lg p-1"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {storeSettings.storeName || "PayFlow"}
                {(() => {
                  const license = LicenseManager.getCurrentLicenseStatus();
                  if (license.type === 'trial') {
                    return (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-normal">
                        TRIAL - {license.daysLeft} hari
                      </span>
                    );
                  }
                  return null;
                })()}
              </h1>
              <p className="text-sm opacity-90">PayFlow Cashier Management</p>
            </div>
          </div>

          {/* USER + BUTTON SECTION */}
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-sm font-semibold">{currentUser.fullName}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    currentUser.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                  {currentUser.role === "admin" ? "Administrator" : "Kasir"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLockScreen}
              className="bg-gray-50 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
              title="Kunci Layar">
              <LockIcon size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="bg-gray-50 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
              title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 shadow-md sticky top-0 z-10">
        <div 
          className="flex overflow-x-auto cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => {
            const startX = e.pageX;
            const scrollLeft = e.currentTarget.scrollLeft;
            
            const handleMouseMove = (e) => {
              const walk = (e.pageX - startX) * 2;
              e.currentTarget.scrollLeft = scrollLeft - walk;
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onTouchStart={(e) => {
            const startX = e.touches[0].pageX;
            const scrollLeft = e.currentTarget.scrollLeft;
            
            const handleTouchMove = (e) => {
              const walk = (e.touches[0].pageX - startX) * 2;
              e.currentTarget.scrollLeft = scrollLeft - walk;
            };
            
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          {/* Tab Kasir - Semua role bisa akses */}
          <button
            onClick={() => setActiveTab("kasir")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "kasir"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}>
            <ShoppingCart size={20} />
            Kasir
          </button>

          {/* Tab Produk - Hanya Admin yang bisa tambah/edit/hapus, Kasir hanya update stock */}
          <button
            onClick={() => setActiveTab("produk")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "produk"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}>
            <Package size={20} />
            {isAdmin() ? "Produk" : "Update Stok"}
          </button>

          {/* Tab Riwayat - Semua role bisa akses */}
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "riwayat"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}>
            <History size={20} />
            Riwayat
          </button>



          {/* Tab Laporan - Admin: Full, Kasir: Harian saja */}
          <button
            onClick={() => setActiveTab("laporan")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "laporan"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}>
            <BarChart3 size={20} />
            {isAdmin() ? "Laporan" : "Laporan Harian"}
          </button>

          {/* Tab Reservasi - Semua role bisa akses */}
          <button
            onClick={() => setShowTableReservationModal(true)}
            className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Calendar size={20} />
            Reservasi Meja
          </button>

          {/* Tab Pengaturan - Hanya Admin */}
          {isAdmin() && (
            <>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Settings size={20} />
                Pengaturan Toko
              </button>
              <button
                onClick={() => setShowPaymentSettingsModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Wallet size={20} />
                Pengaturan Pembayaran
              </button>
              <button
                onClick={() => setShowDataManagementModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Package size={20} />
                Manajemen Data
              </button>
              <button
                onClick={() => setShowTaxSettings(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Percent size={20} />
                Pengaturan Pajak
              </button>
              <button
                onClick={() => setShowPromotionModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Gift size={20} />
                Promosi
              </button>
              <button
                onClick={() => setShowCustomerManagement(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Users size={20} />
                Customer
              </button>
              <button
                onClick={() => setShowLicenseModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Key size={20} />
                Lisensi
              </button>
              <button
                onClick={() => setShowProfitAnalytics(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <TrendingUp size={20} />
                Analytics Laba
              </button>
              <button
                onClick={() => setShowProductCostModal(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Calculator size={20} />
                Cost & Margin
              </button>
              <button
                onClick={() => setShowCashierSettings(true)}
                className="flex items-center gap-2 px-6 py-4 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Settings size={20} />
                Pengaturan Kasir
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Tab Kasir */}
        {activeTab === "kasir" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Search */}
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                productCounts={getProductCounts()}
              />

              {/* Products Display */}
              <div className="space-y-4">
                {selectedCategory === "all" ? (
                  // Show all categories when 'all' is selected
                  categories.map((category) => {
                    const categoryProducts = getProductsByCategory(category);
                    if (categoryProducts.length === 0) return null;

                    return (
                      <div
                        key={category}
                        className="bg-gray-50 p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-3 text-gray-700">
                          {category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {categoryProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className={`p-3 border rounded-lg text-left transition-all ${
                                product.stock <= 0
                                  ? "bg-gray-100 cursor-not-allowed opacity-50"
                                  : "hover:shadow-md hover:border-blue-500 bg-gray-50"
                              }`}>
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-24 object-cover rounded mb-2"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                  <Camera size={32} className="text-gray-400" />
                                </div>
                              )}
                              <p className="font-medium text-sm mb-1 truncate">
                                {product.name}
                              </p>
                              <p className="text-blue-600 font-semibold text-sm">
                                {formatCurrency(product.price)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Stok: {product.stock}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Show only selected category
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">
                      {selectedCategory}
                    </h3>
                    {filteredProducts.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        Tidak ada produk dalam kategori ini
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                            className={`p-3 border rounded-lg text-left transition-all ${
                              product.stock <= 0
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "hover:shadow-md hover:border-blue-500 bg-gray-50"
                            }`}>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-24 object-cover rounded mb-2"
                              />
                            ) : (
                              <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                <Camera size={32} className="text-gray-400" />
                              </div>
                            )}
                            <p className="font-medium text-sm mb-1 truncate">
                              {product.name}
                            </p>
                            <p className="text-blue-600 font-semibold text-sm">
                              {formatCurrency(product.price)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Stok: {product.stock}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cart & Customer Display */}
            <div className={`${showCustomerDisplay ? 'lg:col-span-1 md:col-span-2 grid md:grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-4 md:space-y-0' : 'lg:col-span-1'}`}>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Keranjang
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      Keranjang kosong
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.cartId} className="p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQty(item.cartId, -1)}
                              className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center">
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartId, 1)}
                              className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center">
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-red-500 hover:text-red-700 ml-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {item.note ? (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                            <p className="text-gray-600">📝 {item.note}</p>
                            <button
                              onClick={() => handleAddNote(item)}
                              className="text-blue-600 hover:underline mt-1">
                              Edit catatan
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddNote(item)}
                            className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <FileText size={12} />
                            Tambah catatan
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon:</span>
                      <span>-{formatCurrency(appliedDiscount.amount)}</span>
                    </div>
                  )}
                  
                  {taxSettings.enabled && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{taxSettings.name} ({taxSettings.rate}%):</span>
                      <span>{taxSettings.type === 'inclusive' ? 'Included' : formatCurrency(calculateTax(calculateSubtotal() - (appliedDiscount?.amount || 0)))}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {buttonSettings.scan && (
                        <button
                          onClick={() => setShowBarcodeScanner(true)}
                          className="flex-1 min-w-[80px] bg-orange-500 text-white py-2 rounded text-sm hover:bg-orange-600"
                        >
                          📱 Scan
                        </button>
                      )}
                      <button
                        onClick={() => setShowSplitBill(true)}
                        disabled={cart.length === 0}
                        className="flex-1 min-w-[80px] bg-purple-500 text-white py-2 rounded text-sm hover:bg-purple-600 disabled:bg-gray-300"
                      >
                        👥 Split
                      </button>
                      <button
                        onClick={() => setShowCashDrawer(true)}
                        className="flex-1 min-w-[80px] bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600"
                      >
                        💰 Drawer
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {buttonSettings.discount && (
                        <button
                          onClick={() => setShowDiscountModal(true)}
                          disabled={cart.length === 0}
                          className="flex-1 min-w-[80px] bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-300"
                        >
                          Diskon
                        </button>
                      )}
                      {buttonSettings.customer && (
                        <button
                          onClick={() => setShowCustomerDisplay(!showCustomerDisplay)}
                          className="flex-1 min-w-[80px] bg-purple-500 text-white py-2 rounded text-sm hover:bg-purple-600"
                        >
                          Customer
                        </button>
                      )}
                      {buttonSettings.display && (
                        <button
                          onClick={() => window.open(window.location.origin + '?display=customer', '_blank', 'width=800,height=600')}
                          className="flex-1 min-w-[80px] bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600"
                        >
                          Display
                        </button>
                      )}
                    </div>
                    {appliedDiscount && (
                      <button
                        onClick={removeDiscount}
                        className="w-full bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600"
                      >
                        Hapus Diskon
                      </button>
                    )}
                    <button
                      onClick={handleCheckoutClick}
                      disabled={cart.length === 0}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
              
              {showCustomerDisplay && (
                <CustomerDisplay
                  cart={cart}
                  total={calculateTotal()}
                  formatCurrency={formatCurrency}
                  storeSettings={storeSettings}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab Produk */}
        {activeTab === "produk" && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {isAdmin() ? "Manajemen Produk" : "Update Stok Produk"}
                </h3>
                {isAdmin() && (
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        category: "Makanan Berat",
                        price: "",
                        stock: "",
                        image: "",
                      });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={20} />
                    Tambah Produk
                  </button>
                )}
              </div>

              {showProductForm && isAdmin() && (
                <div className="mb-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold mb-3">
                    {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                  </h4>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Gambar Produk
                    </label>
                    <div className="flex items-center gap-4">
                      {productForm.image ? (
                        <div className="relative">
                          <img
                            src={productForm.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border"
                          />
                          <button
                            onClick={() =>
                              setProductForm({ ...productForm, image: "" })
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded border flex items-center justify-center">
                          <Camera size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 inline-block">
                          Pilih Gambar
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Maks. 1MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Produk"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Stok"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Barcode (opsional)"
                      value={productForm.barcode}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          barcode: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddProduct}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      {editingProduct ? "Update" : "Simpan"}
                    </button>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          name: "",
                          category: "Makanan Berat",
                          price: "",
                          stock: "",
                          image: "",
                        });
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                      Batal
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Gambar</th>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-left">Kategori</th>
                      <th className="px-4 py-2 text-left">Barcode</th>
                      <th className="px-4 py-2 text-right">Harga</th>
                      <th className="px-4 py-2 text-center">Stok</th>
                      <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-400">
                          Belum ada produk
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <Camera size={24} className="text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm">
                              {product.barcode || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded ${
                                product.stock <= 5
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isAdmin() ? (
                              // Admin: Edit dan Delete
                              <>
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-800 mr-3"
                                  title="Edit Produk">
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  title="Hapus Produk">
                                  <Trash2 size={18} />
                                </button>
                              </>
                            ) : (
                              // Kasir: Hanya Update Stock
                              <button
                                onClick={() => handleStockUpdateClick(product)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                title="Update Stok">
                                Update Stok
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Riwayat */}
        {activeTab === "riwayat" && (
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Riwayat Transaksi</h3>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Pilih Tanggal:</label>
                <input
                  type="date"
                  value={historyDate}
                  onChange={(e) => setHistoryDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const targetDate = new Date(historyDate).toDateString();
                const dayTransactions = transactions.filter(
                  (t) => new Date(t.date).toDateString() === targetDate
                );
                
                if (dayTransactions.length === 0) {
                  return (
                    <p className="text-gray-400 text-center py-8">
                      Tidak ada transaksi pada {new Date(historyDate).toLocaleDateString('id-ID')}
                    </p>
                  );
                }
                
                return dayTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      transaction.type === "refund"
                        ? "bg-red-50 border-red-200"
                        : ""
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">#{transaction.id}</p>
                          {transaction.type === "refund" ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                              REFUND
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              SELESAI
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                        {transaction.type === "refund" &&
                          transaction.originalTransactionId && (
                            <p className="text-xs text-red-600 mt-1">
                              Refund dari #{transaction.originalTransactionId}
                            </p>
                          )}
                        {transaction.reason && (
                          <p className="text-xs text-red-600 mt-1">
                            Alasan: {transaction.reason}
                          </p>
                        )}
                        <div className="flex gap-3 mt-1">
                          {transaction.customerName && (
                            <p className="text-xs text-purple-600 flex items-center gap-1">
                              <User size={12} />
                              {transaction.customerName}
                            </p>
                          )}
                          {transaction.tableNumber &&
                            transaction.tableNumber !== "-" && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <Grid3x3 size={12} />
                                Meja {transaction.tableNumber}
                              </p>
                            )}
                        </div>
                        {transaction.paymentMethod && (
                          <p className="text-xs text-blue-600 mt-1">
                            💳 {getPaymentMethodName(transaction.paymentMethod)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "refund"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}>
                          {transaction.type === "refund" ? "-" : ""}
                          {formatCurrency(transaction.total)}
                        </p>
                        {transaction.paymentMethod === "cash" &&
                          transaction.change > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Kembalian: {formatCurrency(transaction.change)}
                            </p>
                          )}
                        {transaction.type !== "refund" && transaction.status !== "voided" && hasAccess("refund") && (
                          <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleRefundClick(transaction)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                                Refund
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTransactionForVoid(transaction);
                                  setShowVoidTransaction(true);
                                }}
                                className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600">
                                Void
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Status: {transaction.status === 'voided' ? 'Dibatalkan' : 'Selesai'}
                            </p>
                          </div>
                        )}
                        {transaction.type !== "refund" && !hasAccess("refund") && (
                          <p className="text-xs text-green-600 mt-2">
                            Status: {transaction.status === 'voided' ? 'Dibatalkan' : 'Selesai'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {transaction.items.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span
                              className={
                                item.refunded
                                  ? "line-through text-gray-400"
                                  : ""
                              }>
                              {item.name} x{item.qty}
                              {item.refundedQty > 0 && (
                                <span className="text-red-500 ml-2">
                                  (Refund: {item.refundedQty})
                                </span>
                              )}
                            </span>
                            <span
                              className={
                                item.refunded
                                  ? "line-through text-gray-400"
                                  : ""
                              }>
                              {formatCurrency(item.price * item.qty)}
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-yellow-600 italic ml-4">
                              📝 {item.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {transaction.refunds && transaction.refunds.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-red-600 font-medium mb-2">
                          Riwayat Refund:
                        </p>
                        {transaction.refunds.map((refund, idx) => (
                          <div key={idx} className="text-xs text-red-600 mb-1">
                            {formatDate(refund.date)} -{" "}
                            {formatCurrency(refund.total)} ({refund.reason})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Tab Laporan - Admin: Full, Kasir: Harian saja */}
        {activeTab === "laporan" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Total Penjualan</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(getTotalSales())}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Penjualan Hari Ini</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTodaySales())}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Total Refund</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalRefunds())}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Refund Hari Ini</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(getTodayRefunds())}
                </p>
              </div>
            </div>

            {/* Laporan Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar size={20} />
                    Laporan Harian
                  </h3>
                  <button
                    onClick={() => setShowDailyReportModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-400">
                    <FileText size={20} />
                    Lihat Laporan
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Laporan transaksi harian dengan detail penjualan dan refund
                </p>
              </div>

              {/* Laporan Periode - Hanya Admin */}
              {isAdmin() && (
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart3 size={20} />
                      Laporan Periode
                    </h3>
                    <button
                      onClick={() => setShowAdvancedReportModal(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-400">
                      <FileText size={20} />
                      Lihat Laporan
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Laporan mingguan, bulanan, tahunan dan custom periode
                  </p>
                </div>
              )}

              {/* Best Seller untuk Kasir */}
              {isKasir() && (
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart3 size={20} />
                      Produk Terlaris
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Rekomendasi produk best seller untuk customer
                  </p>
                </div>
              )}
            </div>

            {/* Grafik Dashboard */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Grafik Penjualan 7 Hari Terakhir
              </h3>
              {(() => {
                // Generate data 7 hari terakhir
                const last7Days = [];
                for (let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toDateString();

                  const dayTransactions = transactions.filter(
                    (t) =>
                      new Date(t.date).toDateString() === dateStr &&
                      t.type !== "refund"
                  );

                  const dayRefunds = transactions.filter(
                    (t) =>
                      new Date(t.date).toDateString() === dateStr &&
                      t.type === "refund"
                  );

                  last7Days.push({
                    date: dateStr,
                    sales: dayTransactions.reduce((sum, t) => sum + t.total, 0),
                    refunds: dayRefunds.reduce((sum, t) => sum + t.total, 0),
                    transactions: dayTransactions.length,
                  });
                }

                if (last7Days.every((day) => day.sales === 0)) {
                  return (
                    <p className="text-gray-400 text-center py-8">
                      Belum ada data penjualan
                    </p>
                  );
                }

                try {
                  return (
                    <SalesChart
                      reportData={{ dailyAnalysis: last7Days || [] }}
                      formatCurrency={formatCurrency}
                      chartType="sales"
                    />
                  );
                } catch (error) {
                  return (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-gray-600">Grafik tidak dapat dimuat</p>
                    </div>
                  );
                }
              })()}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-green-600" />
                Produk Terlaris{" "}
                {isKasir() ? "(Rekomendasi untuk Customer)" : ""}
              </h3>
              <div className="space-y-2">
                {(() => {
                  const productSales = {};
                  transactions.forEach((t) => {
                    if (t.type === "refund") return;
                    t.items.forEach((item) => {
                      if (!productSales[item.id]) {
                        productSales[item.id] = {
                          name: item.name,
                          qty: 0,
                          revenue: 0,
                        };
                      }
                      productSales[item.id].qty += item.qty;
                      productSales[item.id].revenue += item.price * item.qty;
                    });
                  });

                  const sorted = Object.values(productSales)
                    .sort((a, b) => b.qty - a.qty)
                    .slice(0, isKasir() ? 10 : 5);

                  if (sorted.length === 0) {
                    return (
                      <p className="text-gray-400 text-center py-4">
                        Belum ada data penjualan
                      </p>
                    );
                  }

                  return sorted.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-3 border rounded hover:bg-gray-50 ${
                        isKasir() && idx < 3
                          ? "bg-green-50 border-green-200"
                          : ""
                      }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            idx === 0
                              ? "bg-yellow-500 text-white"
                              : idx === 1
                              ? "bg-gray-400 text-white"
                              : idx === 2
                              ? "bg-orange-600 text-white"
                              : "bg-blue-100 text-blue-600"
                          }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.qty} terjual
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        show={showNoteModal}
        selectedItem={selectedCartItem}
        itemNote={itemNote}
        setItemNote={setItemNote}
        onSave={handleSaveNote}
        onClose={() => {
          setShowNoteModal(false);
          setSelectedCartItem(null);
          setItemNote("");
        }}
      />

      {/* Order Info Modal */}
      <OrderInfoModal
        show={showOrderInfoModal}
        customerName={customerName}
        setCustomerName={setCustomerName}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        total={calculateTotal()}
        formatCurrency={formatCurrency}
        onSubmit={handleOrderInfoSubmit}
        onClose={() => {
          setShowOrderInfoModal(false);
          setCustomerName("");
          setTableNumber("");
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        paymentMethod={paymentMethod}
        cashAmount={cashAmount}
        setCashAmount={setCashAmount}
        customerName={customerName}
        tableNumber={tableNumber}
        total={calculateTotal()}
        calculateChange={calculateChange}
        formatCurrency={formatCurrency}
        onMethodSelect={handlePaymentMethodSelect}
        onCashPayment={handleCashPayment}
        onBack={() => {
          setPaymentMethod("");
          setCashAmount("");
        }}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentMethod("");
          setCashAmount("");
          localStorage.removeItem('currentPayment');
        }}
        paymentSettings={paymentSettings}
      />

      {/* QRIS Modal */}
      <QRISModal
        show={showQRISModal}
        paymentMethodName={getPaymentMethodName(paymentMethod)}
        total={calculateTotal()}
        customerName={customerName}
        tableNumber={tableNumber}
        formatCurrency={formatCurrency}
        onConfirm={handleQRISConfirm}
        onClose={() => {
          setShowQRISModal(false);
          setPaymentMethod("");
          localStorage.removeItem('currentPayment');
        }}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        show={showReceipt}
        transaction={lastTransaction}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getPaymentMethodName={getPaymentMethodName}
        storeSettings={storeSettings} // ← TAMBAHKAN INI
        onClose={() => {
          setShowReceipt(false);
          localStorage.removeItem('currentPayment');
          window.dispatchEvent(new CustomEvent('paymentCleared'));
        }}
      />

      {/* Daily Report Modal */}
      <DailyReportModal
        show={showDailyReportModal}
        reportDate={reportDate}
        setReportDate={setReportDate}
        getDailyReport={getDailyReport}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        formatDateOnly={formatDateOnly}
        getPaymentMethodName={getPaymentMethodName}
        storeSettings={storeSettings} // ← TAMBAHKAN INI
        onPrint={handlePrintDailyReport}
        onClose={() => setShowDailyReportModal(false)}
      />

      {/* Store Settings Modal - Hanya Admin */}
      {isAdmin() && (
        <StoreSettingsModal
          show={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      )}

      {/* Refund Modal */}
      <RefundModal
        show={showRefundModal}
        transaction={selectedTransaction}
        refundItems={refundItems}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        updateRefundQty={updateRefundQty}
        onProcess={processRefund}
        onClose={() => {
          setShowRefundModal(false);
          setSelectedTransaction(null);
          setRefundItems([]);
          setRefundReason("");
        }}
        formatCurrency={formatCurrency}
      />

      {/* Advanced Report Modal - Hanya Admin */}
      {isAdmin() && (
        <AdvancedReportModal
          show={showAdvancedReportModal}
          reportType={reportType}
          setReportType={setReportType}
          reportStartDate={reportStartDate}
          setReportStartDate={setReportStartDate}
          reportEndDate={reportEndDate}
          setReportEndDate={setReportEndDate}
          getAdvancedReport={getAdvancedReport}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getPaymentMethodName={getPaymentMethodName}
          storeSettings={storeSettings}
          onClose={() => setShowAdvancedReportModal(false)}
        />
      )}

      {/* Stock Update Modal - Untuk Kasir */}
      <StockUpdateModal
        show={showStockUpdateModal}
        product={selectedProductForStock}
        onUpdate={handleStockUpdate}
        onClose={() => {
          setShowStockUpdateModal(false);
          setSelectedProductForStock(null);
        }}
        formatCurrency={formatCurrency}
      />

      {/* Table Reservation Modal */}
      <TableReservationModal
        show={showTableReservationModal}
        onClose={() => setShowTableReservationModal(false)}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      {/* Payment Settings Modal - Hanya Admin */}
      {isAdmin() && (
        <PaymentSettingsModal
          show={showPaymentSettingsModal}
          onClose={() => setShowPaymentSettingsModal(false)}
          onSave={handleSavePaymentSettings}
        />
      )}

      {/* Data Management Modal - Hanya Admin */}
      {isAdmin() && (
        <DataManagementModal
          show={showDataManagementModal}
          onClose={() => setShowDataManagementModal(false)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearOldData={handleClearOldData}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Backup Reminder Modal */}
      <BackupReminderModal
        show={showBackupReminder}
        onClose={() => setShowBackupReminder(false)}
        onBackupNow={handleBackupFromReminder}
        onRemindLater={handleRemindLater}
        lastBackupDate={lastBackupDate}
      />

      {/* Tax Settings Modal */}
      {isAdmin() && (
        <TaxSettingsModal
          show={showTaxSettings}
          onClose={() => setShowTaxSettings(false)}
          onSave={saveTaxSettings}
          currentSettings={taxSettings}
        />
      )}

      {/* Discount Modal */}
      <DiscountModal
        show={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApply={applyDiscount}
        cartTotal={calculateSubtotal()}
      />

      {/* Promotion Modal */}
      {isAdmin() && (
        <PromotionModal
          show={showPromotionModal}
          onClose={() => setShowPromotionModal(false)}
          onSave={savePromotions}
          promotions={promotions}
        />
      )}

      {/* License Modal */}
      <LicenseModal
        show={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        onActivated={() => {
          const license = LicenseManager.getCurrentLicenseStatus();
          setLicenseStatus(license);
          setShowLicenseModal(false);
        }}
      />

      {/* Customer Management Modal */}
      {isAdmin() && (
        <CustomerManagementModal
          show={showCustomerManagement}
          onClose={() => setShowCustomerManagement(false)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Update Notification Modal */}
      <UpdateNotificationModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        updateInfo={updateInfo}
        onUpdate={async () => {
          const result = await UpdateManager.downloadUpdate(updateInfo);
          if (result.success) {
            UpdateManager.addToUpdateHistory(updateInfo);
            setShowUpdateModal(false);
            alert('Update berhasil diunduh! Silakan restart aplikasi.');
          }
        }}
        onSkip={() => {
          UpdateManager.skipVersion(updateInfo.newVersion);
          setShowUpdateModal(false);
        }}
      />

      {/* Profit Analytics Modal */}
      {isAdmin() && (
        <ProfitAnalyticsModal
          show={showProfitAnalytics}
          onClose={() => setShowProfitAnalytics(false)}
          transactions={transactions}
          products={products}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Product Cost Modal */}
      {isAdmin() && (
        <ProductCostModal
          show={showProductCostModal}
          onClose={() => setShowProductCostModal(false)}
          products={products}
          formatCurrency={formatCurrency}
          onSave={(costs) => {
            setProductCosts(costs);
            setShowProductCostModal(false);
          }}
        />
      )}
      
      {/* Trial Reminder Modal */}
      <TrialReminderModal
        show={showTrialReminder}
        onClose={() => setShowTrialReminder(false)}
        daysLeft={trialDaysLeft}
        onBuyLicense={() => {
          setShowTrialReminder(false);
          setShowLicenseModal(true);
        }}
      />
      
      {/* Barcode Scanner */}
      <BarcodeScanner
        show={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
        products={products}
      />
      
      {/* Split Bill Modal */}
      <SplitBillModal
        show={showSplitBill}
        onClose={() => setShowSplitBill(false)}
        cart={cart}
        formatCurrency={formatCurrency}
        onSplitComplete={handleSplitBillComplete}
      />
      
      {/* Void Transaction Modal */}
      <VoidTransactionModal
        show={showVoidTransaction}
        onClose={() => setShowVoidTransaction(false)}
        transaction={selectedTransactionForVoid}
        onVoid={handleVoidTransaction}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        currentUser={currentUser}
      />
      
      {/* Cash Drawer Modal */}
      <CashDrawerModal
        show={showCashDrawer}
        onClose={() => setShowCashDrawer(false)}
        formatCurrency={formatCurrency}
        currentUser={currentUser}
        onCashOperation={handleCashOperation}
      />
      
      {/* Cashier Settings Modal */}
      {isAdmin() && (
        <CashierSettingsModal
          isOpen={showCashierSettings}
          onClose={() => setShowCashierSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
