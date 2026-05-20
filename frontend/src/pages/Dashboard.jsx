import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import StatCardSkeleton from '../components/StatCardSkeleton';
import { FolderKanban, CheckSquare, FileText, TrendingUp, Loader2, Clock, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completedTasks: 0, notes: 0 });
  const [tasksByPriority, setTasksByPriority] = useState({ low: 0, medium: 0, high: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes, notesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/notes'),
        ]);

        const projects = projectsRes.data.length;
        const tasks = tasksRes.data;
        const completedTasks = tasks.filter(t => t.completed).length;
        const notes = notesRes.data.length;

        setStats({ projects, tasks: tasks.length, completedTasks, notes });

        setTasksByPriority({
          low: tasks.filter(t => t.priority === 'low').length,
          medium: tasks.filter(t => t.priority === 'medium').length,
          high: tasks.filter(t => t.priority === 'high').length,
        });

        setRecentTasks(tasks.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Proyectos', value: stats.projects, icon: FolderKanban, color: '#22c55e', to: '/projects' },
    { label: 'Tareas', value: stats.tasks, icon: CheckSquare, color: '#3b82f6', to: '/tasks' },
    { label: 'Completadas', value: stats.completedTasks, icon: TrendingUp, color: '#a855f7', to: '/tasks?filter=completed' },
    { label: 'Notas', value: stats.notes, icon: FileText, color: '#f59e0b', to: '/notes' },
  ];

  const priorityBars = [
    { label: 'Alta', value: tasksByPriority.high, color: '#ef4444', max: stats.tasks },
    { label: 'Media', value: tasksByPriority.medium, color: '#f59e0b', max: stats.tasks },
    { label: 'Baja', value: tasksByPriority.low, color: '#3b82f6', max: stats.tasks },
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-9 w-48 bg-[#262626] rounded animate-pulse" />
          <div className="h-5 w-64 bg-[#262626] rounded mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hola, {user?.name} 👋
        </h1>
        <p className="text-[#a3a3a3] mt-1">Bienvenido a tu dashboard de desarrollo</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            to={stat.to}
            className="group p-4 sm:p-6 bg-[#171717] border border-[#262626] rounded-2xl hover:border-[#404040] hover:shadow-lg hover:shadow-black/20 transition-all"
          >
            <div className="flex items-center gap-3 sm:block sm:mb-4">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={20} className="sm:w-6 sm:h-6" style={{ color: stat.color }} />
              </div>
              <div className="sm:hidden">
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-[#a3a3a3] text-xs">{stat.label}</p>
              </div>
            </div>
            <p className="hidden sm:block text-[#a3a3a3] text-sm">{stat.label}</p>
            <p className="hidden sm:block text-3xl font-bold text-white mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 p-6 bg-[#171717] border border-[#262626] rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Tareas por Prioridad</h2>
          <div className="space-y-5">
            {priorityBars.map((bar, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a3a3a3]">{bar.label}</span>
                  <span className="text-sm font-medium text-white">{bar.value}</span>
                </div>
                <div className="w-full h-2.5 bg-[#262626] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${bar.max > 0 ? (bar.value / bar.max) * 100 : 0}%`,
                      backgroundColor: bar.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#171717] border border-[#262626] rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Progreso</h2>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#262626" strokeWidth="12" fill="none" />
              <circle
                cx="64" cy="64" r="56"
                stroke="#22c55e"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${stats.tasks > 0 ? (stats.completedTasks / stats.tasks) * 352 : 0} 352`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}%
              </span>
            </div>
          </div>
          <p className="text-center text-[#a3a3a3] text-sm mt-4">Completado</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#171717] border border-[#262626] rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Tareas Recientes</h2>
          {recentTasks.length === 0 ? (
            <p className="text-[#737373] text-sm">No hay tareas</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-[#262626] rounded-xl hover:bg-[#303030] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.completed ? 'bg-green-500' : task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <span className={`text-sm truncate ${task.completed ? 'text-[#737373] line-through' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-xs text-[#737373] flex-shrink-0">
                    <Clock size={12} className="inline mr-1" />
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-[#171717] border border-[#262626] rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/projects"
              className="flex items-center gap-4 p-4 bg-[#262626] rounded-xl hover:bg-[#303030] active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center shrink-0">
                <FolderKanban size={20} className="text-[#22c55e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Nuevo Proyecto</p>
                <p className="text-[#737373] text-xs mt-0.5">Organiza tus proyectos</p>
              </div>
              <ChevronRight size={18} className="text-[#525252] shrink-0" />
            </Link>
            <Link
              to="/tasks"
              className="flex items-center gap-4 p-4 bg-[#262626] rounded-xl hover:bg-[#303030] active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/20 flex items-center justify-center shrink-0">
                <CheckSquare size={20} className="text-[#3b82f6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Nueva Tarea</p>
                <p className="text-[#737373] text-xs mt-0.5">Gestiona tus tareas</p>
              </div>
              <ChevronRight size={18} className="text-[#525252] shrink-0" />
            </Link>
            <Link
              to="/notes"
              className="flex items-center gap-4 p-4 bg-[#262626] rounded-xl hover:bg-[#303030] active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Nueva Nota</p>
                <p className="text-[#737373] text-xs mt-0.5">Guarda tus apuntes</p>
              </div>
              <ChevronRight size={18} className="text-[#525252] shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}