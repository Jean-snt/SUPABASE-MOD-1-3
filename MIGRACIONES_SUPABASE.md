# 🗄️ Migraciones de Supabase - Sistema POS

## 📋 Resumen

Este documento describe las migraciones de base de datos para el sistema POS, corrigiendo todos los errores de sintaxis y esquema.

---

## ✅ Cambios Principales

### 1. Eliminación de Columna `unit`
- ❌ **ANTES**: `products` tenía columna `unit` (kg, un, atado, etc.)
- ✅ **AHORA**: `products` NO tiene columna `unit`
- **Razón**: Simplificación del esquema y corrección de errores

### 2. Adición de Tabla `categories`
- ✅ Nueva tabla para categorías de productos
- ✅ Relación: `products.category_id` → `categories.id`
- ✅ Categorías predefinidas en seed.sql

### 3. Sintaxis SQL Limpia
- ✅ Solo caracteres ASCII estándar
- ✅ Sin caracteres invisibles que causan error `SQLSTATE 42601`
- ✅ Comentarios en español sin caracteres especiales

---

## 📁 Archivos de Migración

### 1. `20251120090000_create_tables.sql`
**Contenido**: Creación de todas las tablas base

**Tablas creadas**:
- `users` - Usuarios del sistema
- `categories` - Categorías de productos
- `products` - Catálogo de productos (SIN columna `unit`)
- `sales_header` - Cabecera de ventas
- `sales_detail` - Detalle de ventas
- `cash_movements` - Movimientos de caja

**Características**:
- ✅ Tipos de datos correctos (BIGINT, NUMERIC, TEXT, UUID, TIMESTAMPTZ)
- ✅ Constraints CHECK para validaciones
- ✅ Foreign Keys con ON DELETE CASCADE/RESTRICT
- ✅ Valores por defecto (NOW(), 0, 'completed')

### 2. `20251120090001_add_constraints.sql`
**Contenido**: Índices y políticas RLS

**Índices creados**:
- Índices en columnas de búsqueda frecuente
- Índices en foreign keys
- Índices en columnas de fecha (DESC para ordenamiento)

**Políticas RLS**:
- ✅ Users: Solo pueden ver/editar su propio perfil
- ✅ Categories: Lectura pública para autenticados
- ✅ Products: Lectura pública, escritura solo admins
- ✅ Sales: Solo pueden ver/crear sus propias ventas
- ✅ Cash Movements: Solo pueden ver/crear sus propios movimientos

### 3. `20251120090002_functions.sql`
**Contenido**: Funciones PL/pgSQL auxiliares

**Funciones creadas**:
- `update_updated_at_column()` - Actualiza timestamp automáticamente
- `get_user_role(UUID)` - Obtiene rol de usuario
- `calculate_sale_total(BIGINT)` - Calcula total de venta
- `get_product_stock(BIGINT)` - Obtiene stock de producto
- `update_product_stock(BIGINT, NUMERIC)` - Actualiza stock
- `get_daily_sales_summary(DATE)` - Resumen de ventas diarias
- `get_user_sales_count(UUID)` - Cuenta ventas de usuario
- `get_low_stock_products(NUMERIC)` - Lista productos con stock bajo

### 4. `20251120090003_triggers.sql`
**Contenido**: Triggers automáticos

**Triggers creados**:
- `update_users_updated_at` - Actualiza timestamp en users
- `update_products_updated_at` - Actualiza timestamp en products
- `check_sale_detail_subtotal` - Valida subtotal = quantity * unit_price
- `log_cash_movements_insert` - Log de movimientos de caja
- `check_product_stock` - Previene stock negativo
- `sync_sale_header_total` - Sincroniza total de venta con detalles
- `check_user_exists_sales` - Valida usuario antes de venta
- `check_user_exists_cash` - Valida usuario antes de movimiento

### 5. `seed.sql`
**Contenido**: Datos de prueba

**Datos insertados**:
- ✅ 10 categorías predefinidas
- ✅ 26 productos de ejemplo (SIN columna `unit`)
- ✅ Stock inicial para todos los productos
- ✅ Imágenes de Unsplash

---

## 🚀 Instrucciones de Uso

### Paso 1: Resetear Base de Datos

```bash
cd MODULO-2
supabase db reset
```

**Resultado esperado**:
```
Resetting local database...
Applying migration 20251120090000_create_tables.sql...
Applying migration 20251120090001_add_constraints.sql...
Applying migration 20251120090002_functions.sql...
Applying migration 20251120090003_triggers.sql...
Seeding data from seed.sql...
Database reset complete!
```

### Paso 2: Verificar Tablas

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Resultado esperado:
-- cash_movements
-- categories
-- products
-- sales_detail
-- sales_header
-- users
```

### Paso 3: Verificar Estructura de Products

```sql
-- Ver columnas de products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Resultado esperado (SIN columna 'unit'):
-- id            | bigint    | NO
-- name          | text      | NO
-- price         | numeric   | NO
-- category_id   | bigint    | YES
-- image         | text      | YES
-- stock         | numeric   | YES
-- created_at    | timestamp | YES
-- updated_at    | timestamp | YES
```

### Paso 4: Verificar Datos de Seed

```sql
-- Contar categorías
SELECT COUNT(*) as total_categorias FROM public.categories;
-- Resultado: 10

-- Contar productos
SELECT COUNT(*) as total_productos FROM public.products;
-- Resultado: 26

