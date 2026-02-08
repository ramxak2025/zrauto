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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`btn-press flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-brand' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
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
