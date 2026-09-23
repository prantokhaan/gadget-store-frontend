import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderService, productService } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [reviewedProductIds, setReviewedProductIds] = useState({});

  const isWelcome = new URLSearchParams(location.search).get('welcome') === '1';
  const isPaymentSuccess = new URLSearchParams(location.search).get('payment') === 'success';

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return <span className="badge bg-success">Delivered</span>;
      case 'shipped':
        return <span className="badge bg-primary">Shipped</span>;
      case 'processing':
        return <span className="badge bg-info text-dark">Processing</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      case 'pending':
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const handleOpenReview = async (item) => {
    setSelectedItem(item);
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccess(null);
    setReviewError(null);
    setReviewModalOpen(true);

    try {
      const eligibility = await productService.canReview(item.product_id);
      if (eligibility && eligibility.existing_review) {
        setReviewRating(eligibility.existing_review.rating);
        setReviewComment(eligibility.existing_review.comment || '');
        setReviewedProductIds((prev) => ({
          ...prev,
          [item.product_id]: eligibility.existing_review.rating,
        }));
      }
    } catch (e) {
      console.warn('Could not fetch existing review:', e);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setReviewLoading(true);
    setReviewSuccess(null);
    setReviewError(null);

    try {
      await productService.submitReview(selectedItem.product_id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess('Your review has been submitted successfully!');
      setReviewedProductIds((prev) => ({
        ...prev,
        [selectedItem.product_id]: reviewRating,
      }));
      setTimeout(() => {
        setReviewModalOpen(false);
      }, 1500);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading order history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold mb-0">My Orders & Delivery Tracking</h1>
        <Link to="/products" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-cart-plus me-1"></i> Continue Shopping
        </Link>
      </div>

      {(isWelcome || isPaymentSuccess) && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-3 text-success me-3"></i>
          <div>
            <div className="fw-bold">
              {isPaymentSuccess ? 'Payment Successful!' : 'Welcome to GadgetStore!'}
            </div>
            <small>
              {isWelcome
                ? 'Your account has been created and you are now automatically signed in. You can track your order status in real time below.'
                : 'Your SSLCommerz online payment has been confirmed and your order status is now Processing.'}
            </small>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center">
          <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
          <h4>No orders found</h4>
          <p className="text-muted mb-4">You have not placed any orders yet.</p>
          <div>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const isDelivered = order.status.toLowerCase() === 'delivered';
            return (
              <div key={order.id} className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom">
                  <div>
                    <span className="fw-bold me-2">Order #{order.id}</span>
                    <span className="text-muted small">
                      Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div>Status: {getStatusBadge(order.status)}</div>
                    <div className="fw-bold text-primary fs-5">
                      ৳{order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Delivery Details Header */}
                <div className="bg-light px-3 py-2 small border-bottom text-muted d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    <strong>Delivery To:</strong> {order.shipping_address ? `${order.shipping_address}, ` : ''}{order.thana}, {order.district}
                  </div>
                  <div>
                    <i className="bi bi-telephone-fill text-primary me-1"></i>
                    <strong>Contact Phone:</strong> {order.phone || 'N/A'}
                  </div>
                  <div>
                    <span className="badge bg-secondary text-uppercase me-1">{order.payment_method}</span>
                    <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th className="ps-4">Item</th>
                          <th>Price per Unit</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-end">Subtotal</th>
                          {isDelivered && (
                            <th className="text-end pe-4">Customer Review</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={item.product_image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60'}
                                  alt={item.product_name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded border"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60';
                                  }}
                                />
                                <div>
                                  <Link
                                    to={`/products/${item.product_id}`}
                                    className="fw-semibold small text-decoration-none text-dark d-block text-truncate"
                                    style={{ maxWidth: '240px' }}
                                  >
                                    {item.product_name || `Product #${item.product_id}`}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td>৳{item.price.toFixed(2)}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className={`text-end ${isDelivered ? '' : 'pe-4'} fw-bold`}>
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </td>
                            {isDelivered && (
                              <td className="text-end pe-4">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-warning text-dark fw-semibold text-nowrap"
                                  onClick={() => handleOpenReview(item)}
                                  title="Write or edit your review for this product"
                                >
                                  <i className="bi bi-star-fill text-warning me-1"></i>
                                  {reviewedProductIds[item.product_id] ? 'Edit Review' : 'Add Review'}
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal Dialog for Delivered Orders */}
      {reviewModalOpen && selectedItem && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-star-fill text-warning me-2"></i> Product Review
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setReviewModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body p-4">
                  {/* Selected Product info */}
                  <div className="d-flex align-items-center gap-3 p-2 bg-light rounded border mb-3">
                    <img
                      src={selectedItem.product_image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60'}
                      alt={selectedItem.product_name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      className="rounded border"
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{selectedItem.product_name}</div>
                      <small className="text-muted">Price: ৳{selectedItem.price.toFixed(2)}</small>
                    </div>
                  </div>

                  {reviewSuccess && (
                    <div className="alert alert-success d-flex align-items-center py-2" role="alert">
                      <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                      <div>{reviewSuccess}</div>
                    </div>
                  )}

                  {reviewError && (
                    <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                      <div>{reviewError}</div>
                    </div>
                  )}

                  {/* Interactive Star Rating Selector */}
                  <div className="mb-3 text-center py-2 bg-light rounded border">
                    <label className="form-label small fw-semibold text-muted d-block mb-1">
                      Rate this product *
                    </label>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${
                            star <= reviewRating ? 'bi-star-fill text-warning' : 'bi-star text-muted'
                          } fs-2`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setReviewRating(star)}
                          title={`${star} star${star === 1 ? '' : 's'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="badge bg-secondary mt-1">
                      {reviewRating === 5
                        ? '5 - Excellent'
                        : reviewRating === 4
                        ? '4 - Good'
                        : reviewRating === 3
                        ? '3 - Average'
                        : reviewRating === 2
                        ? '2 - Poor'
                        : '1 - Terrible'}
                    </span>
                  </div>

                  {/* Comment Textarea */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Your Feedback / Comment (Optional)
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Share what you liked about this gadget, how it worked, quality..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReviewModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-4 fw-semibold"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
