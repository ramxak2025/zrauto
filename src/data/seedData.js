export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MASTER: 'master',
};

export const STATUSES = {
  OFFLINE: 'offline',
  WORKING: 'working',
  BUSY: 'busy',
  LUNCH: 'lunch',
  AWAY: 'away',
};

export const STATUS_LABELS = {
  [STATUSES.OFFLINE]: 'Не на смене',
  [STATUSES.WORKING]: 'В работе',
  [STATUSES.BUSY]: 'Занят',
  [STATUSES.LUNCH]: 'На обеде',
  [STATUSES.AWAY]: 'Отошел',
};

export const STATUS_COLORS = {
  [STATUSES.OFFLINE]: 'bg-gray-200 text-gray-600',
  [STATUSES.WORKING]: 'bg-green-100 text-green-700',
  [STATUSES.BUSY]: 'bg-red-100 text-red-700',
  [STATUSES.LUNCH]: 'bg-yellow-100 text-yellow-700',
  [STATUSES.AWAY]: 'bg-blue-100 text-blue-600',
};

export const SHIFT_TYPES = {
  WORK: 'work',
  DAYOFF: 'dayoff',
  SICK: 'sick',
  LEAVE: 'leave',
};

export const SHIFT_LABELS = {
  [SHIFT_TYPES.WORK]: 'Рабочий день',
  [SHIFT_TYPES.DAYOFF]: 'Выходной',
  [SHIFT_TYPES.SICK]: 'Больничный',
  [SHIFT_TYPES.LEAVE]: 'Отгул',
};

export const TASK_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.NEW]: 'Новая',
  [TASK_STATUSES.IN_PROGRESS]: 'В работе',
  [TASK_STATUSES.REVIEW]: 'На проверке',
  [TASK_STATUSES.DONE]: 'Завершена',
};

export const FINANCE_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

const avatarUrl = (seed) =>
  `https://i.pravatar.cc/150?img=${seed}`;

