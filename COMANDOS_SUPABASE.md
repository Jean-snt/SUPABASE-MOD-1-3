# 🛠️ Comandos Útiles de Supabase

Guía rápida de comandos para gestionar la base de datos Supabase.

---

## 🚀 Comandos Básicos

### Resetear Base de Datos
```bash
cd MODULO-2
supabase db reset
```

### Ver Estado de Supabase
```bash
supabase status
```

### Iniciar Supabase Local
```bash
supabase start
```

### Detener Supabase Local
```bash
supabase stop
```

---

## 📊 Consultas de Verificación

### Ver Todas las Tablas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Ver Estructura de una Tabla
```sql
-- Opción 1: psql
\d products

-- Opción 2: SQL estándar
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

### Contar Registros
```sql
SELECT 
    'categories' as tabla, COUNT(*) as registros FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'sales_header', COUNT(*) FROM sales_header
UNION ALL
SELECT 'sales_detail', COUNT(*) FROM sales_detail
UNION ALL
SELECT 'cash_movements', COUNT(*) FROM cash_movements;
```

### Ver Productos con Categorías
```sql
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    c.name as category,
    c.color
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY c.name, p.name;
```

### Ver Productos por Categoría
```sql
SELECT 
    c.name as category,
    COUNT(p.id) as total_products,
    SUM(p.stock) as total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.name;
```

---

## 👤 Gestión de Usuarios

### Ver Usuarios del Sistema
```sql
SELECT 
    id,
    auth_user_id,
    email,
    full_name,
    role,
    created_at
FROM users
ORDER BY created_at DESC;
```

### Crear Usuario (después de crear en Auth)
```sql
-- 1. Crear en Supabase Auth Dashboard
-- 2. Copiar el UUID generado
-- 3. Insertar en public.users

INSERT INTO public.users (auth_user_id, email, full_name, role)
VALUES 
    ('uuid-from-auth', 'admin@yappita.com', 'Administrador', 'admin');
```

### Cambiar Rol de Usuario
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'usuario@ejemplo.com';
```

---

## 💰 Consultas de Ventas

### Ver Últimas Ventas
```sql
SELECT 
    sh.id,
    sh.total,
    sh.payment_method,
    sh.status,
    sh.created_at,
    u.email as vendedor
FROM sales_header sh
JOIN users u ON sh.user_id = u.auth_user_id
ORDER BY sh.created_at DESC
LIMIT 10;
```

### Ver Detalle de una Venta
```sql
SELECT 
    sd.id,
    p.name as producto,
    sd.quantity,
    sd.unit_price,
    sd.subtotal
FROM sales_detail sd
JOIN products p ON sd.product_id = p.id
WHERE sd.sale_header_id = 1;  -- Cambiar ID
```

### Resumen de Ventas del Día
```sql
SELECT 
    COUNT(*) as total_ventas,
    SUM(total) as total_ingresos,
    payment_method,
    COUNT(*) as ventas_por_metodo
FROM sales_header
WHERE DATE(created_at) = CURRENT_DATE
AND status = 'completed'
GROUP BY payment_method;
```

### Top 10 Productos Más Vendidos
```sql
SELECT 
    p.name,
    SUM(sd.quantity) as total_vendido,
    SUM(sd.subtotal) as ingresos_totales
FROM sales_detail sd
JOIN products p ON sd.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_vendido DESC
LIMIT 10;
```

---

## 📦 Gestión de Stock

### Ver Productos con Stock Bajo
```sql
SELECT 
    p.id,
    p.name,
    p.stock,
    c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock < 20
ORDER BY p.stock ASC;
```

### Actualizar Stock de un Producto
```sql
UPDATE products
SET stock = stock - 5.000  -- Reducir 5 unidades
WHERE id = 1;
```

### Ver Historial de Stock (si se implementa tabla de historial)
```sql
-- Nota: Requiere crear tabla stock_history
SELECT 
    p.name,
    sh.old_stock,
    sh.new_stock,
    sh.change_amount,
    sh.reason,
    sh.created_at
FROM stock_history sh
JOIN products p ON sh.product_id = p.id
WHERE p.id = 1
ORDER BY sh.created_at DESC;
```

