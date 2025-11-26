-- =====================================================
-- SEED: Datos de Prueba
-- Fecha: 2024-11-20
-- Descripcion: Datos iniciales para el sistema POS
-- IMPORTANTE: NO incluye columna 'unit' en products
-- =====================================================

-- =====================================================
-- LIMPIAR DATOS EXISTENTES (OPCIONAL)
-- =====================================================
-- TRUNCATE TABLE public.cash_movements CASCADE;
-- TRUNCATE TABLE public.sales_detail CASCADE;
-- TRUNCATE TABLE public.sales_header CASCADE;
-- TRUNCATE TABLE public.products CASCADE;
-- TRUNCATE TABLE public.categories CASCADE;
-- TRUNCATE TABLE public.users CASCADE;

-- =====================================================
-- INSERTAR CATEGORIAS
-- =====================================================
INSERT INTO public.categories (name, description, color) VALUES
    ('Frutas', 'Frutas frescas', '#FADCD9'),
    ('Verduras', 'Verduras y hortalizas', '#C1E1C1'),
    ('Tuberculos', 'Tuberculos y raices', '#E6CCB2'),
    ('Frutales', 'Frutas de temporada', '#FFE5B4'),
    ('Hortalizas', 'Hortalizas verdes', '#98FB98'),
    ('Bulbos', 'Bulbos y cebollas', '#E0B0FF'),
    ('Legumbres', 'Legumbres secas', '#FFFACD'),
    ('Citricos', 'Frutas citricas', '#FFD700'),
    ('Tropicales', 'Frutas tropicales', '#FF7F50'),
    ('Hierbas', 'Hierbas aromaticas', '#ACE1AF')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- INSERTAR PRODUCTOS
-- NOTA: NO incluye columna 'unit'
-- =====================================================
DO $$
DECLARE
    cat_frutas BIGINT;
    cat_verduras BIGINT;
    cat_tuberculos BIGINT;
    cat_frutales BIGINT;
    cat_hortalizas BIGINT;
    cat_bulbos BIGINT;
    cat_citricos BIGINT;
    cat_tropicales BIGINT;
    cat_hierbas BIGINT;
BEGIN
    -- Obtener IDs de categorias
    SELECT id INTO cat_frutas FROM public.categories WHERE name = 'Frutas';
    SELECT id INTO cat_verduras FROM public.categories WHERE name = 'Verduras';
    SELECT id INTO cat_tuberculos FROM public.categories WHERE name = 'Tuberculos';
    SELECT id INTO cat_frutales FROM public.categories WHERE name = 'Frutales';
    SELECT id INTO cat_hortalizas FROM public.categories WHERE name = 'Hortalizas';
    SELECT id INTO cat_bulbos FROM public.categories WHERE name = 'Bulbos';
    SELECT id INTO cat_citricos FROM public.categories WHERE name = 'Citricos';
    SELECT id INTO cat_tropicales FROM public.categories WHERE name = 'Tropicales';
    SELECT id INTO cat_hierbas FROM public.categories WHERE name = 'Hierbas';

    -- Insertar productos (sin columna 'unit')
    INSERT INTO public.products (name, price, category_id, image, stock) VALUES
        -- Frutas
        ('Manzana Roja', 5.20, cat_frutas, 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80', 100.000),
        ('Pera Verde', 4.80, cat_frutas, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80', 80.000),
        ('Uva Roja', 6.50, cat_frutas, 'https://images.unsplash.com/photo-1599819177626-c0d3b3a5e8c1?auto=format&fit=crop&w=600&q=80', 50.000),
        
        -- Tropicales
        ('Platano Seda', 2.50, cat_tropicales, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80', 150.000),
        ('Pina Golden', 4.50, cat_tropicales, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80', 30.000),
        ('Palta Fuerte', 9.50, cat_tropicales, 'https://images.unsplash.com/photo-1596151782685-2214e70d280a?auto=format&fit=crop&w=600&q=80', 40.000),
        ('Mango Kent', 5.80, cat_tropicales, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', 60.000),
        
        -- Tuberculos
        ('Papa Amarilla', 3.80, cat_tuberculos, 'https://images.unsplash.com/photo-1633013649620-420897578669?auto=format&fit=crop&w=600&q=80', 200.000),
        ('Camote Morado', 2.80, cat_tuberculos, 'https://images.unsplash.com/photo-1596097635121-14b63b8a66cf?auto=format&fit=crop&w=600&q=80', 120.000),
        ('Yuca', 2.20, cat_tuberculos, 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=600&q=80', 100.000),
        
        -- Verduras
        ('Zanahoria', 1.90, cat_verduras, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', 150.000),
        ('Tomate', 3.50, cat_verduras, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', 100.000),
        ('Brocoli', 4.20, cat_verduras, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80', 50.000),
        ('Pimiento', 4.80, cat_verduras, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80', 70.000),
        
        -- Citricos
        ('Naranja Jugo', 3.00, cat_citricos, 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80', 120.000),
        ('Mandarina', 3.50, cat_citricos, 'https://images.unsplash.com/photo-1611105637889-281587d2c9b9?auto=format&fit=crop&w=600&q=80', 100.000),
        ('Limon', 4.50, cat_citricos, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 80.000),
        
        -- Bulbos
        ('Cebolla Roja', 2.20, cat_bulbos, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', 150.000),
        ('Ajo', 15.00, cat_bulbos, 'https://images.unsplash.com/photo-1588855933979-25d2997538eb?auto=format&fit=crop&w=600&q=80', 50.000),
        
        -- Hortalizas
        ('Lechuga', 2.00, cat_hortalizas, 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80', 60.000),
        ('Espinaca', 2.50, cat_hortalizas, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 40.000),
        ('Apio', 3.00, cat_hortalizas, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', 50.000),
        
        -- Frutales
        ('Fresa', 8.00, cat_frutales, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80', 30.000),
        ('Arandano', 12.00, cat_frutales, 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80', 20.000),
        
        -- Hierbas
        ('Perejil', 1.00, cat_hierbas, 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=600&q=80', 100.000),
        ('Cilantro', 1.00, cat_hierbas, 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80', 100.000)
    ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- NOTA: USUARIOS
-- =====================================================
-- Los usuarios deben crearse primero en auth.users
-- Luego insertar en public.users con el auth_user_id correspondiente
-- 
-- Ejemplo:
-- INSERT INTO public.users (auth_user_id, email, full_name, role) VALUES
--     ('uuid-from-auth-users', 'admin@yappita.com', 'Administrador', 'admin'),
--     ('uuid-from-auth-users', 'cajero@yappita.com', 'Cajero 01', 'cashier');

-- =====================================================
-- VERIFICACION DE DATOS
-- =====================================================
-- SELECT COUNT(*) as total_categorias FROM public.categories;
-- SELECT COUNT(*) as total_productos FROM public.products;
-- SELECT c.name, COUNT(p.id) as productos 
-- FROM public.categories c
-- LEFT JOIN public.products p ON c.id = p.category_id
-- GROUP BY c.name
-- ORDER BY c.name;
