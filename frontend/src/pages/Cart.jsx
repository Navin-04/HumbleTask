import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';
import './Cart.css';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, loading, updateCartItem, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Please login to view your cart</h2>
            <p>Sign in to see your saved items</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add items to your cart to continue shopping</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemove(itemId);
      return;
    }
    try {
      await updateCartItem(itemId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Error updating cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Error clearing cart');
      }
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p className="cart-item-count">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Items in your cart</h2>
              {cart.items.length > 0 && (
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              )}
            </div>

            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <Link to={`/products/${item.product?._id}`} className="cart-item-image">
                    <img
                      src={item.product?.images?.[0] || item.product?.image}
                      alt={item.product?.name}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link to={`/products/${item.product?._id}`} className="cart-item-name">
                      {item.product?.name}
                    </Link>
                    {item.product?.brand && (
                      <p className="cart-item-brand">{item.product.brand}</p>
                    )}
                    <div className="cart-item-price">
                      {formatCurrency(item.product?.price)}
                      {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className="original-price">
                          {formatCurrency(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="cart-item-stock">
                      {item.product?.stock > 0 ? (
                        <span className="in-stock">In Stock</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-quantity">
                    <label>Qty:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.product?.stock || 99}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          handleQuantityChange(item._id, Math.min(newQty, item.product?.stock || 99));
                        }}
                        className="quantity-input"
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= (item.product?.stock || 99)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <div className="item-total-price">
                      {formatCurrency((item.product?.price || 0) * item.quantity)}
                    </div>
                    {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                      <div className="item-savings">
                        Save {formatCurrency((item.product.originalPrice - item.product.price) * item.quantity)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="remove-item-btn"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-continue-shopping">
              <Link to="/products" className="continue-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="free-shipping">FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 50 && (
                  <div className="shipping-note">
                    Add {formatCurrency(50 - subtotal)} more for free shipping!
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="total-amount">{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn btn-checkout">
                Proceed to Checkout
              </button>

              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>💵</span>
                  <span>📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
