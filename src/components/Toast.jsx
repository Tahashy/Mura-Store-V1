import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ show, message, type = 'success', onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'from-green-900 to-green-800',
      border: 'border-green-600',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircle,
      bg: 'from-red-900 to-red-800',
      border: 'border-red-600',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bg: 'from-yellow-900 to-yellow-800',
      border: 'border-yellow-600',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bg: 'from-blue-900 to-blue-800',
      border: 'border-blue-600',
      iconColor: 'text-blue-400'
    }
  };

  const config = types[type] || types.success;
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`bg-gradient-to-r ${config.bg} border-2 ${config.border} rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <p className="text-white flex-1 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}