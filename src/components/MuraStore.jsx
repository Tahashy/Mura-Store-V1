import React, { useState, useEffect } from 'react';
import { useCoupons } from '../hooks/useCoupons';
import { Tag } from 'lucide-react';
import Header from './Header';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import SuccessToast from './SuccessToast';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useConfig } from '../hooks/useConfig';

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MAKI-';
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
  const { validateCoupon, markAsUsed } = useCoupons();

  // Estados locales
  const [cart, setCart] = useState([]);
  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('murastore_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito cada vez que cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('murastore_cart', JSON.stringify(cart));
    }else{
      localStorage.removeItem('murastore_cart');
    }
}, [cart]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [currentMakiCoupon, setCurrentMakiCoupon] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  
// Nuevo estado para mensajes de cupón (error / success)
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // Agregar después de los otros estados (línea ~20):
   const [discountedProductId, setDiscountedProductId] = useState(null);

 // Reemplaza la función handleApplyCoupon (línea ~45):
  const handleApplyCoupon = async () => {
    setCouponMessage({ type: "", text: "" });

    if (!couponInput.trim()) {
      setCouponMessage({
        type: "error",
        text: "Ingresa un cupón válido",
      });
      return;
    }

    const result = await validateCoupon(couponInput);

    if (result.success) {
      setAppliedCoupon(result.coupon);
      setHasDiscount(true);
      setShowCouponInput(false);
      setCouponInput("");

      // Si hay productos en el carrito, aplicar al primero por defecto
      if (cart.length > 0) {
        setDiscountedProductId(cart[0].id);
      }

      setCouponMessage({
        type: "success",
        text: `Cupón aplicado: ${result.coupon.discount}% de descuento en 1 producto`,
      });
    } else {
      setCouponMessage({
        type: "error",
        text: result.message,
      });
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

 // Reemplaza la función calculateTotal() completa (aproximadamente línea 80):
// Reemplaza calculateTotal (línea ~80):
  const calculateTotal = () => {
    if (!hasDiscount || !appliedCoupon || !discountedProductId) {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    let total = 0;
    cart.forEach((item) => {
      if (item.id === discountedProductId) {
        // Solo la primera unidad de este producto recibe descuento
        const discountedPrice = item.price * (1 - appliedCoupon.discount / 100);
        total += discountedPrice; // Primera unidad con descuento
        if (item.quantity > 1) {
          total += item.price * (item.quantity - 1); // Resto sin descuento
        }
      } else {
        total += item.price * item.quantity;
      }
    });

    return total;
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  // Reemplaza la función completePurchase (línea 98-135):
  // Reemplaza completePurchase (línea ~98):
  const completePurchase = async () => {
    const itemCount = getTotalItems();

    if (appliedCoupon) {
      await markAsUsed(appliedCoupon.code);
    }

    let newCoupon = null;
    if (itemCount >= 2) {
      newCoupon = `MAKI-${generateRandomCode().slice(-6)}`;
      setCurrentMakiCoupon(newCoupon);
    }

    const total = calculateTotal();
    let message = `Hola!%20Quiero%20realizar%20esta%20compra:%0A%0A`;

    cart.forEach((item) => {
      const isDiscounted = hasDiscount && item.id === discountedProductId;

      let price;
      if (isDiscounted) {
        // Primera unidad con descuento
        const discountedPrice = item.price * (1 - appliedCoupon.discount / 100);
        price = discountedPrice.toFixed(2);

        message += `1x%20${item.name}`;
        if (item.selectedSize) message += `%20(${item.selectedSize})`;
        if (item.selectedColor) message += `%20-%20${item.selectedColor}`;
        message += `%20-%20S/${price}%20✨(${appliedCoupon.discount}%25%20OFF)%0A`;

        // Resto sin descuento
        if (item.quantity > 1) {
          message += `${item.quantity - 1}x%20${item.name}`;
          if (item.selectedSize) message += `%20(${item.selectedSize})`;
          if (item.selectedColor) message += `%20-%20${item.selectedColor}`;
          message += `%20-%20S/${item.price.toFixed(2)}%0A`;
        }
      } else {
        price = item.price.toFixed(2);
        message += `${item.quantity}x%20${item.name}`;
        if (item.selectedSize) message += `%20(${item.selectedSize})`;
        if (item.selectedColor) message += `%20-%20${item.selectedColor}`;
        message += `%20-%20S/${price}%0A`;
      }
    });

    message += `%0A*Total:%20S/${total.toFixed(2)}*`;

    if (hasDiscount && appliedCoupon) {
      message += `%0ACupón%20usado:%20${appliedCoupon.code}`;
    }

    if (newCoupon) {
      message += `%0A%0A*¡FELICITACIONES!*%0AHas%20ganado%20un%20cupón%20de%20makis:%0A*${newCoupon}*`;
    }

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setShowSuccess(true);
    setCart([]);
    setHasDiscount(false);
    setAppliedCoupon(null);
    setDiscountedProductId(null); // 🔥 RESETEAR

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

      {/* Botón para ingresar cupón */}
      {!hasDiscount && (
        <button
          onClick={() => setShowCouponInput(!showCouponInput)}
          className="fixed top-20 right-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition z-40 flex items-center gap-2 shadow-lg"
        >
          <Tag className="w-4 h-4" />
          ¿Tienes un cupón?
        </button>
      )}

      {/* Modal para ingresar cupón */}
      {showCouponInput && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Ingresa tu cupón</h3>
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="WELCOME-XXXXXX"
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg mb-4 focus:border-red-600 focus:outline-none text-center text-lg tracking-wider"
              maxLength="14"
            />
            {couponMessage.text && (
              <p className={`text-sm mb-4 ${couponMessage.type === "error" ? "text-red-500" : "text-green-500"}`}>
                {couponMessage.text}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleApplyCoupon}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Aplicar
              </button>
              <button
                onClick={() => {
                  setShowCouponInput(false);
                  setCouponInput('');
                }}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        hasDiscount={hasDiscount}
        welcomeDiscount={appliedCoupon?.discount || 0}
        cartCount={getTotalItems()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categoryList}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
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
        {/* Mostrar cupón activo */}
        {hasDiscount && appliedCoupon && (
          <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-600 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-bold">Cupón aplicado: {appliedCoupon.code}</p>
                <p className="text-green-300 text-sm">{appliedCoupon.discount}% de descuento</p>
              </div>
            </div>
          </div>
        )}

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
                      welcomeDiscount={appliedCoupon?.discount || 0} 
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
              welcomeDiscount={appliedCoupon?.discount || 0}
              getTotalItems={getTotalItems}
              currentMakiCoupon={currentMakiCoupon}
              onFinalizePurchase={completePurchase}
              discountedProductId={discountedProductId} // 🔥 NUEVA PROP
              onSelectDiscountProduct={setDiscountedProductId} // 🔥 NUEVA PROP
              appliedCoupon={appliedCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}