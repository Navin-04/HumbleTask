import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { FaHeart } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, loading, fetchWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]); // avoid refetch flicker from unstable function refs

  if (!user) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <FaHeart className="empty-icon" />
            <h2>Please login to view your wishlist</h2>
            <p>Sign in to save your favorite products</p>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p className="wishlist-count">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty-wishlist">
            <FaHeart className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

