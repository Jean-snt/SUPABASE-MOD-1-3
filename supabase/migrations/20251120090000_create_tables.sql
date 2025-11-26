-- =====================================================
-- MIGRACION: Creacion de Tablas Base
-- Fecha: 2024-11-20
-- Descripcion: Esquema completo para sistema POS
-- =====================================================

-- Habilitar extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: users
-- Descripcion: Usuarios del sistema (vinculados a auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'cashier')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: categories
-- Descripcion: Categorias de productos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: products
-- Descripcion: Catalogo de productos
-- NOTA: NO incluye columna 'unit'
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    image TEXT,
    stock NUMERIC(10, 3) DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: sales_header
-- Descripcion: Cabecera de ventas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sales_header (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('efectivo', 'yape', 'plin', 'tarjeta')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: sales_detail
-- Descripcion: Detalle de ventas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sales_detail (
    id BIGSERIAL PRIMARY KEY,
    sale_header_id BIGINT NOT NULL REFERENCES public.sales_header(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 3) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: cash_movements
-- Descripcion: Movimientos de caja
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cash_movements (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('apertura', 'cierre', 'ingreso', 'egreso')),
    amount NUMERIC(10, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMENTARIOS DE TABLAS
-- =====================================================
COMMENT ON TABLE public.users IS 'Usuarios del sistema vinculados a auth.users';
COMMENT ON TABLE public.categories IS 'Categorias de productos';
COMMENT ON TABLE public.products IS 'Catalogo de productos sin columna unit';
COMMENT ON TABLE public.sales_header IS 'Cabecera de ventas';
COMMENT ON TABLE public.sales_detail IS 'Detalle de ventas';
COMMENT ON TABLE public.cash_movements IS 'Movimientos de caja';

-- =====================================================
-- COMENTARIOS DE COLUMNAS IMPORTANTES
-- =====================================================
COMMENT ON COLUMN public.users.auth_user_id IS 'UUID del usuario en auth.users';
COMMENT ON COLUMN public.sales_header.user_id IS 'UUID del usuario que realiza la venta';
COMMENT ON COLUMN public.cash_movements.user_id IS 'UUID del usuario que realiza el movimiento';