-- Ver productos por categoría
SELECT c.name, COUNT(p.id) as productos 
FROM public.categories c
LEFT JOIN public.products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.name;
```

### Paso 5: Crear Usuario de Prueba

```sql
-- 1. Crear usuario en auth.users (desde Supabase Dashboard)
-- Email: admin@yappita.com
-- Password: admin123
-- Copiar el UUID generado

-- 2. Insertar en public.users
INSERT INTO public.users (auth_user_id, email, full_name, role) VALUES
    ('uuid-copiado-aqui', 'admin@yappita.com', 'Administrador', 'admin');
```

---

## 🔍 Verificación de Políticas RLS

### Probar Política de Products

```sql
-- Como usuario autenticado, debería poder leer productos
SELECT * FROM public.products LIMIT 5;

-- Como usuario no-admin, NO debería poder insertar
INSERT INTO public.products (name, price, category_id, stock) 
VALUES ('Test', 1.00, 1, 10);
-- Resultado esperado: ERROR (si no es admin)
```

### Probar Política de Sales

```sql
-- Solo debería ver sus propias ventas
SELECT * FROM public.sales_header;

-- Solo debería poder insertar ventas con su propio user_id
INSERT INTO public.sales_header (user_id, total, payment_method, status)
VALUES (auth.uid(), 100.00, 'efectivo', 'completed');
-- Resultado esperado: SUCCESS
```

---

## 📊 Esquema de Base de Datos

### Diagrama de Relaciones

```
auth.users (Supabase Auth)
    ↓ (auth_user_id)
public.users
    ↓ (user_id)
    ├─→ sales_header
    │       ↓ (sale_header_id)
    │       └─→ sales_detail
    │               ↓ (product_id)
    │               └─→ products
    │                       ↓ (category_id)
    │                       └─→ categories
    │
    └─→ cash_movements

```

### Tipos de Datos

| Tabla | Columna | Tipo | Descripción |
|-------|---------|------|-------------|
| users | auth_user_id | UUID | ID de auth.users |
| products | price | NUMERIC(10,2) | Precio con 2 decimales |
| products | stock | NUMERIC(10,3) | Stock con 3 decimales |
| sales_header | total | NUMERIC(10,2) | Total de venta |
| sales_detail | quantity | NUMERIC(10,3) | Cantidad vendida |

---

## ⚠️ Errores Comunes y Soluciones

### Error: `column "unit" does not exist`

**Causa**: Código TypeScript intenta usar columna `unit` que no existe

**Solución**: Actualizar interfaz `Product` en `database.types.ts`:
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  category_id?: number;  // ✅ Usar category_id
  image: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  // ❌ NO incluir: unit: string;
}
```

### Error: `SQLSTATE 42601` (Syntax Error)

**Causa**: Caracteres invisibles o no-ASCII en archivos SQL

**Solución**: Todos los archivos de migración usan solo ASCII estándar

### Error: `User does not exist in users table`

**Causa**: Trigger valida que el usuario exista antes de insertar venta/movimiento

**Solución**: Crear usuario en `public.users` con el `auth_user_id` correcto:
```sql
INSERT INTO public.users (auth_user_id, email, full_name, role)
VALUES ('uuid-from-auth', 'user@example.com', 'Usuario', 'cashier');
```

---

## 🧪 Pruebas Recomendadas

### 1. Insertar Producto
```sql
INSERT INTO public.products (name, price, category_id, stock)
VALUES ('Producto Test', 5.50, 1, 100.000);
```

### 2. Crear Venta
```sql
-- Insertar cabecera
INSERT INTO public.sales_header (user_id, total, payment_method, status)
VALUES (auth.uid(), 25.50, 'efectivo', 'completed')
RETURNING id;

-- Insertar detalle (usar el ID retornado)
INSERT INTO public.sales_detail (sale_header_id, product_id, quantity, unit_price, subtotal)
VALUES (1, 1, 2.500, 5.20, 13.00);
```

### 3. Registrar Apertura de Caja
```sql
INSERT INTO public.cash_movements (user_id, movement_type, amount, note)
VALUES (auth.uid(), 'apertura', 100.00, 'Apertura de caja');
```

### 4. Actualizar Stock
```sql
-- Reducir stock después de venta
UPDATE public.products
SET stock = stock - 2.500
WHERE id = 1;
```

---

## 📝 Notas Importantes

1. **Columna `unit` eliminada**: El esquema NO incluye esta columna. Si el frontend la necesita, debe manejarse en el cliente.

2. **Categorías por ID**: Los productos ahora usan `category_id` (BIGINT) en lugar de `category` (TEXT).

3. **Stock con 3 decimales**: Permite ventas por peso (ej: 2.500 kg).

4. **Triggers automáticos**: Los triggers sincronizan automáticamente el total de ventas y validan datos.

5. **RLS habilitado**: Todas las tablas tienen Row Level Security activo.

---

## ✅ Checklist de Verificación

- [ ] `supabase db reset` ejecutado sin errores
- [ ] 6 tablas creadas correctamente
- [ ] 10 categorías insertadas
- [ ] 26 productos insertados (sin columna `unit`)
- [ ] Índices creados
- [ ] Políticas RLS activas
- [ ] Funciones PL/pgSQL creadas
- [ ] Triggers activos
- [ ] Usuario de prueba creado en `public.users`
- [ ] Interfaz TypeScript actualizada (sin `unit`)

---

**Fecha de creación**: Noviembre 2024  
**Versión**: 2.0.0  
**Estado**: ✅ Listo para producción
