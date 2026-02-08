import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../data/seedData';
import Avatar from '../components/Avatar';
import {
  LogOut,
  Camera,
  Save,
  Trophy,
  UserPlus,
  Trash2,
  Edit3,
  X,
  Ban,
  Shield,
  Phone,
  User as UserIcon,
  Lock,
  ChevronRight,
} from 'lucide-react';

export default function Profile() {
  const { currentUser, users, logout, updateUser, addUser, deleteUser, isOwner } = useApp();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(currentUser.phone);
  const fileInputRef = useRef(null);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState(ROLES.MASTER);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateUser(currentUser.id, { avatar: ev.target.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStaffAvatarChange = (userId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateUser(userId, { avatar: ev.target.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveName = () => {
    if (name.trim()) {
      updateUser(currentUser.id, { name: name.trim() });
    }
    setEditingName(false);
  };

  const handleSavePhone = () => {
    if (phone.trim()) {
      updateUser(currentUser.id, { phone: phone.trim() });
    }
    setEditingPhone(false);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim() || !newUserPassword.trim()) return;
    addUser({
      name: newUserName.trim(),
      phone: newUserPhone.trim(),
      password: newUserPassword.trim(),
      role: newUserRole,
    });
    setNewUserName('');
    setNewUserPhone('');
    setNewUserPassword('');
    setNewUserRole(ROLES.MASTER);
    setShowAddUser(false);
  };

  const handleStartEditUser = (user) => {
    setEditingUserId(user.id);
    setEditUserName(user.name);
    setEditUserPhone(user.phone);
  };

  const handleSaveEditUser = () => {
    if (editUserName.trim() && editUserPhone.trim()) {
      updateUser(editingUserId, { name: editUserName.trim(), phone: editUserPhone.trim() });
    }
    setEditingUserId(null);
  };

  const staff = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      {/* My Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 text-center">
        <div className="relative inline-block mb-3">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.name}
            size={80}
            isBestMaster={currentUser.isBestMaster}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press absolute bottom-0 right-0 bg-brand text-white p-1.5 rounded-full shadow-lg"
          >
            <Camera size={14} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="mb-1">
          {editingName ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                autoFocus
              />
              <button onClick={handleSaveName} className="btn-press text-brand">
                <Save size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="inline-flex items-center gap-1.5 text-lg font-bold text-gray-900"
            >
              {currentUser.name}
              <Edit3 size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        <div className="mb-3">
          {editingPhone ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-center text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                autoFocus
              />
              <button onClick={handleSavePhone} className="btn-press text-brand">
                <Save size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingPhone(true)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500"
            >
              {currentUser.phone}
              <Edit3 size={12} className="text-gray-400" />
            </button>
          )}
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
          <Shield size={12} />
          {currentUser.role === ROLES.OWNER ? 'Владелец' : currentUser.role === ROLES.ADMIN ? 'Админ' : 'Мастер'}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 font-medium rounded-2xl shadow-sm border border-gray-100 hover:bg-red-50 transition-colors mb-6"
      >
        <LogOut size={18} />
        Выйти
      </button>

      {/* Staff Management - Owner Only */}
      {isOwner && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Сотрудники</h2>
            <button
              onClick={() => setShowAddUser(true)}
              className="btn-press flex items-center gap-1.5 px-3 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
            >
              <UserPlus size={14} />
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {staff.map((user) => {
              const isEditing = editingUserId === user.id;
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size={44}
                        isBestMaster={user.isBestMaster}
                      />
                      <label className="absolute bottom-0 right-0 bg-gray-200 text-gray-600 p-0.5 rounded-full cursor-pointer hover:bg-gray-300">
                        <Camera size={10} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleStaffAvatarChange(user.id, e)}
                        />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editUserName}
                            onChange={(e) => setEditUserName(e.target.value)}
                            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                          />
                          <input
                            type="tel"
                            value={editUserPhone}
                            onChange={(e) => setEditUserPhone(e.target.value)}
                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEditUser}
                            className="btn-press p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="btn-press p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEditUser(user)}
                            className="btn-press p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="btn-press p-2 text-red-400 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={user.isBestMaster}
                          onChange={(e) => updateUser(user.id, { isBestMaster: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-9 h-5 rounded-full transition-colors ${user.isBestMaster ? 'bg-gold' : 'bg-gray-200'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${user.isBestMaster ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                      <Trophy size={14} className={user.isBestMaster ? 'text-gold' : 'text-gray-300'} />
                      <span className="text-xs text-gray-500">Лучший мастер</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={user.bannedInChat}
                          onChange={(e) => updateUser(user.id, { bannedInChat: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-9 h-5 rounded-full transition-colors ${user.bannedInChat ? 'bg-red-500' : 'bg-gray-200'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${user.bannedInChat ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                      <Ban size={14} className={user.bannedInChat ? 'text-red-500' : 'text-gray-300'} />
                      <span className="text-xs text-gray-500">Бан в чате</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Новый сотрудник</h2>
              <button onClick={() => setShowAddUser(false)} className="btn-press p-1 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <UserIcon size={12} className="inline mr-1" />
                  Имя
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <Phone size={12} className="inline mr-1" />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <Lock size={12} className="inline mr-1" />
                  Пароль
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Роль</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                >
                  <option value={ROLES.MASTER}>Мастер</option>
                  <option value={ROLES.ADMIN}>Админ</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-press w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
              >
                Добавить сотрудника
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
