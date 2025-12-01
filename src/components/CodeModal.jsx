import React, { useState } from 'react';
import { Gift } from 'lucide-react';

export default function CodeModal({ show, welcomeCode, welcomeDiscount, onApply, onClose }) {
  const [inputCode, setInputCode] = useState('');

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <div className="absolute inset-0 bg-red-600 opacity-5 rounded-2xl"></div>
        <div className="relative z-10 text-center">
          <Gift className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido!</h2>
          <p className="text-gray-300 mb-4">Usa este código para {welcomeDiscount}% OFF</p>

          <div className="bg-black border-2 border-red-600 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Tu código exclusivo:</p>
            <p className="text-2xl font-bold text-red-600">{welcomeCode}</p>
          </div>

          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código"
            className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg mb-3 focus:outline-none focus:border-red-600"
          />

          <button
            onClick={() => onApply(inputCode, setInputCode)}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mb-2"
          >
            Aplicar Código
          </button>

          <button onClick={onClose} className="w-full text-gray-400 py-2 hover:text-white transition">
            Continuar sin código
          </button>
        </div>
      </div>
    </div>
  );
}
