# ✅ Checklist de Verificación - Integración POS + Supabase

Use este checklist para verificar que la integración está funcionando correctamente.

---

## 📋 Pre-requisitos

- [ ] Node.js instalado (v16 o superior)
- [ ] npm instalado
- [ ] Supabase CLI instalado (opcional, para desarrollo local)
- [ ] Cuenta de Supabase Cloud o instancia local corriendo

---

## 🔧 Configuración Inicial

### 1. Instalación de Dependencias
```bash
cd MODULO-2
npm install
```
- [ ] Dependencias instaladas sin errores
- [ ] `@supabase/supabase-js` presente en `node_modules`
- [ ] `@types/react` y `@types/react-dom` instalados

### 2. Variables de Entorno
- [ ] Archivo `.env.local` existe en la raíz de `MODULO-2`
- [ ] Variable `VITE_SUPABASE_URL` configurada
- [ ] Variable `VITE_SUPABASE_ANON_KEY` configurada
- [ ] Credenciales son válidas (probar conexión)

### 3. Base de Datos Supabase
- [ ] Tablas creadas por Sala A:
  - [ ] `users`
  - [ ] `products`
  - [ ] `sales_header`
  - [ ] `sales_detail`
  - [ ] `cash_movements`
- [ ] Políticas RLS configuradas
- [ ] Al menos un usuario creado en Supabase Auth
- [ ] Usuario insertado en tabla `public.users`
- [ ] Productos insertados (usar `supabase/seed.sql`)

---

## 🧪 Pruebas de Funcionalidad

### Prueba 1: Inicio de Aplicación
```bash
npm run dev
```
- [ ] Aplicación inicia sin errores
- [ ] No hay errores en la consola del navegador
- [ ] Pantalla de login se muestra correctamente

### Prueba 2: Autenticación

#### Login Exitoso
- [ ] Ingresar email y contraseña válidos
- [ ] Click en "Iniciar Sesión"
- [ ] No hay errores en consola
- [ ] Redirección al dashboard
- [ ] Modal de apertura de caja se muestra
- [ ] Nombre de usuario aparece en el header

#### Login Fallido
- [ ] Ingresar credenciales incorrectas
- [ ] Mensaje de error se muestra
- [ ] No hay redirección
- [ ] Formulario sigue disponible

#### Verificación en Supabase
```sql
-- Verificar sesión activa
SELECT * FROM auth.sessions ORDER BY created_at DESC LIMIT 1;
```
- [ ] Sesión creada en Supabase

### Prueba 3: Apertura de Caja

#### Apertura Exitosa
- [ ] Modal de apertura visible
- [ ] Ingresar monto (ej: 100,00)
- [ ] Ingresar nota (opcional)
- [ ] Click en "Abrir caja registradora"
- [ ] Modal se cierra
- [ ] Dashboard se vuelve interactivo

#### Verificación en Supabase
```sql
-- Verificar movimiento de apertura
SELECT * FROM cash_movements 
WHERE movement_type = 'apertura' 
ORDER BY created_at DESC 
LIMIT 1;
```
- [ ] Registro insertado en `cash_movements`
- [ ] `user_id` corresponde al usuario autenticado
- [ ] `amount` es correcto
- [ ] `note` está presente (si se ingresó)
- [ ] `created_at` es reciente

### Prueba 4: Carga de Productos

#### Visualización
- [ ] Productos se cargan automáticamente
- [ ] No hay mensaje de error
- [ ] Grid de productos visible
- [ ] Imágenes se cargan correctamente
- [ ] Precios se muestran correctamente

#### Filtrado por Categoría
- [ ] Click en categoría "Frutas"
- [ ] Solo productos de frutas se muestran
- [ ] Click en "Todo"
- [ ] Todos los productos se muestran

#### Verificación en Consola
- [ ] No hay errores de red
- [ ] Request a Supabase exitoso
- [ ] Datos de productos recibidos

