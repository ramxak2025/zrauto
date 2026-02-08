import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, MessageCircle, ClipboardList, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Главная', icon: LayoutDashboard },
  { path: '/schedule', label: 'График', icon: CalendarDays },
  { path: '/chat', label: 'Чат', icon: MessageCircle },
  { path: '/tasks', label: 'Задачи', icon: ClipboardList },
  { path: '/profile', label: 'Профиль', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/chat') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50">
      <div className="flex justify-around items-center h-22 max-w-lg mx-auto px-2 pt-2 pb-4">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`btn-press flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-2xl transition-all ${
                isActive ? 'text-brand' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-brand/15' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
