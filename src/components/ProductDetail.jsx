import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Star } from 'lucide-react';

export default function ProductDetail({ product, onClose, onAddToCart, onIncrementViews }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.[0] || '');
      
      // Incrementar vistas cuando se abre el detalle
      if (onIncrementViews) {
        onIncrementViews(product.id);
      }
    }
  }, [product, onIncrementViews]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl max-w-4xl w-full overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          {/* IMAGEN */}
          <div className="relative h-96 md:h-auto bg-gray-800">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-70 p-2 rounded-full hover:bg-opacity-90 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Badge de stock bajo */}
            {product.stock && product.stock < 10 && (
              <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⚠️ Solo {product.stock} disponibles
              </div>
            )}
          </div>

          {/* DETALLES */}
          <div className="p-6 flex flex-col">
            {/* Nombre y categoría */}
            <div className="mb-2">
              <span className="text-red-600 text-sm font-semibold uppercase">{product.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-gray-400 text-sm">({product.views || 0} vistas)</span>
            </div>

            {/* Precio */}
            <div className="text-3xl font-bold text-red-600 mb-6">
              S/ {product.price.toFixed(2)}
            </div>

            {/* COLOR */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedColor === color
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-red-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TALLA */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">Talla</h3>
                  <button className="text-red-600 text-sm hover:underline">Guía de tallas</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-12 px-3 rounded-lg border-2 font-semibold transition ${
                        selectedSize === size
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-red-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CANTIDAD */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Cantidad</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                  disabled={quantity >= (product.stock || 999)}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-6 flex-1">
              <h3 className="text-white font-semibold mb-2">Descripción</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>

            {/* BOTÓN AGREGAR */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition text-lg"
            >
              Añadir al Carrito - S/ {(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}