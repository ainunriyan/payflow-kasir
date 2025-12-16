// Mock storage untuk development
const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return { key, value };
      }
      throw new Error('Key not found');
    } catch (error) {
      throw error;
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (error) {
      return null;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (error) {
      return null;
    }
  },

  async list(prefix) {
    try {
      const keys = Object.keys(localStorage).filter(k => 
        !prefix || k.startsWith(prefix)
      );
      return { keys, prefix };
    } catch (error) {
      return null;
    }
  }
};

// Setup window.storage
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;