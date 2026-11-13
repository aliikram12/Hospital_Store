import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('hospital_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteModalProduct, setQuoteModalProduct] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('hospital_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      addToast(`Updated quantity for "${product.name.slice(0, 30)}..." in your cart`, 'info');
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity || 99) }
            : item
        )
      );
    } else {
      addToast(`Added "${product.name.slice(0, 30)}..." to your cart`, 'success');
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          price: product.price,
          original_price: product.original_price,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          quantity: Math.max(1, quantity)
        }
      ]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      addToast(`Removed "${item.name.slice(0, 25)}..." from cart`, 'info');
    }
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Price metrics (stored in base PKR)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.12); // 12% GST standard
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const totalAmount = subtotal + taxAmount + shippingFee;

  const openQuoteModal = (product = null) => {
    setQuoteModalProduct(product);
  };

  const closeQuoteModal = () => {
    setQuoteModalProduct(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        taxAmount,
        shippingFee,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        quoteModalProduct,
        openQuoteModal,
        closeQuoteModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
