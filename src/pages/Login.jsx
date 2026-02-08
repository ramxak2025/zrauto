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
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 fade-in">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">ZR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ZR CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Система управления персоналом</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-press w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 font-medium mb-2 text-center">Демо-доступ:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Владелец:</span>
              <span className="font-mono">+79000000001 / owner123</span>
            </div>
            <div className="flex justify-between">
              <span>Админ (Малик):</span>
              <span className="font-mono">+79000000002 / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Мастер (Раджаб):</span>
              <span className="font-mono">+79000000003 / master123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
