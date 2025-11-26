-- Este script se ejecuta al final de 'supabase db reset'.
-- Garantiza que la base de datos se inicialice con datos de prueba consistentes.

BEGIN;

-- TRUNCATE/DELETE para asegurar un estado limpio en cada reset
-- Usar DELETE en lugar de TRUNCATE es más seguro si hay RLS o triggers.
DELETE FROM public.sales_detail;
DELETE FROM public.sales_header;
DELETE FROM public.cash_movements;
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.users;


-- 1. SEED: CATEGORIES (10 CATEGORÍAS)
INSERT INTO public.categories (name) VALUES
('Frutas Frescas'),
('Verduras de Hoja'),
('Tubérculos'),
('Cítricos'),
('Hortalizas'),
('Frutos Secos'),
('Granos y Legumbres'),
('Lácteos y Huevos'),
('Panadería'),
('Bebidas');


-- 2. SEED: USERS (5 USUARIOS - LIMPIEZA DE SINTAXIS)
-- NOTA: El campo correcto es 'auth_user_id' (no 'auth_id')
-- IMPORTANTE: Estos UUIDs son de ejemplo. En produccion, deben coincidir con auth.users
INSERT INTO public.users (auth_user_id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@pos.com', 'Administrador POS', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'cajero1@pos.com', 'Cajero Lopez', 'cashier'),
    ('00000000-0000-0000-0000-000000000003', 'cajero2@pos.com', 'Cajera Diaz', 'cashier'),
    ('00000000-0000-0000-0000-000000000004', 'cajero3@pos.com', 'Cajero Ramirez', 'cashier'),
    ('00000000-0000-0000-0000-000000000005', 'cajero4@pos.com', 'Cajera Sanchez', 'cashier');


-- Bloque para obtener los IDs de categorías (CORRECCIÓN BIGINT)
DO $$
DECLARE
    -- Declarar las variables como BIGINT para IDs secuenciales
    v_frutas_id BIGINT;
    v_verduras_id BIGINT;
    v_citricos_id BIGINT;
    v_hortalizas_id BIGINT;
    v_tuberculos_id BIGINT;
    v_frutos_secos_id BIGINT;
    v_lacteos_id BIGINT;

BEGIN
    -- Obtener IDs
    SELECT id INTO v_frutas_id FROM public.categories WHERE name = 'Frutas Frescas';
    SELECT id INTO v_verduras_id FROM public.categories WHERE name = 'Verduras de Hoja';
    SELECT id INTO v_citricos_id FROM public.categories WHERE name = 'Cítricos';
    SELECT id INTO v_hortalizas_id FROM public.categories WHERE name = 'Hortalizas';
    SELECT id INTO v_tuberculos_id FROM public.categories WHERE name = 'Tubérculos';
    SELECT id INTO v_frutos_secos_id FROM public.categories WHERE name = 'Frutos Secos';
    SELECT id INTO v_lacteos_id FROM public.categories WHERE name = 'Lácteos y Huevos';

    --
    -- 3. SEED: PRODUCTS (25 PRODUCTOS REALES)
    -- Se usan las variables BIGINT obtenidas para category_id.
    --
    INSERT INTO public.products (name, price, stock, image, category_id) VALUES
    ('Manzana Roja', 2.50, 150.000, 'url_placeholder/manzana.jpg', v_frutas_id),
    ('Banana', 1.80, 200.000, 'url_placeholder/banana.jpg', v_frutas_id),
    ('Naranja', 1.20, 300.000, 'url_placeholder/naranja.jpg', v_citricos_id),
    ('Limón', 0.80, 500.000, 'url_placeholder/limon.jpg', v_citricos_id),
    ('Lechuga Romana', 3.50, 80.000, 'url_placeholder/lechuga.jpg', v_verduras_id),
    ('Espinaca Bolsa', 4.90, 60.000, 'url_placeholder/espinaca.jpg', v_verduras_id),
    ('Tomate Perita', 2.90, 120.000, 'url_placeholder/tomate.jpg', v_hortalizas_id),
    ('Pimiento Rojo', 5.50, 90.000, 'url_placeholder/pimiento.jpg', v_hortalizas_id),
    ('Papa Negra', 1.00, 500.000, 'url_placeholder/papa.jpg', v_tuberculos_id),
    ('Cebolla', 1.50, 400.000, 'url_placeholder/cebolla.jpg', v_tuberculos_id),
    ('Ajo (Cabeza)', 1.50, 200.000, 'url_placeholder/ajo.jpg', v_hortalizas_id),
    ('Palta Hass', 8.00, 50.000, 'url_placeholder/palta.jpg', v_frutas_id),
    ('Melón Tuna', 7.50, 40.000, 'url_placeholder/melon.jpg', v_frutas_id),
    ('Uvas Verdes', 12.00, 70.000, 'url_placeholder/uvas.jpg', v_frutas_id),
    ('Zanahoria', 1.00, 250.000, 'url_placeholder/zanahoria.jpg', v_tuberculos_id),
    ('Remolacha', 2.00, 80.000, 'url_placeholder/remolacha.jpg', v_tuberculos_id),
    ('Huevos Docena', 15.00, 50.000, 'url_placeholder/huevos.jpg', v_lacteos_id),
    ('Leche Entera', 6.00, 100.000, 'url_placeholder/leche.jpg', v_lacteos_id),
    ('Pan Integral', 9.50, 45.000, 'url_placeholder/pan.jpg', (SELECT id FROM public.categories WHERE name = 'Panadería')),
    ('Agua Mineral 1L', 3.00, 150.000, 'url_placeholder/agua.jpg', (SELECT id FROM public.categories WHERE name = 'Bebidas')),
    ('Nueces Bolsa', 25.00, 30.000, 'url_placeholder/nueces.jpg', v_frutos_secos_id),
    ('Almendras 100g', 18.00, 40.000, 'url_placeholder/almendras.jpg', v_frutos_secos_id),
    ('Lentejas Kilo', 4.50, 90.000, 'url_placeholder/lentejas.jpg', (SELECT id FROM public.categories WHERE name = 'Granos y Legumbres')),
    ('Arroz Grano Fino', 5.00, 120.000, 'url_placeholder/arroz.jpg', (SELECT id FROM public.categories WHERE name = 'Granos y Legumbres')),
    ('Champiñones', 6.50, 55.000, 'url_placeholder/champinones.jpg', v_hortalizas_id);
END $$;

COMMIT;