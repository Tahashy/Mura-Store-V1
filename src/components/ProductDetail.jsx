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
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm p-0 md:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-black border-t-2 md:border-2 border-red-600 md:rounded-2xl w-full md:max-w-5xl h-full md:h-auto max-h-screen md:max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LAYOUT MÓVIL Y DESKTOP */}
        <div className="flex flex-col md:grid md:grid-cols-2 h-full md:h-auto">
          
          {/* IMAGEN - Ocupa más espacio en móvil */}
          <div className="relative h-[50vh] md:h-[600px] bg-gray-800 flex-shrink-0">
            <img 
              src={product.image || null} 
              alt={product.name}
              className="w-full h-full object-contain md:object-cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Badge de stock bajo */}
            {product.stock && product.stock < 10 && (
              <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                ⚠️ Solo {product.stock}
              </div>
            )}
          </div>

          {/* DETALLES - Scrolleable en móvil */}
          <div className="p-5 md:p-6 overflow-y-auto flex-1">
            {/* Nombre y categoría */}
            <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">{product.category}</span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 mt-1">{product.name}</h2>
            
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
            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-5">
              S/ {product.price.toFixed(2)}
            </div>

            {/* COLOR */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <h3 className="text-white font-semibold mb-2 text-sm">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
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
              <div className="mb-5">
                <h3 className="text-white font-semibold mb-2 text-sm">Talla</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 font-semibold transition text-sm ${
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
            <div className="mb-5">
              <h3 className="text-white font-semibold mb-2 text-sm">Cantidad</h3>
              <div className="flex items-center gap-4">
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
            <div className="mb-5">
              <h3 className="text-white font-semibold mb-2 text-sm">Descripción</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>

            {/* BOTÓN AGREGAR - Sticky en móvil */}
            <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 pt-3 pb-1 -mx-5 px-5 md:static md:bg-none md:p-0 md:m-0">
              <button
                onClick={handleAddToCart}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition text-base shadow-lg"
              >
                Añadir al Carrito - S/ {(product.price * quantity).toFixed(2)}
              </button>

              {/* Stock warning */}
              {product.stock && product.stock < 10 && (
                <p className="text-yellow-500 text-xs mt-2 text-center">
                  ⚠️ ¡Solo quedan {product.stock} unidades!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}