// Tipos de la base de datos Supabase

export interface User {
  id: string;
  auth_user_id: string; // UUID del usuario en auth.users
  email: string;
  role: 'admin' | 'cashier';
  full_name?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category_id?: number;
  image: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface SalesHeader {
  id?: number;
  user_id: string;
  total : number;
  payment_method: 'efectivo' | 'yape' | 'plin' | 'tarjeta';
  status: 'completed' | 'pending' | 'cancelled';
  created_at?: string;
}

export interface SalesDetail {
  id?: number;
  sale_header_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
}

export interface CashMovement {
  id?: number;
  user_id: string;
  movement_type: 'apertura' | 'cierre' | 'ingreso' | 'egreso';
  amount: number;
  note?: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}
