import React from 'react';
import { Check } from 'lucide-react';

export default function SuccessToast({ show }) {
  if (!show) return null;
  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-50 border border-red-500">
      <Check className="w-5 h-5" />
      <span>¡Compra enviada a WhatsApp!</span>
    </div>
  );
}
