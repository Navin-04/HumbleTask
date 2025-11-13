import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { FaStar, FaHeart, FaShoppingCart, FaCheck, FaTimes, FaBolt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(0);
      }
      if (res.data.variants?.colors?.length > 0) {
        setSelectedColor(res.data.variants.colors[0]);
      }
      if (res.data.variants?.sizes?.length > 0) {
        setSelectedSize(res.data.variants.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/product/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await axios.get(`/api/products/${id}/related`);
      setRelatedProducts(res.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please login to continue with purchase');
      navigate('/login');
      return;
    }

    const productImages =
      product?.images && product.images.length > 0 ? product.images : [product?.image];
    const primaryImage = productImages[selectedImage] || productImages[0];

    navigate('/checkout', {
      state: {
        buyNowItem: {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: primaryImage,
          selectedColor,
          selectedSize,
        },
      },
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.info('Please login to add items to wishlist');
      navigate('/login');
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/reviews', {
        product: id,
        ...reviewForm,
      });
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      fetchProduct(); // Refresh product to update rating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'star filled' : 'star'}
          onClick={() => setReviewForm({ ...reviewForm, rating: i })}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  const avgRating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-main">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {discountPercentage > 0 && (
                <span className="discount-badge-large">{discountPercentage}% OFF</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-main">
            <h1 className="product-title">{product.name}</h1>
            
            {product.brand && (
              <p className="product-brand">Brand: {product.brand}</p>
            )}

            {/* Rating */}
            <div className="product-rating-section">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(avgRating) ? 'star filled' : 'star'}
                  />
                ))}
              </div>
              <span className="rating-value">{avgRating.toFixed(1)}</span>
              <span className="rating-count">({numReviews} {numReviews === 1 ? 'review' : 'reviews'})</span>
              <Link to="#reviews" className="rating-link">See all reviews</Link>
            </div>

            {/* Price */}
            <div className="product-price-section">
              <span className="current-price">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                  <span className="save-amount">
                    You save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className="feature-check" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {product.variants && (
              <div className="product-variants">
                {product.variants.colors && product.variants.colors.length > 0 && (
                  <div className="variant-group">
                    <label>Color:</label>
                    <div className="variant-options">
                      {product.variants.colors.map((color) => (
                        <button
                          key={color}
                          className={`variant-option ${selectedColor === color ? 'active' : ''}`}
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.variants.sizes && product.variants.sizes.length > 0 && (
                  <div className="variant-group">
                    <label>Size:</label>
                    <div className="variant-options">
                      {product.variants.sizes.map((size) => (
                        <button
                          key={size}
                          className={`variant-option ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <FaCheck /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">
                  <FaTimes /> Out of Stock
                </span>
              )}
            </div>

            {/* Actions */}
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="quantity-input"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-buy-now"
                    onClick={handleBuyNow}
                  >
                    <FaBolt /> Buy Now
                  </button>
                  <button
                    className="btn btn-cart"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    className={`btn btn-wishlist ${isInWishlist(product._id) ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    <FaHeart /> {isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {user && (
              <button
                className="btn btn-primary"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">{renderStars(reviewForm.rating)}</div>
              </div>
              <div className="form-group">
                <label>Title (optional)</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="form-control"
                  placeholder="Give your review a title"
                />
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="form-control"
                  rows="5"
                  placeholder="Share your experience with this product"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'star filled' : 'star'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && <h4 className="review-title">{review.title}</h4>}
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>You may also like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
