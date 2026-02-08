import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TASK_STATUSES, TASK_STATUS_LABELS, ROLES } from '../data/seedData';
import Avatar from '../components/Avatar';
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Eye,
  X,
  ChevronDown,
  AlertCircle,
  ArrowRight,
  CalendarClock,
  User as UserIcon,
} from 'lucide-react';

const statusConfig = {
  [TASK_STATUSES.NEW]: { color: 'bg-blue-500/15 text-blue-400', icon: Circle, dot: 'bg-blue-400' },
  [TASK_STATUSES.IN_PROGRESS]: { color: 'bg-green-500/15 text-green-400', icon: Clock, dot: 'bg-green-400' },
  [TASK_STATUSES.REVIEW]: { color: 'bg-yellow-500/15 text-yellow-400', icon: Eye, dot: 'bg-yellow-400' },
  [TASK_STATUSES.DONE]: { color: 'bg-white/5 text-white/40', icon: CheckCircle2, dot: 'bg-white/30' },
};

export default function Tasks() {
  const { currentUser, tasks, users, createTask, updateTaskStatus, getUserById, canManage } = useApp();
  const [tab, setTab] = useState('my');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const filteredTasks = useMemo(() => {
    const list = tab === 'my'
      ? tasks.filter((t) => t.assigneeId === currentUser.id)
      : tasks.filter((t) => t.creatorId === currentUser.id);
    return [...list].sort((a, b) => {
      const order = { new: 0, in_progress: 1, review: 2, done: 3 };
      return (order[a.status] || 0) - (order[b.status] || 0);
    });
  }, [tasks, tab, currentUser]);

  const taskCounts = useMemo(() => {
    const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);
    const assigned = tasks.filter((t) => t.creatorId === currentUser.id);
    return { my: myTasks.length, assigned: assigned.length };
  }, [tasks, currentUser]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignee) return;
    createTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      assigneeId: newAssignee,
      deadline: newDeadline ? new Date(newDeadline).toISOString() : null,
    });
    setNewTitle('');
    setNewDesc('');
    setNewAssignee('');
    setNewDeadline('');
    setShowCreate(false);
  };

  const assignableUsers = users.filter(
    (u) => u.role === ROLES.MASTER || u.role === ROLES.ADMIN
  );

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const d = new Date(deadline);
    const now = new Date();
    const diffMs = d - now;
    const diffH = Math.round(diffMs / 3600000);

    if (diffH < 0) return 'Просрочена';
    if (diffH < 24) return `${diffH}ч осталось`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-white">Задачи</h1>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="btn-press flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
          >
            <Plus size={16} />
            Создать
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex glass rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab('my')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            tab === 'my' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40'
          }`}
        >
          Мои задачи
          {taskCounts.my > 0 && (
            <span className="ml-1.5 bg-brand/20 text-brand text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {taskCounts.my}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('assigned')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            tab === 'assigned' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40'
          }`}
        >
          Поручения
          {taskCounts.assigned > 0 && (
            <span className="ml-1.5 bg-brand/20 text-brand text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {taskCounts.assigned}
            </span>
          )}
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3">
            <CheckCircle2 size={28} className="text-white/20" />
          </div>
          <p className="text-sm text-white/30">Нет задач</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const assignee = getUserById(task.assigneeId);
            const creator = getUserById(task.creatorId);
            const { color, icon: StatusIcon, dot } = statusConfig[task.status];
            const expanded = expandedId === task.id;
            const overdue = isOverdue(task.deadline) && task.status !== TASK_STATUSES.DONE;
            const isDone = task.status === TASK_STATUSES.DONE;

            return (
              <div
                key={task.id}
                className={`glass rounded-2xl overflow-hidden transition-all ${isDone ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : task.id)}
                  className="w-full text-left px-4 py-3.5 flex items-start gap-3"
                >
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0 mt-1.5`} />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDone ? 'line-through text-white/30' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color}`}>
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      {task.deadline && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${
                          overdue ? 'text-red-400' : 'text-white/30'
                        }`}>
                          <CalendarClock size={10} />
                          {formatDeadline(task.deadline)}
                        </span>
                      )}
                      {assignee && (
                        <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                          <UserIcon size={10} />
                          {assignee.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white/20 shrink-0 mt-0.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-white/5 slide-up">
                    {task.description && (
                      <p className="text-sm text-white/60 mt-3 mb-4 leading-relaxed">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span>Исполнитель:</span>
                        {assignee && (
                          <div className="flex items-center gap-1">
                            <Avatar src={assignee.avatar} name={assignee.name} size={18} isBestMaster={assignee.isBestMaster} />
                            <span className="text-white/60 font-medium">{assignee.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>От:</span>
                        <span className="text-white/60 font-medium">{creator?.name || '—'}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-1 mb-4">
                      {['new', 'in_progress', 'review', 'done'].map((s, i) => {
                        const order = { new: 0, in_progress: 1, review: 2, done: 3 };
                        const current = order[task.status];
                        const filled = i <= current;
                        return (
                          <div
                            key={s}
                            className={`flex-1 h-1 rounded-full transition-colors ${
                              filled ? (task.status === 'done' ? 'bg-green-500' : 'bg-brand') : 'bg-white/5'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {task.status === TASK_STATUSES.NEW && task.assigneeId === currentUser.id && (
                        <button
                          onClick={() => updateTaskStatus(task.id, TASK_STATUSES.IN_PROGRESS)}
                          className="btn-press flex-1 py-2.5 bg-green-500/15 text-green-400 text-sm font-medium rounded-xl hover:bg-green-500/25 transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowRight size={16} />
                          Начать
                        </button>
                      )}
                      {task.status === TASK_STATUSES.IN_PROGRESS && task.assigneeId === currentUser.id && (
                        <button
                          onClick={() => updateTaskStatus(task.id, TASK_STATUSES.REVIEW)}
                          className="btn-press flex-1 py-2.5 bg-yellow-500/15 text-yellow-400 text-sm font-medium rounded-xl hover:bg-yellow-500/25 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          Выполнил
                        </button>
                      )}
                      {task.status === TASK_STATUSES.REVIEW && task.creatorId === currentUser.id && (
                        <button
                          onClick={() => updateTaskStatus(task.id, TASK_STATUSES.DONE)}
                          className="btn-press flex-1 py-2.5 bg-green-500/15 text-green-400 text-sm font-medium rounded-xl hover:bg-green-500/25 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Принять
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-end justify-center" onClick={() => setShowCreate(false)}>
          <div className="glass-heavy w-full max-w-lg rounded-t-3xl slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Новая задача</h2>
              <button onClick={() => setShowCreate(false)} className="btn-press p-1.5 rounded-xl hover:bg-white/5 text-white/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Заголовок</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Описание</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Исполнитель</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                  required
                >
                  <option value="" className="bg-[#1a1a1a]">Выберите...</option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#1a1a1a]">{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Дедлайн</label>
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm"
                />
              </div>
              <button
                type="submit"
                className="btn-press w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
              >
                Создать задачу
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
