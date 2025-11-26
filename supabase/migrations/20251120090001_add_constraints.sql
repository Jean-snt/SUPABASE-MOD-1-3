-- =====================================================
-- MIGRACION: Indices y Restricciones
-- Fecha: 2024-11-20
-- Descripcion: Indices para optimizar consultas y restricciones
-- =====================================================

-- =====================================================
-- INDICES PARA TABLA: users
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =====================================================
-- INDICES PARA TABLA: categories
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);

-- =====================================================
-- INDICES PARA TABLA: products
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);

-- =====================================================
-- INDICES PARA TABLA: sales_header
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sales_header_user_id ON public.sales_header(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_header_created_at ON public.sales_header(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_header_status ON public.sales_header(status);
CREATE INDEX IF NOT EXISTS idx_sales_header_payment_method ON public.sales_header(payment_method);

-- =====================================================
-- INDICES PARA TABLA: sales_detail
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sales_detail_sale_header_id ON public.sales_detail(sale_header_id);
CREATE INDEX IF NOT EXISTS idx_sales_detail_product_id ON public.sales_detail(product_id);

-- =====================================================
-- INDICES PARA TABLA: cash_movements
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cash_movements_user_id ON public.cash_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_movements_created_at ON public.cash_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_movements_type ON public.cash_movements(movement_type);

-- =====================================================
-- POLITICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITICAS: users
-- =====================================================
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- =====================================================
-- POLITICAS: categories (lectura publica)
-- =====================================================
CREATE POLICY "Categories are viewable by authenticated users"
    ON public.categories FOR SELECT
    TO authenticated
    USING (true);

-- =====================================================
-- POLITICAS: products (lectura publica)
-- =====================================================
CREATE POLICY "Products are viewable by authenticated users"
    ON public.products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITICAS: sales_header
-- =====================================================
CREATE POLICY "Users can view their own sales"
    ON public.sales_header FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales"
    ON public.sales_header FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLITICAS: sales_detail
-- =====================================================
CREATE POLICY "Users can view details of their own sales"
    ON public.sales_detail FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.sales_header
            WHERE id = sale_header_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert details for their own sales"
    ON public.sales_detail FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sales_header
            WHERE id = sale_header_id
            AND user_id = auth.uid()
        )
    );

-- =====================================================
-- POLITICAS: cash_movements
-- =====================================================
CREATE POLICY "Users can view their own cash movements"
    ON public.cash_movements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cash movements"
    ON public.cash_movements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- GRANTS (Permisos)
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
