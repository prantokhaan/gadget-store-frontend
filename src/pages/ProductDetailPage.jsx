import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  // Tabs state: 'description' | 'reviews'
  const [activeTab, setActiveTab] = useState('description');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [canReviewInfo, setCanReviewInfo] = useState({
    can_review: false,
    has_reviewed: false,
    delivered: false,
    existing_review: null,
  });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);
  const [reviewErr, setReviewErr] = useState(null);

  // Load product details & initial data
  const fetchProductAndReviews = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
      setActiveImage(data.image_url || '');

      // Fetch reviews
      const revs = await productService.getReviews(id);
      setReviews(revs);

      // Check review eligibility if user is authenticated
      if (isAuthenticated) {
        try {
          const eligibility = await productService.canReview(id);
          setCanReviewInfo(eligibility);
          if (eligibility.existing_review) {
            setReviewRating(eligibility.existing_review.rating);
            setReviewComment(eligibility.existing_review.comment || '');
          }
        } catch (e) {
          console.warn('Could not check review eligibility:', e);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewMsg(null);
    setReviewErr(null);

    try {
      await productService.submitReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewMsg('Thank you! Your review has been submitted successfully.');
      // Refresh reviews and product rating
      const updatedProduct = await productService.getById(id);
      setProduct(updatedProduct);
      const updatedReviews = await productService.getReviews(id);
      setReviews(updatedReviews);
      const eligibility = await productService.canReview(id);
      setCanReviewInfo(eligibility);
    } catch (err) {
      setReviewErr(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Product not found'}
        </div>
        <Link to="/products" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-1"></i> Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  // Combine feature image and gallery images (up to 5 additional)
  const allImages = [
    product.image_url,
    ...(product.images || []),
  ].filter(Boolean);
  // Ensure unique list
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products">Products</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Top Section */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="row g-4">
          {/* Left: Product Images Gallery */}
          <div className="col-md-6">
            {/* Main Featured Image Display */}
            <div className="bg-white p-3 rounded border text-center position-relative">
              <img
                src={activeImage || product.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                className="product-img-detail img-fluid rounded"
                style={{ maxHeight: '380px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Thumbnail Gallery (Feature + Up to 5 Images) */}
            {uniqueImages.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn p-1 rounded border ${
                      activeImage === img ? 'border-primary shadow-sm ring-2' : 'border-light-subtle'
                    }`}
                    style={{ outline: activeImage === img ? '2px solid #0d6efd' : 'none' }}
                    onClick={() => setActiveImage(img)}
                    title={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                      className="rounded"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100&auto=format&fit=crop&q=60';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info, Price, Rating & Actions (NO description here) */}
          <div className="col-md-6 d-flex flex-column">
            <div className="mb-2">
              <span className="badge bg-secondary me-2">{product.category}</span>
              {isOutOfStock ? (
                <span className="badge bg-danger">Out of Stock</span>
              ) : (
                <span className="badge bg-success">{product.stock} available</span>
              )}
            </div>

            <h1 className="h2 fw-bold mb-2">{product.name}</h1>

            {/* Price Area with Average Star Rating and Review Count */}
            <div className="bg-light p-3 rounded mb-3 border">
              <div className="d-flex flex-wrap align-items-baseline gap-2 mb-2">
                <span className="fs-2 fw-bold text-primary">৳{product.price.toFixed(2)}</span>
                <span className="text-muted small">BDT (Tax included)</span>
              </div>

              {/* Star Rating & Review Count */}
              <div className="d-flex align-items-center gap-2">
                <div className="text-warning fs-5 d-flex">
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
                <span className="fw-bold fs-6">
                  {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                </span>
                <span className="text-muted small">
                  ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none p-0 ms-2"
                  onClick={() => {
                    setActiveTab('reviews');
                    const element = document.getElementById('product-tabs-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Reviews
                </button>
              </div>
            </div>

            {/* Quick Delivery Highlights */}
            <div className="small text-muted mb-4 d-flex flex-column gap-1">
              <div>
                <i className="bi bi-truck text-primary me-2"></i>
                <strong>Delivery Charge:</strong> Inside Dhaka ৳60 | Outside Dhaka ৳120
              </div>
              <div>
                <i className="bi bi-cash-coin text-success me-2"></i>
                <strong>Payment Options:</strong> Cash on Delivery (COD) or Instant Pay with SSLCommerz
              </div>
            </div>

            {/* Order Action Buttons */}
            <div className="border-top pt-4 mt-auto">
              {addedMessage && (
                <div className="alert alert-success d-flex align-items-center mb-3 py-2" role="alert">
                  <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                  <div>Added to your shopping cart!</div>
                </div>
              )}

              <div className="d-flex align-items-center gap-3">
                {/* Quantity Controls */}
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max={product.stock}
                    disabled={isOutOfStock}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="btn btn-outline-primary px-3 flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>

                {/* Buy Now Button */}
                <button
                  className="btn btn-danger px-4 flex-grow-1 fw-semibold text-nowrap"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  <i className="bi bi-lightning-charge-fill me-2"></i>
                  Buy Now
                </button>
              </div>

              <div className="mt-3">
                <Link to="/products" className="text-decoration-none small text-muted">
                  <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs Section: Description & Reviews */}
      <div id="product-tabs-section" className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom pt-3 px-4">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link fw-semibold px-4 ${
                  activeTab === 'description' ? 'active text-primary border-primary border-bottom-0' : 'text-muted'
                }`}
                onClick={() => setActiveTab('description')}
              >
                <i className="bi bi-file-text me-2"></i> Description
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-semibold px-4 ${
                  activeTab === 'reviews' ? 'active text-primary border-primary border-bottom-0' : 'text-muted'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                <i className="bi bi-star-half me-2"></i> Reviews ({reviews.length})
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-4">
          {/* TAB 1: Product Description */}
          {activeTab === 'description' && (
            <div>
              <h5 className="fw-bold mb-3">Product Description</h5>
              <div className="text-secondary leading-relaxed" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                {product.description || 'No detailed description available for this item.'}
              </div>
            </div>
          )}

          {/* TAB 2: Customer Reviews & Submission */}
          {activeTab === 'reviews' && (
            <div>
              {/* Rating Overview Header */}
              <div className="row g-4 align-items-center pb-4 mb-4 border-bottom">
                <div className="col-sm-4 text-center border-end">
                  <div className="display-4 fw-bold text-dark">
                    {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-warning fs-5 my-1">
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
                  <div className="text-muted small">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                <div className="col-sm-8">
                  <h6 className="fw-bold mb-2">Verified Purchase Reviews</h6>
                  <p className="text-muted small mb-0">
                    To keep all customer reviews honest and trustworthy, only shoppers who have received
                    their order (marked as <strong>Delivered</strong>) can write a review.
                  </p>
                </div>
              </div>

              {/* Write a Review Section */}
              <div className="bg-light p-4 rounded mb-4 border">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  {canReviewInfo.has_reviewed ? 'Update Your Review' : 'Write a Customer Review'}
                </h5>

                {!isAuthenticated ? (
                  <div className="alert alert-warning mb-0" role="alert">
                    <i className="bi bi-lock-fill me-2"></i>
                    Please <Link to="/login" className="fw-semibold">log in</Link> with your account to leave a review for delivered orders.
                  </div>
                ) : !canReviewInfo.delivered ? (
                  <div className="alert alert-info mb-0" role="alert">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Verified Purchase Policy:</strong> You can submit a review once you have purchased this product and your order status is updated to <strong>Delivered</strong>.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    {reviewMsg && (
                      <div className="alert alert-success py-2 d-flex align-items-center" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i> {reviewMsg}
                      </div>
                    )}
                    {reviewErr && (
                      <div className="alert alert-danger py-2 d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {reviewErr}
                      </div>
                    )}

                    {/* Interactive Star Picker */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Your Rating *</label>
                      <div className="d-flex align-items-center gap-2">
                        <div className="text-warning fs-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`bi ${star <= reviewRating ? 'bi-star-fill' : 'bi-star'} me-1`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setReviewRating(star)}
                              title={`${star} star${star === 1 ? '' : 's'}`}
                            ></i>
                          ))}
                        </div>
                        <span className="badge bg-secondary">
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
                    </div>

                    {/* Comment Area */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Review Comment (Optional)</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Tell others what you liked or disliked about this gadget, build quality, performance..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm px-4 fw-semibold"
                      disabled={reviewSubmitting}
                    >
                      {reviewSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : canReviewInfo.has_reviewed ? (
                        'Update Review'
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <h5 className="fw-bold mb-3">Customer Reviews ({reviews.length})</h5>

              {reviews.length === 0 ? (
                <div className="text-center py-4 bg-white rounded border">
                  <i className="bi bi-chat-heart fs-1 text-muted mb-2 d-block"></i>
                  <p className="text-muted mb-0">No reviews yet for this product.</p>
                  <small className="text-secondary">Be the first to review after your delivery!</small>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="card border-0 bg-light p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                            <span>{rev.user_name}</span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle py-1" style={{ fontSize: '0.65rem' }}>
                              <i className="bi bi-patch-check-fill me-1"></i> Verified Buyer
                            </span>
                          </div>
                          <div className="text-warning small mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`bi ${star <= rev.rating ? 'bi-star-fill' : 'bi-star'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">
                          {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) : ''}
                        </small>
                      </div>

                      {rev.comment && (
                        <p className="text-secondary mb-0 small" style={{ whiteSpace: 'pre-line' }}>
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
