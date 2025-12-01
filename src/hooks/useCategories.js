import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: name.toLowerCase() }]);

      if (error) throw error;

      // Log
      await supabase.from('admin_logs').insert([{
        action: 'Categoría creada',
        details: `Se creó la categoría: ${name}`
      }]);

      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Error agregando categoría:', error);
      return { success: false, error };
    }
  };

  const deleteCategory = async (id, name) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log
      await supabase.from('admin_logs').insert([{
        action: 'Categoría eliminada',
        details: `Se eliminó la categoría: ${name}`
      }]);

      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    deleteCategory,
    refreshCategories: fetchCategories
  };
};