import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useToastStore } from '../store/toastStore';
import TaskCardSkeleton from '../components/TaskCardSkeleton';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, CheckSquare, Loader2, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react';

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [formData, setFormData] = useState({ title: '', description: '', project: '', priority: 'medium' });
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get(`/tasks?completed=${filter === 'completed' ? 'true' : filter === 'pending' ? 'false' : ''}`),
        api.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
        addToast('Tarea actualizada', 'success');
      } else {
        await api.post('/tasks', formData);
        addToast('Tarea creada', 'success');
      }
      fetchData();
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', project: '', priority: 'medium' });
    } catch (error) {
      addToast('Error al guardar tarea', 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project: task.project?._id || task.project || '',
      priority: task.priority
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteModal.id}`);
      addToast('Tarea eliminada', 'success');
      fetchData();
    } catch (error) {
      addToast('Error al eliminar tarea', 'error');
    }
    setDeleteModal({ open: false, id: null });
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      addToast(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada', 'success');
      fetchData();
    } catch (error) {
      addToast('Error al actualizar tarea', 'error');
    }
  };

  const filters = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completadas' },
  ];

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400',
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Tareas</h1>
            <p className="text-[#a3a3a3] mt-1">Gestiona tus tareas por proyecto</p>
          </div>
          <div className="w-32 h-10 bg-[#262626] rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <TaskCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tareas</h1>
          <p className="text-[#a3a3a3] mt-1">Gestiona tus tareas por proyecto</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', project: '', priority: 'medium' }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/20 transition-all"
        >
          <Plus size={18} />
          Nueva Tarea
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setSearchParams(f.value === 'all' ? {} : { filter: f.value }); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === f.value
                ? 'bg-[#262626] text-white shadow-sm'
                : 'text-[#a3a3a3] hover:text-white hover:bg-[#171717]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#262626] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckSquare size={32} className="text-[#404040]" />
          </div>
          <p className="text-[#737373]">No hay tareas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`group flex items-center gap-4 p-4 bg-[#171717] border border-[#262626] rounded-xl hover:border-[#404040] hover:shadow-md hover:shadow-black/20 transition-all ${task.completed ? 'opacity-60' : ''}`}
            >
              <button
                onClick={() => toggleComplete(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  task.completed ? 'bg-[#22c55e] border-[#22c55e] scale-110' : 'border-[#404040] hover:border-[#22c55e]'
                }`}
              >
                {task.completed && <Check size={14} className="text-black" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className={`font-medium truncate ${task.completed ? 'line-through text-[#737373]' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                {task.project && (
                  <p className="text-xs text-[#737373] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.project.color }} />
                    {task.project.name}
                  </p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => handleEdit(task)} className="p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(task._id)} className="p-2 rounded-lg text-[#a3a3a3] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#a3a3a3] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white placeholder-[#737373] focus:border-[#22c55e] focus:outline-none"
                  placeholder="Mi tarea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Proyecto</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white focus:border-[#22c55e] focus:outline-none"
                >
                  <option value="">Sin proyecto</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Prioridad</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        formData.priority === p ? priorityColors[p] : 'bg-[#262626] text-[#a3a3a3]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#303030]">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a]">
                  {editingTask ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Eliminar Tarea"
        message="Esta acción no se puede deshacer. ¿Estás seguro de eliminar esta tarea?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}