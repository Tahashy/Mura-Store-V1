import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generar código formato WELCOME-XXXXXX
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'WELCOME-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Crear cupón
  const createCoupon = async (discount) => {
    try {
      const code = generateCode();
      const { data, error } = await supabase
        .from('coupons')
        .insert([{ code, discount }])
        .select()
        .single();

      if (error) throw error;
      await fetchCoupons();
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Validar cupón
  const validateCoupon = async (code) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !data) {
        return { success: false, message: 'Cupón inválido' };
      }

      if (data.is_used) {
        return { success: false, message: 'Este cupón ya fue usado' };
      }

      return { success: true, coupon: data };
    } catch (error) {
      return { success: false, message: 'Error al validar' };
    }
  };

  // Marcar como usado
  const markAsUsed = async (code) => {
    try {
      await supabase
        .from('coupons')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('code', code.toUpperCase());
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // Eliminar cupón
  const deleteCoupon = async (id) => {
    try {
      await supabase.from('coupons').delete().eq('id', id);
      await fetchCoupons();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    createCoupon,
    validateCoupon,
    markAsUsed,
    deleteCoupon,
    refreshCoupons: fetchCoupons
  };
};