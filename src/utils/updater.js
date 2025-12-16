class UpdateManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateServerUrl = 'https://api.payflow.id/updates';
    this.checkInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Check for updates
  async checkForUpdates() {
    try {
      const lastCheck = localStorage.getItem('lastUpdateCheck');
      const now = Date.now();
      
      // Check only once per day
      if (lastCheck && (now - parseInt(lastCheck)) < this.checkInterval) {
        return null;
      }
      
      localStorage.setItem('lastUpdateCheck', now.toString());
      
      // Simulate server response (replace with actual API call)
      const response = await this.fetchUpdateInfo();
      
      if (response && this.isNewerVersion(response.version, this.currentVersion)) {
        return {
          available: true,
          currentVersion: this.currentVersion,
          newVersion: response.version,
          releaseNotes: response.releaseNotes,
          downloadUrl: response.downloadUrl,
          fileSize: response.fileSize,
          releaseDate: response.releaseDate,
          critical: response.critical || false
        };
      }
      
      return { available: false };
    } catch (error) {
      console.log('Update check failed:', error);
      return null;
    }
  }

  // Simulate server API (replace with actual implementation)
  async fetchUpdateInfo() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - replace with actual server call
    return {
      version: '1.1.0',
      releaseNotes: [
        'Perbaikan bug pada sistem pembayaran',
        'Peningkatan performa laporan',
        'Fitur backup otomatis ke cloud',
        'Perbaikan keamanan login',
        'UI/UX yang lebih responsif'
      ],
      downloadUrl: 'https://releases.payflow.id/v1.1.0/payflow-setup.exe',
      fileSize: '45.2 MB',
      releaseDate: new Date().toISOString(),
      critical: false
    };
  }

  // Compare version numbers
  isNewerVersion(newVersion, currentVersion) {
    const parseVersion = (version) => {
      return version.split('.').map(num => parseInt(num, 10));
    };
    
    const newVer = parseVersion(newVersion);
    const currentVer = parseVersion(currentVersion);
    
    for (let i = 0; i < Math.max(newVer.length, currentVer.length); i++) {
      const newNum = newVer[i] || 0;
      const currentNum = currentVer[i] || 0;
      
      if (newNum > currentNum) return true;
      if (newNum < currentNum) return false;
    }
    
    return false;
  }

  // Download and install update
  async downloadUpdate(updateInfo) {
    try {
      // In a real Electron app, this would trigger the download
      // For web app, redirect to download page
      if (updateInfo.downloadUrl) {
        window.open(updateInfo.downloadUrl, '_blank');
        return { success: true };
      }
      
      throw new Error('Download URL not available');
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Skip this version
  skipVersion(version) {
    localStorage.setItem('skippedVersion', version);
  }

  // Check if version was skipped
  isVersionSkipped(version) {
    const skippedVersion = localStorage.getItem('skippedVersion');
    return skippedVersion === version;
  }

  // Auto-check for updates on app start
  async autoCheckForUpdates() {
    try {
      const updateInfo = await this.checkForUpdates();
      
      if (updateInfo && updateInfo.available) {
        // Don't show if user skipped this version (unless critical)
        if (!updateInfo.critical && this.isVersionSkipped(updateInfo.newVersion)) {
          return null;
        }
        
        return updateInfo;
      }
      
      return null;
    } catch (error) {
      console.log('Auto update check failed:', error);
      return null;
    }
  }

  // Get update history
  getUpdateHistory() {
    const history = localStorage.getItem('updateHistory');
    return history ? JSON.parse(history) : [];
  }

  // Add to update history
  addToUpdateHistory(updateInfo) {
    const history = this.getUpdateHistory();
    history.unshift({
      version: updateInfo.newVersion,
      installedAt: new Date().toISOString(),
      releaseNotes: updateInfo.releaseNotes
    });
    
    // Keep only last 10 updates
    const trimmedHistory = history.slice(0, 10);
    localStorage.setItem('updateHistory', JSON.stringify(trimmedHistory));
  }

  // Check if app needs restart after update
  checkRestartRequired() {
    const restartFlag = localStorage.getItem('restartRequired');
    return restartFlag === 'true';
  }

  // Set restart required flag
  setRestartRequired() {
    localStorage.setItem('restartRequired', 'true');
  }

  // Clear restart flag
  clearRestartFlag() {
    localStorage.removeItem('restartRequired');
  }
}

export default new UpdateManager();