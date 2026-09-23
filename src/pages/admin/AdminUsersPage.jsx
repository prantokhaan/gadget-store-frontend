import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalCustomerSpend = users.reduce((acc, u) => acc + (u.total_spent || 0), 0);

  return (
    <div className="container py-4">
      {/* Admin Navigation Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">Registered Users & Customers</h1>
          <p className="text-muted small mb-0">
            View all accounts across the platform, order counts, and customer spend metrics
          </p>
        </div>

        <div className="nav nav-pills mt-2 mt-md-0">
          <Link to="/admin" className="nav-link">
            Dashboard
          </Link>
          <Link to="/admin/products" className="nav-link">
            Products
          </Link>
          <Link to="/admin/orders" className="nav-link">
            Orders
          </Link>
          <Link to="/admin/users" className="nav-link active">
            Users
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-4">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <div className="text-muted small">Total Accounts</div>
                <div className="h4 fw-bold mb-0">{totalUsers}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-4">
                <i className="bi bi-person-check-fill"></i>
              </div>
              <div>
                <div className="text-muted small">Customers</div>
                <div className="h4 fw-bold mb-0">{totalCustomers}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-4">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <div>
                <div className="text-muted small">Administrators</div>
                <div className="h4 fw-bold mb-0">{totalAdmins}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-4">
                <i className="bi bi-currency-exchange"></i>
              </div>
              <div>
                <div className="text-muted small">Total Customer Spend</div>
                <div className="h5 fw-bold mb-0">৳{totalCustomerSpend.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="row g-2 align-items-center justify-content-between">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, phone, role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearch('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="col-auto text-muted small">
              Showing <strong>{filteredUsers.length}</strong> of {totalUsers} registered users
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading users...</span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x fs-1 mb-2"></i>
              <p className="mb-0">No users match your search query.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">User</th>
                    <th scope="col">Role</th>
                    <th scope="col">Delivery Phone</th>
                    <th scope="col">Orders Placed</th>
                    <th scope="col">Total Spent</th>
                    <th scope="col">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                              u.role === 'admin'
                                ? 'bg-warning text-dark'
                                : 'bg-primary text-white'
                            }`}
                            style={{ width: '38px', height: '38px' }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">{u.name}</div>
                            <small className="text-muted">{u.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
                          } text-uppercase`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.phone ? (
                          <span className="font-monospace small">
                            <i className="bi bi-telephone me-1 text-muted"></i>
                            {u.phone}
                          </span>
                        ) : (
                          <span className="text-muted small fst-italic">Not recorded</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-secondary rounded-pill">
                          {u.total_orders} order{u.total_orders === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          ৳{(u.total_spent || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
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
  );
}

