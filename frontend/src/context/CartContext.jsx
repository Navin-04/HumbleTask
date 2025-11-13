import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const getStorageKey = () => (user && (user._id || user.id) ? `cart_${user._id || user.id}` : 'cart_guest');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(getStorageKey());
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && (user._id || user.id)]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (cart !== null) {
      localStorage.setItem(getStorageKey(), JSON.stringify(cart));
    } else {
      localStorage.removeItem(getStorageKey());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, user && (user._id || user.id)]);

  useEffect(() => {
    if (user) {
      // Reset in-memory cart when user changes to avoid previous user's view
      setCart(null);
      // Sync localStorage cart with backend when user logs in
      syncCartWithBackend();
    } else {
      // Load guest cart when logged out
      const savedCart = localStorage.getItem('cart_guest');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      } else {
        setCart(null);
      }
    }
  }, [user]);

  const syncCartWithBackend = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cart');
      if (res.data && res.data.items && res.data.items.length > 0) {
        setCart(res.data);
      } else {
        // If backend cart is empty, check if we have localStorage cart
        const savedCart = localStorage.getItem(getStorageKey());
        if (savedCart) {
          const localCart = JSON.parse(savedCart);
          // Try to sync local cart items to backend
          if (localCart.items && localCart.items.length > 0) {
            for (const item of localCart.items) {
              try {
                await axios.post('/api/cart', {
                  productId: item.product?._id || item.productId,
                  quantity: item.quantity,
                });
              } catch (error) {
                console.error('Error syncing cart item:', error);
              }
            }
            // Fetch updated cart from backend
            const updatedRes = await axios.get('/api/cart');
            setCart(updatedRes.data);
          }
        } else {
          setCart(res.data);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cart');
      setCart(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      // If user is logged in, sync with backend
      if (user) {
        const res = await axios.post('/api/cart', { productId, quantity });
        setCart(res.data);
        return res.data;
      } else {
        // If not logged in, use localStorage
        const savedCart = localStorage.getItem(getStorageKey());
        let localCart = savedCart ? JSON.parse(savedCart) : { items: [] };
        
        // Fetch product details
        const productRes = await axios.get(`/api/products/${productId}`);
        const product = productRes.data;
        
        // Check if item already exists in cart
        const existingItemIndex = localCart.items.findIndex(
          item => (item.product?._id || item.productId) === productId
        );
        
        if (existingItemIndex >= 0) {
          localCart.items[existingItemIndex].quantity += quantity;
        } else {
          localCart.items.push({
            product: product,
            productId: productId,
            quantity: quantity,
            _id: `local_${Date.now()}_${Math.random()}`,
          });
        }
        
        setCart(localCart);
        return localCart;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (user) {
        const res = await axios.put(`/api/cart/${itemId}`, { quantity });
        setCart(res.data);
        return res.data;
      } else {
        // Update localStorage cart
        const savedCart = localStorage.getItem(getStorageKey());
        if (savedCart) {
          const localCart = JSON.parse(savedCart);
          const itemIndex = localCart.items.findIndex(item => item._id === itemId);
          if (itemIndex >= 0) {
            localCart.items[itemIndex].quantity = quantity;
            setCart(localCart);
            return localCart;
          }
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (user) {
        const res = await axios.delete(`/api/cart/${itemId}`);
        setCart(res.data);
        return res.data;
      } else {
        // Remove from localStorage cart
        const savedCart = localStorage.getItem(getStorageKey());
        if (savedCart) {
          const localCart = JSON.parse(savedCart);
          localCart.items = localCart.items.filter(item => item._id !== itemId);
          setCart(localCart.items.length > 0 ? localCart : null);
          return localCart;
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await axios.delete('/api/cart');
      }
      setCart(null);
      localStorage.removeItem(getStorageKey());
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

