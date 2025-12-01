import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useConfig = () => {
  const [config, setConfig] = useState({
    whatsapp_number: '51999999999',
    welcome_discount: 20
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) setConfig(data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates) => {
    try {
      const { error } = await supabase
        .from('config')
        .update(updates)
        .eq('id', 1);

      if (error) throw error;

      // Log
      await supabase.from('admin_logs').insert([{
        action: 'Configuración actualizada',
        details: `Se actualizó la configuración`
      }]);

      await fetchConfig();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    refreshConfig: fetchConfig
  };
};