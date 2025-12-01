import React from 'react';
import { Trash2, Gift } from 'lucide-react';

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  hasDiscount,
  welcomeDiscount,
  getTotalItems,
  currentMakiCoupon,
  onFinalizePurchase // 🔥 NUEVA PROP
}) {

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-white mb-4">Carrito</h2>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-black border border-gray-800 p-3 rounded-lg">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    ${hasDiscount ? (item.price * (1 - welcomeDiscount / 100)).toFixed(2) : item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 bg-gray-800 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    -
                  </button>
                  <span className="font-semibold text-sm text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 bg-gray-800 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Artículos:</span>
              <span className="font-semibold text-white">{getTotalItems()}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Descuento ({welcomeDiscount}%):</span>
                <span>
                  -${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * (welcomeDiscount / 100)).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total:</span>
              <span className="text-red-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* 🔥 BOTÓN CORREGIDO */}
          <button
            onClick={onFinalizePurchase}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition mt-4"
          >
            Finalizar Compra por WhatsApp
          </button>

          {/* 🔥 ALERTA CUANDO HAY 3+ PRODUCTOS */}
          {getTotalItems() >= 3 && !currentMakiCoupon && (
            <div className="mt-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-3 text-sm text-yellow-400">
              🎉 ¡Comprando 3+ artículos ganarás un cupón de makis!
            </div>
          )}
        </>
      )}

      {/* 🔥 CUPÓN DE MAKIS VISIBLE */}
      {currentMakiCoupon && (
        <div className="mt-6 bg-gradient-to-r from-red-900 to-red-800 border-2 border-red-600 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white">¡Premio desbloqueado! 🎁</h3>
          </div>
          <p className="text-sm text-gray-300 mb-2">Tu cupón de descuento en makis:</p>
          <p className="text-xl font-bold text-red-400 bg-black px-3 py-2 rounded text-center tracking-wider">
            {currentMakiCoupon}
          </p>
          <p className="text-xs text-gray-400 mt-2 text-center">
            💾 Este cupón se ha enviado a tu WhatsApp
          </p>
        </div>
      )}
    </div>
  );
}