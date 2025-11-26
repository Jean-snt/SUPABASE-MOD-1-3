-- =====================================================
-- MIGRACION: Funciones PL/pgSQL
-- Fecha: 2024-11-20
-- Descripcion: Funciones auxiliares para el sistema POS
-- =====================================================

-- =====================================================
-- FUNCION: update_updated_at_column
-- Descripcion: Actualiza automaticamente la columna updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: get_user_role
-- Descripcion: Obtiene el rol de un usuario por su auth_user_id
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.users
    WHERE auth_user_id = user_uuid;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCION: calculate_sale_total
-- Descripcion: Calcula el total de una venta sumando sus detalles
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_sale_total(sale_id BIGINT)
RETURNS NUMERIC AS $$
DECLARE
    total_amount NUMERIC;
BEGIN
    SELECT COALESCE(SUM(subtotal), 0) INTO total_amount
    FROM public.sales_detail
    WHERE sale_header_id = sale_id;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: get_product_stock
-- Descripcion: Obtiene el stock actual de un producto
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_product_stock(product_id BIGINT)
RETURNS NUMERIC AS $$
DECLARE
    current_stock NUMERIC;
BEGIN
    SELECT stock INTO current_stock
    FROM public.products
    WHERE id = product_id;
    
    RETURN COALESCE(current_stock, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: update_product_stock
-- Descripcion: Actualiza el stock de un producto
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_product_stock(
    product_id BIGINT,
    quantity_change NUMERIC
)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock NUMERIC;
    new_stock NUMERIC;
BEGIN
    SELECT stock INTO current_stock
    FROM public.products
    WHERE id = product_id;
    
    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    new_stock := current_stock + quantity_change;
    
    IF new_stock < 0 THEN
        RAISE EXCEPTION 'Insufficient stock';
    END IF;
    
    UPDATE public.products
    SET stock = new_stock,
        updated_at = NOW()
    WHERE id = product_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCION: get_daily_sales_summary
-- Descripcion: Obtiene resumen de ventas del dia
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_daily_sales_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_sales BIGINT,
    total_amount NUMERIC,
    payment_method TEXT,
    method_count BIGINT,
    method_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_sales,
        SUM(sh.total)::NUMERIC as total_amount,
        sh.payment_method,
        COUNT(*)::BIGINT as method_count,
        SUM(sh.total)::NUMERIC as method_total
    FROM public.sales_header sh
    WHERE DATE(sh.created_at) = target_date
    AND sh.status = 'completed'
    GROUP BY sh.payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCION: get_user_sales_count
-- Descripcion: Obtiene el numero de ventas de un usuario
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_sales_count(user_uuid UUID)
RETURNS BIGINT AS $$
DECLARE
    sales_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO sales_count
    FROM public.sales_header
    WHERE user_id = user_uuid
    AND status = 'completed';
    
    RETURN COALESCE(sales_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCION: get_low_stock_products
-- Descripcion: Obtiene productos con stock bajo
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_low_stock_products(threshold NUMERIC DEFAULT 10)
RETURNS TABLE (
    product_id BIGINT,
    product_name TEXT,
    current_stock NUMERIC,
    category_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.stock,
        c.name
    FROM public.products p
    LEFT JOIN public.categories c ON p.category_id = c.id
    WHERE p.stock <= threshold
    ORDER BY p.stock ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTARIOS DE FUNCIONES
-- =====================================================
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function para actualizar updated_at';
COMMENT ON FUNCTION public.get_user_role(UUID) IS 'Obtiene el rol de un usuario';
COMMENT ON FUNCTION public.calculate_sale_total(BIGINT) IS 'Calcula el total de una venta';
COMMENT ON FUNCTION public.get_product_stock(BIGINT) IS 'Obtiene el stock de un producto';
COMMENT ON FUNCTION public.update_product_stock(BIGINT, NUMERIC) IS 'Actualiza el stock de un producto';
COMMENT ON FUNCTION public.get_daily_sales_summary(DATE) IS 'Resumen de ventas diarias';
COMMENT ON FUNCTION public.get_user_sales_count(UUID) IS 'Cuenta las ventas de un usuario';
COMMENT ON FUNCTION public.get_low_stock_products(NUMERIC) IS 'Lista productos con stock bajo';
