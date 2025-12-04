import React from 'react';

export default function ProductCard({ product, hasDiscount, welcomeDiscount, addToCart }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-red-600 transition-all cursor-pointer">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 capitalize">{product.category}</p>
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <div>
                <span className="text-gray-500 line-through text-sm">S/{product.price.toFixed(2)}</span>
                <span className="text-red-600 font-bold text-xl ml-2">
                  S/{(product.price * (1 - welcomeDiscount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-red-600 font-bold text-xl">S/{product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
          >
            Agregar
          </button>
        </div>
        
        {/* Indicadores */}
        <div className="flex gap-2 mt-3">
          {product.stock && product.stock < 10 && (
            <span className="text-xs bg-yellow-900 bg-opacity-30 text-yellow-500 px-2 py-1 rounded">
              Stock bajo
            </span>
          )}
          {product.colors && product.colors.length > 0 && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
              {product.colors.length} colores
            </span>
          )}
        </div>
      </div>
    </div>
  );
}