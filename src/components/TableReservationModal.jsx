import React, { useState } from 'react';
import { X, Users, Phone, User } from 'lucide-react';

const TableReservationModal = ({ 
  show, 
  onClose, 
  onSave, 
  formatDate,
  formatCurrency 
}) => {
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    phone: '',
    tableNumber: '',
    guestCount: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: ''
  });

  const [reservations, setReservations] = useState([]);

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  React.useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await window.storage.get('reservations');
      if (data && data.value) {
        setReservations(JSON.parse(data.value));
      }
    } catch (error) {
      console.log('No reservations found');
    }
  };

  const saveReservations = async (newReservations) => {
    await window.storage.set('reservations', JSON.stringify(newReservations));
    setReservations(newReservations);
  };

  const handleSubmit = async () => {
    if (!reservationForm.customerName || !reservationForm.phone || !reservationForm.tableNumber || 
        !reservationForm.guestCount || !reservationForm.date || !reservationForm.time) {
      alert('Mohon isi semua field yang wajib!');
      return;
    }

    // Check if table is already reserved at that time
    const isConflict = reservations.some(r => 
      r.tableNumber === reservationForm.tableNumber &&
      r.date === reservationForm.date &&
      r.time === reservationForm.time &&
      r.status === 'active'
    );

    if (isConflict) {
      alert('Meja sudah dipesan pada waktu tersebut!');
      return;
    }

    const newReservation = {
      id: Date.now(),
      ...reservationForm,
      guestCount: parseInt(reservationForm.guestCount),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedReservations = [newReservation, ...reservations];
    await saveReservations(updatedReservations);

    alert('Reservasi berhasil dibuat!');
    setReservationForm({
      customerName: '',
      phone: '',
      tableNumber: '',
      guestCount: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      notes: ''
    });
  };

  const handleCancel = async (reservationId) => {
    if (window.confirm('Yakin ingin membatalkan reservasi ini?')) {
      const updatedReservations = reservations.map(r =>
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      );
      await saveReservations(updatedReservations);
    }
  };



  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Reservasi Meja</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Reservasi */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Buat Reservasi Baru</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Pemesan *</label>
                <input
                  type="text"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({...reservationForm, customerName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama pemesan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">No. Telepon *</label>
                <input
                  type="tel"
                  value={reservationForm.phone}
                  onChange={(e) => setReservationForm({...reservationForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">No. Meja *</label>
                <select
                  value={reservationForm.tableNumber}
                  onChange={(e) => setReservationForm({...reservationForm, tableNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Meja</option>
                  {tables.map(num => (
                    <option key={num} value={num.toString()}>Meja {num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Tamu *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reservationForm.guestCount}
                  onChange={(e) => setReservationForm({...reservationForm, guestCount: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah tamu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal *</label>
                <input
                  type="date"
                  value={reservationForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReservationForm({...reservationForm, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Waktu *</label>
              <select
                value={reservationForm.time}
                onChange={(e) => setReservationForm({...reservationForm, time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Waktu</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catatan</label>
              <textarea
                value={reservationForm.notes}
                onChange={(e) => setReservationForm({...reservationForm, notes: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Catatan khusus (opsional)"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Buat Reservasi
            </button>
          </div>

          {/* Daftar Reservasi */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Daftar Reservasi Hari Ini</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reservations
                .filter(r => r.date === new Date().toISOString().split('T')[0])
                .map(reservation => (
                <div key={reservation.id} className={`border rounded-lg p-4 ${
                  reservation.status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-blue-600" />
                        <span className="font-medium">{reservation.customerName}</span>
                        {reservation.status === 'cancelled' && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                            DIBATALKAN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {reservation.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {reservation.guestCount} orang
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">Meja {reservation.tableNumber}</div>
                      <div className="text-sm text-gray-600">{reservation.time}</div>
                    </div>
                  </div>
                  {reservation.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{reservation.notes}"</p>
                  )}
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Batalkan
                    </button>
                  )}
                </div>
              ))}
              {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length === 0 && (
                <p className="text-gray-400 text-center py-8">Belum ada reservasi hari ini</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Meja */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-lg mb-4">Status Meja Hari Ini</h4>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {tables.map(tableNum => {
              const hasReservation = reservations.some(r =>
                r.tableNumber === tableNum.toString() &&
                r.date === new Date().toISOString().split('T')[0] &&
                r.status === 'active'
              );
              
              return (
                <div
                  key={tableNum}
                  className={`p-3 rounded-lg text-center font-medium ${
                    hasReservation
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-green-100 text-green-700 border border-green-300'
                  }`}
                >
                  <div className="text-sm">Meja</div>
                  <div className="font-bold">{tableNum}</div>
                  <div className="text-xs mt-1">
                    {hasReservation ? 'Terisi' : 'Kosong'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableReservationModal;