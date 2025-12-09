import React from 'react';
import { ShoppingCart, Tag, Search } from 'lucide-react';
import logo from '../assets/logo.png'; // Cambiado a logo.png

export default function Header({
  hasDiscount,
  welcomeDiscount,
  cartCount,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-black border-b border-red-600 shadow-lg sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y título - alineados horizontalmente */}
          <div className="flex items-center gap-0.0">
            {/* Logo PNG */}
            <div className="flex-shrink-0 mt-4">
              <img 
                src={logo} 
                alt="Logo de MuraStore" 
                className="h-35 w-35 object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Título y subtítulo */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-red-500 leading-tight">MuraStore</h1>
              <p className="text-sm text-gray-400 mt-0.5">Tu tienda de mercadería Favorita</p>
            </div>
          </div>

          {/* Elementos del lado derecho */}
          <div className="flex items-center gap-4">
            {hasDiscount && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {welcomeDiscount}% OFF
              </div>
            )}

            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-red-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-black border-2 border-gray-800 text-white rounded-lg focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}