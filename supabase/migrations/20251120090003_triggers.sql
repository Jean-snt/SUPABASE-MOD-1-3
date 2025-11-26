-- =====================================================
-- MIGRACION: Triggers y Eventos
-- Fecha: 2024-11-20
-- Descripcion: Triggers automaticos para el sistema POS
-- =====================================================

-- =====================================================
-- TRIGGER: update_users_updated_at
-- Descripcion: Actualiza updated_at en users
-- =====================================================
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: update_products_updated_at
-- Descripcion: Actualiza updated_at en products
-- =====================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCION: validate_sale_detail_subtotal
-- Descripcion: Valida que el subtotal sea correcto
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_sale_detail_subtotal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subtotal != (NEW.quantity * NEW.unit_price) THEN
        RAISE EXCEPTION 'Subtotal incorrecto: % != % * %', 
            NEW.subtotal, NEW.quantity, NEW.unit_price;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: check_sale_detail_subtotal
-- Descripcion: Valida subtotal antes de insertar
-- =====================================================
DROP TRIGGER IF EXISTS check_sale_detail_subtotal ON public.sales_detail;
CREATE TRIGGER check_sale_detail_subtotal
    BEFORE INSERT OR UPDATE ON public.sales_detail
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_sale_detail_subtotal();

-- =====================================================
-- FUNCION: log_cash_movement
-- Descripcion: Registra movimientos de caja en log
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_cash_movement()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Cash movement: type=%, amount=%, user=%', 
        NEW.movement_type, NEW.amount, NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: log_cash_movements_insert
-- Descripcion: Log de movimientos de caja
-- =====================================================
DROP TRIGGER IF EXISTS log_cash_movements_insert ON public.cash_movements;
CREATE TRIGGER log_cash_movements_insert
    AFTER INSERT ON public.cash_movements
    FOR EACH ROW
    EXECUTE FUNCTION public.log_cash_movement();

-- =====================================================
-- FUNCION: prevent_negative_stock
-- Descripcion: Previene stock negativo en productos
-- =====================================================
CREATE OR REPLACE FUNCTION public.prevent_negative_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Stock cannot be negative for product %', NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: check_product_stock
-- Descripcion: Valida stock antes de actualizar
-- =====================================================
DROP TRIGGER IF EXISTS check_product_stock ON public.products;
CREATE TRIGGER check_product_stock
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    WHEN (NEW.stock IS DISTINCT FROM OLD.stock)
    EXECUTE FUNCTION public.prevent_negative_stock();

-- =====================================================
-- FUNCION: update_sale_header_total
-- Descripcion: Actualiza el total de la venta cuando cambian los detalles
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_sale_header_total()
RETURNS TRIGGER AS $$
DECLARE
    new_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(subtotal), 0) INTO new_total
    FROM public.sales_detail
    WHERE sale_header_id = COALESCE(NEW.sale_header_id, OLD.sale_header_id);
    
    UPDATE public.sales_header
    SET total = new_total
    WHERE id = COALESCE(NEW.sale_header_id, OLD.sale_header_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: sync_sale_header_total
-- Descripcion: Sincroniza total de venta con detalles
-- =====================================================
DROP TRIGGER IF EXISTS sync_sale_header_total ON public.sales_detail;
CREATE TRIGGER sync_sale_header_total
    AFTER INSERT OR UPDATE OR DELETE ON public.sales_detail
    FOR EACH ROW
    EXECUTE FUNCTION public.update_sale_header_total();

-- =====================================================
-- FUNCION: validate_user_exists
-- Descripcion: Valida que el usuario exista en users
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_user_exists()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users WHERE auth_user_id = NEW.user_id
    ) THEN
        RAISE EXCEPTION 'User % does not exist in users table', NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: check_user_exists_sales
-- Descripcion: Valida usuario antes de insertar venta
-- =====================================================
DROP TRIGGER IF EXISTS check_user_exists_sales ON public.sales_header;
CREATE TRIGGER check_user_exists_sales
    BEFORE INSERT ON public.sales_header
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_exists();

-- =====================================================
-- TRIGGER: check_user_exists_cash
-- Descripcion: Valida usuario antes de insertar movimiento
-- =====================================================
DROP TRIGGER IF EXISTS check_user_exists_cash ON public.cash_movements;
CREATE TRIGGER check_user_exists_cash
    BEFORE INSERT ON public.cash_movements
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_exists();

-- =====================================================
-- COMENTARIOS DE TRIGGERS
-- =====================================================
COMMENT ON TRIGGER update_users_updated_at ON public.users IS 'Actualiza updated_at automaticamente';
COMMENT ON TRIGGER update_products_updated_at ON public.products IS 'Actualiza updated_at automaticamente';
COMMENT ON TRIGGER check_sale_detail_subtotal ON public.sales_detail IS 'Valida que subtotal = quantity * unit_price';
COMMENT ON TRIGGER log_cash_movements_insert ON public.cash_movements IS 'Registra movimientos de caja en log';
COMMENT ON TRIGGER check_product_stock ON public.products IS 'Previene stock negativo';
COMMENT ON TRIGGER sync_sale_header_total ON public.sales_detail IS 'Sincroniza total de venta';
COMMENT ON TRIGGER check_user_exists_sales ON public.sales_header IS 'Valida que el usuario exista';
COMMENT ON TRIGGER check_user_exists_cash ON public.cash_movements IS 'Valida que el usuario exista';
