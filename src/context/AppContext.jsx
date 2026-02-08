import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  initialUsers,
  initialSchedule,
  initialMessages,
  initialTasks,
  STATUSES,
  TASK_STATUSES,
  ROLES,
  SHIFT_TYPES,
} from '../data/seedData';

const AppContext = createContext(null);

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadState('zr_currentUser', null));
  const [users, setUsers] = useState(() => loadState('zr_users', initialUsers));
  const [schedule, setSchedule] = useState(() => loadState('zr_schedule', initialSchedule));
  const [messages, setMessages] = useState(() => loadState('zr_messages', initialMessages));
  const [tasks, setTasks] = useState(() => loadState('zr_tasks', initialTasks));

  useEffect(() => { localStorage.setItem('zr_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('zr_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('zr_schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('zr_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('zr_tasks', JSON.stringify(tasks)); }, [tasks]);

  const login = useCallback((phone, password) => {
    const normalizedPhone = phone.replace(/\s+/g, '');
    const user = users.find(
      (u) => u.phone.replace(/\s+/g, '') === normalizedPhone && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Неверный номер телефона или пароль' };
  }, [users]);

  const logout = useCallback(() => {
    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, status: STATUSES.OFFLINE, shiftStart: null } : u
        )
      );
    }
    setCurrentUser(null);
  }, [currentUser]);

  const updateMyStatus = useCallback((status) => {
    const now = Date.now();
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser?.id) return u;
        if (status === STATUSES.WORKING && u.status === STATUSES.OFFLINE) {
          return { ...u, status, shiftStart: now };
        }
        if (status === STATUSES.OFFLINE) {
          return { ...u, status, shiftStart: null };
        }
        return { ...u, status };
      })
    );
    setCurrentUser((prev) => {
      if (!prev) return prev;
      if (status === STATUSES.WORKING && prev.status === STATUSES.OFFLINE) {
        return { ...prev, status, shiftStart: now };
      }
      if (status === STATUSES.OFFLINE) {
        return { ...prev, status, shiftStart: null };
      }
      return { ...prev, status };
    });
  }, [currentUser]);

  const updateUser = useCallback((userId, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  }, [currentUser]);

  const addUser = useCallback((userData) => {
    const newUser = {
      id: String(Date.now()),
      status: STATUSES.OFFLINE,
      shiftStart: null,
      isBestMaster: false,
      bannedInChat: false,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      ...userData,
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const deleteUser = useCallback((userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const updateScheduleCell = useCallback((date, userId, shiftType) => {
    setSchedule((prev) => ({
      ...prev,
      [date]: { ...prev[date], [userId]: shiftType },
    }));
  }, []);

  const sendMessage = useCallback((text, image = null) => {
    if (!currentUser) return;
    const msg = {
      id: String(Date.now()),
      userId: currentUser.id,
      text,
      timestamp: Date.now(),
      image,
    };
    setMessages((prev) => [...prev, msg]);
  }, [currentUser]);

  const createTask = useCallback((taskData) => {
    const task = {
      id: String(Date.now()),
      status: TASK_STATUSES.NEW,
      creatorId: currentUser?.id,
      ...taskData,
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, [currentUser]);

  const updateTaskStatus = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  const isOwner = currentUser?.role === ROLES.OWNER;
  const isAdmin = currentUser?.role === ROLES.ADMIN;
  const canManage = isOwner || isAdmin;

  const todayKey = new Date().toISOString().split('T')[0];
  const todaySchedule = schedule[todayKey] || {};

  const getUserById = useCallback((id) => users.find((u) => u.id === id), [users]);

  const value = {
    currentUser,
    users,
    schedule,
    messages,
    tasks,
    login,
    logout,
    updateMyStatus,
    updateUser,
    addUser,
    deleteUser,
    updateScheduleCell,
    sendMessage,
    createTask,
    updateTaskStatus,
    isOwner,
    isAdmin,
    canManage,
    todayKey,
    todaySchedule,
    getUserById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
