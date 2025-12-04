import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import CodeModal from './CodeModal';
import SuccessToast from './SuccessToast';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useConfig } from '../hooks/useConfig';

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'WELCOME-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function MerchStore() {
  // Hooks de Supabase
  const { products, loading: loadingProducts, incrementViews } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();
  const { config } = useConfig();

  // Estados locales
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setWelcomeCode(generateRandomCode());
  }, []);

  const applyCode = (inputCode, resetInput) => {
    if (inputCode === welcomeCode && !isCodeUsed) {
      setHasDiscount(true);
      setIsCodeUsed(true);
      setShowCodeModal(false);
      alert(`¡Código aplicado! Tienes ${config.welcome_discount}% de descuento`);
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
      setCart(cart.map((item) => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
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
    return hasDiscount ? subtotal * (1 - config.welcome_discount / 100) : subtotal;
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const completePurchase = () => {
    const itemCount = getTotalItems();
    let newCoupon = null;

    if (itemCount >= 3) {
      newCoupon = `MAKI-${generateRandomCode().slice(-6)}`;
      setCurrentMakiCoupon(newCoupon);
      setUsedMakiCoupons([...usedMakiCoupons, newCoupon]);
    }

    const total = calculateTotal();
    let message = `Hola!%20Quiero%20realizar%20esta%20compra:%0A%0A`;

    cart.forEach((item) => {
      const price = hasDiscount 
        ? (item.price * (1 - config.welcome_discount / 100)).toFixed(2) 
        : item.price.toFixed(2);
      message += `${item.quantity}x%20${item.name}`;
      if (item.selectedSize) message += `%20(${item.selectedSize})`;
      if (item.selectedColor) message += `%20-20${item.selectedColor}`;
      message += `%20-%20S/${price}%0A`;
    });

    message += `%0A*Total:%20S/${total.toFixed(2)}*`;
    
    if (hasDiscount) {
      message += `%0ADescuento%20de%20bienvenida%20(${config.welcome_discount}%25)`;
    }

    if (newCoupon) {
      message += `%0A%0A*FELICITACIONES!*%0AHas%20ganado%20un%20cupon%20de%20descuento%20en%20makis:%0A*${newCoupon}*%0A%0AMuestralo%20al%20ordenar%20tus%20makis`;
    }

    const messageText = message.replace(/%20/g, ' ').replace(/%0A/g, '\n').replace(/%25/g, '%');
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText).catch(() => {});
    }

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${message}`;
    const whatsappUrlAlt = `https://api.whatsapp.com/send?phone=${config.whatsapp_number}&text=${message}`;
    
    const newWindow = window.open(whatsappUrl, '_blank');
    
   

    setShowSuccess(true);
    setCart([]);
    setHasDiscount(false);

    setTimeout(() => {
      setCurrentMakiCoupon(null);
      setShowSuccess(false);
    }, 5000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryList = ['todos', ...categories.map(cat => cat.name)];

  if (loadingProducts || loadingCategories) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-red-600 font-bold">Cargando tienda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fondo dinámico */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header
        hasDiscount={hasDiscount}
        welcomeDiscount={config.welcome_discount}
        cartCount={getTotalItems()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categoryList}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <CodeModal 
        show={showCodeModal} 
        welcomeCode={welcomeCode} 
        welcomeDiscount={config.welcome_discount} 
        onApply={applyCode} 
        onClose={() => setShowCodeModal(false)} 
      />

      <SuccessToast show={showSuccess} />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onIncrementViews={incrementViews}
        />
      )}

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
                  <div key={product.id} onClick={() => setSelectedProduct(product)}>
                    <ProductCard 
                      product={product} 
                      hasDiscount={hasDiscount} 
                      welcomeDiscount={config.welcome_discount} 
                      addToCart={addToCart} 
                    />
                  </div>
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
              welcomeDiscount={config.welcome_discount}
              getTotalItems={getTotalItems}
              currentMakiCoupon={currentMakiCoupon}
              onFinalizePurchase={completePurchase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}