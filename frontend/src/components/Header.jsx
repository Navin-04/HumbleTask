import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartItemCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/products/categories');
        setCategories(res.data || []);
      } catch (e) {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <Link to="/" className="logo">
              <span className="logo-text">ShopNow</span>
            </Link>
            
            {/* Search Bar */}
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>

            {/* Right Side Actions */}
            <div className="header-actions">
              {user ? (
                <>
                  <Link to="/wishlist" className="header-action-item">
                    <FaHeart />
                    <span className="action-label">Wishlist</span>
                  </Link>
                  
                  <Link to="/cart" className="header-action-item cart-link">
                    <FaShoppingCart />
                    <span className="action-label">Cart</span>
                    {getCartItemCount() > 0 && (
                      <span className="cart-badge">{getCartItemCount()}</span>
                    )}
                  </Link>

                  <div className="user-menu-wrapper">
                    <button
                      className="header-action-item user-menu-trigger"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <FaUser />
                      <span className="action-label">{user.name}</span>
                    </button>
                    {showUserMenu && (
                      <div className="user-menu-dropdown">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                          My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                          My Orders
                        </Link>
                        {user.isAdmin && (
                          <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="header-action-item">
                    <FaUser />
                    <span className="action-label">Sign In</span>
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="header-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/products" className="nav-link">All Products</Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="nav-link"
              >
                {cat}
              </Link>
            ))}
            <Link to="/products?onSale=true" className="nav-link sale-link">Today's Deals</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/products" onClick={() => setShowMobileMenu(false)}>All Products</Link>
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              onClick={() => setShowMobileMenu(false)}
            >
              {cat}
            </Link>
          ))}
          <Link to="/products?onSale=true" onClick={() => setShowMobileMenu(false)}>Today's Deals</Link>
          {user && (
            <>
              <Link to="/wishlist" onClick={() => setShowMobileMenu(false)}>Wishlist</Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)}>My Orders</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
