import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isOutOfStock = product.stock <= 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="card h-100 shadow-sm product-card">
      <div className="position-relative bg-white text-center p-3 border-bottom product-img-wrapper">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60'}
          className="card-img-top product-img"
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
          {product.category}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fs-6 fw-bold mb-1 text-truncate" title={product.name}>
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </h5>

        {/* Star Rating Display */}
        <div className="d-flex align-items-center gap-1 mb-2">
          <div className="text-warning small d-flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${
                  (product.average_rating || 0) >= star
                    ? 'bi-star-fill'
                    : (product.average_rating || 0) >= star - 0.5
                    ? 'bi-star-half'
                    : 'bi-star'
                }`}
              ></i>
            ))}
          </div>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            {product.review_count > 0 ? (
              <>
                <span className="fw-semibold text-dark">{product.average_rating.toFixed(1)}</span> (
                {product.review_count})
              </>
            ) : (
              '(0)'
            )}
          </small>
        </div>

        <p className="card-text text-muted small flex-grow-1 text-truncate-2" style={{ maxHeight: '2.8rem', overflow: 'hidden' }}>
          {product.description || 'Quality gadget accessory for your daily tech needs.'}
        </p>

        <div className="mt-3 pt-2 border-top">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fs-5 fw-bold text-primary">৳{product.price.toFixed(2)}</span>
            <div className="small">
              {isOutOfStock ? (
                <span className="badge bg-danger">Out of Stock</span>
              ) : (
                <span className="text-success small fw-semibold">{product.stock} in stock</span>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary flex-fill text-nowrap"
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Product is out of stock' : 'Add to Shopping Cart'}
            >
              <i className="bi bi-cart-plus me-1"></i>
              Add to Cart
            </button>
            <button
              className="btn btn-sm btn-danger flex-fill fw-semibold text-nowrap"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Product is out of stock' : 'Buy Now and Checkout'}
            >
              <i className="bi bi-lightning-charge-fill me-1"></i>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

