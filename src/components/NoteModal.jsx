import React from 'react';
import { X, FileText } from 'lucide-react';

const NoteModal = ({ show, selectedItem, itemNote, setItemNote, onSave, onClose }) => {
  if (!show || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Tambah Catatan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">{selectedItem.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            Contoh: Less ice, less sugar, extra shot, tanpa sayur, dll
          </p>
          <textarea
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            placeholder="Masukkan catatan untuk produk ini..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {['Less Ice', 'Less Sugar', 'Extra Shot', 'Tanpa Es', 'Pedas', 'Tidak Pedas'].map(preset => (
            <button
              key={preset}
              onClick={() => setItemNote(itemNote ? `${itemNote}, ${preset}` : preset)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;