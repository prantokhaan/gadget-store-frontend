import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filter states from URL search params
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialMinPrice = searchParams.get('min_price') || '';
  const initialMaxPrice = searchParams.get('max_price') || '';
  const initialSortBy = searchParams.get('sort_by') || '';
  const initialSortOrder = searchParams.get('sort_order') || '';
  const initialSortOption =
    initialSortBy && initialSortOrder ? `${initialSortBy}_${initialSortOrder}` : '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load distinct categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const catList = await productService.getCategories();
        setCategories(catList);
      } catch (err) {
        console.warn('Could not load categories list:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products whenever filters change (with 300ms debounce for smoother typing)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        let sortBy = undefined;
        let sortOrder = undefined;
        if (sortOption) {
          const parts = sortOption.split('_');
          sortBy = parts[0];
          sortOrder = parts[1];
        }

        const data = await productService.getAll({
          category: selectedCategory || undefined,
          search: searchTerm || undefined,
          min_price: minPrice !== '' ? Number(minPrice) : undefined,
          max_price: maxPrice !== '' ? Number(maxPrice) : undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }

      // Sync query params in URL
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (sortOption) {
        const [b, o] = sortOption.split('_');
        params.sort_by = b;
        params.sort_order = o;
      }
      setSearchParams(params, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, minPrice, maxPrice, sortOption]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('');
  };

  const hasActiveFilters = Boolean(
    selectedCategory || searchTerm || minPrice || maxPrice || sortOption
  );

  return (
    <div className="container py-4">
      {/* Header and Filter Controls */}
      <div className="bg-white p-4 rounded shadow-sm mb-4 border">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h1 className="fs-3 fw-bold mb-0">Products Catalog</h1>
            <small className="text-muted">
              {loading
                ? 'Updating results...'
                : `Showing ${products.length} gadget${products.length === 1 ? '' : 's'}`}
            </small>
          </div>
          {hasActiveFilters && (
            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={handleClearFilters}
              title="Reset all filters"
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset Filters
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="row g-3">
          {/* Search Products */}
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              Search Products
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search mouse, charger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">Category</label>
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              Price Range (৳)
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text">৳</span>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="input-group-text bg-light text-muted">-</span>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              {(minPrice || maxPrice) && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  title="Clear price filter"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Sort By */}
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">Sort By</label>
            <select
              className="form-select form-select-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Default (Newest First)</option>
              <option value="price_asc">Price: Low to High (৳ ↑)</option>
              <option value="price_desc">Price: High to Low (৳ ↓)</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top align-items-center">
            <small className="text-muted fw-semibold me-1">Active Filters:</small>
            {searchTerm && (
              <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Search: "{searchTerm}"
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.65rem' }}
                  onClick={() => setSearchTerm('')}
                  aria-label="Remove search filter"
                ></button>
              </span>
            )}
            {selectedCategory && (
              <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Category: {selectedCategory}
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.65rem' }}
                  onClick={() => setSelectedCategory('')}
                  aria-label="Remove category filter"
                ></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Price: ৳{minPrice || 0} - ৳{maxPrice || '∞'}
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.65rem' }}
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  aria-label="Remove price filter"
                ></button>
              </span>
            )}
            {sortOption && (
              <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                Sort: {
                  sortOption === 'price_asc'
                    ? 'Price: Low to High'
                    : sortOption === 'price_desc'
                    ? 'Price: High to Low'
                    : sortOption === 'name_asc'
                    ? 'Name: A to Z'
                    : sortOption === 'name_desc'
                    ? 'Name: Z to A'
                    : sortOption === 'stock_asc'
                    ? 'Stock: Low to High'
                    : 'Stock: High to Low'
                }
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.65rem' }}
                  onClick={() => setSortOption('')}
                  aria-label="Remove sort filter"
                ></button>
              </span>
            )}
            <button
              className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-2"
              onClick={handleClearFilters}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Content State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-5 text-center rounded shadow-sm border">
          <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-semibold">No products found</h4>
          <p className="text-muted">
            Try adjusting your search keywords, price range, or category filter.
          </p>
          <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

