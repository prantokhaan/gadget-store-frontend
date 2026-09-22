import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await productService.getAll();
        setFeaturedProducts(data.slice(0, 8));
      } catch (err) {
        setError('Failed to load featured products.');
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    { name: 'Computer Accessories', icon: 'bi-keyboard' },
    { name: 'Cables & Chargers', icon: 'bi-lightning-charge' },
    { name: 'Audio', icon: 'bi-headphones' },
    { name: 'Power Banks', icon: 'bi-battery-charging' },
    { name: 'Mobile Gadgets', icon: 'bi-phone' },
  ];

  return (
    <div>
      {/* Hero Banner with Modern Gradient */}
      <section className="hero-gradient text-white py-5 mb-4">
        <div className="container py-5 text-center">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-3 px-3 py-2 fw-semibold rounded-pill">
            <i className="bi bi-stars me-1"></i> Authentic Tech & Mobile Accessories
          </span>
          <h1 className="display-4 fw-bold mb-3">Essential Gadgets & Gear</h1>
          <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Explore premium wireless peripherals, fast chargers, studio audio, and smart electronic accessories across Bangladesh.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/products" className="btn btn-primary btn-lg px-4 shadow-sm">
              <i className="bi bi-grid-fill me-2"></i>
              Browse Catalog
            </Link>
            <Link to="/cart" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-cart3 me-2"></i>
              View Cart
            </Link>
          </div>
        </div>
      </section>

      <div className="container mb-5">
        {/* Trust & Benefits Highlight Strip */}
        <div className="card shadow-sm border-0 p-3 mb-5">
          <div className="row g-3 text-center text-md-start">
            <div className="col-6 col-md-3 d-flex align-items-center gap-3">
              <div className="bg-primary-subtle text-primary p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-truck"></i>
              </div>
              <div>
                <div className="fw-bold small">Fast Nationwide Delivery</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>৳60 Dhaka / ৳120 Outside</div>
              </div>
            </div>

            <div className="col-6 col-md-3 d-flex align-items-center gap-3">
              <div className="bg-success-subtle text-success p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <div className="fw-bold small">100% Genuine Gear</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Tested gadget quality</div>
              </div>
            </div>

            <div className="col-6 col-md-3 d-flex align-items-center gap-3">
              <div className="bg-warning-subtle text-warning p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-cash-coin"></i>
              </div>
              <div>
                <div className="fw-bold small">COD & SSLCommerz</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Secure payment methods</div>
              </div>
            </div>

            <div className="col-6 col-md-3 d-flex align-items-center gap-3">
              <div className="bg-info-subtle text-info p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-patch-check"></i>
              </div>
              <div>
                <div className="fw-bold small">Verified Reviews</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Delivered buyer feedback</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="mb-5">
          <h2 className="fs-4 fw-bold mb-3">Shop by Category</h2>
          <div className="row g-3">
            {categories.map((cat) => (
              <div key={cat.name} className="col-6 col-md-4 col-lg">
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="card text-center p-3 text-decoration-none text-dark h-100 shadow-sm border-0 category-card"
                >
                  <i className={`bi ${cat.icon} fs-1 text-primary mb-2`}></i>
                  <h6 className="fw-semibold mb-0 small">{cat.name}</h6>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-sm btn-outline-primary">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

