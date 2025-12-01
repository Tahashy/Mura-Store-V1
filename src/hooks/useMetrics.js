import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalViews: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      // Total de productos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Total de categorías
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Productos con stock bajo
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 10);

      // Total de vistas
      const { data: viewsData } = await supabase
        .from('products')
        .select('views');
      
      const totalViews = viewsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

      // Últimos productos
      const { data: recentData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setMetrics({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        lowStockCount: lowStockCount || 0,
        totalViews: totalViews
      });

      setRecentProducts(recentData || []);
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    recentProducts,
    loading,
    refreshMetrics: fetchMetrics
  };
};