export const initialUsers = [
  {
    id: '1',
    name: 'Владелец',
    phone: '+7 900 000 0001',
    password: 'owner123',
    role: ROLES.OWNER,
    avatar: avatarUrl(68),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '2',
    name: 'Малик',
    phone: '+7 900 000 0002',
    password: 'admin123',
    role: ROLES.ADMIN,
    avatar: avatarUrl(60),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '3',
    name: 'Раджаб',
    phone: '+7 900 000 0003',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(57),
    isBestMaster: true,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '4',
    name: 'Омар',
    phone: '+7 900 000 0004',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(53),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '5',
    name: 'Байрам',
    phone: '+7 900 000 0005',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(51),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '6',
    name: 'Ших',
    phone: '+7 900 000 0006',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(52),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '7',
    name: 'Магьди',
    phone: '+7 900 000 0007',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(56),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '8',
    name: 'Хизри',
    phone: '+7 900 000 0008',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(59),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '9',
    name: 'Хайбулла',
    phone: '+7 900 000 0009',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(61),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '10',
    name: 'Сайпудин',
    phone: '+7 900 000 0010',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(62),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '11',
    name: 'Ибрагим',
    phone: '+7 900 000 0011',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(14),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '12',
    name: 'Рамазан',
    phone: '+7 900 000 0012',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(33),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '13',
    name: 'Асрет',
    phone: '+7 900 000 0013',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(11),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
  {
    id: '14',
    name: 'Умар',
    phone: '+7 900 000 0014',
    password: 'master123',
    role: ROLES.MASTER,
    avatar: avatarUrl(12),
    isBestMaster: false,
    status: STATUSES.OFFLINE,
    shiftStart: null,
  },
];

function generateSchedule() {
  const schedule = {};
  const today = new Date();
  const masterIds = initialUsers.filter(u => u.role !== ROLES.OWNER).map(u => u.id);

  for (let dayOffset = -7; dayOffset <= 35; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const key = date.toISOString().split('T')[0];
    schedule[key] = {};

    masterIds.forEach((id, idx) => {
      const seed = Math.abs(idx + dayOffset);
      if (seed % 7 === 0) {
        schedule[key][id] = SHIFT_TYPES.DAYOFF;
      } else if (seed % 13 === 0) {
        schedule[key][id] = SHIFT_TYPES.SICK;
      } else if (seed % 11 === 0) {
        schedule[key][id] = SHIFT_TYPES.LEAVE;
      } else {
        schedule[key][id] = SHIFT_TYPES.WORK;
      }
    });
  }
  return schedule;
}

export const initialSchedule = generateSchedule();

// Finance seed data: transactions per user
function generateFinanceData() {
  const transactions = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const staffIds = initialUsers.filter(u => u.role !== ROLES.OWNER).map(u => u.id);

  const incomeDescs = ['Стрижка', 'Укладка', 'Окрашивание', 'Бритьё', 'Моделирование бороды', 'Детская стрижка', 'Комплекс VIP'];
  const expenseDescs = ['Расходные материалы', 'Обед', 'Инструменты', 'Средства для волос', 'Перчатки'];

  let idCounter = 1;

  // Previous month data
  staffIds.forEach((userId) => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrev = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let d = 1; d <= daysInPrev; d += 2) {
      const date = new Date(prevYear, prevMonth, d);
      transactions.push({
        id: String(idCounter++),
        userId,
        type: FINANCE_TYPES.INCOME,
        amount: Math.floor(800 + Math.random() * 4200),
        description: incomeDescs[Math.floor(Math.random() * incomeDescs.length)],
        date: date.toISOString(),
      });
      if (d % 6 === 0) {
        transactions.push({
          id: String(idCounter++),
          userId,
          type: FINANCE_TYPES.EXPENSE,
          amount: Math.floor(200 + Math.random() * 1500),
          description: expenseDescs[Math.floor(Math.random() * expenseDescs.length)],
          date: date.toISOString(),
        });
      }
    }
  });

  // Current month data
  staffIds.forEach((userId) => {
    for (let d = 1; d <= now.getDate(); d += 1) {
      if (Math.random() > 0.4) {
        const date = new Date(currentYear, currentMonth, d, 10 + Math.floor(Math.random() * 8));
        transactions.push({
          id: String(idCounter++),
          userId,
          type: FINANCE_TYPES.INCOME,
          amount: Math.floor(800 + Math.random() * 4200),
          description: incomeDescs[Math.floor(Math.random() * incomeDescs.length)],
          date: date.toISOString(),
        });
      }
      if (Math.random() > 0.8) {
        const date = new Date(currentYear, currentMonth, d, 12 + Math.floor(Math.random() * 4));
        transactions.push({
          id: String(idCounter++),
          userId,
          type: FINANCE_TYPES.EXPENSE,
          amount: Math.floor(200 + Math.random() * 1500),
          description: expenseDescs[Math.floor(Math.random() * expenseDescs.length)],
          date: date.toISOString(),
        });
      }
    }
  });

  return transactions;
}

export const initialFinance = generateFinanceData();

export const initialTasks = [
  {
    id: '1',
    title: 'Убрать рабочее место',
    description: 'Провести генеральную уборку рабочей зоны. Протереть все поверхности, разложить инструменты.',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    assigneeId: '3',
    creatorId: '2',
    status: TASK_STATUSES.IN_PROGRESS,
  },
  {
    id: '2',
    title: 'Инвентаризация материалов',
    description: 'Пересчитать все расходные материалы и составить список необходимых закупок.',
    deadline: new Date(Date.now() + 172800000).toISOString(),
    assigneeId: '4',
    creatorId: '2',
    status: TASK_STATUSES.NEW,
  },
  {
    id: '3',
    title: 'Обновить прайс-лист',
    description: 'Актуализировать цены в прайс-листе с учётом новых поставок.',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    assigneeId: '5',
    creatorId: '1',
    status: TASK_STATUSES.REVIEW,
  },
  {
    id: '4',
    title: 'Подготовить отчёт за неделю',
    description: 'Собрать данные о выполненных работах за прошедшую неделю и оформить отчёт.',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    assigneeId: '3',
    creatorId: '1',
    status: TASK_STATUSES.DONE,
  },
];
