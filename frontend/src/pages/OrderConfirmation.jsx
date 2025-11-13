import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="loading">Loading order confirmation...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="empty-state">
            <h2>Order not found</h2>
            <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        <div className="confirmation-content">
          <div className="order-info-card">
            <h2>Order Information</h2>
            <div className="info-row">
              <span>Order ID:</span>
              <strong>#{order._id.slice(-8)}</strong>
            </div>
            <div className="info-row">
              <span>Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span>Total Amount:</span>
              <strong className="total-amount">{formatCurrency(order.totalPrice)}</strong>
            </div>
            <div className="info-row">
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span>Status:</span>
              <span className={`status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>

          <div className="shipping-info-card">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div className="order-items-card">
            <h2>Order Items</h2>
            <div className="items-list">
              {order.orderItems.map((item, index) => (
                <div key={index} className="confirmation-item">
                  <div className="item-image">
                    <img
                      src={item.product?.image || item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.product?.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <strong>{formatCurrency(order.totalPrice)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to={`/orders/${order._id}`} className="btn btn-outline">
            View Order Details
          </Link>
          <Link to="/orders" className="btn btn-outline">
            View All Orders
          </Link>
          <Link to="/products" className="btn btn-primary">
            <FaShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

