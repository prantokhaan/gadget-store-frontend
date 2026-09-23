import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <div className="bg-warning text-dark rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-cpu-fill fs-5"></i>
          </div>
          <span className="text-white">Gadget<span className="text-warning">Store</span></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {/* Cart link */}
            <li className="nav-item">
              <Link className="btn btn-outline-light btn-sm position-relative me-2" to="/cart">
                <i className="bi bi-cart3 me-1"></i>
                Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {/* Admin button if admin */}
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="btn btn-warning btn-sm fw-semibold" to="/admin">
                      <i className="bi bi-speedometer2 me-1"></i>
                      Admin Panel
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <NavLink className="nav-link" to="/orders">
                    <i className="bi bi-box-seam me-1"></i>
                    My Orders
                  </NavLink>
                </li>

                <li className="nav-item d-flex align-items-center">
                  <span className="navbar-text text-light small me-2">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name}
                  </span>
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

