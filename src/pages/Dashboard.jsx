import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STATUSES, STATUS_LABELS, ROLES, SHIFT_TYPES } from '../data/seedData';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import {
  Play,
  Pause,
  UtensilsCrossed,
  Coffee,
  Square,
  Users,
  AlertTriangle,
} from 'lucide-react';

function ShiftTimer({ shiftStart }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!shiftStart) return;
    const update = () => setElapsed(Date.now() - shiftStart);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [shiftStart]);

  if (!shiftStart) return <span className="text-3xl font-bold text-gray-300">00:00:00</span>;

  const h = Math.floor(elapsed / 3600000);
  const m = Math.floor((elapsed % 3600000) / 60000);
  const s = Math.floor((elapsed % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className="text-3xl font-bold text-gray-900 tabular-nums">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

const statusButtons = [
  { status: STATUSES.WORKING, label: 'В работе', icon: Play, color: 'bg-green-500 hover:bg-green-600', activeColor: 'bg-green-600 ring-2 ring-green-300' },
  { status: STATUSES.BUSY, label: 'Занят', icon: Pause, color: 'bg-brand hover:bg-brand-dark', activeColor: 'bg-brand-dark ring-2 ring-red-300' },
  { status: STATUSES.LUNCH, label: 'Обед', icon: UtensilsCrossed, color: 'bg-yellow-500 hover:bg-yellow-600', activeColor: 'bg-yellow-600 ring-2 ring-yellow-300' },
  { status: STATUSES.AWAY, label: 'Отошел', icon: Coffee, color: 'bg-blue-500 hover:bg-blue-600', activeColor: 'bg-blue-600 ring-2 ring-blue-300' },
];

export default function Dashboard() {
  const { currentUser, users, updateMyStatus, todaySchedule } = useApp();

  const staff = useMemo(
    () => users.filter((u) => u.role !== ROLES.OWNER),
    [users]
  );

  const stats = useMemo(() => {
    const working = staff.filter((u) => u.status === STATUSES.WORKING).length;
    const lunch = staff.filter((u) => u.status === STATUSES.LUNCH).length;
    const busy = staff.filter((u) => u.status === STATUSES.BUSY).length;

    const absent = staff.filter((u) => {
      const shift = todaySchedule[u.id];
      return shift === SHIFT_TYPES.WORK && u.status === STATUSES.OFFLINE;
    }).length;

    return { working, lunch, busy, absent };
  }, [staff, todaySchedule]);

  const statCards = [
    { label: 'В работе', value: stats.working, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'На обеде', value: stats.lunch, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Заняты', value: stats.busy, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Не пришли', value: stats.absent, color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertTriangle },
  ];

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Привет, {currentUser.name}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Avatar
          src={currentUser.avatar}
          name={currentUser.name}
          size={44}
          isBestMaster={currentUser.isBestMaster}
        />
      </div>

      {/* My Status Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Мой статус</p>
        <div className="flex items-center justify-between mb-4">
          <ShiftTimer shiftStart={currentUser.shiftStart} />
          <StatusBadge status={currentUser.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {statusButtons.map(({ status, label, icon: Icon, color, activeColor }) => {
            const isActive = currentUser.status === status;
            return (
              <button
                key={status}
                onClick={() => updateMyStatus(status)}
                className={`btn-press flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${
                  isActive ? activeColor : color
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        {currentUser.status !== STATUSES.OFFLINE && (
          <button
            onClick={() => updateMyStatus(STATUSES.OFFLINE)}
            className="btn-press w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Square size={16} />
            Закончить смену
          </button>
        )}
      </div>

      {/* Stats Infographic */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statCards.map(({ label, value, color, bg, icon: CardIcon }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 slide-up`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
              {CardIcon && <CardIcon size={18} className={color} />}
              {!CardIcon && <Users size={18} className={color} />}
            </div>
            <p className="text-xs text-gray-600 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Personnel List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users size={16} />
            Персонал ({staff.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {staff.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar
                src={user.avatar}
                name={user.name}
                size={36}
                isBestMaster={user.isBestMaster}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role === ROLES.ADMIN ? 'Админ' : 'Мастер'}</p>
              </div>
              <StatusBadge status={user.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
