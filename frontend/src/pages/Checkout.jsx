import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import './Checkout.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  // Check if we have either buyNow item or cart items
  const isBuyNow = !!buyNowItem;
  const hasCartItems = cart && cart.items && cart.items.length > 0;

  if (!isBuyNow && !hasCartItems) {
    navigate('/cart');
    return null;
  }

  // Calculate items to display and total
  const displayItems = isBuyNow 
    ? [{
        _id: buyNowItem.productId,
        product: {
          _id: buyNowItem.productId,
          name: buyNowItem.name,
          price: buyNowItem.price,
          image: buyNowItem.image,
        },
        quantity: buyNowItem.quantity,
      }]
    : cart.items;

  const calculateTotal = () => {
    if (isBuyNow) {
      return buyNowItem.price * buyNowItem.quantity;
    }
    return getCartTotal();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      // For Buy Now, send custom order items
      const orderData = {
        shippingAddress,
        paymentMethod: formData.paymentMethod,
      };

      if (isBuyNow) {
        orderData.items = [{
          product: buyNowItem.productId,
          quantity: buyNowItem.quantity,
          price: buyNowItem.price,
        }];
      }

      const res = await axios.post('/api/orders', orderData);

      // Only clear cart if this was a regular cart checkout
      if (!isBuyNow) {
        await clearCart();
      }

      navigate(`/order-confirmation/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Address</h2>
            
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>Payment Method</h2>
            
            <div className="form-group">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="checkout-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {displayItems.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="order-item-info">
                    <span>{item.product?.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    {formatCurrency((item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

