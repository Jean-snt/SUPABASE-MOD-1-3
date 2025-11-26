// src/contexts/AuthContext.tsx (CORREGIDO)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService'; // <--- IMPORTACIÓN CRÍTICA
import type { User as AppUser } from '../types/database.types'; // Asume que AppUser es el tipo de la tabla 'users'

// Definición de tipos
interface AuthContextType {
  user: AppUser | null; // Usamos AppUser (de la tabla 'users')
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  // Agregamos funciones para ser utilizadas por los componentes (Login.tsx)
  login: (email: string, password: string) => Promise<{ user: AppUser; token: string }>;
  logout: () => Promise<void>;
}

// Inicializar el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Funciones del Contexto ---

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Usar el servicio para autenticar e inmediatamente obtener los datos de la tabla 'users'
      const result = await authService.login(email, password);
      
      // La suscripción a authStateChange debería actualizar el estado
      // pero actualizamos aquí para que el Login.tsx pueda reaccionar inmediatamente.
      // NOTA: Esto no es lo ideal si AuthContext no maneja el login, pero funciona para exponerlo.
      // La mejor práctica es que Login.tsx use el servicio directamente y AuthContext solo escuche.

      // Sin embargo, si usamos el contexto para proveer la función de login,
      // la responsabilidad de actualizar el estado recae en él.
      // El cambio real de sesión lo hará el listener de Supabase, pero 
      // actualizamos el estado del AppUser aquí
      
      // Dado que el servicio ya obtuvo el AppUser, lo usamos.
      setUser(result.user); 
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    // El listener de onAuthStateChange se encargará de poner el user y session en null
  };

  // --- Efecto de Inicialización y Suscripción ---

  useEffect(() => {
    // Función central para actualizar el estado del usuario completo (AppUser)
    const updateAuthState = async (supabaseSession: Session | null) => {
      setSession(supabaseSession);
      
      if (supabaseSession) {
        // Intenta obtener el AppUser (datos de la tabla 'users')
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // 1. Obtener la sesión inicial
    const getInitialSession = async () => {
      setLoading(true);
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      await updateAuthState(initialSession);
    };

    getInitialSession();

    // 2. Suscribirse a los cambios de estado de autenticación (login, logout, refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // El listener maneja todos los eventos, incluyendo el inicio de sesión
        // y el cierre de sesión, manteniendo el estado sincronizado.
        updateAuthState(session);
      }
    );

    // Limpiar la suscripción al desmontar el componente
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []); // Solo se ejecuta al montar/desmontar

  const isAuthenticated = !!user; // Autenticado si tenemos el AppUser

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated, 
      loading, 
      login: handleLogin, // <--- EXPONER FUNCIONES
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};