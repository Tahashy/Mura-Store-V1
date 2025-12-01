import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import Cart from './Cart';
import CodeModal from './CodeModal';
import SuccessToast from './SuccessToast';

// helpers
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'WELCOME-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function MerchStore() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [welcomeCode, setWelcomeCode] = useState('');
  const [isCodeUsed, setIsCodeUsed] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(true);
  const [currentMakiCoupon, setCurrentMakiCoupon] = useState(null);
  const [usedMakiCoupons, setUsedMakiCoupons] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('51902142112');
  const [welcomeDiscount, setWelcomeDiscount] = useState(20);
  const [categories, setCategories] = useState(['todos', 'polos', 'gorras', 'hoodies', 'accesorios']);

  useEffect(() => {
    const defaultProducts = [
      { id: 1, name: 'Polo Logo Negro', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'polos' },
      { id: 2, name: 'Gorra Snapback', price: 19.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', category: 'gorras' },
      { id: 3, name: 'Hoodie Premium', price: 49.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', category: 'hoodies' },
      { id: 4, name: 'Mochila Canvas', price: 39.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'accesorios' },
    ];
    setProducts(defaultProducts);
    setWelcomeCode(generateRandomCode());
  }, []);

  const applyCode = (inputCode, resetInput) => {
    if (inputCode === welcomeCode && !isCodeUsed) {
      setHasDiscount(true);
      setIsCodeUsed(true);
      setShowCodeModal(false);
      alert(`¡Código aplicado! Tienes ${welcomeDiscount}% de descuento`);
      resetInput('');
    } else if (isCodeUsed) {
      alert('Este código ya fue utilizado');
    } else {
      alert('Código inválido');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return hasDiscount ? subtotal * (1 - welcomeDiscount / 100) : subtotal;
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🔥 FUNCIÓN CORREGIDA
  const completePurchase = () => {
    const itemCount = getTotalItems();
    let newCoupon = null;

    // 🔥 GENERAR CUPÓN SI HAY 3 O MÁS ARTÍCULOS
    if (itemCount >= 3) {
      newCoupon = `MAKI-${generateRandomCode().slice(-6)}`;
      console.log('🎁 Cupón generado:', newCoupon); // Para debug
      setCurrentMakiCoupon(newCoupon); // 🔥 MOSTRAR CUPÓN INMEDIATAMENTE
      setUsedMakiCoupons([...usedMakiCoupons, newCoupon]);
    }

    // Preparar mensaje de WhatsApp - 🔥 EMOJIS CODIFICADOS
    const total = calculateTotal();
    let message = `Hola!%20Quiero%20realizar%20esta%20compra:%0A%0A`;

    cart.forEach((item) => {
      const price = hasDiscount 
        ? (item.price * (1 - welcomeDiscount / 100)).toFixed(2) 
        : item.price.toFixed(2);
      message += `${item.quantity}x%20${item.name}%20-%20S/${price}%0A`;
    });

    message += `%0A*Total:%20S/${total.toFixed(2)}*`;
    
    if (hasDiscount) {
      message += `%0ADescuento%20de%20bienvenida%20(${welcomeDiscount}%25)`;
    }

    // 🔥 AGREGAR CUPÓN AL MENSAJE DE WHATSAPP (sin emojis problemáticos)
    if (newCoupon) {
      message += `%0A%0A*FELICITACIONES!*%0AHas%20ganado%20un%20cupon%20de%20descuento%20en%20makis:%0A*${newCoupon}*%0A%0AMuestralo%20al%20ordenar%20tus%20makis`;
    }

    // Abrir WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

    // Mostrar mensaje de éxito
    setShowSuccess(true);

    // 🔥 LIMPIAR CARRITO Y DESCUENTO
    setCart([]);
    setHasDiscount(false);

    // 🔥 OCULTAR CUPÓN DESPUÉS DE 5 SEGUNDOS (para que el usuario lo vea)
    setTimeout(() => {
      setCurrentMakiCoupon(null);
      setShowSuccess(false);
    }, 5000); // Aumentado a 5 segundos para que alcance a verlo
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header
        hasDiscount={hasDiscount}
        welcomeDiscount={welcomeDiscount}
        cartCount={getTotalItems()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <CodeModal 
        show={showCodeModal} 
        welcomeCode={welcomeCode} 
        welcomeDiscount={welcomeDiscount} 
        onApply={applyCode} 
        onClose={() => setShowCodeModal(false)} 
      />

      <SuccessToast show={showSuccess} />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6 capitalize">
              {selectedCategory === 'todos' ? 'Todos los Productos' : selectedCategory}
            </h2>
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No se encontraron productos</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    hasDiscount={hasDiscount} 
                    welcomeDiscount={welcomeDiscount} 
                    addToCart={addToCart} 
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
              hasDiscount={hasDiscount}
              welcomeDiscount={welcomeDiscount}
              getTotalItems={getTotalItems}
              currentMakiCoupon={currentMakiCoupon}
              onFinalizePurchase={completePurchase} // 🔥 PROP CORREGIDA
            />
          </div>
        </div>
      </div>
    </div>
  );
}