### Prueba 5: Carrito de Compras

#### Agregar Productos
- [ ] Click en un producto
- [ ] Producto aparece en el carrito (izquierda)
- [ ] Cantidad inicial: 1.500
- [ ] Precio unitario correcto
- [ ] Total calculado correctamente

#### Múltiples Productos
- [ ] Agregar 3-5 productos diferentes
- [ ] Todos aparecen en el carrito
- [ ] Total general se actualiza
- [ ] Último producto agregado tiene fondo azul claro

### Prueba 6: Proceso de Pago

#### Pantalla de Pago
- [ ] Click en botón "Pago"
- [ ] Transición a pantalla de pago
- [ ] Total se muestra grande arriba
- [ ] Métodos de pago visibles (Efectivo, Yape, Plin, Tarjeta)

#### Selección de Método de Pago
- [ ] Click en "Efectivo"
- [ ] Botón se resalta
- [ ] Click en "Yape"
- [ ] Botón se resalta (color morado)

#### Ingreso de Monto
- [ ] Click en números del teclado
- [ ] Monto se muestra en línea "Efectivo"
- [ ] Cálculo de vuelto/restante correcto
- [ ] Botón "X" elimina el monto

#### Validación de Venta
- [ ] Ingresar monto suficiente
- [ ] Click en "Validar"
- [ ] Botón muestra "Procesando..."
- [ ] No hay errores en consola
- [ ] Transición a pantalla de recibo

#### Verificación en Supabase
```sql
-- Verificar cabecera de venta
SELECT * FROM sales_header 
ORDER BY created_at DESC 
LIMIT 1;

-- Verificar detalles (reemplazar ID)
SELECT sd.*, p.name 
FROM sales_detail sd
JOIN products p ON sd.product_id = p.id
WHERE sd.sale_header_id = [ID_DE_LA_VENTA];
```
- [ ] Registro en `sales_header` insertado
- [ ] `user_id` corresponde al usuario autenticado
- [ ] `total_amount` es correcto
- [ ] `payment_method` es correcto
- [ ] `status` es 'completed'
- [ ] Registros en `sales_detail` insertados
- [ ] Cantidad de registros = cantidad de productos en carrito
- [ ] `quantity`, `unit_price`, `subtotal` son correctos
- [ ] `sale_header_id` vincula correctamente

### Prueba 7: Pantalla de Recibo

#### Visualización
- [ ] Mensaje "Pago exitoso" visible
- [ ] Total de venta correcto
- [ ] Botones de acción visibles
- [ ] Recibo preview a la derecha

#### Recibo Preview
- [ ] Logo "yappita" visible
- [ ] Número de orden visible
- [ ] Lista de productos correcta
- [ ] Cantidades y precios correctos
- [ ] Total correcto
- [ ] Información de pago (efectivo, vuelto)
- [ ] Fecha y hora actuales

#### Nueva Orden
- [ ] Click en "Nueva orden"
- [ ] Carrito se vacía
- [ ] Vuelve a pantalla POS
- [ ] Listo para nueva venta

### Prueba 8: Logout

#### Cerrar Sesión
- [ ] Click en botón de logout (icono de salida)
- [ ] Redirección a pantalla de login
- [ ] Carrito se limpia
- [ ] Estado de usuario se limpia

#### Verificación
- [ ] Intentar acceder al dashboard sin login
- [ ] Debe redirigir a login
- [ ] Sesión cerrada en Supabase

---

## 🔍 Verificación de Seguridad

### User ID
- [ ] Todas las operaciones usan `user.id` del usuario autenticado
- [ ] No hay IDs hardcodeados en el código
- [ ] Políticas RLS validan el user_id

### Tokens
- [ ] Token JWT se almacena correctamente
- [ ] Token se envía en requests a Supabase
- [ ] Token expira correctamente

### Errores
- [ ] Errores de autenticación se muestran al usuario
- [ ] Errores de red se manejan correctamente
- [ ] No se exponen detalles sensibles en errores

