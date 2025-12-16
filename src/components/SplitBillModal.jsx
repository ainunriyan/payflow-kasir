import React, { useState, useEffect } from 'react';
import { Users, X, Plus, Minus, Calculator } from 'lucide-react';

const SplitBillModal = ({ show, onClose, cart, formatCurrency, onSplitComplete }) => {
  const [splitMethod, setSplitMethod] = useState('equal'); // equal, custom, items
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [customAmounts, setCustomAmounts] = useState([]);
  const [itemSplit, setItemSplit] = useState({});
  const [customerNames, setCustomerNames] = useState([]);

  useEffect(() => {
    if (show) {
      // Initialize customer names
      const names = Array(numberOfPeople).fill('').map((_, i) => `Customer ${i + 1}`);
      setCustomerNames(names);
      
      // Initialize custom amounts
      const total = calculateTotal();
      const equalAmount = Math.round(total / numberOfPeople);
      setCustomAmounts(Array(numberOfPeople).fill(equalAmount));
      
      // Initialize item split
      const itemSplitInit = {};
      cart.forEach(item => {
        itemSplitInit[item.cartId] = Array(numberOfPeople).fill(0);
      });
      setItemSplit(itemSplitInit);
    }
  }, [show, numberOfPeople, cart]);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleNumberOfPeopleChange = (change) => {
    const newNumber = Math.max(2, Math.min(10, numberOfPeople + change));
    setNumberOfPeople(newNumber);
  };

  const handleCustomAmountChange = (index, amount) => {
    const newAmounts = [...customAmounts];
    newAmounts[index] = parseFloat(amount) || 0;
    setCustomAmounts(newAmounts);
  };

  const handleItemSplitChange = (cartId, personIndex, qty) => {
    const newItemSplit = { ...itemSplit };
    newItemSplit[cartId][personIndex] = Math.max(0, qty);
    setItemSplit(newItemSplit);
  };

  const calculateEqualSplit = () => {
    const total = calculateTotal();
    return Math.round(total / numberOfPeople);
  };

  const calculateCustomTotal = () => {
    return customAmounts.reduce((sum, amount) => sum + amount, 0);
  };

  const calculateItemSplitTotals = () => {
    const totals = Array(numberOfPeople).fill(0);
    
    cart.forEach(item => {
      const splits = itemSplit[item.cartId] || [];
      splits.forEach((qty, personIndex) => {
        totals[personIndex] += (item.price * qty);
      });
    });
    
    return totals;
  };

  const validateSplit = () => {
    const total = calculateTotal();
    
    if (splitMethod === 'equal') {
      return true;
    } else if (splitMethod === 'custom') {
      const customTotal = calculateCustomTotal();
      return Math.abs(customTotal - total) < 100; // Allow 100 rupiah difference
    } else if (splitMethod === 'items') {
      // Check if all items are distributed
      for (const item of cart) {
        const totalSplit = (itemSplit[item.cartId] || []).reduce((sum, qty) => sum + qty, 0);
        if (totalSplit !== item.qty) {
          return false;
        }
      }
      return true;
    }
    
    return false;
  };

  const handleSplitComplete = () => {
    if (!validateSplit()) {
      alert('Pembagian tagihan tidak valid. Periksa kembali.');
      return;
    }

    let splitData = [];

    if (splitMethod === 'equal') {
      const amountPerPerson = calculateEqualSplit();
      splitData = customerNames.map((name, index) => ({
        customerName: name,
        amount: amountPerPerson,
        items: cart.map(item => ({
          ...item,
          qty: Math.round(item.qty / numberOfPeople * 100) / 100
        }))
      }));
    } else if (splitMethod === 'custom') {
      splitData = customerNames.map((name, index) => ({
        customerName: name,
        amount: customAmounts[index],
        items: [] // Custom split doesn't specify items
      }));
    } else if (splitMethod === 'items') {
      const totals = calculateItemSplitTotals();
      splitData = customerNames.map((name, index) => ({
        customerName: name,
        amount: totals[index],
        items: cart.filter(item => {
          const qty = itemSplit[item.cartId]?.[index] || 0;
          return qty > 0;
        }).map(item => ({
          ...item,
          qty: itemSplit[item.cartId]?.[index] || 0
        }))
      }));
    }

    onSplitComplete(splitData);
    onClose();
  };

  if (!show) return null;

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Split Bill
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Total Amount */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Tagihan:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Number of People */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Orang
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNumberOfPeopleChange(-1)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {numberOfPeople}
              </span>
              <button
                onClick={() => handleNumberOfPeopleChange(1)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Split Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metode Pembagian
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSplitMethod('equal')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  splitMethod === 'equal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Rata
              </button>
              <button
                onClick={() => setSplitMethod('custom')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  splitMethod === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Custom
              </button>
              <button
                onClick={() => setSplitMethod('items')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  splitMethod === 'items'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Per Item
              </button>
            </div>
          </div>

          {/* Customer Names */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Customer
            </label>
            <div className="space-y-2">
              {customerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...customerNames];
                    newNames[index] = e.target.value;
                    setCustomerNames(newNames);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Customer ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Split Details */}
          {splitMethod === 'equal' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Pembagian Rata</h3>
              <div className="space-y-2">
                {customerNames.map((name, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{name}:</span>
                    <span className="font-semibold">
                      {formatCurrency(calculateEqualSplit())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {splitMethod === 'custom' && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Jumlah Custom</h3>
              <div className="space-y-2">
                {customerNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-24 text-sm">{name}:</span>
                    <input
                      type="number"
                      value={customAmounts[index]}
                      onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 p-2 bg-yellow-50 rounded">
                <div className="flex justify-between text-sm">
                  <span>Total Custom:</span>
                  <span className={calculateCustomTotal() === total ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(calculateCustomTotal())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {splitMethod === 'items' && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Pembagian Per Item</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600">
                        Qty: {item.qty} | {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {customerNames.map((name, personIndex) => (
                        <div key={personIndex} className="flex items-center gap-2">
                          <span className="text-xs w-16 truncate">{name}:</span>
                          <input
                            type="number"
                            min="0"
                            max={item.qty}
                            value={itemSplit[item.cartId]?.[personIndex] || 0}
                            onChange={(e) => handleItemSplitChange(
                              item.cartId, 
                              personIndex, 
                              parseInt(e.target.value) || 0
                            )}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {splitMethod === 'items' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Total per Orang:</h4>
                  {calculateItemSplitTotals().map((total, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{customerNames[index]}:</span>
                      <span className="font-semibold">{formatCurrency(total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleSplitComplete}
              disabled={!validateSplit()}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calculator size={16} />
              Bagi Tagihan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitBillModal;