# 🏗️ Arquitectura del Sistema POS + Supabase

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Login     │  │  Dashboard   │  │   Opening    │         │
│  │  Component   │  │    Layout    │  │    Modal     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                  │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  AuthContext    │                           │
│                  │  (useAuth hook) │                           │
│                  └────────┬────────┘                           │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐           │
│  │   Auth      │  │  Inventory  │  │   Sales     │           │
│  │  Service    │  │   Service   │  │  Service    │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│         │                 │                 │                  │
│         │        ┌────────▼────────┐        │                  │
│         │        │  Cash Movement  │        │                  │
│         │        │    Service      │        │                  │
│         │        └────────┬────────┘        │                  │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │ Supabase Client │                           │
│                  └────────┬────────┘                           │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTPS / WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      SUPABASE (Backend)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Supabase Auth                          │  │
│  │  - JWT Tokens                                             │  │
│  │  - Session Management                                     │  │
│  │  - Password Authentication                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  PostgreSQL Database                      │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │  users   │  │ products │  │  sales_  │               │  │
│  │  │          │  │          │  │  header  │               │  │
│  │  └──────────┘  └──────────┘  └──────────┘               │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐                              │  │
│  │  │  sales_  │  │   cash_  │                              │  │
│  │  │  detail  │  │movements │                              │  │
│  │  └──────────┘  └──────────┘                              │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Row Level Security (RLS)                     │  │
│  │  - User can only access their own data                   │  │
│  │  - Policies enforce auth.uid() checks                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Login Component → authService.login()
    ↓
Supabase Auth (signInWithPassword)
    ↓
JWT Token + User ID
    ↓
Query public.users table
    ↓
AuthContext (global state)
    ↓
Dashboard (authenticated)
```

### 2. Carga de Productos
```
Dashboard Mount → inventoryService.getAllProducts()
    ↓
Supabase Query: SELECT * FROM products
    ↓
RLS Check: User authenticated?
    ↓
Return products array
    ↓
Update component state
    ↓
Render product grid
```

### 3. Apertura de Caja
```
Opening Modal → cashMovementService.registerOpening()
    ↓
Prepare data: { user_id, movement_type: 'apertura', amount, note }
    ↓
Supabase Insert: INSERT INTO cash_movements
    ↓
RLS Check: user_id = auth.uid()?
    ↓
Return inserted record
    ↓
Close modal, enable dashboard
```

### 4. Proceso de Venta
```
Add to Cart → Local state (cart array)
    ↓
Click "Pago" → Payment screen
    ↓
Select payment method → Local state
    ↓
Enter amount → Local state
    ↓
Click "Validar" → salesService.registerSale()
    ↓
Transaction Start
    ├─ INSERT INTO sales_header
    │  ↓
    │  Get sale_header_id
    │  ↓
    └─ INSERT INTO sales_detail (multiple rows)
       ↓
       RLS Check: user_id = auth.uid()?
       ↓
       Return success
       ↓
       Show receipt screen
```

---

## 📁 Estructura de Archivos

```
MODULO-2/
│
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts          # Cliente Supabase configurado
│   │
│   ├── types/
│   │   └── database.types.ts          # Tipos TypeScript
│   │
│   ├── services/                      # Capa de servicios
│   │   ├── authService.ts             # Autenticación
│   │   ├── inventoryService.ts        # Productos
│   │   ├── salesService.ts            # Ventas
│   │   └── cashMovementService.ts     # Caja
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx            # Estado global de auth
│   │
│   └── components/
│       └── Login.tsx                  # Componente de login
│
├── components/
│   ├── DashboardLayout.tsx            # Dashboard principal
│   └── OpeningModal.tsx               # Modal de apertura
│
├── App.tsx                            # Componente raíz
├── index.tsx                          # Entry point
│
├── .env.local                         # Variables de entorno
├── package.json                       # Dependencias
└── tsconfig.json                      # Config TypeScript
```

---

## 🔐 Modelo de Seguridad

### Capas de Seguridad

```
┌─────────────────────────────────────────┐
│  1. Frontend Validation                 │
│  - Form validation                      │
│  - Type checking (TypeScript)           │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  2. Supabase Auth                       │
│  - JWT Token validation                 │
│  - Session management                   │
│  - Password hashing                     │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  3. Row Level Security (RLS)            │
│  - auth.uid() checks                    │
│  - User can only access own data        │
│  - Policies on all tables               │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  4. Database Constraints                │
│  - Foreign keys                         │
│  - NOT NULL constraints                 │
│  - Data type validation                 │
└─────────────────────────────────────────┘
```

### Políticas RLS Esperadas

```sql
-- Ejemplo de política para sales_header
CREATE POLICY "Users can insert their own sales"
ON sales_header FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sales"
ON sales_header FOR SELECT
USING (auth.uid() = user_id);
```

---

## 🔄 Estados de la Aplicación

### Estado de Autenticación
```typescript
interface AuthState {
  user: User | null;           // Usuario autenticado
  loading: boolean;            // Cargando sesión
  isAuthenticated: boolean;    // ¿Está autenticado?
}
```

### Estado del Dashboard
```typescript
interface DashboardState {
  products: Product[];         // Productos cargados
  loadingProducts: boolean;    // Cargando productos
  productsError: string;       // Error al cargar
  