---

## 💵 Movimientos de Caja

### Ver Movimientos de Hoy
```sql
SELECT 
    cm.id,
    cm.movement_type,
    cm.amount,
    cm.note,
    cm.created_at,
    u.email as usuario
FROM cash_movements cm
JOIN users u ON cm.user_id = u.auth_user_id
WHERE DATE(cm.created_at) = CURRENT_DATE
ORDER BY cm.created_at DESC;
```

### Calcular Saldo de Caja
```sql
SELECT 
    SUM(CASE 
        WHEN movement_type IN ('apertura', 'ingreso') THEN amount
        WHEN movement_type IN ('cierre', 'egreso') THEN -amount
        ELSE 0
    END) as saldo_actual
FROM cash_movements
WHERE DATE(created_at) = CURRENT_DATE;
```

### Ver Última Apertura de Caja
```sql
SELECT 
    cm.*,
    u.email as usuario
FROM cash_movements cm
JOIN users u ON cm.user_id = u.auth_user_id
WHERE cm.movement_type = 'apertura'
ORDER BY cm.created_at DESC
LIMIT 1;
```

---

## 🔍 Consultas de Auditoría

### Ver Actividad por Usuario
```sql
SELECT 
    u.email,
    COUNT(DISTINCT sh.id) as total_ventas,
    SUM(sh.total) as total_vendido,
    COUNT(DISTINCT cm.id) as movimientos_caja
FROM users u
LEFT JOIN sales_header sh ON u.auth_user_id = sh.user_id
LEFT JOIN cash_movements cm ON u.auth_user_id = cm.user_id
GROUP BY u.id, u.email
ORDER BY total_vendido DESC;
```

### Ver Ventas por Rango de Fechas
```sql
SELECT 
    DATE(created_at) as fecha,
    COUNT(*) as total_ventas,
    SUM(total) as ingresos
FROM sales_header
WHERE created_at BETWEEN '2024-11-01' AND '2024-11-30'
AND status = 'completed'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

---

## 🔧 Mantenimiento

### Limpiar Datos de Prueba
```sql
-- CUIDADO: Esto elimina TODOS los datos
TRUNCATE TABLE cash_movements CASCADE;
TRUNCATE TABLE sales_detail CASCADE;
TRUNCATE TABLE sales_header CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
-- NO eliminar users si hay usuarios reales
```

### Resetear Secuencias
```sql
-- Después de limpiar datos, resetear IDs
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE sales_header_id_seq RESTART WITH 1;
ALTER SEQUENCE sales_detail_id_seq RESTART WITH 1;
ALTER SEQUENCE cash_movements_id_seq RESTART WITH 1;
```

### Ver Tamaño de Tablas
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔐 Políticas RLS

### Ver Políticas Activas
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Deshabilitar RLS (solo para desarrollo)
```sql
-- CUIDADO: Solo usar en desarrollo local
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

### Habilitar RLS
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Funciones Útiles

### Usar Función de Resumen Diario
```sql
SELECT * FROM get_daily_sales_summary(CURRENT_DATE);
```

### Obtener Productos con Stock Bajo
```sql
SELECT * FROM get_low_stock_products(20);  -- threshold = 20
```

### Calcular Total de una Venta
```sql
SELECT calculate_sale_total(1);  -- sale_header_id = 1
```

### Obtener Rol de Usuario
```sql
SELECT get_user_role('uuid-del-usuario');
```

---

## 🐛 Debugging

### Ver Logs de Triggers
```sql
-- Los triggers con RAISE NOTICE aparecen en los logs
-- Ver en Supabase Dashboard > Database > Logs
```

### Verificar Constraints
```sql
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    conrelid::regclass as table_name
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, contype;
```

### Ver Índices
```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 📝 Backup y Restore

### Crear Backup
```bash
supabase db dump -f backup.sql
```

### Restaurar Backup
```bash
supabase db reset
psql -h localhost -p 54322 -U postgres -d postgres -f backup.sql
```

---

## 🔗 Enlaces Útiles

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Supabase CLI**: https://supabase.com/docs/guides/cli

---

**Última actualización**: Noviembre 2024
