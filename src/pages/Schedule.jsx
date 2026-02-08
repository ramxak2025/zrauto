import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ROLES, SHIFT_TYPES, SHIFT_LABELS } from '../data/seedData';
import Avatar from '../components/Avatar';
import { Check, X, Thermometer, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const shiftIcons = {
  [SHIFT_TYPES.WORK]: { icon: Check, bg: 'bg-green-100', text: 'text-green-600' },
  [SHIFT_TYPES.DAYOFF]: { icon: X, bg: 'bg-gray-100', text: 'text-gray-400' },
  [SHIFT_TYPES.SICK]: { icon: Thermometer, bg: 'bg-red-100', text: 'text-red-500' },
  [SHIFT_TYPES.LEAVE]: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-600' },
};

const shiftCycle = [SHIFT_TYPES.WORK, SHIFT_TYPES.DAYOFF, SHIFT_TYPES.SICK, SHIFT_TYPES.LEAVE];

export default function Schedule() {
  const { users, schedule, updateScheduleCell, canManage } = useApp();
  const [startOffset, setStartOffset] = useState(0);
  const daysToShow = 7;

  const staff = useMemo(
    () => users.filter((u) => u.role !== ROLES.OWNER),
    [users]
  );

  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = startOffset; i < startOffset + daysToShow; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        key: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('ru-RU', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: i === 0 && startOffset === 0,
      });
    }
    return result;
  }, [startOffset]);

  const handleCellClick = (dateKey, userId) => {
    if (!canManage) return;
    const current = schedule[dateKey]?.[userId] || SHIFT_TYPES.WORK;
    const idx = shiftCycle.indexOf(current);
    const next = shiftCycle[(idx + 1) % shiftCycle.length];
    updateScheduleCell(dateKey, userId, next);
  };

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">График смен</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStartOffset((p) => p - daysToShow)}
            className="btn-press p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setStartOffset(0)}
            className="btn-press px-3 py-1 text-xs font-medium rounded-lg hover:bg-gray-100 text-brand"
          >
            Сегодня
          </button>
          <button
            onClick={() => setStartOffset((p) => p + daysToShow)}
            className="btn-press p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(SHIFT_LABELS).map(([type, label]) => {
          const { icon: Icon, bg, text } = shiftIcons[type];
          return (
            <div key={type} className="flex items-center gap-1.5 text-xs">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${bg}`}>
                <Icon size={14} className={text} />
              </div>
              <span className="text-gray-600">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 w-32 sticky left-0 bg-white z-10">
                Сотрудник
              </th>
              {dates.map((d) => (
                <th
                  key={d.key}
                  className={`py-3 px-1 text-center ${d.isToday ? 'bg-brand-light' : ''}`}
                >
                  <div className="text-[10px] text-gray-400 uppercase">{d.dayName}</div>
                  <div className={`text-sm font-bold ${d.isToday ? 'text-brand' : 'text-gray-700'}`}>
                    {d.dayNum}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2 px-3 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size={28}
                      isBestMaster={user.isBestMaster}
                    />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[80px]">
                      {user.name}
                    </span>
                  </div>
                </td>
                {dates.map((d) => {
                  const type = schedule[d.key]?.[user.id] || SHIFT_TYPES.DAYOFF;
                  const { icon: Icon, bg, text } = shiftIcons[type];
                  return (
                    <td
                      key={d.key}
                      className={`py-2 px-1 text-center ${d.isToday ? 'bg-brand-light/50' : ''}`}
                    >
                      <button
                        onClick={() => handleCellClick(d.key, user.id)}
                        disabled={!canManage}
                        className={`btn-press inline-flex items-center justify-center w-8 h-8 rounded-lg ${bg} transition-transform ${
                          canManage ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <Icon size={14} className={text} />
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
        <p className="text-xs text-gray-400 text-center mt-3">
          Нажмите на ячейку для изменения типа смены
        </p>
      )}
    </div>
  );
}
