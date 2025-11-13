import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Get to Know Us</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press Releases</Link></li>
              <li><Link to="/investor">Investor Relations</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect with Us</h3>
            <ul>
              <li><Link to="/facebook">Facebook</Link></li>
              <li><Link to="/twitter">Twitter</Link></li>
              <li><Link to="/instagram">Instagram</Link></li>
              <li><Link to="/youtube">YouTube</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Make Money with Us</h3>
            <ul>
              <li><Link to="/sell">Sell on ShopNow</Link></li>
              <li><Link to="/affiliate">Affiliate Program</Link></li>
              <li><Link to="/advertise">Advertise Your Products</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Let Us Help You</h3>
            <ul>
              <li><Link to="/account">Your Account</Link></li>
              <li><Link to="/returns">Returns Centre</Link></li>
              <li><Link to="/shipping">Shipping Rates & Policies</Link></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <Link to="/">ShopNow</Link>
          </div>
          <div className="footer-links">
            <Link to="/conditions">Conditions of Use</Link>
            <Link to="/privacy">Privacy Notice</Link>
            <Link to="/interest">Interest-Based Ads</Link>
          </div>
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} ShopNow.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

