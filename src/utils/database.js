class DatabaseManager {
  constructor() {
    this.dbName = 'PayFlowDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('name', 'name', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('phone', 'phone', { unique: true });
          customerStore.createIndex('email', 'email', { unique: false });
        }
      };
    });
  }

  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Migration from localStorage
  async migrateFromLocalStorage() {
    try {
      // Migrate products
      const productsData = localStorage.getItem('products');
      if (productsData) {
        const products = JSON.parse(productsData);
        for (const product of products) {
          await this.put('products', product);
        }
      }
      
      // Migrate transactions
      const transactionsData = localStorage.getItem('transactions');
      if (transactionsData) {
        const transactions = JSON.parse(transactionsData);
        for (const transaction of transactions) {
          await this.put('transactions', transaction);
        }
      }
      
      // Migrate users
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        for (const user of users) {
          await this.put('users', user);
        }
      }
      
      console.log('Migration from localStorage completed');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Backup to JSON
  async exportData() {
    const data = {
      products: await this.getAll('products'),
      transactions: await this.getAll('transactions'),
      users: await this.getAll('users'),
      settings: await this.getAll('settings'),
      customers: await this.getAll('customers'),
      exportDate: new Date().toISOString(),
      version: this.version
    };
    
    return data;
  }

  // Restore from JSON
  async importData(data) {
    try {
      if (data.products) {
        await this.clear('products');
        for (const item of data.products) {
          await this.put('products', item);
        }
      }
      
      if (data.transactions) {
        await this.clear('transactions');
        for (const item of data.transactions) {
          await this.put('transactions', item);
        }
      }
      
      if (data.users) {
        await this.clear('users');
        for (const item of data.users) {
          await this.put('users', item);
        }
      }
      
      if (data.settings) {
        await this.clear('settings');
        for (const item of data.settings) {
          await this.put('settings', item);
        }
      }
      
      if (data.customers) {
        await this.clear('customers');
        for (const item of data.customers) {
          await this.put('customers', item);
        }
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new DatabaseManager();