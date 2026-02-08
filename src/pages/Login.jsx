import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(phone, password);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand rounded-2xl mb-4 shadow-lg shadow-brand/30 pulse-glow">
            <span className="text-white text-3xl font-bold tracking-tight">ZR</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ZR CRM</h1>
          <p className="text-white/40 text-sm mt-1">Система управления персоналом</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 glass-input rounded-xl"
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 glass-input rounded-xl"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-press w-full py-3.5 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Войти
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 glass rounded-2xl">
          <p className="text-xs text-white/40 font-medium mb-3 text-center">Демо-доступ</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Владелец</span>
              <span className="font-mono text-white/70">+79000000001 / owner123</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Админ</span>
              <span className="font-mono text-white/70">+79000000002 / admin123</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Мастер</span>
              <span className="font-mono text-white/70">+79000000003 / master123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
