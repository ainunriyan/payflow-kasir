import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Download, Clock, CheckCircle } from 'lucide-react';

const BackupReminderModal = ({ 
  show, 
  onClose, 
  onBackupNow, 
  onRemindLater, 
  lastBackupDate 
}) => {
  const [reminderType, setReminderType] = useState('');

  useEffect(() => {
    if (show) {
      determineReminderType();
    }
  }, [show, lastBackupDate]);

  const determineReminderType = () => {
    if (!lastBackupDate) {
      setReminderType('never');
      return;
    }

    const now = new Date();
    const lastBackup = new Date(lastBackupDate);
    const daysDiff = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 7) {
      setReminderType('overdue');
    } else if (daysDiff >= 3) {
      setReminderType('due');
    } else {
      setReminderType('recent');
    }
  };

  const getReminderContent = () => {
    switch (reminderType) {
      case 'never':
        return {
          title: 'Backup Data Belum Pernah Dilakukan',
          message: 'Untuk keamanan data, sangat disarankan untuk melakukan backup secara rutin. Backup pertama sebaiknya dilakukan sekarang.',
          urgency: 'high',
          icon: AlertTriangle,
          color: 'red'
        };
      case 'overdue':
        return {
          title: 'Backup Data Sudah Terlambat',
          message: `Backup terakhir dilakukan ${Math.floor((new Date() - new Date(lastBackupDate)) / (1000 * 60 * 60 * 24))} hari yang lalu. Segera lakukan backup untuk melindungi data Anda.`,
          urgency: 'high',
          icon: AlertTriangle,
          color: 'red'
        };
      case 'due':
        return {
          title: 'Saatnya Backup Data',
          message: `Backup terakhir dilakukan ${Math.floor((new Date() - new Date(lastBackupDate)) / (1000 * 60 * 60 * 24))} hari yang lalu. Disarankan untuk melakukan backup sekarang.`,
          urgency: 'medium',
          icon: Clock,
          color: 'orange'
        };
      case 'recent':
        return {
          title: 'Backup Data Masih Terbaru',
          message: `Backup terakhir dilakukan ${Math.floor((new Date() - new Date(lastBackupDate)) / (1000 * 60 * 60 * 24))} hari yang lalu. Data Anda aman.`,
          urgency: 'low',
          icon: CheckCircle,
          color: 'green'
        };
      default:
        return {
          title: 'Backup Data',
          message: 'Lakukan backup untuk keamanan data.',
          urgency: 'medium',
          icon: Download,
          color: 'blue'
        };
    }
  };

  if (!show) return null;

  const content = getReminderContent();
  const Icon = content.icon;

  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const buttonClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icon size={20} className={`text-${content.color}-600`} />
            Backup Reminder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className={`p-4 rounded-lg border ${colorClasses[content.color]} mb-4`}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Icon size={20} />
              {content.title}
            </h3>
            <p className="text-sm">
              {content.message}
            </p>
          </div>

          {lastBackupDate && (
            <div className="mb-4 p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600">
                <strong>Backup terakhir:</strong> {new Date(lastBackupDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Tips Backup:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Lakukan backup minimal seminggu sekali</li>
              <li>• Simpan file backup di tempat yang aman</li>
              <li>• Beri nama file dengan tanggal backup</li>
              <li>• Test restore backup secara berkala</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t">
          {content.urgency !== 'low' && (
            <button
              onClick={onRemindLater}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Ingatkan Nanti
            </button>
          )}
          <button
            onClick={onBackupNow}
            className={`flex-1 px-4 py-2 text-white rounded flex items-center justify-center gap-2 ${buttonClasses[content.color]}`}
          >
            <Download size={16} />
            {content.urgency === 'low' ? 'Backup Sekarang' : 'Backup Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupReminderModal;