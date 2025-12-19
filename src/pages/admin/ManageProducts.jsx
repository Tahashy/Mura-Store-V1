import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import { supabase } from '../../supabaseClient';


export default function ManageProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    colors: '',
    sizes: '',
    stock: ''
  });

  // Estados para Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  //Estados para confirmar eliminación
  const [confirmModal, setConfirmModal] = useState({
  show: false,
  productId: null,
  productName: ''
});


  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description || '',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      stock: product.stock || 0
    });
  };

  const handleSave = async (id) => {
    const updates = {
      ...formData,
      price: parseFloat(formData.price),
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      stock: parseInt(formData.stock) || 0
    };

    const result = await updateProduct(id, updates);
    if (result.success) {
      setEditingId(null);
      showToast('✅ Producto actualizado correctamente', 'success');
    } else {
      showToast('❌ Error al actualizar producto', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    setConfirmModal({ show: true, productId: id, productName: name });
  };

  const confirmDelete = async () => {
  const { productId, productName } = confirmModal;

  const result = await deleteProduct(productId);

  if (result.success) {
    showToast(`🗑️ "${productName}" eliminado correctamente`, 'success');
  } else {
    showToast('❌ Error al eliminar producto', 'error');
  }

  setConfirmModal({ show: false, productId: null, productName: '' });
};


  const handleAdd = async () => {
    if (!formData.name || !formData.price) {
      showToast('⚠️ Completa al menos el nombre y precio', 'warning');
      return;
    }

    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      stock: parseInt(formData.stock) || 0
    };

    const result = await addProduct(newProduct);
    if (result.success) {
      setFormData({ name: '', price: '', image: '', category: '', description: '', colors: '', sizes: '', stock: '' });
      setShowAddForm(false);
      showToast('✅ Producto agregado correctamente', 'success');
    } else {
      showToast('❌ Error al agregar producto', 'error');
    }
  };

const handleImageUpload = async (e, productId = null) => {
  const file = e.target.files[0];
  if (!file) return;

  showToast('📤 Subiendo imagen...', 'info');

  try {
    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    console.log('URL generada:', publicUrl);

    if (productId) {
      // Actualizar en la BD
      await updateProduct(productId, { image: publicUrl });
      
      // 🔥 ACTUALIZAR TAMBIÉN EL ESTADO LOCAL
      setFormData({ ...formData, image: publicUrl });
      
      showToast('✅ Imagen actualizada', 'success');
    } else {
      setFormData({ ...formData, image: publicUrl });
      showToast('✅ Imagen cargada', 'success');
    }
  } catch (error) {
    console.error('Error completo:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
};

  if (loading) {
    return <div className="text-white text-center py-12">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">Administra tu catálogo de productos</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Agregar Nuevo Producto</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Precio"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Colores (separados por coma)"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tallas (separados por coma)"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
                rows="3"
              />
            </div>
            <input
              type="text"
              placeholder="URL de imagen"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:border-red-600 focus:outline-none"
            />
            <div>
              <label className="block text-sm text-gray-400 mb-2">O subir imagen</label>
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-red-600 hover:bg-gray-700 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-300">Seleccionar archivo</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Agregar Producto
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 hover:border-red-600 transition"
          >
            {editingId === product.id ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <img src={formData.image} alt="" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <label className="cursor-pointer block mb-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded hover:border-red-600 hover:bg-gray-700 transition">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs text-gray-300">Cambiar imagen</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={(e) => handleImageUpload(e, product.id)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-2 py-1 bg-black border border-gray-700 text-white rounded text-sm"
                      placeholder="URL imagen"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Stock"
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Colores"
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="Tallas"
                    className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción"
                    className="col-span-2 px-3 py-2 bg-black border border-gray-700 text-white rounded"
                    rows="2"
                  />
                  <div className="col-span-2 flex gap-2">
                    <button
                      onClick={() => handleSave(product.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-white font-bold">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.category} • S/ {product.price.toFixed(2)}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>Stock: {product.stock}</span>
                    <span>Vistas: {product.views}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ConfirmModal
  show={confirmModal.show}
  title="Eliminar producto"
  message={`¿Seguro que deseas eliminar "${confirmModal.productName}"? Esta acción no se puede deshacer.`}
  onCancel={() => setConfirmModal({ show: false, productId: null, productName: '' })}
  onConfirm={confirmDelete}
/>

    </div>
  );
}