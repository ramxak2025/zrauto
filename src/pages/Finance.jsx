import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { FINANCE_TYPES, ROLES } from '../data/seedData';
import Avatar from '../components/Avatar';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Calendar,
  Trash2,
  History,
  ArrowLeft,
} from 'lucide-react';

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function formatMoney(n) {
  return n.toLocaleString('ru-RU');
}

export default function Finance() {
  const {
    currentUser, users, finance, addTransaction, deleteTransaction,
    getFinanceForUser, getFinanceMonths, canManage, isOwner,
  } = useApp();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState(FINANCE_TYPES.INCOME);
  const [addAmount, setAddAmount] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addUserId, setAddUserId] = useState(currentUser.id);
  const [historyView, setHistoryView] = useState(false);
  const [historyUserId, setHistoryUserId] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);

  // Who can we view? Owner/admin sees everyone selector, master sees only self
  const viewingUserId = canManage ? addUserId : currentUser.id;
  const targetUser = users.find(u => u.id === viewingUserId);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const transactions = useMemo(() => {
    return getFinanceForUser(viewingUserId, viewYear, viewMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [getFinanceForUser, viewingUserId, viewYear, viewMonth]);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach(t => {
      if (t.type === FINANCE_TYPES.INCOME) income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Group transactions by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    transactions.forEach(t => {
      const key = new Date(t.date).toISOString().split('T')[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  // History: all months for user
  const allMonths = useMemo(() => {
    const uid = historyUserId || viewingUserId;
    return getFinanceMonths(uid);
  }, [getFinanceMonths, historyUserId, viewingUserId]);

  const historyData = useMemo(() => {
    if (!historyView) return [];
    const uid = historyUserId || viewingUserId;
    return allMonths.map(key => {
      const [y, m] = key.split('-').map(Number);
      const txs = getFinanceForUser(uid, y, m);
      let income = 0, expense = 0;
      txs.forEach(t => {
        if (t.type === FINANCE_TYPES.INCOME) income += t.amount;
        else expense += t.amount;
      });
      return { key, year: y, month: m, income, expense, balance: income - expense, count: txs.length };
    });
  }, [historyView, historyUserId, viewingUserId, allMonths, getFinanceForUser]);

  const goMonth = (dir) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) return;
    addTransaction(viewingUserId, addType, amt, addDesc.trim());
    setAddAmount('');
    setAddDesc('');
    setShowAdd(false);
  };

  const selectHistoryMonth = (year, month) => {
    setViewYear(year);
    setViewMonth(month);
    setHistoryView(false);
    setHistoryUserId(null);
  };

  const staffList = users.filter(u => u.role !== ROLES.OWNER);

  // History mode
  if (historyView) {
    const uid = historyUserId || viewingUserId;
    const histUser = users.find(u => u.id === uid);
    return (
      <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setHistoryView(false); setHistoryUserId(null); }} className="btn-press p-2 rounded-xl hover:bg-white/5 text-white/50">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {histUser && <Avatar src={histUser.avatar} name={histUser.name} size={28} isBestMaster={histUser.isBestMaster} />}
            <h1 className="text-xl font-bold text-white">История</h1>
          </div>
        </div>

        {historyData.length === 0 ? (
          <div className="text-center py-16">
            <History size={32} className="mx-auto mb-3 text-white/15" />
            <p className="text-sm text-white/30">Нет данных</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyData.map(({ key, year, month, income, expense, balance, count }) => (
              <button
                key={key}
                onClick={() => selectHistoryMonth(year, month)}
                className="btn-press w-full glass rounded-2xl p-4 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">
                    {MONTHS_RU[month]} {year}
                  </span>
                  <span className="text-[10px] text-white/30">{count} операций</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Доход</p>
                    <p className="text-sm font-bold text-green-400">+{formatMoney(income)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Расход</p>
                    <p className="text-sm font-bold text-red-400">-{formatMoney(expense)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Баланс</p>
                    <p className={`text-sm font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {formatMoney(balance)}
                    </p>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="flex gap-0.5 mt-3">
                  <div className="h-1 rounded-full bg-green-500/40" style={{ flex: income || 1 }} />
                  <div className="h-1 rounded-full bg-red-500/40" style={{ flex: expense || 1 }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">Финансы</h1>
        <button
          onClick={() => { setHistoryView(true); setHistoryUserId(viewingUserId); }}
          className="btn-press flex items-center gap-1.5 px-3 py-2 text-white/40 hover:text-white/60 text-sm rounded-xl hover:bg-white/5"
        >
          <History size={16} />
          История
        </button>
      </div>

      {/* User selector for Owner/Admin */}
      {canManage && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          {staffList.map(u => (
            <button
              key={u.id}
              onClick={() => setAddUserId(u.id)}
              className={`btn-press flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-all ${
                viewingUserId === u.id ? 'glass-heavy ring-1 ring-brand/30' : 'hover:bg-white/5'
              }`}
            >
              <Avatar src={u.avatar} name={u.name} size={24} isBestMaster={u.isBestMaster} />
              <span className={`text-xs font-medium ${viewingUserId === u.id ? 'text-white' : 'text-white/40'}`}>
                {u.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => goMonth(-1)} className="btn-press p-2 rounded-xl hover:bg-white/5 text-white/50">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <span className={`text-sm font-semibold ${isCurrentMonth ? 'text-brand' : 'text-white'}`}>
            {MONTHS_RU[viewMonth]} {viewYear}
          </span>
          {isCurrentMonth && <span className="text-[10px] text-brand/60 block">Текущий месяц</span>}
        </div>
        <button onClick={() => goMonth(1)} className="btn-press p-2 rounded-xl hover:bg-white/5 text-white/50">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass rounded-2xl p-3 text-center">
          <TrendingUp size={18} className="text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-400">{formatMoney(totals.income)}</p>
          <p className="text-[10px] text-white/30">Доход</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <TrendingDown size={18} className="text-red-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-red-400">{formatMoney(totals.expense)}</p>
          <p className="text-[10px] text-white/30">Расход</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <Wallet size={18} className={`mx-auto mb-1 ${totals.balance >= 0 ? 'text-white' : 'text-red-400'}`} />
          <p className={`text-lg font-bold ${totals.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            {formatMoney(totals.balance)}
          </p>
          <p className="text-[10px] text-white/30">Баланс</p>
        </div>
      </div>

      {/* Add buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => { setAddType(FINANCE_TYPES.INCOME); setShowAdd(true); }}
          className="btn-press flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/15 text-green-400 text-sm font-medium rounded-xl hover:bg-green-500/25 transition-colors"
        >
          <Plus size={18} />
          Доход
        </button>
        <button
          onClick={() => { setAddType(FINANCE_TYPES.EXPENSE); setShowAdd(true); }}
          className="btn-press flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/15 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/25 transition-colors"
        >
          <Minus size={18} />
          Расход
        </button>
      </div>

      {/* Transactions grouped by date */}
      {groupedByDate.length === 0 ? (
        <div className="text-center py-12">
          <Wallet size={32} className="mx-auto mb-3 text-white/10" />
          <p className="text-sm text-white/30">Нет операций за этот месяц</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([dateKey, txs]) => {
            const d = new Date(dateKey + 'T12:00:00');
            const dayIncome = txs.filter(t => t.type === FINANCE_TYPES.INCOME).reduce((s, t) => s + t.amount, 0);
            const dayExpense = txs.filter(t => t.type === FINANCE_TYPES.EXPENSE).reduce((s, t) => s + t.amount, 0);
            const isExpanded = expandedDate === dateKey;

            return (
              <div key={dateKey}>
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : dateKey)}
                  className="w-full flex items-center justify-between mb-2 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-white/20" />
                    <span className="text-xs font-semibold text-white/50">
                      {d.getDate()} {MONTHS_SHORT[d.getMonth()]}
                      {d.toDateString() === now.toDateString() && (
                        <span className="text-brand ml-1">Сегодня</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    {dayIncome > 0 && <span className="text-green-400/70">+{formatMoney(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="text-red-400/70">-{formatMoney(dayExpense)}</span>}
                  </div>
                </button>

                <div className="space-y-1.5">
                  {(isExpanded ? txs : txs.slice(0, 3)).map(tx => (
                    <div
                      key={tx.id}
                      className="glass rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.type === FINANCE_TYPES.INCOME ? 'bg-green-500/15' : 'bg-red-500/15'
                      }`}>
                        {tx.type === FINANCE_TYPES.INCOME
                          ? <TrendingUp size={14} className="text-green-400" />
                          : <TrendingDown size={14} className="text-red-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{tx.description}</p>
                        <p className="text-[10px] text-white/25">
                          {new Date(tx.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${
                        tx.type === FINANCE_TYPES.INCOME ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.type === FINANCE_TYPES.INCOME ? '+' : '-'}{formatMoney(tx.amount)}
                      </span>
                      {(canManage || tx.userId === currentUser.id) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); }}
                          className="btn-press p-1 text-white/10 hover:text-red-400/50 shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                  {!isExpanded && txs.length > 3 && (
                    <button
                      onClick={() => setExpandedDate(dateKey)}
                      className="w-full text-center text-[11px] text-white/25 py-1 hover:text-white/40"
                    >
                      Ещё {txs.length - 3} операций
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <div className="glass-heavy w-full max-w-lg rounded-t-3xl slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">
                {addType === FINANCE_TYPES.INCOME ? 'Новый доход' : 'Новый расход'}
              </h2>
              <button onClick={() => setShowAdd(false)} className="btn-press p-1.5 rounded-xl hover:bg-white/5 text-white/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              {/* Type toggle */}
              <div className="flex glass rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setAddType(FINANCE_TYPES.INCOME)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    addType === FINANCE_TYPES.INCOME ? 'bg-green-500/15 text-green-400' : 'text-white/40'
                  }`}
                >
                  <TrendingUp size={14} />
                  Доход
                </button>
                <button
                  type="button"
                  onClick={() => setAddType(FINANCE_TYPES.EXPENSE)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    addType === FINANCE_TYPES.EXPENSE ? 'bg-red-500/15 text-red-400' : 'text-white/40'
                  }`}
                >
                  <TrendingDown size={14} />
                  Расход
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Сумма</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={addAmount}
                  onChange={e => setAddAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 glass-input rounded-xl text-2xl font-bold text-center"
                  required
                  min="1"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Описание</label>
                <input
                  type="text"
                  value={addDesc}
                  onChange={e => setAddDesc(e.target.value)}
                  placeholder={addType === FINANCE_TYPES.INCOME ? 'Напр. Стрижка' : 'Напр. Обед'}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                />
              </div>

              {canManage && (
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Сотрудник</label>
                  <select
                    value={viewingUserId}
                    onChange={e => setAddUserId(e.target.value)}
                    className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  >
                    {staffList.map(u => (
                      <option key={u.id} value={u.id} className="bg-[#1a1a1a]">{u.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className={`btn-press w-full py-3 font-semibold rounded-xl transition-colors shadow-lg ${
                  addType === FINANCE_TYPES.INCOME
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                }`}
              >
                {addType === FINANCE_TYPES.INCOME ? 'Добавить доход' : 'Добавить расход'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
