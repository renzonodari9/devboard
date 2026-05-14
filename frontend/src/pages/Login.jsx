import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Code, Mail, Lock, Loader2, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('dev@devboard.com');
  const [password, setPassword] = useState('123456');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#22c55e]/20">
            <Code size={40} className="text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">DevBoard</h1>
          <p className="text-[#a3a3a3] text-lg">Gestiona tus proyectos como un pro</p>
        </div>

        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <X size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-white placeholder-[#525252] focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 focus:outline-none transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a3a3a3] mb-2 font-medium">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-white placeholder-[#525252] focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/20"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#737373] mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
