import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaFilter, FaTimes, FaTh, FaList } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [onSale, setOnSale] = useState(searchParams.get('onSale') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update state when URL params change (e.g., from navigation links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newCategory = params.get('category') || '';
    const newSearch = params.get('search') || '';
    const newOnSale = params.get('onSale') === 'true';
    const newPage = parseInt(params.get('page')) || 1;
    
    // Update state from URL params - this handles navigation link clicks
    setCategory(newCategory);
    setSearch(newSearch);
    setOnSale(newOnSale);
    setPage(newPage);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [category, search, onSale, minPrice, maxPrice, rating, sort, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
      };
      
      if (category) params.category = category;
      if (search) params.search = search;
      if (onSale) params.onSale = true;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (sort) params.sort = sort;
      
      const res = await axios.get('/api/products', { params });
      
      if (res.data.products) {
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      } else {
        setProducts(res.data);
      }
      
      // Update URL params
      const newParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) newParams.set(key, params[key]);
      });
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/products/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setPage(1); // Reset to first page when filter changes
    switch (filterName) {
      case 'category':
        setCategory(value);
        break;
      case 'search':
        setSearch(value);
        break;
      case 'minPrice':
        setMinPrice(value);
        break;
      case 'maxPrice':
        setMaxPrice(value);
        break;
      case 'rating':
        setRating(value);
        break;
      case 'sort':
        setSort(value);
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setOnSale(false);
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSort('');
    setPage(1);
  };

  const hasActiveFilters = category || search || onSale || minPrice || maxPrice || rating || sort;

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>All Products</h1>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h2>Filters</h2>
              <button
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </button>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}

            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-control"
              />
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="form-control"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="filter-group">
              <label>Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="form-control"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Star</option>
              </select>
            </div>
          </aside>

          {/* Products Section */}
          <div className="products-content">
            {/* Sort and Results Count */}
            <div className="products-toolbar">
              <p className="results-count">
                {loading ? 'Loading...' : `${total || products.length} results`}
              </p>
              <div className="toolbar-right">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <FaList />
                  </button>
                </div>
                <div className="sort-group">
                  <label>Sort by:</label>
                  <select
                    value={sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="form-control"
                  >
                    <option value="">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <div className="pagination-info">
                      Page {page} of {totalPages}
                    </div>
                    <button
                      className="pagination-btn"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
