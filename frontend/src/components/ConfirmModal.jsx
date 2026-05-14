import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Eliminar', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-[#a3a3a3] text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#303030]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-white rounded-xl font-medium ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#22c55e] hover:bg-[#16a34a]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}