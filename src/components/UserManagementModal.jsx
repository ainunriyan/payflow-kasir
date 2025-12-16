import React, { useState, useEffect } from "react";
import { X, Users, Plus, Edit, Trash2, Eye, EyeOff, UserPlus } from "lucide-react";

const UserManagementModal = ({ show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    pin: "",
    fullName: "",
    role: "kasir"
  });

  useEffect(() => {
    if (show) {
      loadUsers();
    }
  }, [show]);

  const loadUsers = async () => {
    try {
      const usersData = await window.storage.get("users");
      if (usersData && usersData.value) {
        setUsers(JSON.parse(usersData.value));
      }
    } catch (error) {
      console.log("No users found");
    }
  };

  const saveUsers = async (newUsers) => {
    await window.storage.set("users", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const handleAddUser = async () => {
    if (!userForm.username || !userForm.password || !userForm.pin || !userForm.fullName) {
      alert("Mohon isi semua field!");
      return;
    }

    if (userForm.pin.length !== 6) {
      alert("PIN harus 6 digit!");
      return;
    }

    // Check if username already exists
    const existingUser = users.find(u => u.username === userForm.username);
    if (existingUser && !editingUser) {
      alert("Username sudah digunakan!");
      return;
    }

    const newUser = {
      id: editingUser ? editingUser.id : Date.now(),
      ...userForm,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser.id ? newUser : u);
    } else {
      updatedUsers = [...users, newUser];
    }

    await saveUsers(updatedUsers);
    
    setUserForm({
      username: "",
      password: "",
      pin: "",
      fullName: "",
      role: "kasir"
    });
    setShowAddForm(false);
    setEditingUser(null);
    
    alert(editingUser ? "User berhasil diupdate!" : "User berhasil ditambahkan!");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      password: user.password,
      pin: user.pin,
      fullName: user.fullName,
      role: user.role
    });
    setShowAddForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      const updatedUsers = users.filter(u => u.id !== userId);
      await saveUsers(updatedUsers);
      alert("User berhasil dihapus!");
    }
  };

  const resetForm = () => {
    setUserForm({
      username: "",
      password: "",
      pin: "",
      fullName: "",
      role: "kasir"
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={24} />
              Manajemen User
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Add User Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <UserPlus size={20} />
              Tambah User Baru
            </button>
          </div>

          {/* Add/Edit User Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-4">
                {editingUser ? "Edit User" : "Tambah User Baru"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="kasir1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Lengkap: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama Kasir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    PIN (6 digit): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={userForm.pin}
                    onChange={(e) => setUserForm({...userForm, pin: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456"
                    maxLength="6"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Role: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? "Update User" : "Tambah User"}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Nama Lengkap</th>
                  <th className="px-4 py-2 text-center">Role</th>
                  <th className="px-4 py-2 text-center">PIN</th>
                  <th className="px-4 py-2 text-center">Dibuat</th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      Belum ada user
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{user.username}</td>
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role === "admin" ? "Admin" : "Kasir"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {user.pin}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Informasi Penting:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Admin</strong>: Akses penuh ke semua fitur</li>
              <li>• <strong>Kasir</strong>: Akses terbatas (kasir, update stok, refund)</li>
              <li>• PIN digunakan untuk verifikasi setelah login</li>
              <li>• Username harus unik untuk setiap user</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;