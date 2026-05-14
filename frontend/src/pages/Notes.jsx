import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToastStore } from '../store/toastStore';
import ConfirmModal from '../components/ConfirmModal';
import { FileText, Loader2, Pencil, Trash2, X, Pin } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ title: '', content: '', project: '', tags: '' });
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      const [notesRes, projectsRes] = await Promise.all([
        api.get(`/notes${selectedProject ? `?project=${selectedProject}` : ''}`),
        api.get('/projects'),
      ]);
      setNotes(notesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, payload);
        addToast('Nota actualizada', 'success');
      } else {
        await api.post('/notes', payload);
        addToast('Nota creada', 'success');
      }
      fetchData();
      setShowModal(false);
      setEditingNote(null);
      setFormData({ title: '', content: '', project: '', tags: '' });
    } catch (error) {
      addToast('Error al guardar nota', 'error');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      project: note.project?._id || note.project || '',
      tags: note.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/notes/${deleteModal.id}`);
      addToast('Nota eliminada', 'success');
      fetchData();
    } catch (error) {
      addToast('Error al eliminar nota', 'error');
    }
    setDeleteModal({ open: false, id: null });
  };

  const handlePin = async (note) => {
    try {
      await api.put(`/notes/${note._id}`, { isPinned: !note.isPinned });
      addToast(note.isPinned ? 'Nota desfijada' : 'Nota fijada', 'success');
      fetchData();
    } catch (error) {
      addToast('Error al fijar nota', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#22c55e]" />
      </div>
    );
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notas Técnicas</h1>
          <p className="text-[#a3a3a3] mt-1">Guarda tus apuntes y documentación</p>
        </div>
        <button
          onClick={() => { setEditingNote(null); setFormData({ title: '', content: '', project: '', tags: '' }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/20 transition-all"
        >
          <FileText size={18} />
          Nueva Nota
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedProject('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            !selectedProject ? 'bg-[#262626] text-white shadow-sm' : 'text-[#a3a3a3] hover:text-white hover:bg-[#171717]'
          }`}
        >
          Todas
        </button>
        {projects.map((p) => (
          <button
            key={p._id}
            onClick={() => setSelectedProject(p._id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedProject === p._id ? 'bg-[#262626] text-white shadow-sm' : 'text-[#a3a3a3] hover:text-white hover:bg-[#171717]'
            }`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </button>
        ))}
      </div>

      {sortedNotes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#262626] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-[#404040]" />
          </div>
          <p className="text-[#737373]">No hay notas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note._id}
              className="group p-5 bg-[#171717] border border-[#262626] rounded-2xl hover:border-[#404040] hover:shadow-lg hover:shadow-black/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {note.isPinned && <Pin size={14} className="text-[#f59e0b] fill-current flex-shrink-0" />}
                  <h3 className="font-semibold text-white truncate">{note.title}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => handlePin(note)} className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                    <Pin size={14} className={note.isPinned ? 'fill-current' : ''} />
                  </button>
                  <button onClick={() => handleEdit(note)} className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(note._id)} className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-[#737373] text-sm line-clamp-4 whitespace-pre-wrap">{note.content}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                {note.project && (
                  <span className="text-xs text-[#737373] flex items-center gap-1 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: note.project.color }} />
                    <span className="truncate">{note.project.name}</span>
                  </span>
                )}
                {note.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap justify-end flex-shrink-0">
                    {note.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#262626] text-[#737373] text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-xs text-[#737373]">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#171717] border border-[#262626] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingNote ? 'Editar Nota' : 'Nueva Nota'}
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
                  placeholder="Título de la nota"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a3a3a3] mb-2">Contenido</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white placeholder-[#737373] focus:border-[#22c55e] focus:outline-none resize-none font-mono text-sm"
                  rows={10}
                  placeholder="# Tu nota técnica aquí..."
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">Proyecto (opcional)</label>
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
                  <label className="block text-sm text-[#a3a3a3] mb-2">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#404040] rounded-xl text-white placeholder-[#737373] focus:border-[#22c55e] focus:outline-none"
                    placeholder="react, hooks, tutorial"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#303030]">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-xl hover:bg-[#16a34a]">
                  {editingNote ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Eliminar Nota"
        message="Esta acción no se puede deshacer. ¿Estás seguro de eliminar esta nota?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}