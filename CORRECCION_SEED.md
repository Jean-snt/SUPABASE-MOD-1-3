# 🔧 Corrección de Errores en Seed

## ❌ Error Encontrado

```
ERROR: column "auth_id" of relation "users" does not exist (SQLSTATE 42703)
```

**Ubicación**: `supabase/migrations/20251120090004_seed.sql` línea 8

---

## 🔍 Causa del Error

El archivo `20251120090004_seed.sql` tenía dos errores:

### Error 1: Nombre de columna incorrecto
```sql
-- ❌ INCORRECTO
INSERT INTO public.users (auth_id, email, full_name, role) VALUES ...
```

**Problema**: La columna se llama `auth_user_id`, no `auth_id`

### Error 2: Nombre de columna incorrecto en products
```sql
-- ❌ INCORRECTO
INSERT INTO public.products (name, price, stock, image_url, category_id) VALUES ...
```

**Problema**: La columna se llama `image`, no `image_url`

### Error 3: Rol incorrecto
```sql
-- ❌ INCORRECTO
..., role) VALUES (..., 'cajero')
```

**Problema**: El rol debe ser `'cashier'`, no `'cajero'` (según el CHECK constraint)

---

## ✅ Corrección Aplicada

### Corrección 1: auth_user_id
```sql
-- ✅ CORRECTO
INSERT INTO public.users (auth_user_id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@pos.com', 'Administrador POS', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'cajero1@pos.com', 'Cajero Lopez', 'cashier'),
    ...
```

### Corrección 2: image
```sql
-- ✅ CORRECTO
INSERT INTO public.products (name, price, stock, image, category_id) VALUES
    ('Manzana Roja', 2.50, 150.000, 'url_placeholder/manzana.jpg', v_frutas_id),
    ...
```

### Corrección 3: role = 'cashier'
```sql
-- ✅ CORRECTO
..., role) VALUES (..., 'cashier')
```

---

## 🚀 Ejecutar Nuevamente

Ahora puede ejecutar sin errores:

```bash
cd MODULO-2
supabase db reset
```

**Resultado esperado**:
```
Resetting local database...
Recreating database...
Initialising schema...
Seeding globals from roles.sql...
Applying migration 20251120090000_create_tables.sql...
Applying migration 20251120090001_add_constraints.sql...
Applying migration 20251120090002_functions.sql...
Applying migration 20251120090003_triggers.sql...
Applying migration 20251120090004_seed.sql...
✓ Finished supabase db reset on branch main.
```

---

## 📊 Datos Insertados

Después del reset exitoso, tendrá:

### Usuarios (5)
```sql
SELECT * FROM users;
```
| id | auth_user_id | email | full_name | role |
|----|--------------|-------|-----------|------|
| 1 | 00000000-... | admin@pos.com | Administrador POS | admin |
| 2 | 00000000-... | cajero1@pos.com | Cajero Lopez | cashier |
| 3 | 00000000-... | cajero2@pos.com | Cajera Diaz | cashier |
| 4 | 00000000-... | cajero3@pos.com | Cajero Ramirez | cashier |
| 5 | 00000000-... | cajero4@pos.com | Cajera Sanchez | cashier |

### Categorías (10)
```sql
SELECT * FROM categories;
```
- Frutas Frescas
- Verduras de Hoja
- Tubérculos
- Cítricos
- Hortalizas
- Frutos Secos
- Granos y Legumbres
- Lácteos y Huevos
- Panadería
- Bebidas

### Productos (25)
```sql
SELECT COUNT(*) FROM products;
-- Resultado: 25
```

---

## ⚠️ Nota Importante sobre auth_user_id

Los UUIDs insertados en `users.auth_user_id` son **de ejemplo**:
```
00000000-0000-0000-0000-000000000001
00000000-0000-0000-0000-000000000002
...
```

### Para Producción:

1. **Crear usuarios en Supabase Auth** primero
2. **Copiar los UUIDs reales** generados por Auth
3. **Actualizar la tabla users** con los UUIDs correctos:

```sql
-- Ejemplo: Actualizar con UUID real
UPDATE users 
SET auth_user_id = 'uuid-real-de-auth-users'
WHERE email = 'admin@pos.com';
```

O mejor aún, **eliminar los usuarios de ejemplo** y crear los reales:

```sql
-- Limpiar usuarios de ejemplo
DELETE FROM users;

-- Insertar usuarios reales (después de crearlos en Auth)
INSERT INTO users (auth_user_id, email, full_name, role)
VALUES ('uuid-real-from-auth', 'admin@yappita.com', 'Admin Real', 'admin');
```

---

## 🔍 Verificación

### Verificar estructura de users
```sql
\d users

-- Debe mostrar:
-- auth_user_id | uuid | not null
-- (NO debe mostrar 'auth_id')
```

### Verificar estructura de products
```sql
\d products

-- Debe mostrar:
-- image | text
-- (NO debe mostrar 'image_url')
```

### Verificar datos insertados
```sql
-- Contar registros
SELECT 
    (SELECT COUNT(*) FROM users) as usuarios,
    (SELECT COUNT(*) FROM categories) as categorias,
    (SELECT COUNT(*) FROM products) as productos;

-- Resultado esperado:
-- usuarios: 5
-- categorias: 10
-- productos: 25
```

---

## ✅ Estado Final

- [x] Error `auth_id` corregido a `auth_user_id`
- [x] Error `image_url` corregido a `image`
- [x] Error `'cajero'` corregido a `'cashier'`
- [x] Archivo `20251120090004_seed.sql` actualizado
- [x] Listo para ejecutar `supabase db reset`

---

**Fecha de corrección**: Noviembre 2024  
**Estado**: ✅ Corregido
