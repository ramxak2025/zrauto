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
  Shield,
  Phone,
  User as UserIcon,
  Lock,
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
    if (name.trim()) updateUser(currentUser.id, { name: name.trim() });
    setEditingName(false);
  };

  const handleSavePhone = () => {
    if (phone.trim()) updateUser(currentUser.id, { phone: phone.trim() });
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
      <div className="glass rounded-2xl p-6 mb-4 text-center">
        <div className="relative inline-block mb-4">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.name}
            size={88}
            isBestMaster={currentUser.isBestMaster}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full shadow-lg shadow-brand/30"
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

        <div className="mb-1.5">
          {editingName ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg font-bold glass-input rounded-lg px-3 py-1"
                autoFocus
              />
              <button onClick={handleSaveName} className="btn-press text-brand">
                <Save size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="inline-flex items-center gap-1.5 text-lg font-bold text-white"
            >
              {currentUser.name}
              <Edit3 size={14} className="text-white/30" />
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
                className="text-center text-sm glass-input rounded-lg px-3 py-1"
                autoFocus
              />
              <button onClick={handleSavePhone} className="btn-press text-brand">
                <Save size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingPhone(true)}
              className="inline-flex items-center gap-1.5 text-sm text-white/40"
            >
              {currentUser.phone}
              <Edit3 size={12} className="text-white/20" />
            </button>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-xs font-medium text-white/50">
          <Shield size={12} />
          {currentUser.role === ROLES.OWNER ? 'Владелец' : currentUser.role === ROLES.ADMIN ? 'Админ' : 'Мастер'}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="btn-press w-full flex items-center justify-center gap-2 py-3.5 glass text-red-400 font-medium rounded-2xl hover:bg-red-500/5 transition-colors mb-6"
      >
        <LogOut size={18} />
        Выйти
      </button>

      {/* Staff Management - Owner Only */}
      {isOwner && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Сотрудники</h2>
            <button
              onClick={() => setShowAddUser(true)}
              className="btn-press flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
            >
              <UserPlus size={14} />
              Добавить
            </button>
          </div>

          <div className="space-y-3">
            {staff.map((user) => {
              const isEditing = editingUserId === user.id;
              return (
                <div key={user.id} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size={44}
                        isBestMaster={user.isBestMaster}
                      />
                      <label className="absolute -bottom-0.5 -right-0.5 bg-white/10 text-white/60 p-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
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
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={editUserName}
                            onChange={(e) => setEditUserName(e.target.value)}
                            className="w-full text-sm glass-input rounded-lg px-2 py-1"
                          />
                          <input
                            type="tel"
                            value={editUserPhone}
                            onChange={(e) => setEditUserPhone(e.target.value)}
                            className="w-full text-xs glass-input rounded-lg px-2 py-1"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/30">{user.phone}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button onClick={handleSaveEditUser} className="btn-press p-2 text-green-400 hover:bg-green-500/10 rounded-lg">
                            <Save size={16} />
                          </button>
                          <button onClick={() => setEditingUserId(null)} className="btn-press p-2 text-white/30 hover:bg-white/5 rounded-lg">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEditUser(user)} className="btn-press p-2 text-white/30 hover:bg-white/5 rounded-lg">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => deleteUser(user.id)} className="btn-press p-2 text-red-400/50 hover:bg-red-500/10 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Apple-style Toggles */}
                  <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <button
                        type="button"
                        className={`apple-toggle ${user.isBestMaster ? 'on-gold' : ''}`}
                        onClick={() => updateUser(user.id, { isBestMaster: !user.isBestMaster })}
                      />
                      <div className="flex items-center gap-1.5">
                        <Trophy size={14} className={user.isBestMaster ? 'text-gold' : 'text-white/20'} />
                        <span className={`text-xs ${user.isBestMaster ? 'text-gold' : 'text-white/40'}`}>
                          Лучший мастер
                        </span>
                      </div>
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
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-end justify-center" onClick={() => setShowAddUser(false)}>
          <div className="glass-heavy w-full max-w-lg rounded-t-3xl slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Новый сотрудник</h2>
              <button onClick={() => setShowAddUser(false)} className="btn-press p-1.5 rounded-xl hover:bg-white/5 text-white/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  <UserIcon size={12} className="inline mr-1" />
                  Имя
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  <Phone size={12} className="inline mr-1" />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  <Lock size={12} className="inline mr-1" />
                  Пароль
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Роль</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                >
                  <option value={ROLES.MASTER} className="bg-[#1a1a1a]">Мастер</option>
                  <option value={ROLES.ADMIN} className="bg-[#1a1a1a]">Админ</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-press w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
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
