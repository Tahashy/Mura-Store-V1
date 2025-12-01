import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto
  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;
      
      // Log de actividad
      await supabase.from('admin_logs').insert([{
        action: 'Producto creado',
        details: `Se creó el producto: ${product.name}`
      }]);

      await fetchProducts();
      return { success: true, data };
    } catch (error) {
      console.error('Error agregando producto:', error);
      return { success: false, error };
    }
  };

  // Actualizar producto
  const updateProduct = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Log de actividad
      await supabase.from('admin_logs').insert([{
        action: 'Producto actualizado',
        details: `Se actualizó el producto ID: ${id}`
      }]);

      await fetchProducts();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return { success: false, error };
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log de actividad
      await supabase.from('admin_logs').insert([{
        action: 'Producto eliminado',
        details: `Se eliminó el producto ID: ${id}`
      }]);

      await fetchProducts();
      return { success: true };
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return { success: false, error };
    }
  };

  // Incrementar vistas
  const incrementViews = async (id) => {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('views')
        .eq('id', id)
        .single();

      const newViews = (product?.views || 0) + 1;

      await supabase
        .from('products')
        .update({ views: newViews })
        .eq('id', id);

      return { success: true };
    } catch (error) {
      console.error('Error incrementando vistas:', error);
      return { success: false, error };
    }
  };

  // Obtener productos con stock bajo
  const getLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10)
        .order('stock', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo productos con stock bajo:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
    getLowStockProducts,
    refreshProducts: fetchProducts
  };
};