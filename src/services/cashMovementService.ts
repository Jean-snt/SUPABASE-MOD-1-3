import { supabase } from '../lib/supabaseClient';
import type { CashMovement } from '../types/database.types';

/**
 * Servicio de gestión de movimientos de caja
 */
export const cashMovementService = {
  /**
   * Registrar apertura de caja
   */
  async registerOpening(userId: string, amount: number, note?: string): Promise<CashMovement> {
    try {
      const movement: Omit<CashMovement, 'id' | 'created_at'> = {
        user_id: userId,
        movement_type: 'apertura',
        amount,
        note: note || 'Apertura de caja',
      };

      const { data, error } = await supabase
        .from('cash_movements')
        .insert(movement)
        .select()
        .single();

      if (error) {
        throw new Error('Error al registrar apertura de caja: ' + error.message);
      }

      return data as CashMovement;
    } catch (error) {
      console.error('Error en registerOpening:', error);
      throw error;
    }
  },

  /**
   * Registrar cierre de caja
   */
  async registerClosing(userId: string, amount: number, note?: string): Promise<CashMovement> {
    try {
      const movement: Omit<CashMovement, 'id' | 'created_at'> = {
        user_id: userId,
        movement_type: 'cierre',
        amount,
        note: note || 'Cierre de caja',
      };

      const { data, error } = await supabase
        .from('cash_movements')
        .insert(movement)
        .select()
        .single();

      if (error) {
        throw new Error('Error al registrar cierre de caja: ' + error.message);
      }

      return data as CashMovement;
    } catch (error) {
      console.error('Error en registerClosing:', error);
      throw error;
    }
  },

  /**
   * Obtener movimientos de caja del usuario
   */
  async getMovementsByUser(userId: string): Promise<CashMovement[]> {
    try {
      const { data, error } = await supabase
        .from('cash_movements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Error al obtener movimientos de caja: ' + error.message);
      }

      return data as CashMovement[];
    } catch (error) {
      console.error('Error en getMovementsByUser:', error);
      throw error;
    }
  },

  /**
   * Obtener el último movimiento de apertura del usuario
   */
  async getLastOpening(userId: string): Promise<CashMovement | null> {
    try {
      const { data, error } = await supabase
        .from('cash_movements')
        .select('*')
        .eq('user_id', userId)
        .eq('movement_type', 'apertura')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw new Error('Error al obtener última apertura: ' + error.message);
      }

      return data as CashMovement | null;
    } catch (error) {
      console.error('Error en getLastOpening:', error);
      return null;
    }
  },
};
