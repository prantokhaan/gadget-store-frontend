import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Non-admin attempting admin page
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm text-center" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-shield-lock-fill me-2"></i>
            403 - Access Forbidden
          </h4>
          <p>You do not have administrative privileges to access this area.</p>
          <hr />
          <a href="/" className="btn btn-outline-danger btn-sm">
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return children;
}

