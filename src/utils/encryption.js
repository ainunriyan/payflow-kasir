class EncryptionManager {
  constructor() {
    this.key = 'PAYFLOW_SECURE_KEY_2024';
  }

  // Simple encryption for passwords
  hashPassword(password) {
    let hash = 0;
    const salt = 'payflow_salt_2024';
    const combined = password + salt;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  // Verify password
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  // Encrypt sensitive data
  encrypt(data) {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (error) {
      return null;
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const jsonString = atob(encryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  }

  // Generate secure session token
  generateSessionToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}_${random}`);
  }

  // Validate session token (basic)
  validateSessionToken(token) {
    try {
      const decoded = atob(token);
      const [timestamp] = decoded.split('_');
      const tokenAge = Date.now() - parseInt(timestamp);
      
      // Token valid for 8 hours
      return tokenAge < 8 * 60 * 60 * 1000;
    } catch (error) {
      return false;
    }
  }
}

export default new EncryptionManager();