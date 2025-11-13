import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import './OrderDetail.css';

const OrderDetail = () => {
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

  const handleMarkAsPaid = async () => {
    try {
      await axios.put(`/api/orders/${id}/pay`);
      fetchOrder();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!order) {
    return <div className="empty-state">Order not found</div>;
  }

  return (
    <div className="order-detail-page">
      <button onClick={() => navigate('/orders')} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Orders
      </button>
      
      <h1>Order Details</h1>
      
      <div className="order-detail-content">
        <div className="order-info-card">
          <h2>Order Information</h2>
          <div className="info-row">
            <span>Order ID:</span>
            <span>#{order._id.slice(-8)}</span>
          </div>
          <div className="info-row">
            <span>Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span>Status:</span>
            <div className="status-group">
              <span className={`status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>
              <span className={`status ${order.isDelivered ? 'delivered' : 'pending'}`}>
                {order.isDelivered ? 'Delivered' : 'Pending'}
              </span>
            </div>
          </div>
          {!order.isPaid && (
            <button onClick={handleMarkAsPaid} className="btn btn-success" style={{ marginTop: '15px' }}>
              Mark as Paid
            </button>
          )}
        </div>

        <div className="shipping-card">
          <h2>Shipping Address</h2>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <div className="payment-card">
          <h2>Payment Method</h2>
          <p>{order.paymentMethod}</p>
        </div>

        <div className="order-items-card">
          <h2>Order Items</h2>
          {order.orderItems.map((item, index) => (
            <div key={index} className="order-detail-item">
              <div className="order-detail-item-image">
                <img src={item.product?.image} alt={item.product?.name} />
              </div>
              <div className="order-detail-item-info">
                <h3>{item.product?.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {formatCurrency(item.price)}</p>
              </div>
              <div className="order-detail-item-total">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
          
          <div className="order-total-section">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-amount">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

