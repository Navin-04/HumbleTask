import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist(null);
    }
  }, [user]); // fetchWishlist is memoized

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId) => {
    try {
      const res = await axios.post('/api/wishlist', { productId });
      setWishlist(res.data);
      return res.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const res = await axios.delete(`/api/wishlist/${productId}`);
      setWishlist(res.data);
      return res.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }, []);

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some((p) => p._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

