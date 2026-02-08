import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ROLES, SHIFT_TYPES, SHIFT_LABELS } from '../data/seedData';
import Avatar from '../components/Avatar';
import { Check, X, Thermometer, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const shiftConfig = {
  [SHIFT_TYPES.WORK]: { icon: Check, bg: 'bg-green-500/15', text: 'text-green-400' },
  [SHIFT_TYPES.DAYOFF]: { icon: X, bg: 'bg-white/5', text: 'text-white/25' },
  [SHIFT_TYPES.SICK]: { icon: Thermometer, bg: 'bg-red-500/15', text: 'text-red-400' },
  [SHIFT_TYPES.LEAVE]: { icon: Clock, bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
};

const shiftCycle = [SHIFT_TYPES.WORK, SHIFT_TYPES.DAYOFF, SHIFT_TYPES.SICK, SHIFT_TYPES.LEAVE];

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function Schedule() {
  const { users, schedule, updateScheduleCell, canManage } = useApp();
  const [monthOffset, setMonthOffset] = useState(0);

  const staff = useMemo(
    () => users.filter((u) => u.role !== ROLES.OWNER),
    [users]
  );

  const { year, month, daysInMonth, dates, monthLabel } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = target.getFullYear();
    const m = target.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    const result = [];
    for (let d = 1; d <= dim; d++) {
      const date = new Date(y, m, d);
      const key = date.toISOString().split('T')[0];
      result.push({
        key,
        dayNum: d,
        dayName: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        isToday: key === todayKey,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    return {
      year: y,
      month: m,
      daysInMonth: dim,
      dates: result,
      monthLabel: `${MONTHS_RU[m]} ${y}`,
    };
  }, [monthOffset]);

  const handleCellClick = (dateKey, userId) => {
    if (!canManage) return;
    const current = schedule[dateKey]?.[userId] || SHIFT_TYPES.WORK;
    const idx = shiftCycle.indexOf(current);
    const next = shiftCycle[(idx + 1) % shiftCycle.length];
    updateScheduleCell(dateKey, userId, next);
  };

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">График смен</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonthOffset((p) => p - 1)}
            className="btn-press p-2 rounded-xl hover:bg-white/5 text-white/50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="btn-press px-3 py-1.5 text-xs font-medium rounded-xl hover:bg-white/5 text-brand"
          >
            {monthLabel}
          </button>
          <button
            onClick={() => setMonthOffset((p) => p + 1)}
            className="btn-press p-2 rounded-xl hover:bg-white/5 text-white/50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(SHIFT_LABELS).map(([type, label]) => {
          const { icon: Icon, bg, text } = shiftConfig[type];
          return (
            <div key={type} className="flex items-center gap-1.5 text-xs">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${bg}`}>
                <Icon size={12} className={text} />
              </div>
              <span className="text-white/50">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full" style={{ minWidth: `${130 + dates.length * 36}px` }}>
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-3 text-xs font-semibold text-white/40 w-28 sticky left-0 bg-[#0e0e0e] z-10">
                Сотрудник
              </th>
              {dates.map((d) => (
                <th
                  key={d.key}
                  className={`py-2 px-0.5 text-center min-w-[32px] ${d.isToday ? 'bg-brand/10' : ''}`}
                >
                  <div className={`text-[9px] uppercase ${d.isWeekend ? 'text-red-400/50' : 'text-white/25'}`}>
                    {d.dayName}
                  </div>
                  <div className={`text-[11px] font-bold ${d.isToday ? 'text-brand' : d.isWeekend ? 'text-red-400/70' : 'text-white/60'}`}>
                    {d.dayNum}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => (
              <tr key={user.id} className="border-b border-white/3 last:border-0">
                <td className="py-1.5 px-3 sticky left-0 bg-[#0e0e0e] z-10">
                  <div className="flex items-center gap-2">
                    <Avatar src={user.avatar} name={user.name} size={24} isBestMaster={user.isBestMaster} />
                    <span className="text-[11px] font-medium text-white/70 truncate max-w-[70px]">
                      {user.name}
                    </span>
                  </div>
                </td>
                {dates.map((d) => {
                  const type = schedule[d.key]?.[user.id] || SHIFT_TYPES.DAYOFF;
                  const { icon: Icon, bg, text } = shiftConfig[type];
                  return (
                    <td key={d.key} className={`py-1.5 px-0.5 text-center ${d.isToday ? 'bg-brand/5' : ''}`}>
                      <button
                        onClick={() => handleCellClick(d.key, user.id)}
                        disabled={!canManage}
                        className={`btn-press inline-flex items-center justify-center w-7 h-7 rounded-lg ${bg} transition-all ${
                          canManage ? 'cursor-pointer hover:ring-1 hover:ring-white/10' : 'cursor-default'
                        }`}
                      >
                        <Icon size={11} className={text} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canManage && (
        <p className="text-xs text-white/25 text-center mt-3">
          Нажмите на ячейку для изменения типа смены
        </p>
      )}
    </div>
  );
}
