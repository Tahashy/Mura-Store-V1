import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function ManageCategories() {
  const { categories, loading, addCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      alert('⚠️ Ingresa un nombre para la categoría');
      return;
    }

    const result = await addCategory(newCategoryName);

    if (result.success) {
      setNewCategoryName('');
      alert('✅ Categoría agregada');
    } else {
      alert('❌ Error al agregar categoría');
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`¿Eliminar categoría "${name}"?`)) {
      const result = await deleteCategory(id);

      if (result.success) {
        alert('✅ Categoría eliminada');
      } else {
        alert('❌ Error al eliminar');
      }
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Cargando categorías...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
        <p className="text-gray-400">Organiza tus productos por categorías</p>
      </div>

      {/* Formulario agregar */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Agregar Nueva Categoría</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 px-4 py-3 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-red-600 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 bg-opacity-20 rounded-lg">
                  <Tag className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-white font-bold capitalize text-lg">{category.name}</h3>
                  <p className="text-gray-500 text-sm">ID: {category.id}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No hay categorías creadas</p>
        </div>
      )}

    </div>
  );
}
