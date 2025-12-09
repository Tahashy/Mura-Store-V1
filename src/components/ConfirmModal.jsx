import React from 'react';
import { XCircle, CheckCircle, X } from 'lucide-react';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
        
        <h2 className="text-2xl text-white font-bold mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Sí, eliminar
          </button>
        </div>

      </div>
    </div>
  );
}
