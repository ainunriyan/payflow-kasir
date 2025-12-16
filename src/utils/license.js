class LicenseManager {
  constructor() {
    this.secretKey = 'PAYFLOW_2024_SECRET_KEY';
  }

  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('PayFlow License', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  }

  validateLicenseFormat(licenseKey) {
    const pattern = /^PF-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(licenseKey);
  }

  generateTrialLicense() {
    const trialData = {
      type: 'trial',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      fingerprint: this.generateFingerprint()
    };
    
    return btoa(JSON.stringify(trialData));
  }

  checkTrialStatus() {
    const trialLicense = localStorage.getItem('payflow_trial');
    if (!trialLicense) return null;

    try {
      const trialData = JSON.parse(atob(trialLicense));
      const now = new Date();
      const endDate = new Date(trialData.endDate);
      
      if (now > endDate) {
        return { expired: true, daysLeft: 0 };
      }
      
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return { expired: false, daysLeft, startDate: trialData.startDate };
    } catch (error) {
      return null;
    }
  }

  startTrial() {
    const existingTrial = this.checkTrialStatus();
    if (existingTrial && !existingTrial.expired) {
      return { success: false, error: 'Trial sudah aktif' };
    }
    
    const trialLicense = this.generateTrialLicense();
    localStorage.setItem('payflow_trial', trialLicense);
    
    return { success: true, message: 'Trial 30 hari dimulai', daysLeft: 30 };
  }

  async validateLicense(licenseKey) {
    if (!this.validateLicenseFormat(licenseKey)) {
      return { valid: false, error: 'Format lisensi tidak valid' };
    }

    // Accept all properly formatted PF- keys as valid
    // In production, you can add server validation here
    if (licenseKey.startsWith('PF-')) {
      return { valid: true, type: 'full' };
    }
    
    return { valid: false, error: 'Lisensi tidak valid' };
  }

  getCurrentLicenseStatus() {
    const fullLicense = localStorage.getItem('payflow_license');
    if (fullLicense) {
      return { type: 'full', status: 'active' };
    }
    
    const trialStatus = this.checkTrialStatus();
    if (trialStatus) {
      return { 
        type: 'trial', 
        status: trialStatus.expired ? 'expired' : 'active',
        daysLeft: trialStatus.daysLeft
      };
    }
    
    return { type: 'none', status: 'inactive' };
  }

  async activateLicense(licenseKey) {
    const validation = await this.validateLicense(licenseKey);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    localStorage.setItem('payflow_license', licenseKey);
    localStorage.setItem('payflow_license_data', JSON.stringify({
      activatedAt: new Date().toISOString(),
      fingerprint: this.generateFingerprint(),
      type: validation.type
    }));
    
    return { success: true, message: 'Lisensi berhasil diaktivasi' };
  }
}

export default new LicenseManager();