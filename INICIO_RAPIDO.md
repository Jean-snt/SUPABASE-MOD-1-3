# 🚀 Inicio Rápido - POS + Supabase

Guía rápida para poner en marcha el sistema en 5 minutos.

---

## ⚡ Pasos Rápidos

### 1. Instalar Dependencias (30 segundos)
```bash
cd MODULO-2
npm install
```

### 2. Configurar Supabase (2 minutos)

#### Opción A: Supabase Local (Desarrollo)
```bash
# Si tiene Supabase CLI instalado
supabase start

# Copiar la URL y ANON_KEY que aparecen en la terminal
```

El archivo `.env.local` ya está configurado con valores por defecto para Supabase local:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Opción B: Supabase Cloud (Producción)
1. Ir a https://supabase.com
2. Crear un proyecto
3. Copiar URL y ANON_KEY del proyecto
4. Editar `.env.local`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Crear Usuario de Prueba (1 minuto)

#### Desde Supabase Dashboard:
1. Ir a **Authentication** > **Users**
2. Click en **"Add user"**
3. Email: `admin@yappita.com`
4. Password: `admin123`
5. Click en **"Create user"**
6. **Copiar el UUID generado**

#### Insertar en tabla users:
1. Ir a **SQL Editor**
2. Ejecutar (reemplazar UUID):
```sql
INSERT INTO public.users (id, email, role, full_name)
VALUES ('uuid-copiado-aqui', 'admin@yappita.com', 'admin', 'Administrador');
```

### 4. Insertar Productos (1 minuto)

En **SQL Editor**, ejecutar:
```sql
INSERT INTO public.products (name, price, unit, category, image) VALUES
  ('Manzana Roja', 5.20, 'kg', 'frutas', 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80'),
  ('Plátano Seda', 2.50, 'kg', 'tropicales', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80'),
  ('Papa Amarilla', 3.80, 'kg', 'tuberculos', 'https://images.unsplash.com/photo-1633013649620-420897578669?auto=format&fit=crop&w=600&q=80'),
  ('Zanahoria', 1.90, 'kg', 'verduras', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'),
  ('Tomate', 3.50, 'kg', 'verduras', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
```

O ejecutar el archivo completo:
```bash
# Copiar contenido de supabase/seed.sql y ejecutar en SQL Editor
```

### 5. Iniciar Aplicación (30 segundos)
```bash
npm run dev
```

Abrir navegador en: http://localhost:5173

---

## 🎯 Flujo de Prueba Rápida

### 1. Login
- Email: `admin@yappita.com`
- Password: `admin123`
- Click en **"Iniciar Sesión"**

### 2. Apertura de Caja
- Monto: `100,00`
- Nota: `Apertura de prueba`
- Click en **"Abrir caja registradora"**

### 3. Venta
1. Click en 3-4 productos
2. Click en **"Pago"**
3. Seleccionar **"Efectivo"**
4. Ingresar monto: `50`
5. Click en **"Validar"**
6. Ver recibo generado

### 4. Verificar en Supabase
```sql
-- Ver última venta
SELECT * FROM sales_header ORDER BY created_at DESC LIMIT 1;

-- Ver detalles de la venta (reemplazar ID)
SELECT sd.*, p.name 
FROM sales_detail sd
JOIN products p ON sd.product_id = p.id
WHERE sd.sale_header_id = 1;

-- Ver apertura de caja
SELECT * FROM cash_movements ORDER BY created_at DESC LIMIT 1;
```

---

## 🔧 Solución Rápida de Problemas

### Error: "Faltan las variables de entorno"
```bash
# Verificar que existe .env.local
ls -la .env.local

# Si no existe, crearlo:
cat > .env.local << EOF
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOF

# Reiniciar servidor
npm run dev
```

### Error: "Error al cargar productos"
```sql
-- Verificar que existen productos
SELECT COUNT(*) FROM products;

-- Si no hay productos, ejecutar seed.sql
```

### Error: "Usuario no autenticado"
```sql
-- Verificar que el usuario existe en ambas tablas
SELECT * FROM auth.users WHERE email = 'admin@yappita.com';
SELECT * FROM public.users WHERE email = 'admin@yappita.com';

-- Los IDs deben coincidir
```

### Error de conexión a Supabase
```bash
# Si usa Supabase local, verificar que está corriendo
supabase status

# Si no está corriendo, iniciarlo
supabase start
```

---

## 📚 Documentación Completa

Para más detalles, ver:
- `INTEGRACION_SUPABASE.md` - Documentación técnica completa
- `RESUMEN_INTEGRACION.md` - Resumen ejecutivo
- `CHECKLIST_VERIFICACION.md` - Lista de verificación completa
- `supabase/seed.sql` - Datos de prueba completos

---

## 🎓 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Vista previa de producción

# Supabase (si usa CLI local)
supabase start           # Iniciar Supabase local
supabase stop            # Detener Supabase local
supabase status          # Ver estado de servicios
supabase db reset        # Resetear base de datos

# Git
git status               # Ver cambios
git add .                # Agregar todos los cambios
git commit -m "mensaje"  # Commit
```

---

## ✅ Checklist Mínimo

Antes de empezar, verificar:
- [x] Node.js instalado
- [x] npm instalado
- [x] Supabase configurado (local o cloud)
- [x] Usuario creado en Auth
- [x] Usuario en tabla public.users
- [x] Productos insertados
- [x] Variables de entorno configuradas

---

## 🎉 ¡Listo!

Si completó todos los pasos, el sistema debería estar funcionando.

**Credenciales de prueba:**
- Email: `admin@yappita.com`
- Password: `admin123`

**URL local:** http://localhost:5173

---

## 📞 Ayuda

Si tiene problemas:
1. Revisar la consola del navegador (F12)
2. Revisar logs de Supabase
3. Consultar `INTEGRACION_SUPABASE.md`
4. Verificar políticas RLS en Supabase

---

**Tiempo estimado total**: 5 minutos  
**Dificultad**: Fácil  
**Requisitos**: Básicos