  cart: CartItem[];            // Carrito de compras
  activeCategory: string;      // Categoría activa
  
  view: ViewState;             // Vista actual (pos/payment/receipt)
  paymentMethod: string;       // Método de pago seleccionado
  tenderAmount: string;        // Monto ingresado
  
  processingPayment: boolean;  // Procesando venta
  saleError: string;           // Error en venta
}
```

---

## 🎯 Patrones de Diseño Utilizados

### 1. Service Layer Pattern
- Separación de lógica de negocio en servicios
- Cada servicio maneja una entidad (auth, products, sales, cash)
- Servicios son reutilizables y testeables

### 2. Context API Pattern
- Estado global de autenticación
- Evita prop drilling
- Hook personalizado `useAuth()`

### 3. Repository Pattern
- Servicios actúan como repositorios
- Abstracción de acceso a datos
- Fácil cambio de backend si es necesario

### 4. Component Composition
- Componentes pequeños y enfocados
- Reutilización de componentes
- Separación de presentación y lógica

---

## 📊 Modelo de Datos

### Relaciones entre Tablas

```
users (1) ──────────────┐
                        │
                        │ user_id
                        │
                        ├──> sales_header (N)
                        │         │
                        │         │ sale_header_id
                        │         │
                        │         └──> sales_detail (N)
                        │                   │
                        │                   │ product_id
                        │                   │
                        │                   └──> products (1)
                        │
                        └──> cash_movements (N)
```

### Tipos de Datos

```typescript
User {
  id: string (UUID)
  email: string
  role: 'admin' | 'cashier'
  full_name?: string
}

Product {
  id: number
  name: string
  price: number
  unit: string
  category: string
  image: string
}

SalesHeader {
  id: number
  user_id: string (FK → users.id)
  total_amount: number
  payment_method: 'efectivo' | 'yape' | 'plin' | 'tarjeta'
  status: 'completed' | 'pending' | 'cancelled'
  created_at: timestamp
}

SalesDetail {
  id: number
  sale_header_id: number (FK → sales_header.id)
  product_id: number (FK → products.id)
  quantity: number
  unit_price: number
  subtotal: number
}

CashMovement {
  id: number
  user_id: string (FK → users.id)
  movement_type: 'apertura' | 'cierre' | 'ingreso' | 'egreso'
  amount: number
  note?: string
  created_at: timestamp
}
```

---

## 🚀 Flujo de Deployment

### Desarrollo Local
```
1. npm install
2. Configure .env.local
3. supabase start (if using local)
4. npm run dev
```

### Producción
```
1. Update .env.local with production credentials
2. npm run build
3. Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
4. Configure environment variables in hosting platform
```

---

## 📈 Escalabilidad

### Consideraciones Futuras

1. **Caché de Productos**
   - Implementar caché local para productos
   - Reducir llamadas a Supabase

2. **Optimistic Updates**
   - Actualizar UI antes de confirmar con servidor
   - Mejor UX

3. **Paginación**
   - Implementar paginación para productos
   - Lazy loading de ventas históricas

4. **WebSockets**
   - Supabase Realtime para actualizaciones en tiempo real
   - Sincronización entre múltiples cajas

5. **Offline Support**
   - Service Workers
   - IndexedDB para datos locales
   - Sincronización cuando vuelve conexión

---

## 🔍 Monitoreo y Debugging

### Logs Importantes

```typescript
// En servicios
console.log('Calling Supabase:', endpoint, params);
console.error('Supabase error:', error);

// En componentes
console.log('State updated:', newState);
console.error('Component error:', error);
```

### Herramientas de Debug

1. **React DevTools** - Inspeccionar componentes y estado
2. **Network Tab** - Ver requests a Supabase
3. **Supabase Dashboard** - Ver logs y queries
4. **Console** - Errores y warnings

---

## 📚 Referencias

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024
