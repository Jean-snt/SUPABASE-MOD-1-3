import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/database.types';

/**
 * Servicio de gestión de inventario
 */
export const inventoryService = {
  /**
   * Obtener todos los productos
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error('Error al cargar productos: ' + error.message);
      }

      return data as Product[];
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) {
        throw new Error('Error al cargar productos por categoría: ' + error.message);
      }

      return data as Product[];
    } catch (error) {
      console.error('Error en getProductsByCategory:', error);
      throw error;
    }
  },

  /**
   * Buscar productos por nombre
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true });

      if (error) {
        throw new Error('Error al buscar productos: ' + error.message);
      }

      return data as Product[];
    } catch (error) {
      console.error('Error en searchProducts:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   */
  async getProductById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Error al obtener producto: ' + error.message);
      }

      return data as Product;
    } catch (error) {
      console.error('Error en getProductById:', error);
      return null;
    }
  },
};
