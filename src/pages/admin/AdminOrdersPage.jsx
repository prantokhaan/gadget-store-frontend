import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setSuccessMsg(`Order #${orderId} status changed to "${newStatus}"!`);
      // Update local state directly
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="container py-4">
      {/* Admin Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">Customer Orders Management</h1>
          <p className="text-muted small mb-0">Track order lifecycle, review line items, and adjust fulfillment status</p>
        </div>

        <div className="nav nav-pills mt-2 mt-md-0">
          <Link to="/admin" className="nav-link">
            Dashboard
          </Link>
          <Link to="/admin/products" className="nav-link">
            Products
          </Link>
          <Link to="/admin/orders" className="nav-link active">
            Orders
          </Link>
          <Link to="/admin/users" className="nav-link">
            Users
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg(null)}></button>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-5 text-center text-muted">No orders found in the system.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <React.Fragment key={o.id}>
                      <tr>
                        <td className="ps-4 fw-bold">#{o.id}</td>
                        <td>
                          <div className="fw-semibold">{o.user_name}</div>
                          <small className="text-muted">{o.user_email}</small>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="fw-bold text-primary">৳{o.total_amount.toFixed(2)}</td>
                        <td>
                          <select
                            className={`form-select form-select-sm fw-semibold ${
                              o.status === 'delivered'
                                ? 'text-success'
                                : o.status === 'cancelled'
                                ? 'text-danger'
                                : o.status === 'shipped'
                                ? 'text-primary'
                                : 'text-warning'
                            }`}
                            style={{ width: '135px' }}
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleExpand(o.id)}
                          >
                            <i
                              className={`bi bi-chevron-${
                                expandedOrderId === o.id ? 'up' : 'down'
                              } me-1`}
                            ></i>
                            {o.items.length} item{o.items.length === 1 ? '' : 's'}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable items breakdown */}
                      {expandedOrderId === o.id && (
                        <tr className="bg-light">
                          <td colSpan="6" className="p-3 ps-4 pe-4">
                            <div className="card border-0 shadow-sm mb-2">
                              <div className="card-body py-2 px-3 bg-white rounded">
                                <div className="row g-2 small">
                                  <div className="col-12 col-md-4">
                                    <span className="text-muted d-block">Delivery Phone:</span>
                                    <strong className="text-dark">
                                      <i className="bi bi-telephone me-1 text-primary"></i>
                                      {o.phone || 'Not provided'}
                                    </strong>
                                  </div>
                                  <div className="col-12 col-md-5">
                                    <span className="text-muted d-block">Shipping Address:</span>
                                    <span className="fw-semibold">
                                      {o.shipping_address ? `${o.shipping_address}, ` : ''}
                                      {o.thana ? `${o.thana}, ` : ''}
                                      {o.district || 'Dhaka'}
                                    </span>
                                  </div>
                                  <div className="col-12 col-md-3">
                                    <span className="text-muted d-block">Payment:</span>
                                    <span className="badge bg-secondary text-uppercase me-1">{o.payment_method}</span>
                                    <span className={`badge ${o.payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                      {o.payment_status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card border-0 shadow-sm">
                              <div className="card-header bg-white py-2 small fw-bold">
                                Order #{o.id} Items:
                              </div>
                              <ul className="list-group list-group-flush">
                                {o.items.map((item) => (
                                  <li
                                    key={item.id}
                                    className="list-group-item d-flex justify-content-between align-items-center small"
                                  >
                                    <div className="d-flex align-items-center gap-2">
                                      <img
                                        src={item.product_image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60'}
                                        alt={item.product_name}
                                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                        className="rounded border"
                                        onError={(e) => {
                                          e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60';
                                        }}
                                      />
                                      <span>{item.product_name || `Product ID ${item.product_id}`}</span>
                                      <span className="text-muted">× {item.quantity}</span>
                                    </div>
                                    <span className="fw-semibold">
                                      ৳{(item.price * item.quantity).toFixed(2)}
                                      <small className="text-muted ms-1">(৳{item.price.toFixed(2)} ea)</small>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

