
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  PlusCircle, 
  Barcode, 
  AlignJustify,
  Home,
  ShoppingCart,
  Delete,
  User,
  Banknote,
  CreditCard,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  X,
  Printer,
  Send,
  Check,
  Settings,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface DashboardLayoutProps {
  isBlurred?: boolean;
}

// --- Mock Data Defaults ---

const CATEGORIES = [
  { id: 'all', name: 'Todo', icon: <Home size={16} />, color: 'bg-gray-200 text-gray-700' },
  { id: 'frutas', name: 'Frutas', color: 'bg-[#FADCD9] text-[#8B4513]' }, 
  { id: 'verduras', name: 'Verduras', color: 'bg-[#C1E1C1] text-[#2E8B57]' }, 
  { id: 'tuberculos', name: 'Tubérculos', color: 'bg-[#E6CCB2] text-[#5D4037]' },
  { id: 'frutales', name: 'Frutales', color: 'bg-[#FFE5B4] text-[#D2691E]' },
  { id: 'hortalizas', name: 'Hortalizas', color: 'bg-[#98FB98] text-[#006400]' },
  { id: 'bulbos', name: 'Bulbos', color: 'bg-[#E0B0FF] text-[#4B0082]' },
  { id: 'legumbres', name: 'Legumbres', color: 'bg-[#FFFACD] text-[#8B8000]' },
  { id: 'citricos', name: 'Cítricos', color: 'bg-[#FFD700] text-[#8B4500]' },
  { id: 'tropicales', name: 'Tropicales', color: 'bg-[#FF7F50] text-[#8B0000]' },
  { id: 'hierbas', name: 'Hierbas', color: 'bg-[#ACE1AF] text-[#006400]' },
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Manzana Roja', price: 5.20, unit: 'kg', category: 'frutas', image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Plátano Seda', price: 2.50, unit: 'kg', category: 'tropicales', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Papa Amarilla', price: 3.80, unit: 'kg', category: 'tuberculos', image: 'https://images.unsplash.com/photo-1633013649620-420897578669?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Zanahoria', price: 1.90, unit: 'kg', category: 'verduras', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Cebolla Roja', price: 2.20, unit: 'kg', category: 'bulbos', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Tomate', price: 3.50, unit: 'kg', category: 'verduras', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Naranja Jugo', price: 3.00, unit: 'kg', category: 'citricos', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Piña Golden', price: 4.50, unit: 'un', category: 'tropicales', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Perejil', price: 1.00, unit: 'un', category: 'hierbas', image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Lechuga', price: 2.00, unit: 'un', category: 'hortalizas', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'Camote Morado', price: 2.80, unit: 'kg', category: 'tuberculos', image: 'https://images.unsplash.com/photo-1596097635121-14b63b8a66cf?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'Fresa', price: 8.00, unit: 'kg', category: 'frutales', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80' },
  { id: 13, name: 'Mandarina', price: 3.50, unit: 'kg', category: 'citricos', image: 'https://images.unsplash.com/photo-1611105637889-281587d2c9b9?auto=format&fit=crop&w=600&q=80' },
  { id: 14, name: 'Brócoli', price: 4.20, unit: 'un', category: 'verduras', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80' },
  { id: 15, name: 'Ajo', price: 15.00, unit: 'kg', category: 'bulbos', image: 'https://images.unsplash.com/photo-1588855933979-25d2997538eb?auto=format&fit=crop&w=600&q=80' },
  { id: 16, name: 'Pimiento', price: 4.80, unit: 'kg', category: 'verduras', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
  { id: 17, name: 'Limón', price: 4.50, unit: 'kg', category: 'citricos', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { id: 18, name: 'Palta Fuerte', price: 9.50, unit: 'kg', category: 'tropicales', image: 'https://images.unsplash.com/photo-1596151782685-2214e70d280a?auto=format&fit=crop&w=600&q=80' },
  { id: 19, name: 'Espinaca', price: 2.50, unit: 'atado', category: 'hortalizas', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
  { id: 20, name: 'Apio', price: 3.00, unit: 'atado', category: 'hortalizas', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
];

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

type ViewState = 'pos' | 'payment' | 'receipt' | 'backend';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isBlurred = false }) => {
  // Initialize products from localStorage if available, otherwise use defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('pos_products_v1');
      return savedProducts ? JSON.parse(savedProducts) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<ViewState>('pos');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [tenderAmount, setTenderAmount] = useState('');

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pos_products_v1', JSON.stringify(products));
  }, [products]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      const incrementAmount = 1.5; 

      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
          ? { ...item, qty: item.qty + incrementAmount } 
          : item
        );
      }
      return [...prev, { product, qty: incrementAmount }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const handleTenderInput = (val: string) => {
      if (val === 'backspace') {
          setTenderAmount(prev => prev.slice(0, -1));
      } else {
          setTenderAmount(prev => prev + val);
      }
  };
  
  const handleQuickCash = (amount: number) => {
      const current = parseFloat(tenderAmount) || 0;
      setTenderAmount((current + amount).toString());
  };

  const handleValidateSale = () => {
      setView('receipt');
  };

  const handleNewOrder = () => {
      setCart([]);
      setTenderAmount('');
      setView('pos');
  };

  // Backend Image Upload Handler
  const handleImageUpload = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, image: base64String } : p
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate Change / Remaining
  const tenderedValue = parseFloat(tenderAmount) || 0;
  const difference = cartTotal - tenderedValue;
  const isChange = difference < 0;
  const changeAmount = Math.abs(difference);

  return (
    <div className={`flex flex-col h-screen bg-gray-100 text-gray-800 transition-all duration-300 ${isBlurred ? 'blur-[2px]' : ''}`}>
      
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-300 flex shrink-0 shadow-sm z-20 relative">
        
        {/* Header Left (Matches Cart Width 420px) */}
        <div className="w-[420px] border-r border-gray-300 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setView('pos')}
              className={`px-3 py-1 font-medium text-sm rounded-sm transition-colors ${view === 'pos' ? 'bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Registrar
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-medium text-sm rounded-sm transition-colors">
              Pedidos
            </button>
            <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
              <PlusCircle size={18} />
            </button>
          </div>
          <div className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded border border-gray-300">
            1001
          </div>
        </div>

        {/* Header Right (Main Workspace) */}
        <div className="flex-1 flex items-center px-3 gap-4">
            {/* Conditional header content based on view */}
            {view === 'pos' && (
                <>
                  {/* DIGITAL SCALE DISPLAY */}
                  <div className="flex h-12 border-4 border-gray-300 rounded overflow-hidden shadow-md">
                      {/* Digital Number Display */}
                      <div className="bg-[#39FF14] w-48 flex items-center justify-end px-2 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '4px 4px'}}></div>
                          <span className="font-digital text-black text-6xl leading-none tracking-widest translate-y-1">
                              1.500
                          </span>
                      </div>
                      {/* Unit Box */}
                      <div className="bg-[#2c3e50] w-14 flex items-center justify-center border-l border-gray-600">
                          <span className="text-white font-medium text-xl">kg</span>
                      </div>
                  </div>

                  <div className="flex-1 max-w-md ml-auto">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#704559]" size={16} />
                      <input 
                        type="text" 
                        placeholder="Buscar productos..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#704559] rounded-sm text-sm focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </>
            )}
            
            {view === 'payment' && (
                <div className="flex-1 flex justify-center">
                   <h1 className="text-xl font-bold text-gray-600">PAGOS</h1>
                </div>
            )}

            {view === 'receipt' && (
                <div className="flex-1 flex justify-center">
                   <h1 className="text-xl font-bold text-gray-600">RECIBO</h1>
                </div>
            )}

            {view === 'backend' && (
                <div className="flex-1 flex justify-center">
                   <h1 className="text-xl font-bold text-gray-600">GESTIÓN DE INVENTARIO (Temporal)</h1>
                </div>
            )}

          <div className="flex items-center space-x-3 text-gray-500 ml-auto">
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-medium text-green-600">Conectado</span>
            </div>
            
            <button 
              onClick={() => setView(view === 'backend' ? 'pos' : 'backend')}
              className={`p-2 rounded transition-colors ${view === 'backend' ? 'bg-[#704559] text-white shadow-md' : 'hover:bg-gray-100 hover:text-gray-800'}`}
              title="Gestión de Productos"
            >
              <Settings size={20} />
            </button>

            <button className="hover:text-gray-800"><Barcode size={20} /></button>
            <div className="w-7 h-7 bg-[#A0522D] text-white rounded flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90 shadow-sm">
              W
            </div>
            <button className="hover:text-gray-800"><AlignJustify size={20} /></button>
          </div>
        </div>

      </header>

      {/* CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* VIEW: POS (Standard) */}
        {view === 'pos' && (
            <>
                {/* LEFT PANEL: Cart / Numpad */}
                <div className="w-[420px] bg-white border-r border-gray-300 flex flex-col relative shadow-lg z-10 shrink-0">
                
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                        <ShoppingCart size={80} strokeWidth={1} />
                        <p className="font-medium text-gray-400 text-lg">La cesta está vacía</p>
                        <p className="text-sm text-gray-400 max-w-[200px] text-center">Seleccione productos de la derecha para comenzar una venta</p>
                    </div>
                    ) : (
                    <div className="flex flex-col">
                        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 border-b border-gray-200 flex sticky top-0 z-10">
                            <span className="flex-1">Producto</span>
                            <span className="w-20 text-center">Precio U.</span>
                            <span className="w-16 text-center">Cant/ Kg</span>
                            <span className="w-20 text-right">Total</span>
                        </div>
                        {cart.map((item, idx) => (
                        <div key={idx} className={`px-4 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer group flex items-center ${idx === cart.length - 1 ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex-1">
                            <p className="text-base font-bold text-gray-800 leading-tight">{item.product.name}</p>
                            </div>
                            <div className="w-20 text-center text-xs font-medium text-gray-500">
                                S/. {item.product.price.toFixed(2)} <span className='text-[10px]'>/{item.product.unit}</span>
                            </div>
                            <div className="w-16 text-center font-bold text-gray-700">
                            {item.qty.toFixed(3)}
                            </div>
                            <div className="w-20 text-right font-bold text-gray-900">
                            S/. {(item.product.price * item.qty).toFixed(2)}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Totals Section */}
                <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                    <div className="flex justify-between items-end">
                    <span className="text-gray-800 text-xl font-bold">Total</span>
                    <span className="text-gray-900 text-3xl font-bold">S/. {cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Keypad / Action Area */}
                <div className="border-t border-gray-300 bg-white">
                    {/* 4x4 Grid */}
                    <div className="grid grid-cols-4 h-[240px]">
                        {/* Row 1 */}
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">1</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">2</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">3</button>
                        <button className="border-b border-gray-200 bg-[#e0f2f1] hover:bg-[#b2dfdb] text-lg font-semibold text-teal-900 active:bg-[#80cbc4]">Ctd.</button>
                        
                        {/* Row 2 */}
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">4</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">5</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">6</button>
                        <button className="border-b border-gray-200 hover:bg-gray-100 text-lg font-medium text-gray-700 active:bg-gray-200">%</button>
                        
                        {/* Row 3 */}
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">7</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">8</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">9</button>
                        <button className="border-b border-gray-200 hover:bg-gray-100 text-lg font-medium text-gray-700 active:bg-gray-200">Precio</button>
                        
                        {/* Row 4 */}
                        <button className="border-r border-b border-gray-200 bg-[#fff59d] hover:bg-[#fff176] text-lg font-medium text-gray-800 active:bg-[#ffee58]">+/-</button>
                        <button className="border-r border-b border-gray-200 hover:bg-gray-100 text-xl font-medium text-gray-700 active:bg-gray-200">0</button>
                        {/* Comma button matches 'Verduras' color (#C1E1C1) */}
                        <button className="border-r border-b border-gray-200 bg-[#C1E1C1] hover:bg-[#a8d8a8] text-xl font-medium text-gray-800 active:bg-[#8fce8f]"> , </button>
                        {/* Delete button matches 'Hortalizas' color (#98FB98) */}
                        <button className="border-b border-gray-200 bg-[#98FB98] hover:bg-[#80e680] text-gray-800 active:bg-[#6bd46b] flex items-center justify-center">
                        <Delete className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {/* Payment Button */}
                    <button 
                        onClick={() => setView('payment')}
                        disabled={cart.length === 0}
                        className="w-full h-[60px] bg-[#28a745] hover:bg-[#218838] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold flex items-center justify-center shadow-inner active:bg-[#1e7e34] transition-colors"
                    >
                        Pago
                    </button>
                </div>
                </div>

                {/* RIGHT PANEL: Product Catalog */}
                <div className="flex-1 flex flex-col bg-[#f0f0f0] overflow-hidden">
                    
                    {/* Category Breadcrumbs */}
                    <div className="p-3 bg-white border-b border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap custom-scrollbar">
                        <div className="flex space-x-3">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2 rounded shadow-sm text-sm font-bold transition-all hover:shadow-md flex items-center gap-2 ${activeCategory === cat.id ? 'ring-2 ring-offset-1 ring-gray-400' : ''} ${cat.color}`}
                                >
                                    {cat.icon && <span>{cat.icon}</span>}
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filteredProducts.map(product => (
                                <div 
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group relative flex flex-col h-[180px]"
                                >
                                    {/* Price Tag */}
                                    <div className="absolute top-1 right-1 bg-green-600 text-white text-sm font-bold px-2 py-1 rounded z-20 shadow-sm">
                                        S/. {product.price.toFixed(2)}
                                    </div>
                                    
                                    {/* Image */}
                                    <div className="absolute inset-0 w-full h-full bg-gray-100">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Name Overlay */}
                                    <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-[1px] p-2 border-t border-gray-100/50 z-10">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                                            {product.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* VIEW: PAYMENT SCREEN */}
        {view === 'payment' && (
            <div className="w-full h-full flex animate-in fade-in duration-200">
                {/* Payment Methods Sidebar (Left) */}
                <div className="w-[320px] bg-white border-r border-gray-300 flex flex-col p-4 space-y-3">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Métodos de Pago</h3>
                    
                    <button 
                        onClick={() => setPaymentMethod('efectivo')}
                        className={`flex items-center p-4 rounded border transition-all ${paymentMethod === 'efectivo' ? 'border-green-500 bg-green-50 text-green-700 shadow-md' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                    >
                        <Banknote className="mr-3" />
                        <span className="font-bold">Efectivo</span>
                    </button>

                    <button 
                        onClick={() => setPaymentMethod('yape')}
                        className={`flex items-center p-4 rounded border transition-all ${paymentMethod === 'yape' ? 'border-[#742284] bg-[#f3e5f5] text-[#742284] shadow-md' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                    >
                        <div className="w-6 h-6 rounded bg-[#742284] flex items-center justify-center mr-3 text-white">
                            <Smartphone size={14} />
                        </div>
                        <span className="font-bold">Yape</span>
                    </button>

                    <button 
                        onClick={() => setPaymentMethod('plin')}
                        className={`flex items-center p-4 rounded border transition-all ${paymentMethod === 'plin' ? 'border-[#00C9E0] bg-[#e0f7fa] text-[#0097a7] shadow-md' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                    >
                         <div className="w-6 h-6 rounded bg-[#00C9E0] flex items-center justify-center mr-3 text-white">
                            <Smartphone size={14} />
                        </div>
                        <span className="font-bold">Plin</span>
                    </button>

                    <button 
                        onClick={() => setPaymentMethod('tarjeta')}
                        className={`flex items-center p-4 rounded border transition-all ${paymentMethod === 'tarjeta' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                    >
                        <CreditCard className="mr-3" />
                        <span className="font-bold">Tarjeta</span>
                    </button>
                </div>

                {/* Payment Detail & Numpad (Right) */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {/* Amount Display */}
                    <div className="flex-1 flex flex-col items-center pt-16 px-20">
                        {/* Big Total centered top */}
                        <div className="text-[64px] font-bold text-gray-700 tracking-tight leading-none mb-12">
                            S/ <span className="text-gray-800">{cartTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        {/* Payment Lines Container */}
                        <div className="w-full max-w-3xl space-y-4">
                            
                            {/* Render Effective Line if entered */}
                            {tenderedValue > 0 && (
                                <div className="flex items-center justify-between bg-[#E0F2F1] border border-[#80CBC4] rounded-md px-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <span className="text-xl font-medium text-gray-700">Efectivo</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-[#1B5E20]">
                                            S/ {tenderedValue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <button 
                                            onClick={() => setTenderAmount('')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Change / Remaining Line */}
                            {tenderedValue > 0 && (
                                <div className="flex items-center justify-between px-6 py-2">
                                    <span className={`text-xl font-medium ${isChange ? 'text-red-500' : 'text-gray-500'}`}>
                                        {isChange ? 'Vuelto' : 'Restante'}
                                    </span>
                                    <span className={`text-2xl font-bold ${isChange ? 'text-red-500' : 'text-gray-800'}`}>
                                        S/ {isChange ? '-' : ''}{Math.abs(difference).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            
                            {/* Placeholder/Hint if no input yet */}
                            {tenderedValue === 0 && (
                                <div className="text-center text-gray-400 mt-10">
                                    Ingrese el monto en efectivo
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Controls Area */}
                    <div className="h-[450px] w-full max-w-4xl mx-auto flex flex-col p-4">
                        
                        {/* Customer / Invoice Row */}
                        <div className="flex gap-3 mb-3 h-12">
                            <button className="flex-1 bg-white border border-gray-300 rounded flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-50 shadow-sm">
                                <User size={18} />
                                <span>Cliente</span>
                            </button>
                            <button className="flex-1 bg-white border border-gray-300 rounded flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-50 shadow-sm">
                                <span>📄 Nota de Venta</span>
                            </button>
                        </div>

                        {/* Numpad */}
                        <div className="flex-1 grid grid-cols-4 gap-3 mb-3">
                            <button onClick={() => handleTenderInput('1')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">1</button>
                            <button onClick={() => handleTenderInput('2')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">2</button>
                            <button onClick={() => handleTenderInput('3')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">3</button>
                            <button onClick={() => handleQuickCash(10)} className="bg-[#C8E6C9] rounded shadow-sm text-xl font-bold text-green-800 hover:bg-[#A5D6A7] border border-green-200">+10</button>
                            
                            <button onClick={() => handleTenderInput('4')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">4</button>
                            <button onClick={() => handleTenderInput('5')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">5</button>
                            <button onClick={() => handleTenderInput('6')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">6</button>
                            <button onClick={() => handleQuickCash(20)} className="bg-[#C8E6C9] rounded shadow-sm text-xl font-bold text-green-800 hover:bg-[#A5D6A7] border border-green-200">+20</button>
                            
                            <button onClick={() => handleTenderInput('7')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">7</button>
                            <button onClick={() => handleTenderInput('8')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">8</button>
                            <button onClick={() => handleTenderInput('9')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">9</button>
                            <button onClick={() => handleQuickCash(50)} className="bg-[#C8E6C9] rounded shadow-sm text-xl font-bold text-green-800 hover:bg-[#A5D6A7] border border-green-200">+50</button>
                            
                            {/* Updated Buttons Colors to Match POS */}
                            <button className="bg-[#fff59d] rounded shadow-sm text-xl font-bold text-gray-800 hover:bg-[#fff176] border border-yellow-200">+/-</button>
                            <button onClick={() => handleTenderInput('0')} className="bg-white rounded shadow-sm text-2xl font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">0</button>
                            <button onClick={() => handleTenderInput('.')} className="bg-[#C1E1C1] rounded shadow-sm text-2xl font-bold text-gray-800 hover:bg-[#a8d8a8] border border-[#a8d8a8]"> , </button>
                            <button onClick={() => handleTenderInput('backspace')} className="bg-[#98FB98] rounded shadow-sm text-gray-800 hover:bg-[#80e680] border border-[#80e680] flex items-center justify-center">
                                <Delete />
                            </button>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex gap-4 h-14">
                            <button 
                                onClick={() => setView('pos')}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                Regresar
                            </button>
                            <button 
                                onClick={handleValidateSale}
                                className="flex-[2] bg-[#704559] text-white font-bold rounded shadow-md hover:bg-[#5a3748] flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Validar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )}

        {/* VIEW: RECEIPT SCREEN */}
        {view === 'receipt' && (
            <div className="w-full h-full flex animate-in zoom-in-95 duration-300 bg-gray-100">
                
                {/* Left Panel: Success & Actions */}
                <div className="w-1/2 flex flex-col items-center justify-center p-8 border-r border-gray-200 bg-white z-10 shadow-lg">
                    
                    <div className="w-full max-w-md space-y-8">
                        {/* Success Card */}
                        <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-6 text-center shadow-sm">
                            <div className="w-16 h-16 bg-[#2e7d32] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Check size={32} className="text-white" strokeWidth={4} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1b5e20] mb-1">Pago exitoso</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                S/ {cartTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded flex items-center justify-center gap-2 transition-colors">
                                <Printer size={20} />
                                Imprimir recibo completo
                            </button>
                            
                            <div className="flex gap-0">
                                <input 
                                    type="email" 
                                    placeholder="e.g. cliente@email.com" 
                                    className="flex-1 border border-gray-300 rounded-l px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#704559]"
                                />
                                <button className="bg-[#a1887f] hover:bg-[#8d6e63] text-white px-6 rounded-r flex items-center">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                     {/* Bottom Action */}
                     <div className="mt-auto w-full">
                        <button 
                            onClick={handleNewOrder}
                            className="w-full py-4 bg-[#704559] hover:bg-[#5a3748] text-white text-xl font-bold rounded shadow-md transition-transform active:scale-[0.99]"
                        >
                            Nueva orden
                        </button>
                     </div>

                </div>

                {/* Right Panel: Receipt Preview */}
                <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8 overflow-y-auto">
                    <div className="bg-white w-[380px] shadow-2xl py-8 px-6 text-sm font-mono text-gray-700 relative">
                        {/* Paper Torn Edge Effect (Top/Bottom) - CSS visual trick or simple shadow */}
                        
                        {/* Logo Area */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex items-center gap-1 mb-1">
                                <ShoppingCart className="text-[#8bc34a] fill-[#8bc34a]" size={28} />
                                <span className="text-3xl font-black tracking-tight flex">
                                    <span className="text-[#2e7d32]">y</span>
                                    <span className="text-[#4caf50]">app</span>
                                    <span className="text-[#cddc39]">i</span>
                                    <span className="text-[#8bc34a]">ta</span>
                                </span>
                            </div>
                            <div className="text-center text-xs text-gray-500 space-y-0.5">
                                <p>Tel: +51 987 654 321</p>
                                <p>admin@yappita.com</p>
                                <p>http://yappita.com</p>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="text-center mb-4 border-b border-dashed border-gray-300 pb-4">
                            <p className="mb-1">Atendido por: <span className="font-bold">Cajero 01</span></p>
                            <h3 className="text-2xl font-bold text-gray-800">101</h3>
                        </div>

                        {/* Line Items */}
                        <div className="space-y-3 mb-6 border-b border-dashed border-gray-300 pb-6">
                            {cart.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between font-bold">
                                        <span>{item.product.name}</span>
                                        <span>S/ {(item.product.price * item.qty).toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.qty.toFixed(3)} x S/ {item.product.price.toFixed(2)} / {item.product.unit}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-1 mb-6 border-b border-dashed border-gray-300 pb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>S/ {cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs">
                                <span>0% IGV</span>
                                <span>S/ 0.00</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                                <span>TOTAL</span>
                                <span>S/ {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-1 text-xs mb-8">
                            <div className="flex justify-between">
                                <span>Efectivo</span>
                                <span>S/ {tenderedValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Vuelto</span>
                                <span>S/ -{changeAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-[10px] text-gray-400">
                            <p>Con la tecnología de Yappita POS</p>
                            <p className="mt-1">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                            <p>Orden 00001-005-0001</p>
                        </div>

                    </div>
                </div>

            </div>
        )}

        {/* VIEW: BACKEND (Inventory Management) */}
        {view === 'backend' && (
            <div className="w-full h-full bg-gray-50 p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Gestión de Inventario (Temporal)</h2>
                            <p className="text-gray-500">Cargue imágenes personalizadas. Los cambios se guardan en este navegador.</p>
                        </div>
                        <button 
                            onClick={() => setView('pos')}
                            className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                        >
                            Volver al POS
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 w-20">ID</th>
                                    <th className="p-4 font-semibold text-gray-600 w-24">Imagen</th>
                                    <th className="p-4 font-semibold text-gray-600">Producto</th>
                                    <th className="p-4 font-semibold text-gray-600">Categoría</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-500">#{product.id}</td>
                                        <td className="p-4">
                                            <div className="w-12 h-12 rounded bg-gray-200 border border-gray-300 overflow-hidden relative">
                                                 <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Error';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                        <td className="p-4 text-sm text-gray-500 capitalize">{product.category}</td>
                                        <td className="p-4 text-right">
                                            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 cursor-pointer transition-colors text-sm font-medium">
                                                <Upload size={16} />
                                                Cambiar Foto
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleImageUpload(product.id, e)}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DashboardLayout;
