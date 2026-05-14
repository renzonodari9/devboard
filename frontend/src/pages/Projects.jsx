import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../store/toastStore';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, FolderKanban, Loader2, Pencil, Trash2, X, Check } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ name: '', description: '', color: '#22c55e' });
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData);
        addToast('Proyecto actualizado', 'success');
      } else {
        await api.post('/projects', formData);
        addToast('Proyecto creado', 'success');
      }
      fetchProjects();
      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', color: '#22c55e' });
    } catch (error) {
      addToast('Error al guardar proyecto', 'error');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description || '', color: project.color });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/projects/${deleteModal.id}`);
      addToast('Proyecto eliminado', 'success');
      fetchProjects();
    } catch (error) {
      addToast('Error al eliminar proyecto', 'error');
    }
    setDeleteModal({ open: false, id: null });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Proyectos</h1>
            <p className="text-[#a3a3a3] mt-1">Gestiona tus proyectos de desarrollo</p>
          </div>
          <div className="w-40 h-10 bg-[#262626] rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Proyectos</h1>
          <p className="text-[#a3a3a3] mt-1">Gestiona tus proyectos de desarrollo</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setFormData({ name: '', description: '', color: '#22c55e' }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/20 transition-all"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#262626] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={32} className="text-[#404040]" />
          </div>
          <p className="text-[#737373]">No tienes proyectos todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group p-5 bg-[#171717] border border-[#262626] rounded-2xl hover:border-[#404040] hover:shadow-lg hover:shadow-black/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <h3 className="font-semibold text-white truncate">{project.name}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[#737373] text-sm line-clamp-2">
                {project.description || 'Sin descripción'}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status}
                </span>
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
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#a3a3a3] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white placeholder-[#737373] focus:border-[#22c55e] focus:outline-none"
                  placeholder="Mi Proyecto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white placeholder-[#737373] focus:border-[#22c55e] focus:outline-none resize-none"
                  rows={3}
                  placeholder="Descripción del proyecto..."
                />
              </div>

              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === color ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#171717]' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#303030]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a]"
                >
                  {editingProject ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Eliminar Proyecto"
        message="Esta acción no se puede deshacer. ¿Estás seguro de eliminar este proyecto?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}