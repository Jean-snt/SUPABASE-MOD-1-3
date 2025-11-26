# 🛒 Yappita POS - Sistema de Punto de Venta

Sistema de Punto de Venta (POS) moderno desarrollado con React, TypeScript y Supabase.

## ✨ Características

- 🔐 **Autenticación Real** con Supabase Auth
- 📦 **Gestión de Productos** desde base de datos
- 💰 **Registro de Ventas** completo (header + details)
- 💵 **Manejo de Caja** con apertura y cierre
- 🎨 **Interfaz Moderna** y responsive
- 🔒 **Seguridad** con Row Level Security (RLS)
- 📊 **TypeScript** para type safety

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+
- npm o yarn
- Cuenta de Supabase (local o cloud)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env.local con sus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script `supabase/seed.sql` para crear datos de prueba
3. Crear usuario de prueba en Authentication
4. Actualizar `.env.local` con sus credenciales

Ver **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** para instrucciones detalladas.

## 📚 Documentación

- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guía de inicio en 5 minutos
- **[INTEGRACION_SUPABASE.md](./INTEGRACION_SUPABASE.md)** - Documentación técnica completa
- **[RESUMEN_INTEGRACION.md](./RESUMEN_INTEGRACION.md)** - Resumen ejecutivo
- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Arquitectura del sistema
- **[CHECKLIST_VERIFICACION.md](./CHECKLIST_VERIFICACION.md)** - Lista de verificación

## 🏗️ Estructura del Proyecto

```
MODULO-2/
├── src/
│   ├── lib/                    # Cliente Supabase
│   ├── types/                  # Tipos TypeScript
│   ├── services/               # Servicios (auth, products, sales, cash)
│   ├── contexts/               # Contextos de React
│   └── components/             # Componentes React
├── components/                 # Componentes principales
├── supabase/                   # Scripts SQL
└── .env.local                  # Variables de entorno
```

## 🔐 Seguridad

- Autenticación con JWT tokens
- Row Level Security (RLS) en todas las tablas
- User ID del usuario autenticado (no hardcodeado)
- Variables de entorno para credenciales

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI**: Lucide React (iconos)
- **Estilos**: Tailwind CSS (inline)

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de producción
```

## 🧪 Pruebas

Ver **[CHECKLIST_VERIFICACION.md](./CHECKLIST_VERIFICACION.md)** para una lista completa de pruebas.

### Flujo de Prueba Básico

1. **Login**: `admin@yappita.com` / `admin123`
2. **Apertura de Caja**: Ingresar monto inicial
3. **Agregar Productos**: Click en productos del catálogo
4. **Realizar Venta**: Pago → Método → Monto → Validar
5. **Verificar**: Revisar en Supabase Dashboard

## 🐛 Solución de Problemas

### Error: "Faltan las variables de entorno"
- Verificar que existe `.env.local`
- Verificar que las variables empiezan con `VITE_`
- Reiniciar el servidor de desarrollo

### Error: "Error al cargar productos"
- Verificar conexión a Supabase
- Verificar que la tabla `products` tiene datos
- Verificar políticas RLS

Ver más en **[INTEGRACION_SUPABASE.md](./INTEGRACION_SUPABASE.md#-solución-de-problemas)**

## 📊 Base de Datos

### Tablas Principales

- `users` - Usuarios del sistema
- `products` - Catálogo de productos
- `sales_header` - Cabecera de ventas
- `sales_detail` - Detalles de ventas
- `cash_movements` - Movimientos de caja

### Datos de Prueba

Ejecutar `supabase/seed.sql` para insertar:
- 25+ productos de ejemplo
- Instrucciones para crear usuarios

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es parte de un módulo educativo.

## 👥 Autores

- **Sala B** - Integración POS + Supabase
- **Sala A** - Base de datos y políticas RLS

## 🙏 Agradecimientos

- Supabase por la plataforma
- React team por el framework
- Lucide por los iconos

## 📞 Soporte

Para problemas o preguntas:
1. Revisar la documentación en este repositorio
2. Verificar logs en consola del navegador
3. Revisar Supabase Dashboard

---

**Versión**: 1.0.0  
**Estado**: ✅ Producción  
**Última actualización**: Noviembre 2024
