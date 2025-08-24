import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'room' | 'dining';
  description?: string;
  image?: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
      } catch (error) {
        setCartItems([]);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      }
    } else {
      setCartItems([]);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
    }
  };

  const addToCart = (item: CartItem) => {
    const savedCart = localStorage.getItem('cart');
    let currentItems: CartItem[] = [];
    
    if (savedCart) {
      try {
        currentItems = JSON.parse(savedCart);
      } catch (error) {
        currentItems = [];
      }
    }

    const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(currentItems));
    updateCartFromStorage();
  };

  const removeFromCart = (itemId: string) => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const currentItems = JSON.parse(savedCart);
        const updatedItems = currentItems.filter((item: CartItem) => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        updateCartFromStorage();
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const currentItems = JSON.parse(savedCart);
        const updatedItems = currentItems.map((item: CartItem) => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        updateCartFromStorage();
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    updateCartFromStorage();
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    updateCartFromStorage();
  }, []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    updateCartFromStorage
  };
};