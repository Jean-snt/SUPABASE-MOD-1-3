import { supabase } from '../lib/supabaseClient';
import type { User } from '../types/database.types';

/**
 * Servicio de autenticación con Supabase
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user || !authData.session) {
        throw new Error('No se pudo obtener la sesión del usuario');
      }

      // Obtener información adicional del usuario desde la tabla public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (userError) {
        throw new Error('Error al obtener datos del usuario: ' + userError.message);
      }

      return {
        user: userData as User,
        token: authData.session.access_token,
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Obtener el usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
      }

      return userData as User;
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return null;
    }
  },

  /**
   * Verificar si hay una sesión activa
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
};
