import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, LogOut, Menu, X, Code } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Proyectos', icon: FolderKanban },
    { to: '/tasks', label: 'Tareas', icon: CheckSquare },
    { to: '/notes', label: 'Notas', icon: FileText },
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-lg flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
              <Code size={20} className="text-black" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DevBoard</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.to
                    ? 'bg-[#262626] text-white shadow-sm'
                    : 'text-[#a3a3a3] hover:text-white hover:bg-[#171717]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-[#a3a3a3] text-sm font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-[#a3a3a3] hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[#a3a3a3] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#262626] px-4 py-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'bg-[#262626] text-white'
                      : 'text-[#a3a3a3] hover:bg-[#171717]'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-[#262626] my-2" />
            <div className="px-4 py-2 text-xs text-[#525252]">{user?.email}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}