import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STATUSES, ROLES, SHIFT_TYPES } from '../data/seedData';
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
  Clock,
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

  if (!shiftStart) return <span className="text-3xl font-bold text-white/20 tabular-nums">00:00:00</span>;

  const h = Math.floor(elapsed / 3600000);
  const m = Math.floor((elapsed % 3600000) / 60000);
  const s = Math.floor((elapsed % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className="text-3xl font-bold text-white tabular-nums">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

const statusButtons = [
  { status: STATUSES.WORKING, label: 'В работе', icon: Play, bg: 'bg-green-500/20 hover:bg-green-500/30 text-green-400', activeBg: 'bg-green-500/30 ring-1 ring-green-400/50 text-green-300' },
  { status: STATUSES.BUSY, label: 'Занят', icon: Pause, bg: 'bg-red-500/20 hover:bg-red-500/30 text-red-400', activeBg: 'bg-red-500/30 ring-1 ring-red-400/50 text-red-300' },
  { status: STATUSES.LUNCH, label: 'Обед', icon: UtensilsCrossed, bg: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400', activeBg: 'bg-yellow-500/30 ring-1 ring-yellow-400/50 text-yellow-300' },
  { status: STATUSES.AWAY, label: 'Отошел', icon: Coffee, bg: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400', activeBg: 'bg-blue-500/30 ring-1 ring-blue-400/50 text-blue-300' },
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
    { label: 'В работе', value: stats.working, color: 'text-green-400', glow: 'shadow-green-500/10', border: 'border-green-500/10' },
    { label: 'На обеде', value: stats.lunch, color: 'text-yellow-400', glow: 'shadow-yellow-500/10', border: 'border-yellow-500/10' },
    { label: 'Заняты', value: stats.busy, color: 'text-red-400', glow: 'shadow-red-500/10', border: 'border-red-500/10' },
    { label: 'Не пришли', value: stats.absent, color: 'text-orange-400', glow: 'shadow-orange-500/10', border: 'border-orange-500/10', icon: AlertTriangle },
  ];

  // Sort staff: expected today on top, arrived ones bright, not arrived ones dimmed
  const sortedStaff = useMemo(() => {
    return [...staff].sort((a, b) => {
      const aExpected = todaySchedule[a.id] === SHIFT_TYPES.WORK;
      const bExpected = todaySchedule[b.id] === SHIFT_TYPES.WORK;
      const aArrived = a.status !== STATUSES.OFFLINE;
      const bArrived = b.status !== STATUSES.OFFLINE;

      if (aExpected && !bExpected) return -1;
      if (!aExpected && bExpected) return 1;
      if (aArrived && !bArrived) return -1;
      if (!aArrived && bArrived) return 1;
      return 0;
    });
  }, [staff, todaySchedule]);

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">
            Привет, {currentUser.name}
          </h1>
          <p className="text-sm text-white/40">
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
      <div className="glass rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-white/40" />
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Мой статус</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <ShiftTimer shiftStart={currentUser.shiftStart} />
          <StatusBadge status={currentUser.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {statusButtons.map(({ status, label, icon: Icon, bg, activeBg }) => {
            const isActive = currentUser.status === status;
            return (
              <button
                key={status}
                onClick={() => updateMyStatus(status)}
                className={`btn-press flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? activeBg : bg
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
            className="btn-press w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors mt-2"
          >
            <Square size={16} />
            Закончить смену
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {statCards.map(({ label, value, color, glow, border, icon: CardIcon }) => (
          <div key={label} className={`glass rounded-2xl p-4 ${glow} slide-up`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
              {CardIcon ? <CardIcon size={18} className={color} /> : <Users size={18} className={color} />}
            </div>
            <p className="text-xs text-white/50 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Personnel - Today's Shift */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-white/40" />
            Сегодняшняя смена
          </h2>
        </div>
        <div className="divide-y divide-white/5">
          {sortedStaff.map((user) => {
            const isExpectedToday = todaySchedule[user.id] === SHIFT_TYPES.WORK;
            const hasArrived = user.status !== STATUSES.OFFLINE;
            const isDimmed = isExpectedToday && !hasArrived;

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 transition-all duration-400"
                style={{ opacity: !isExpectedToday ? 0.35 : 1 }}
              >
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size={36}
                  isBestMaster={user.isBestMaster}
                  dimmed={isDimmed}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate transition-colors duration-400 ${
                      isDimmed ? 'text-white/25' : isExpectedToday ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    {user.name}
                  </p>
                  <p className={`text-xs transition-colors duration-400 ${isDimmed ? 'text-white/15' : 'text-white/30'}`}>
                    {user.role === ROLES.ADMIN ? 'Админ' : 'Мастер'}
                    {!isExpectedToday && ' · Выходной'}
                    {isDimmed && ' · Ожидается'}
                  </p>
                </div>
                <StatusBadge status={user.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
