import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please login to add items to wishlist');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={i} className="star" />);
    }
    return stars;
  };

  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}>
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image-wrapper">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
            alt={product.name}
            className="product-image"
          />
          {discountPercentage > 0 && (
            <span className="discount-badge">{discountPercentage}% OFF</span>
          )}
          {product.isOnSale && (
            <span className="sale-badge">SALE</span>
          )}
          <button
            className="wishlist-button"
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
          >
            <FaHeart className={isInWishlist(product._id) ? 'active' : ''} />
          </button>
        </div>
        
        <div className="product-info">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="product-brand">{product.brand}</p>
          )}
          
          <div className="product-rating">
            {product.rating > 0 ? (
              <>
                <span className="stars">{renderStars(product.rating)}</span>
                <span className="rating-text">
                  {product.rating.toFixed(1)} ({product.numReviews})
                </span>
              </>
            ) : (
              <span className="no-rating">No ratings yet</span>
            )}
          </div>
          
          <div className="product-price-section">
            <span className="product-price">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                <span className="price-save">
                  Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>
          
          {product.stock > 0 ? (
            <span className="stock-info in-stock">In Stock</span>
          ) : (
            <span className="stock-info out-of-stock">Out of Stock</span>
          )}
        </div>
      </Link>
      
      {product.stock > 0 && (
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
