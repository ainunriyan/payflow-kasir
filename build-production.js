const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building PayFlow for Production...\n');

// 1. Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('build')) {
  fs.rmSync('build', { recursive: true, force: true });
}

// 2. Set production environment
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';

// 3. Build the app
console.log('📦 Building React app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 4. Create version info
console.log('📝 Creating version info...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const versionInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  name: packageJson.name,
  description: packageJson.description
};

fs.writeFileSync(
  path.join('build', 'version.json'),
  JSON.stringify(versionInfo, null, 2)
);

// 5. Copy additional files
console.log('📋 Copying additional files...');
const filesToCopy = [
  'README.md',
  'LICENSE',
  'CHANGELOG.md'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('build', file));
  }
});

// 6. Create installer info
console.log('💾 Creating installer configuration...');
const installerConfig = {
  appName: 'PayFlow Kasir',
  appVersion: packageJson.version,
  appDescription: packageJson.description,
  appAuthor: packageJson.author,
  appHomepage: packageJson.homepage,
  buildDate: new Date().toISOString(),
  requirements: {
    windows: '10.0.0',
    memory: '4GB',
    storage: '2GB'
  },
  features: [
    'Sistem Kasir Lengkap',
    'Manajemen Produk & Stok',
    'Customer Management',
    'Laporan & Analytics',
    'Multi Payment Method',
    'Thermal Printer Support',
    'Auto Backup & Update',
    'License Protection'
  ]
};

fs.writeFileSync(
  path.join('build', 'installer-config.json'),
  JSON.stringify(installerConfig, null, 2)
);

// 7. Create deployment package info
console.log('📦 Creating deployment package...');
const deploymentInfo = {
  name: 'payflow-kasir',
  version: packageJson.version,
  platform: 'web',
  buildType: 'production',
  buildDate: new Date().toISOString(),
  files: {
    main: 'index.html',
    assets: 'static/',
    config: 'config.json'
  },
  deployment: {
    type: 'static',
    server: 'nginx',
    ssl: true,
    compression: true
  }
};

fs.writeFileSync(
  path.join('build', 'deployment.json'),
  JSON.stringify(deploymentInfo, null, 2)
);

// 8. Generate file manifest
console.log('📋 Generating file manifest...');
function generateManifest(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...generateManifest(fullPath, relativePath));
    } else {
      files.push({
        path: relativePath.replace(/\\/g, '/'),
        size: stat.size,
        modified: stat.mtime.toISOString()
      });
    }
  });
  
  return files;
}

const manifest = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  totalFiles: 0,
  totalSize: 0,
  files: generateManifest('build')
};

manifest.totalFiles = manifest.files.length;
manifest.totalSize = manifest.files.reduce((sum, file) => sum + file.size, 0);

fs.writeFileSync(
  path.join('build', 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// 9. Create production config
console.log('⚙️ Creating production config...');
const prodConfig = {
  app: {
    name: 'PayFlow Kasir',
    version: packageJson.version,
    environment: 'production',
    debug: false
  },
  license: {
    required: true,
    trialDays: 30,
    serverUrl: 'https://api.payflow.id/license'
  },
  updates: {
    enabled: true,
    serverUrl: 'https://api.payflow.id/updates',
    checkInterval: 86400000
  },
  features: {
    customerManagement: true,
    thermalPrinter: true,
    cloudBackup: true,
    multiUser: true,
    analytics: true
  },
  security: {
    encryption: true,
    sessionTimeout: 28800000,
    maxLoginAttempts: 5
  }
};

fs.writeFileSync(
  path.join('build', 'config.json'),
  JSON.stringify(prodConfig, null, 2)
);

// 10. Success message
console.log('\n✅ Production build completed successfully!');
console.log(`📦 Version: ${packageJson.version}`);
console.log(`📁 Output: ./build/`);
console.log(`📊 Total files: ${manifest.totalFiles}`);
console.log(`💾 Total size: ${(manifest.totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('\n🚀 Ready for deployment!');

// 11. Next steps
console.log('\n📋 Next Steps:');
console.log('1. Test the build: npx serve -s build');
console.log('2. Create installer: npm run create-installer');
console.log('3. Deploy to server: npm run deploy');
console.log('4. Update documentation: npm run docs');