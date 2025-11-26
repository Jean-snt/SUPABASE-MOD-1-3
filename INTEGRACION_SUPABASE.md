# Integración POS + Supabase - Documentación

## 📋 Resumen de Integración

Este documento describe la integración completa del sistema POS con Supabase, implementando autenticación, gestión de productos, ventas y movimientos de caja.

## ✅ Archivos Creados/Modificados

### 1. Configuración de Supabase

#### `src/lib/supabaseClient.ts`
- Cliente de Supabase configurado con variables de entorno
- Validación de credenciales al inicializar
- Usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

#### `.env.local`
- Archivo de variables de entorno (NO incluir en Git)
- Contiene credenciales de Supabase local/producción
- **IMPORTANTE**: Reemplazar con sus credenciales reales

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Tipos de Base de Datos

#### `src/types/database.types.ts`
Define las interfaces TypeScript para:
- `User`: Usuarios del sistema (admin/cashier)
- `Product`: Productos del inventario
- `SalesHeader`: Cabecera de ventas
- `SalesDetail`: Detalles de ventas
- `CashMovement`: Movimientos de caja
- `CartItem`: Items del carrito

### 3. Servicios

#### `src/services/authService.ts`
**Funciones implementadas:**
- `login(email, password)`: Autenticación con Supabase Auth
  - Autentica con `signInWithPassword`
  - Obtiene datos adicionales de `public.users`
  - Retorna usuario y token JWT
- `logout()`: Cierra sesión
- `getCurrentUser()`: Obtiene usuario actual
- `getSession()`: Verifica sesión activa

**IMPORTANTE**: El `user_id` retornado es el ID real del usuario autenticado.

#### `src/services/inventoryService.ts`
**Funciones implementadas:**
- `getAllProducts()`: Obtiene todos los productos de la tabla `products`
- `getProductsByCategory(category)`: Filtra por categoría
- `searchProducts(searchTerm)`: Búsqueda por nombre
- `getProductById(id)`: Obtiene un producto específico

**Reemplaza**: Los datos hardcodeados `DEFAULT_PRODUCTS`

#### `src/services/salesService.ts`
**Funciones implementadas:**
- `registerSale(userId, cartItems, paymentMethod, totalAmount)`: 
  - Inserta cabecera en `sales_header`
  - Obtiene el `sale_header_id` generado
  - Inserta detalles en `sales_detail` vinculados al header
  - **SEGURIDAD**: Usa el `user_id` del usuario autenticado (NO hardcodeado)
  - Transacción: Si falla detalles, elimina la cabecera
- `getSalesByUser(userId)`: Historial de ventas
- `getSaleDetails(saleHeaderId)`: Detalles de una venta

#### `src/services/cashMovementService.ts`
**Funciones implementadas:**
- `registerOpening(userId, amount, note)`: Registra apertura de caja
  - Inserta en `cash_movements` con tipo 'apertura'
  - Usa el `user_id` del usuario autenticado
- `registerClosing(userId, amount, note)`: Registra cierre de caja
- `getMovementsByUser(userId)`: Historial de movimientos
- `getLastOpening(userId)`: Última apertura del usuario

### 4. Contexto de Autenticación

#### `src/contexts/AuthContext.tsx`
**Proveedor de contexto que maneja:**
- Estado global del usuario autenticado
- Funciones `login()` y `logout()`
- Verificación automática de sesión al cargar
- Hook `useAuth()` para acceder al contexto

### 5. Componentes

#### `src/components/Login.tsx`
- Formulario de login con email y contraseña
- Integrado con `authService.login()`
- Manejo de errores de autenticación
- Diseño consistente con el tema del POS

#### `App.tsx` (Modificado)
- Envuelve la aplicación con `AuthProvider`
- Muestra `Login` si no está autenticado
- Muestra loading mientras verifica sesión
- Integra apertura de caja con `cashMovementService`
- Valida y convierte el monto de apertura
- Manejo de errores en apertura de caja

#### `components/OpeningModal.tsx` (Modificado)
- Añadido prop `error` para mostrar errores
- Muestra mensajes de error de apertura de caja

#### `components/DashboardLayout.tsx` (Modificado)
**Cambios principales:**
- Importa servicios y tipos de Supabase
- Usa `useAuth()` para obtener usuario actual
- **Carga de productos**: Reemplaza localStorage por `inventoryService.getAllProducts()`
- **Estados de carga**: Loading, error, y retry para productos
- **Registro de ventas**: Usa `salesService.registerSale()` con `user.id` real
- **Botón de logout**: Cierra sesión y vuelve al login
- **Muestra usuario**: Avatar y nombre en el header
- **Manejo de errores**: Mensajes de error en pantalla de pago
- **Estado de procesamiento**: Deshabilita botón mientras procesa venta

## 🔐 Seguridad Implementada

### 1. Autenticación Real
- ✅ Login con Supabase Auth (`signInWithPassword`)
- ✅ Sesiones JWT manejadas por Supabase
- ✅ Verificación automática de sesión al cargar

### 2. User ID Seguro
- ✅ **ANTES**: `user_id` hardcodeado (`f0246718...`)
- ✅ **AHORA**: `user_id` del usuario autenticado (`user.id` o `auth.uid()`)
- ✅ Las políticas RLS de Supabase validan que el usuario solo acceda a sus datos

### 3. Validaciones
- ✅ Validación de variables de entorno al inicializar
- ✅ Validación de monto en apertura de caja
- ✅ Validación de carrito vacío antes de venta
- ✅ Manejo de errores en todas las operaciones

## 📦 Dependencias Instaladas

```bash
npm install @supabase/supabase-js @types/react @types/react-dom
```

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno

