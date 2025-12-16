import React, { useState, useEffect } from 'react';
import { X, Percent, Save } from 'lucide-react';

const TaxSettingsModal = ({ show, onClose, onSave, currentSettings }) => {
  const [taxSettings, setTaxSettings] = useState({
    enabled: false,
    rate: 11,
    type: 'inclusive', // inclusive or exclusive
    name: 'PPN',
    applyToAll: true,
    exemptCategories: []
  });

  const categories = [
    'Makanan Berat', 'Coffee', 'Non Coffee', 'Ice Cream', 
    'Refreshment', 'Makanan Ringan', 'Dessert', 'Topping'
  ];

  useEffect(() => {
    if (currentSettings) {
      setTaxSettings({ ...taxSettings, ...currentSettings });
    }
  }, [currentSettings]);

  const handleSave = () => {
    onSave(taxSettings);
    onClose();
  };

  const toggleExemptCategory = (category) => {
    const exemptCategories = taxSettings.exemptCategories.includes(category)
      ? taxSettings.exemptCategories.filter(c => c !== category)
      : [...taxSettings.exemptCategories, category];
    
    setTaxSettings({ ...taxSettings, exemptCategories });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Percent size={24} />
            Pengaturan Pajak
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Enable Tax */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Aktifkan Pajak</label>
            <input
              type="checkbox"
              checked={taxSettings.enabled}
              onChange={(e) => setTaxSettings({ ...taxSettings, enabled: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          {taxSettings.enabled && (
            <>
              {/* Tax Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Nama Pajak</label>
                <input
                  type="text"
                  value={taxSettings.name}
                  onChange={(e) => setTaxSettings({ ...taxSettings, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PPN, VAT, dll"
                />
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium mb-1">Tarif Pajak (%)</label>
                <input
                  type="number"
                  value={taxSettings.rate}
                  onChange={(e) => setTaxSettings({ ...taxSettings, rate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              {/* Tax Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Pajak</label>
                <select
                  value={taxSettings.type}
                  onChange={(e) => setTaxSettings({ ...taxSettings, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="inclusive">Tax Inclusive (sudah termasuk dalam harga)</option>
                  <option value="exclusive">Tax Exclusive (ditambahkan ke harga)</option>
                </select>
              </div>

              {/* Apply to All */}
              <div className="flex items-center justify-between">
                <label className="font-medium">Terapkan ke Semua Produk</label>
                <input
                  type="checkbox"
                  checked={taxSettings.applyToAll}
                  onChange={(e) => setTaxSettings({ ...taxSettings, applyToAll: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              {/* Exempt Categories */}
              {!taxSettings.applyToAll && (
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori Bebas Pajak</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={taxSettings.exemptCategories.includes(category)}
                          onChange={() => toggleExemptCategory(category)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="bg-blue-50 p-3 rounded border">
                <p className="text-sm font-medium text-blue-800 mb-1">Preview:</p>
                <p className="text-xs text-blue-700">
                  Contoh: Harga Rp 10.000
                </p>
                {taxSettings.type === 'inclusive' ? (
                  <p className="text-xs text-blue-700">
                    Harga Final: Rp 10.000 (sudah termasuk {taxSettings.name} {taxSettings.rate}%)
                  </p>
                ) : (
                  <p className="text-xs text-blue-700">
                    Harga Final: Rp {(10000 * (1 + taxSettings.rate / 100)).toLocaleString('id-ID')} 
                    (+ {taxSettings.name} {taxSettings.rate}%)
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={16} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxSettingsModal;