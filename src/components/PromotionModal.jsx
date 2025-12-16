import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Gift, Calendar, Tag } from 'lucide-react';

const PromotionModal = ({ show, onClose, onSave, promotions = [] }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    name: '',
    type: 'buy_x_get_y',
    description: '',
    startDate: '',
    endDate: '',
    active: true,
    conditions: {
      buyQty: 1,
      getQty: 1,
      minAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      applicableCategories: [],
      applicableProducts: []
    }
  });

  const promoTypes = [
    { id: 'buy_x_get_y', name: 'Beli X Gratis Y', desc: 'Beli sejumlah item, gratis item lain' },
    { id: 'discount_percent', name: 'Diskon Persentase', desc: 'Diskon % untuk pembelian tertentu' },
    { id: 'discount_amount', name: 'Diskon Nominal', desc: 'Potongan harga tetap' },
    { id: 'min_purchase', name: 'Minimum Pembelian', desc: 'Diskon jika mencapai minimum pembelian' }
  ];

  const categories = ['Coffee', 'Non Coffee', 'Ice Cream', 'Refreshment', 'Makanan Berat', 'Makanan Ringan', 'Dessert', 'Topping'];

  useEffect(() => {
    if (editingPromo) {
      setPromoForm(editingPromo);
      setActiveTab('form');
    }
  }, [editingPromo]);

  const handleSave = () => {
    if (!promoForm.name.trim()) {
      alert('Nama promosi harus diisi!');
      return;
    }

    const newPromo = {
      ...promoForm,
      id: editingPromo ? editingPromo.id : Date.now(),
      createdAt: editingPromo ? editingPromo.createdAt : new Date().toISOString()
    };

    let updatedPromotions;
    if (editingPromo) {
      updatedPromotions = promotions.map(p => p.id === editingPromo.id ? newPromo : p);
    } else {
      updatedPromotions = [...promotions, newPromo];
    }

    onSave(updatedPromotions);
    resetForm();
    setActiveTab('list');
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus promosi ini?')) {
      const updatedPromotions = promotions.filter(p => p.id !== id);
      onSave(updatedPromotions);
    }
  };

  const resetForm = () => {
    setPromoForm({
      name: '',
      type: 'buy_x_get_y',
      description: '',
      startDate: '',
      endDate: '',
      active: true,
      conditions: {
        buyQty: 1,
        getQty: 1,
        minAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        applicableCategories: [],
        applicableProducts: []
      }
    });
    setEditingPromo(null);
  };

  const toggleCategory = (category) => {
    const categories = promoForm.conditions.applicableCategories.includes(category)
      ? promoForm.conditions.applicableCategories.filter(c => c !== category)
      : [...promoForm.conditions.applicableCategories, category];
    
    setPromoForm({
      ...promoForm,
      conditions: { ...promoForm.conditions, applicableCategories: categories }
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gift size={24} />
            Manajemen Promosi
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daftar Promosi
          </button>
          <button
            onClick={() => { setActiveTab('form'); resetForm(); }}
            className={`px-4 py-2 font-medium ${
              activeTab === 'form'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {editingPromo ? 'Edit Promosi' : 'Tambah Promosi'}
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'list' && (
            <div className="space-y-3">
              {promotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Gift size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Belum ada promosi</p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Tambah promosi pertama
                  </button>
                </div>
              ) : (
                promotions.map(promo => (
                  <div key={promo.id} className="border rounded-lg p-4 hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{promo.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {promo.active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{promo.description}</p>
                        <p className="text-xs text-gray-500">
                          {promoTypes.find(t => t.id === promo.type)?.name}
                        </p>
                        {promo.startDate && promo.endDate && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            {new Date(promo.startDate).toLocaleDateString('id-ID')} - {new Date(promo.endDate).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPromo(promo)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'form' && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Promosi</label>
                  <input
                    type="text"
                    value={promoForm.name}
                    onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Beli 2 Gratis 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Promosi</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {promoTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={promoForm.description}
                  onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Deskripsi promosi..."
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={promoForm.startDate}
                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={promoForm.endDate}
                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Conditions based on type */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Pengaturan Promosi</h4>
                
                {promoForm.type === 'buy_x_get_y' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Beli (Qty)</label>
                      <input
                        type="number"
                        value={promoForm.conditions.buyQty}
                        onChange={(e) => setPromoForm({
                          ...promoForm,
                          conditions: { ...promoForm.conditions, buyQty: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gratis (Qty)</label>
                      <input
                        type="number"
                        value={promoForm.conditions.getQty}
                        onChange={(e) => setPromoForm({
                          ...promoForm,
                          conditions: { ...promoForm.conditions, getQty: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {promoForm.type === 'discount_percent' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Diskon (%)</label>
                    <input
                      type="number"
                      value={promoForm.conditions.discountPercent}
                      onChange={(e) => setPromoForm({
                        ...promoForm,
                        conditions: { ...promoForm.conditions, discountPercent: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                )}

                {promoForm.type === 'discount_amount' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Diskon (Rp)</label>
                    <input
                      type="number"
                      value={promoForm.conditions.discountAmount}
                      onChange={(e) => setPromoForm({
                        ...promoForm,
                        conditions: { ...promoForm.conditions, discountAmount: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                )}

                {promoForm.type === 'min_purchase' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Minimum Pembelian (Rp)</label>
                      <input
                        type="number"
                        value={promoForm.conditions.minAmount}
                        onChange={(e) => setPromoForm({
                          ...promoForm,
                          conditions: { ...promoForm.conditions, minAmount: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Diskon (%)</label>
                      <input
                        type="number"
                        value={promoForm.conditions.discountPercent}
                        onChange={(e) => setPromoForm({
                          ...promoForm,
                          conditions: { ...promoForm.conditions, discountPercent: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Applicable Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">Kategori yang Berlaku</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={promoForm.conditions.applicableCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={promoForm.active}
                  onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Aktifkan promosi</label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Tutup
          </button>
          {activeTab === 'form' && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              {editingPromo ? 'Update' : 'Simpan'} Promosi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;