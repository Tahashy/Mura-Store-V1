import React, { useState } from 'react';
import { Tag, Phone, X } from 'lucide-react';

export default function CouponModal({ show, onApply, onClose }) {
  const [step, setStep] = useState(1); // 1: Teléfono, 2: Cupón
  const [phoneNumber, setPhoneNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });


  if (!show) return null;

  const handlePhoneSubmit = () => {
    if (phoneNumber.length !== 9) {
      alert('⚠️ Ingresa un número válido de 9 dígitos');
      return;
    }
    setStep(2);
  };

  const handleCouponSubmit = () => {
    if (!couponCode.trim()) {
      alert('⚠️ Ingresa un código de cupón');
      return;
    }
    onApply(couponCode, phoneNumber, setCouponCode);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 bg-red-600 opacity-5 rounded-2xl"></div>
        
        <div className="relative z-10 text-center">
          {step === 1 ? (
            <>
              <div className="bg-red-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">¡Bienvenido a MuraStore!</h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Ingresa tu número de celular para aplicar cupones
              </p>

              <div className="mb-4">
                <div className="flex items-center gap-2 bg-black border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-red-600">
                  <span className="text-gray-400 font-semibold">+51</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 9) {
                        setPhoneNumber(value);
                      }
                    }}
                    placeholder="999 999 999"
                    className="flex-1 bg-transparent text-white outline-none"
                    maxLength="9"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-left">
                  Tu número solo se usa para validar cupones
                </p>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length !== 9}
                className={`w-full py-3 rounded-lg font-semibold transition mb-3 ${
                  phoneNumber.length === 9
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continuar
              </button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-400 py-2 hover:text-white transition text-sm"
              >
                Explorar sin cupón
              </button>
            </>
          ) : (
            <>
              <div className="bg-red-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">¿Tienes un cupón?</h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Ingresa tu código de descuento
              </p>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-400 mb-1">Tu número:</p>
                <p className="text-white font-semibold">+51 {phoneNumber}</p>
                <button
                  onClick={() => setStep(1)}
                  className="text-red-600 text-xs hover:underline mt-1"
                >
                  Cambiar número
                </button>
              </div>

              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Ingresa tu cupón (Ej: MAKI-001)"
                className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:border-red-600"
              />

              <button
                onClick={handleCouponSubmit}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mb-3"
              >
                Aplicar Cupón
              </button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-400 py-2 hover:text-white transition text-sm"
              >
                Continuar sin cupón
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}