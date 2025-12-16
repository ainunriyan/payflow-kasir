import React, { useState } from 'react';
import { Download, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';

const UpdateNotificationModal = ({ show, onClose, updateInfo, onUpdate, onSkip }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpdate = async () => {
    setDownloading(true);
    setProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          onUpdate();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  if (!show || !updateInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Download className="text-blue-600" size={24} />
              Update Tersedia
            </h2>
            {!downloading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Version Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Versi Saat Ini:</span>
                <span className="font-semibold">{updateInfo.currentVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Versi Baru:</span>
                <span className="font-semibold text-blue-600">{updateInfo.newVersion}</span>
              </div>
            </div>

            {/* Update Type */}
            <div className="flex items-center gap-2">
              {updateInfo.critical ? (
                <AlertCircle className="text-red-500" size={20} />
              ) : (
                <CheckCircle className="text-green-500" size={20} />
              )}
              <span className={`font-medium ${updateInfo.critical ? 'text-red-600' : 'text-green-600'}`}>
                {updateInfo.critical ? 'Update Penting' : 'Update Tersedia'}
              </span>
            </div>

            {/* Release Notes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Yang Baru:</h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                <ul className="text-sm text-gray-600 space-y-1">
                  {updateInfo.releaseNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Download Progress */}
            {downloading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mengunduh update...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* File Size */}
            <div className="text-sm text-gray-500">
              Ukuran: {updateInfo.fileSize} • Rilis: {new Date(updateInfo.releaseDate).toLocaleDateString('id-ID')}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {!downloading ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    {updateInfo.critical ? 'Update Sekarang' : 'Update'}
                  </button>
                  {!updateInfo.critical && (
                    <button
                      onClick={onSkip}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Nanti
                    </button>
                  )}
                </>
              ) : (
                <div className="flex-1 bg-gray-100 py-3 rounded-lg flex items-center justify-center gap-2 text-gray-600">
                  <RefreshCw className="animate-spin" size={20} />
                  Mengunduh...
                </div>
              )}
            </div>

            {/* Warning for critical updates */}
            {updateInfo.critical && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-500 mt-0.5" size={16} />
                  <div className="text-sm text-red-700">
                    <strong>Update Penting:</strong> Update ini mengandung perbaikan keamanan dan bug kritis. 
                    Sangat disarankan untuk mengupdate sekarang.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotificationModal;