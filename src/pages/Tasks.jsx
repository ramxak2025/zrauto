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
} from 'lucide-react';

const statusConfig = {
  [TASK_STATUSES.NEW]: { color: 'bg-blue-100 text-blue-700', icon: Circle },
  [TASK_STATUSES.IN_PROGRESS]: { color: 'bg-green-100 text-green-700', icon: Clock },
  [TASK_STATUSES.REVIEW]: { color: 'bg-yellow-100 text-yellow-700', icon: Eye },
  [TASK_STATUSES.DONE]: { color: 'bg-gray-100 text-gray-500', icon: CheckCircle2 },
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
    if (tab === 'my') {
      return tasks.filter((t) => t.assigneeId === currentUser.id);
    }
    return tasks.filter((t) => t.creatorId === currentUser.id);
  }, [tasks, tab, currentUser]);

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

  const handleMarkDone = (taskId) => {
    updateTaskStatus(taskId, TASK_STATUSES.REVIEW);
  };

  const handleAccept = (taskId) => {
    updateTaskStatus(taskId, TASK_STATUSES.DONE);
  };

  const assignableUsers = users.filter(
    (u) => u.role === ROLES.MASTER || u.role === ROLES.ADMIN
  );

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="fade-in px-4 pt-4 pb-4 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Задачи</h1>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="btn-press flex items-center gap-1.5 px-3 py-2 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
          >
            <Plus size={16} />
            Создать
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('my')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'my' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Мои задачи
        </button>
        <button
          onClick={() => setTab('assigned')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'assigned' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Поручения
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ClipboardIcon className="mx-auto mb-2" />
          <p className="text-sm">Нет задач</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const assignee = getUserById(task.assigneeId);
            const creator = getUserById(task.creatorId);
            const { color, icon: StatusIcon } = statusConfig[task.status];
            const expanded = expandedId === task.id;
            const overdue = isOverdue(task.deadline) && task.status !== TASK_STATUSES.DONE;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                  task.status === TASK_STATUSES.DONE ? 'border-gray-100 opacity-60' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : task.id)}
                  className="w-full text-left px-4 py-3 flex items-start gap-3"
                >
                  <StatusIcon
                    size={20}
                    className={`shrink-0 mt-0.5 ${
                      task.status === TASK_STATUSES.DONE ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        task.status === TASK_STATUSES.DONE ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color}`}>
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      {task.deadline && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                          {overdue && <AlertCircle size={10} />}
                          {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-50 slide-up">
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-3 mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span>Исполнитель:</span>
                        {assignee && (
                          <div className="flex items-center gap-1">
                            <Avatar src={assignee.avatar} name={assignee.name} size={18} isBestMaster={assignee.isBestMaster} />
                            <span className="text-gray-700 font-medium">{assignee.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>От:</span>
                        <span className="text-gray-700 font-medium">{creator?.name || '—'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {task.status === TASK_STATUSES.IN_PROGRESS && task.assigneeId === currentUser.id && (
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="btn-press flex-1 py-2 bg-yellow-500 text-white text-sm font-medium rounded-xl hover:bg-yellow-600 transition-colors"
                        >
                          Выполнил
                        </button>
                      )}
                      {task.status === TASK_STATUSES.NEW && task.assigneeId === currentUser.id && (
                        <button
                          onClick={() => updateTaskStatus(task.id, TASK_STATUSES.IN_PROGRESS)}
                          className="btn-press flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors"
                        >
                          Начать
                        </button>
                      )}
                      {task.status === TASK_STATUSES.REVIEW && task.creatorId === currentUser.id && (
                        <button
                          onClick={() => handleAccept(task.id)}
                          className="btn-press flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors"
                        >
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
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Новая задача</h2>
              <button onClick={() => setShowCreate(false)} className="btn-press p-1 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Заголовок</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Описание</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Исполнитель</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  required
                >
                  <option value="">Выберите...</option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Дедлайн</label>
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>
              <button
                type="submit"
                className="btn-press w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
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

function ClipboardIcon({ className }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