Edite el archivo `.env.local` en la raíz del proyecto:

**Para desarrollo local con Supabase CLI:**
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Para producción con Supabase Cloud:**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Iniciar Supabase Local (Opcional)

Si usa Supabase CLI local:
```bash
cd MODULO-2
supabase start
```

### 3. Crear Usuarios de Prueba

Debe crear usuarios en Supabase Auth y en la tabla `public.users`:

```sql
-- 1. Crear usuario en Auth (desde Supabase Dashboard o CLI)
-- Email: admin@yappita.com
-- Password: admin123

-- 2. Insertar en public.users
INSERT INTO public.users (id, email, role, full_name)
VALUES 
  ('uuid-del-usuario-auth', 'admin@yappita.com', 'admin', 'Administrador'),
  ('uuid-del-usuario-auth-2', 'cajero@yappita.com', 'cashier', 'Cajero 01');
```

### 4. Insertar Productos de Prueba

```sql
INSERT INTO public.products (name, price, unit, category, image)
VALUES 
  ('Manzana Roja', 5.20, 'kg', 'frutas', 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80'),
  ('Plátano Seda', 2.50, 'kg', 'tropicales', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80'),
  ('Papa Amarilla', 3.80, 'kg', 'tuberculos', 'https://images.unsplash.com/photo-1633013649620-420897578669?auto=format&fit=crop&w=600&q=80');
```

## 🧪 Pruebas de Integración

### 1. Login Exitoso
1. Iniciar la aplicación: `npm run dev`
2. Ingresar credenciales de usuario creado
3. Verificar que se muestra el dashboard
4. Verificar que aparece el nombre del usuario en el header

### 2. Carga de Productos
1. Después del login, verificar que se cargan productos desde Supabase
2. Si hay error, debe mostrar mensaje y botón "Reintentar"
3. Verificar que se pueden filtrar por categoría

### 3. Apertura de Caja
1. Al iniciar, debe aparecer el modal de apertura
2. Ingresar monto (ej: 100,00) y nota
3. Hacer clic en "Abrir caja registradora"
4. Verificar en Supabase que se insertó en `cash_movements`:
   ```sql
   SELECT * FROM cash_movements WHERE movement_type = 'apertura' ORDER BY created_at DESC LIMIT 1;
   ```

### 4. Venta Completa
1. Agregar productos al carrito
2. Hacer clic en "Pago"
3. Seleccionar método de pago (efectivo, yape, etc.)
4. Ingresar monto y hacer clic en "Validar"
5. Verificar que se muestra el recibo
6. Verificar en Supabase:
   ```sql
   -- Verificar cabecera
   SELECT * FROM sales_header ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar detalles (reemplazar ID)
   SELECT * FROM sales_detail WHERE sale_header_id = [ID_DE_LA_VENTA];
   ```

### 5. Logout
1. Hacer clic en el botón de logout (icono de salida)
2. Verificar que vuelve a la pantalla de login
3. Verificar que la sesión se cerró correctamente

## 🔍 Verificación de Políticas RLS

Las políticas RLS deben estar configuradas en Supabase (Sala A). Verificar:

```sql
-- Ver políticas de products
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Ver políticas de sales_header
SELECT * FROM pg_policies WHERE tablename = 'sales_header';

-- Ver políticas de sales_detail
SELECT * FROM pg_policies WHERE tablename = 'sales_detail';

-- Ver políticas de cash_movements
SELECT * FROM pg_policies WHERE tablename = 'cash_movements';
```

## 📝 Notas Importantes

1. **Variables de Entorno**: El archivo `.env.local` NO debe incluirse en Git (ya está en `.gitignore`)

2. **User ID**: Todas las operaciones usan el `user.id` del usuario autenticado, NO IDs hardcodeados

3. **Transacciones**: El servicio de ventas maneja transacciones básicas (elimina header si fallan detalles)

4. **Errores**: Todos los servicios manejan errores y los propagan al componente para mostrarlos al usuario

5. **Loading States**: Los componentes muestran estados de carga mientras se realizan operaciones

6. **TypeScript**: Todos los archivos usan TypeScript con tipos estrictos

## 🎯 Próximos Pasos (Opcional)

- [ ] Implementar actualización de stock al realizar ventas
- [ ] Agregar historial de ventas en el dashboard
- [ ] Implementar cierre de caja
- [ ] Agregar reportes y estadísticas
- [ ] Implementar búsqueda de productos en tiempo real
- [ ] Agregar gestión de clientes
- [ ] Implementar impresión de tickets

## 🐛 Solución de Problemas

### Error: "Faltan las variables de entorno"
- Verificar que existe el archivo `.env.local` en la raíz de `MODULO-2`
- Verificar que las variables empiezan con `VITE_`
- Reiniciar el servidor de desarrollo

### Error: "Error al cargar productos"
- Verificar que Supabase está corriendo
- Verificar las credenciales en `.env.local`
- Verificar que la tabla `products` existe y tiene datos
- Verificar las políticas RLS de la tabla `products`

### Error: "Usuario no autenticado"
- Verificar que el usuario existe en Supabase Auth
- Verificar que el usuario existe en la tabla `public.users`
- Verificar que el `id` coincide en ambas tablas

### Error al registrar venta
- Verificar que el usuario está autenticado
- Verificar las políticas RLS de `sales_header` y `sales_detail`
- Verificar que los productos existen en la base de datos
- Revisar la consola del navegador para más detalles

## 📞 Contacto

Para dudas o problemas con la integración, revisar:
1. Logs de la consola del navegador (F12)
2. Logs de Supabase (si usa CLI local)
3. Políticas RLS en Supabase Dashboard

---

**Fecha de Integración**: Noviembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Completado
