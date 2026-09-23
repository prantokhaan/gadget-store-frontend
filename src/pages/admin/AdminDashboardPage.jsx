import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await adminService.getDashboard();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <span className="badge bg-success">Delivered</span>;
      case 'shipped':
        return <span className="badge bg-primary">Shipped</span>;
      case 'processing':
        return <span className="badge bg-info text-dark">Processing</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* Admin Header with Navigation Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-speedometer2 text-warning me-2"></i>
            Admin Control Panel
          </h1>
          <p className="text-muted small mb-0">Overview of platform metrics, inventory, and fulfillment</p>
        </div>

        <div className="nav nav-pills mt-2 mt-md-0">
          <Link to="/admin" className="nav-link active">
            Dashboard
          </Link>
          <Link to="/admin/products" className="nav-link">
            Products
          </Link>
          <Link to="/admin/orders" className="nav-link">
            Orders
          </Link>
          <Link to="/admin/users" className="nav-link">
            Users
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 bg-primary text-white p-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small fw-semibold">TOTAL SALES</div>
                    <h3 className="fw-bold mb-0 mt-1">৳{stats.total_sales.toFixed(2)}</h3>
                  </div>
                  <i className="bi bi-cash-coin fs-1 text-white-50"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 bg-success text-white p-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small fw-semibold">TOTAL ORDERS</div>
                    <h3 className="fw-bold mb-0 mt-1">{stats.total_orders}</h3>
                  </div>
                  <i className="bi bi-cart-check fs-1 text-white-50"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 bg-dark text-white p-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small fw-semibold">PRODUCTS IN STORE</div>
                    <h3 className="fw-bold mb-0 mt-1">{stats.total_products}</h3>
                  </div>
                  <i className="bi bi-box fs-1 text-white-50"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 bg-info text-dark p-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-dark small fw-semibold">REGISTERED USERS</div>
                    <h3 className="fw-bold mb-0 mt-1">{stats.total_users}</h3>
                  </div>
                  <i className="bi bi-people fs-1 text-black-50"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Recent Customer Orders</h5>
                  <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
                    View All Orders <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                <div className="card-body p-0">
                  {stats.recent_orders.length === 0 ? (
                    <div className="p-4 text-center text-muted">No orders placed yet.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-4">Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recent_orders.map((o) => (
                            <tr key={o.id}>
                              <td className="ps-4 fw-bold">#{o.id}</td>
                              <td>
                                <div>{o.user_name}</div>
                                <small className="text-muted">{o.user_email}</small>
                              </td>
                              <td className="fw-semibold">৳{o.total_amount.toFixed(2)}</td>
                              <td>{new Date(o.created_at).toLocaleDateString()}</td>
                              <td>{getStatusBadge(o.status)}</td>
                              <td className="text-end pe-4">
                                <Link to="/admin/orders" className="btn btn-sm btn-light border">
                                  Manage
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

