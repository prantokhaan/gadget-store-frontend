import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h3 className="fw-bold">Your cart is empty</h3>
          <p className="text-muted mb-4">
            Looks like you haven't added any gadget accessories to your shopping cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h3 fw-bold mb-4">Shopping Cart</h1>

      <div className="row g-4">
        {/* Cart Items Table */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col" className="text-center">Quantity</th>
                      <th scope="col" className="text-end">Total</th>
                      <th scope="col" className="text-center pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, quantity }) => (
                      <tr key={product.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={product.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=120&auto=format&fit=crop&q=60'}
                              alt={product.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="rounded border"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=120&auto=format&fit=crop&q=60';
                              }}
                            />
                            <div>
                              <Link
                                to={`/products/${product.id}`}
                                className="text-decoration-none fw-semibold text-dark d-block"
                              >
                                {product.name}
                              </Link>
                              <small className="text-muted">{product.category}</small>
                            </div>
                          </div>
                        </td>

                        <td>৳{product.price.toFixed(2)}</td>

                        <td className="text-center">
                          <div className="input-group input-group-sm d-inline-flex" style={{ width: '100px' }}>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              type="button"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control text-center px-1"
                              value={quantity}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= product.stock}
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="text-end fw-bold">
                          ৳{(product.price * quantity).toFixed(2)}
                        </td>

                        <td className="text-center pe-4">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(product.id)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-white d-flex justify-content-between py-3">
              <Link to="/products" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Continue Shopping
              </Link>
              <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">৳{cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Delivery Charge</span>
                <span className="fw-semibold">৳120.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-5 fw-bold text-primary">৳{(cartTotal + 120).toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-semibold"
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

