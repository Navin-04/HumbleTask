import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaChevronLeft, FaChevronRight, FaStar, FaTruck, FaShieldAlt, FaHeadset, FaAward } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const carouselRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    fetchData();
    
    // Set slides per view based on screen size
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth >= 968 ? 2 : 1);
    };
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  useEffect(() => {
    // Auto-rotate carousel
    const maxSlides = Math.min(featuredProducts.length, 4);
    const maxIndex = slidesPerView === 2 ? maxSlides - 1 : maxSlides - 1;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts.length, slidesPerView]);

  useEffect(() => {
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            // Animate counters
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-target'));
              const duration = 2000;
              const increment = target / (duration / 16);
              let current = 0;
              
              const updateCounter = () => {
                current += increment;
                if (current < target) {
                  counter.textContent = Math.floor(current).toLocaleString();
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target.toLocaleString();
                }
              };
              
              updateCounter();
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured products
      const featuredRes = await axios.get('/api/products?featured=true&limit=12');
      setFeaturedProducts(featuredRes.data.products || featuredRes.data);

      // Fetch deals/products on sale
      const dealsRes = await axios.get('/api/products?onSale=true&limit=8');
      setDealsProducts(dealsRes.data.products || dealsRes.data);

      // Fetch categories
      const categoriesRes = await axios.get('/api/products/categories');
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    const maxSlides = Math.min(featuredProducts.length, 4);
    const maxIndex = slidesPerView === 2 ? maxSlides - 1 : maxSlides - 1;
    setCurrentSlide((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevSlide = () => {
    const maxSlides = Math.min(featuredProducts.length, 4);
    const maxIndex = slidesPerView === 2 ? maxSlides - 1 : maxSlides - 1;
    setCurrentSlide((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShopNow</h1>
          <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-hero">
              Shop Now
            </Link>
            <Link to="/products?onSale=true" className="btn btn-hero-secondary">
              View Deals
            </Link>
          </div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats-section">
        <div className="container">
          <div className={`stats-grid ${statsVisible ? 'visible' : ''}`}>
            <div className="stat-item">
              <div className="stat-icon">
                <FaAward />
              </div>
              <div className="stat-number" data-target="10000">0</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaStar />
              </div>
              <div className="stat-number" data-target="5000">0</div>
              <div className="stat-label">5-Star Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaTruck />
              </div>
              <div className="stat-number" data-target="50">0</div>
              <div className="stat-label">Countries Served</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaShieldAlt />
              </div>
              <div className="stat-number" data-target="100">0</div>
              <div className="stat-label">% Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaAward />
              </div>
              <h3>Quality Guarantee</h3>
              <p>100% quality guaranteed products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="category-card"
                >
                  <div className="category-icon">
                    {category.charAt(0).toUpperCase()}
                  </div>
                  <span className="category-name">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mega Sale Banner */}
      <section className="sale-banner">
        <div className="container">
          <div className="sale-banner-inner">
            <div className="sale-copy">
              <span className="sale-tag">SALE</span>
              <h2 className="sale-title">Festive Mega Sale</h2>
              <p className="sale-subtitle">Up to 60% OFF on top categories • Limited time</p>
              <div className="sale-actions">
                <Link to="/products?onSale=true" className="btn btn-sale">
                  Shop Deals
                </Link>
                <Link to="/products?featured=true" className="btn btn-outline-light">
                  View Picks
                </Link>
              </div>
            </div>
            <div className="sale-art">
              <div className="sale-badge">Best Prices</div>
              <div className="sale-badge alt">Hurry!</div>
            </div>
          </div>
          <div className="sale-marquee">
            <div className="sale-marquee-track">
              <span>Limited-Time Offer • Extra Savings • Free Shipping Over ₹999 • </span>
              <span>Limited-Time Offer • Extra Savings • Free Shipping Over ₹999 • </span>
              <span>Limited-Time Offer • Extra Savings • Free Shipping Over ₹999 • </span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Deals Section */}
      {dealsProducts.length > 0 && (
        <section className="deals-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Limited‑Time Deals</h2>
              <Link to="/products?onSale=true" className="see-all-link">
                See all deals →
              </Link>
            </div>
            <div className="products-grid">
              {dealsProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Editor’s Picks</h2>
              <Link to="/products?featured=true" className="see-all-link">
                See all →
              </Link>
            </div>
            <div className="carousel-container">
              <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} aria-label="Previous slide">
                <FaChevronLeft />
              </button>
              <div className="carousel-wrapper" ref={carouselRef}>
                <div 
                  className="carousel-track" 
                  style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
                >
                  {featuredProducts.slice(0, 4).map((product) => (
                    <div key={product._id} className="carousel-slide">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              <button className="carousel-btn carousel-btn-next" onClick={nextSlide} aria-label="Next slide">
                <FaChevronRight />
              </button>
              <div className="carousel-dots">
                {featuredProducts.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="products-grid featured-grid">
              {featuredProducts.slice(4, 12).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="all-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore All Products</h2>
            <Link to="/products" className="see-all-link">
              View all products →
            </Link>
          </div>
          <div className="cta-box">
            <h3>Discover thousands of products</h3>
            <p>From electronics to fashion, find everything you need</p>
            <Link to="/products" className="btn btn-primary btn-large">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