---

## 📊 Verificación de Datos

### Integridad de Datos
```sql
-- Verificar que todas las ventas tienen detalles
SELECT sh.id, sh.total_amount, COUNT(sd.id) as num_items
FROM sales_header sh
LEFT JOIN sales_detail sd ON sh.id = sd.sale_header_id
GROUP BY sh.id, sh.total_amount;
```
- [ ] Todas las ventas tienen al menos 1 detalle
- [ ] Suma de subtotales = total_amount

### Consistencia de User ID
```sql
-- Verificar que todos los user_id existen en users
SELECT DISTINCT sh.user_id, u.email
FROM sales_header sh
LEFT JOIN users u ON sh.user_id = u.id;
```
- [ ] Todos los user_id tienen un usuario correspondiente

---

## 🐛 Pruebas de Manejo de Errores

### Error de Conexión
- [ ] Detener Supabase
- [ ] Intentar cargar productos
- [ ] Mensaje de error se muestra
- [ ] Botón "Reintentar" funciona

### Error de Autenticación
- [ ] Credenciales incorrectas
- [ ] Mensaje de error claro
- [ ] No hay crash de aplicación

### Error de Venta
- [ ] Intentar venta sin productos
- [ ] Mensaje de error apropiado
- [ ] Intentar venta sin autenticación
- [ ] Mensaje de error apropiado

---

## 📱 Pruebas de UI/UX

### Responsividad
- [ ] Pantalla completa (1920x1080)
- [ ] Pantalla mediana (1366x768)
- [ ] Elementos visibles y usables

### Estados de Carga
- [ ] Spinner visible al cargar productos
- [ ] Botón "Procesando..." al validar venta
- [ ] Loading al verificar sesión

### Feedback Visual
- [ ] Hover en botones
- [ ] Productos seleccionados resaltados
- [ ] Categoría activa resaltada
- [ ] Transiciones suaves entre vistas

---

## 📝 Verificación de Documentación

- [ ] `INTEGRACION_SUPABASE.md` presente y completo
- [ ] `RESUMEN_INTEGRACION.md` presente
- [ ] `supabase/seed.sql` presente
- [ ] Comentarios en código claros
- [ ] README actualizado (si aplica)

---

## ✅ Checklist Final

### Funcionalidad Core
- [ ] Login funcional
- [ ] Logout funcional
- [ ] Carga de productos desde Supabase
- [ ] Apertura de caja registrada
- [ ] Ventas registradas correctamente
- [ ] Recibo generado

### Seguridad
- [ ] User ID del usuario autenticado
- [ ] Políticas RLS compatibles
- [ ] Tokens JWT funcionando
- [ ] Variables de entorno seguras

### Calidad de Código
- [ ] Sin errores de TypeScript
- [ ] Sin errores en consola
- [ ] Código modular y organizado
- [ ] Servicios separados por responsabilidad

### Documentación
- [ ] Documentación completa
- [ ] Instrucciones claras
- [ ] Ejemplos de uso
- [ ] Solución de problemas

---

## 🎯 Resultado Final

**Total de checks completados**: _____ / _____

**Estado de la integración**:
- [ ] ✅ APROBADO - Todos los checks completados
- [ ] ⚠️ PARCIAL - Algunos checks pendientes
- [ ] ❌ RECHAZADO - Muchos checks fallidos

---

## 📞 Reporte de Problemas

Si algún check falla, documentar aquí:

### Problema 1
- **Check fallido**: 
- **Descripción**: 
- **Pasos para reproducir**: 
- **Error observado**: 
- **Solución intentada**: 

### Problema 2
- **Check fallido**: 
- **Descripción**: 
- **Pasos para reproducir**: 
- **Error observado**: 
- **Solución intentada**: 

---

**Fecha de verificación**: _______________  
**Verificado por**: _______________  
**Versión**: 1.0.0
