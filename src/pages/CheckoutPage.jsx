import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, addressService } from '../services/api';
import { bangladeshDistricts } from '../data/bangladeshGeo';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Districts list from geography data
  const districtList = Object.keys(bangladeshDistricts).sort();

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    phone: '',
    district: 'Dhaka',
    thana: bangladeshDistricts['Dhaka'] ? bangladeshDistricts['Dhaka'][0] : '',
    address: 'House 12, Road 4, Sector 3',
    zip: '1230',
    saveAddress: false,
    addressLabel: 'Home',
    paymentMethod: 'cod', // 'cod' or 'pay_now'
  });

  // Saved addresses for authenticated user
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Available thanas for current district
  const availableThanas = bangladeshDistricts[shippingData.district] || [];

  // Delivery charge: Dhaka = 60, Others = 120
  const deliveryCharge = shippingData.district.toLowerCase() === 'dhaka' ? 60 : 120;

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const [error, setError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Check URL query parameters for failed/cancelled payment redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'fail') {
      setError('Your SSLCommerz online transaction failed or was declined. You can try again or choose Cash on Delivery.');
    } else if (paymentStatus === 'cancelled') {
      setError('Your SSLCommerz payment session was cancelled. You can retry when ready.');
    }
  }, [location.search]);

  // Keep customer name/email updated if user logs in
  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  // Fetch saved addresses if authenticated
  useEffect(() => {
    async function loadAddresses() {
      if (isAuthenticated) {
        try {
          setLoadingAddresses(true);
          const addrs = await addressService.getAll();
          setSavedAddresses(addrs);
          if (addrs.length > 0) {
            const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
            setSelectedAddressId(defaultAddr.id);
            setShippingData((prev) => ({
              ...prev,
              fullName: defaultAddr.recipient_name || prev.fullName,
              phone: defaultAddr.phone || prev.phone,
              district: defaultAddr.district || prev.district,
              thana: defaultAddr.thana || prev.thana,
              address: defaultAddr.address_details || prev.address,
            }));
          }
        } catch (err) {
          console.warn('Failed to load saved addresses:', err.message);
        } finally {
          setLoadingAddresses(false);
        }
      }
    }
    loadAddresses();
  }, [isAuthenticated]);

  // Select an existing saved address
  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShippingData((prev) => ({
      ...prev,
      fullName: addr.recipient_name,
      phone: addr.phone,
      district: addr.district,
      thana: addr.thana,
      address: addr.address_details,
    }));
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
  };

  // Handle District change & update Thana automatically
  const handleDistrictChange = (e) => {
    const selectedDist = e.target.value;
    const thanasForDist = bangladeshDistricts[selectedDist] || [];
    setShippingData({
      ...shippingData,
      district: selectedDist,
      thana: thanasForDist.length > 0 ? thanasForDist[0] : '',
    });
  };

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // Coupon Apply
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await orderService.validateCoupon(couponInput.trim(), cartTotal);
      setAppliedCoupon(res);
      setCouponError(null);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryCharge - discountAmount);

  // Order Submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validate phone number
    if (!shippingData.phone || shippingData.phone.trim().length < 7) {
      setError('Please provide a valid delivery contact phone number.');
      return;
    }

    // Validate password for guest checkout
    if (!isAuthenticated) {
      if (!shippingData.password || shippingData.password.length < 6) {
        setError('Please provide an account password of at least 6 characters.');
        return;
      }
      if (shippingData.password !== shippingData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        district: shippingData.district,
        thana: shippingData.thana,
        shipping_address: shippingData.address,
        phone: shippingData.phone.trim(),
        save_address: shippingData.saveAddress,
        address_label: shippingData.addressLabel,
        payment_method: shippingData.paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        ...(!isAuthenticated && {
          customer_name: shippingData.fullName,
          customer_email: shippingData.email,
          password: shippingData.password,
        }),
      };

      const result = await orderService.create(orderPayload);
      clearCart();

      // If guest checkout auto-created an account, immediately log user in
      if (result.access_token && result.user) {
        setSession(result.access_token, result.user);
      }

      // If Pay Now with SSLCommerz was selected, redirect to gateway!
      if (shippingData.paymentMethod === 'pay_now' && result.payment_url) {
        setRedirectingToPayment(true);
        window.location.href = result.payment_url;
        return;
      }

      setCreatedOrder(result);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please review your cart and details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (redirectingToPayment) {
    return (
      <div className="container py-5 text-center my-auto">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '520px' }}>
          <div className="spinner-border text-danger mb-3" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="fw-bold mb-2">Connecting to SSLCommerz</h3>
          <p className="text-muted mb-0">
            Please wait while we redirect you to the SSLCommerz sandboxed payment gateway (bKash, Nagad, Cards)...
          </p>
        </div>
      </div>
    );
  }

  if (createdOrder) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '640px' }}>
          <div className="text-success mb-3">
            <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="fw-bold mb-2">Order Confirmed!</h2>
          <p className="text-muted mb-4">
            Thank you for your purchase, <strong>{shippingData.fullName}</strong>.
            Your order <strong>#{createdOrder.id}</strong> has been successfully placed.
          </p>

          {/* Immediate Login Banner ONLY for newly registered non-account users */}
          {createdOrder.access_token && (
            <div className="alert alert-success d-flex align-items-center mb-4 text-start shadow-sm" role="alert">
              <i className="bi bi-person-check-fill fs-2 text-success me-3"></i>
              <div>
                <div className="fw-bold">You are now logged in!</div>
                <small className="text-dark">
                  Your account is active for <strong>{user?.email || createdOrder.user_email || shippingData.email}</strong>.
                  You can view your order progress, delivery status, and history anytime.
                </small>
              </div>
            </div>
          )}

          <div className="bg-light p-3 rounded mb-4 text-start">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Order ID:</span>
              <span className="fw-bold">#{createdOrder.id}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Recipient Name:</span>
              <span className="fw-semibold">{createdOrder.user_name || shippingData.fullName}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Contact Phone:</span>
              <span className="fw-bold text-dark">
                <i className="bi bi-telephone-fill me-1 text-primary"></i>
                {createdOrder.phone || shippingData.phone}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Destination:</span>
              <span className="fw-semibold">{createdOrder.thana}, {createdOrder.district}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Street Address:</span>
              <span className="fw-semibold">{createdOrder.shipping_address || shippingData.address}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Payment Method:</span>
              <span className="badge bg-secondary text-uppercase">{createdOrder.payment_method}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Charge:</span>
              <span>৳{createdOrder.delivery_charge.toFixed(2)}</span>
            </div>
            {createdOrder.discount_amount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Coupon Discount ({createdOrder.coupon_code}):</span>
                <span>-৳{createdOrder.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold fs-5">Total Amount:</span>
              <span className="fw-bold fs-5 text-primary">৳{createdOrder.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link
              to={createdOrder.access_token ? "/orders?welcome=1" : "/orders"}
              className="btn btn-primary"
            >
              <i className="bi bi-box-seam me-2"></i> View Order History & Tracking
            </Link>
            <Link to="/products" className="btn btn-outline-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-bag-x fs-1 text-muted mb-3"></i>
          <h4>No items to checkout</h4>
          <p className="text-muted mb-4">Please add products to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h3 fw-bold mb-4">Checkout & Delivery</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Guest Notice Alert */}
      {!isAuthenticated ? (
        <div className="alert alert-info d-flex align-items-center mb-4 shadow-sm" role="alert">
          <i className="bi bi-info-circle-fill fs-4 me-3"></i>
          <div>
            <strong>Instant Guest Checkout:</strong> No need to register beforehand! Enter your contact details and a password below, and your account will be created automatically with your order.
          </div>
        </div>
      ) : (
        <div className="alert alert-success py-2 mb-4 d-flex align-items-center shadow-sm" role="alert">
          <i className="bi bi-person-check-fill fs-5 me-2"></i>
          <div>
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="row g-4">
          {/* Customer & Delivery Form */}
          <div className="col-lg-7">
            {/* 1. Contact & Account Info */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">1. Contact & Customer Details</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvir Ahmed"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      required
                      disabled={isAuthenticated}
                    />
                  </div>

                  {/* Delivery Phone Number */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Delivery Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted small">+88</span>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                    <div className="form-text small text-muted">
                      Required for delivery rider contact & updates
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">
                          Create Account Password *
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={shippingData.password}
                          onChange={handleInputChange}
                          placeholder="Min 6 characters"
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Confirm Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={shippingData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Re-type password"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Saved Delivery Addresses for Logged-In User */}
            {isAuthenticated && savedAddresses.length > 0 && (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Select Saved Delivery Address</h5>
                  <span className="badge bg-light text-dark border">
                    {savedAddresses.length} saved
                  </span>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div key={addr.id} className="col-12 col-md-6">
                          <div
                            className={`card h-100 p-3 border transition-all ${
                              isSelected
                                ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                                : 'border-light-subtle'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelectSavedAddress(addr)}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="form-check mb-0">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="addressChoice"
                                  checked={isSelected}
                                  onChange={() => handleSelectSavedAddress(addr)}
                                />
                                <label className="form-check-label fw-bold text-dark ms-1">
                                  {addr.label}
                                </label>
                              </div>
                              {addr.is_default && (
                                <span className="badge bg-secondary small">Default</span>
                              )}
                            </div>
                            <div className="small text-muted mb-1">
                              <strong>{addr.recipient_name}</strong> &bull; {addr.phone}
                            </div>
                            <div className="small text-dark mb-1">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {addr.address_details}
                            </div>
                            <div className="small text-muted">
                              {addr.thana}, {addr.district}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="col-12">
                      <div className="form-check mt-1">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="addressChoice"
                          id="newAddressRadio"
                          checked={selectedAddressId === 'new'}
                          onChange={handleSelectNewAddress}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="newAddressRadio">
                          ➕ Deliver to a different / new address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Destination (All Bangladesh Districts & Thanas) */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  {isAuthenticated && savedAddresses.length > 0 && selectedAddressId !== 'new'
                    ? '2. Delivery Destination (Selected Address)'
                    : '2. Delivery Destination (Bangladesh)'}
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* City/District Field */}
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">
                      City / District *
                    </label>
                    <select
                      className="form-select"
                      name="district"
                      value={shippingData.district}
                      onChange={handleDistrictChange}
                      required
                    >
                      {districtList.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} {dist.toLowerCase() === 'dhaka' ? '(Inside Dhaka - ৳60 Delivery)' : '(Outside Dhaka - ৳120 Delivery)'}
                        </option>
                      ))}
                    </select>
                    <div className="form-text small">
                      {shippingData.district.toLowerCase() === 'dhaka' ? (
                        <span className="text-success fw-semibold">Inside Dhaka: Delivery charge is ৳60</span>
                      ) : (
                        <span className="text-primary fw-semibold">Outside Dhaka: Delivery charge is ৳120</span>
                      )}
                    </div>
                  </div>

                  {/* Thana/Upazila Field */}
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">
                      Thana / Upazila *
                    </label>
                    <select
                      className="form-select"
                      name="thana"
                      value={shippingData.thana}
                      onChange={handleInputChange}
                      required
                    >
                      {availableThanas.map((th) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Detailed Street Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      placeholder="House No, Road No, Flat/Apartment, Area"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Postal / ZIP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zip"
                      value={shippingData.zip}
                      onChange={handleInputChange}
                      placeholder="e.g. 1205"
                    />
                  </div>

                  {/* Option to save new address to address book */}
                  {isAuthenticated && selectedAddressId === 'new' && (
                    <div className="col-12 pt-2 border-top">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="saveAddressCheck"
                          checked={shippingData.saveAddress}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, saveAddress: e.target.checked })
                          }
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="saveAddressCheck">
                          Save this delivery address to my address book for future orders
                        </label>
                      </div>

                      {shippingData.saveAddress && (
                        <div className="mt-2 row g-2 align-items-center">
                          <div className="col-auto">
                            <span className="small text-muted">Address Label:</span>
                          </div>
                          <div className="col-auto">
                            <select
                              className="form-select form-select-sm"
                              value={shippingData.addressLabel}
                              onChange={(e) =>
                                setShippingData({ ...shippingData, addressLabel: e.target.value })
                              }
                            >
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Payment Method Options */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">3. Select Payment Method</h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  {/* Option 1: Cash on Delivery */}
                  <label className={`card p-3 border cursor-pointer ${shippingData.paymentMethod === 'cod' ? 'border-primary bg-light' : ''}`}>
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input me-3 mt-0"
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={shippingData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-bold">
                          <i className="bi bi-cash-stack me-2 text-success"></i>
                          Cash on Delivery (COD)
                        </div>
                        <small className="text-muted d-block">
                          Pay in cash when you receive your gadget products at your doorstep.
                        </small>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Pay Now via SSLCommerz */}
                  <label className={`card p-3 border cursor-pointer ${shippingData.paymentMethod === 'pay_now' ? 'border-primary bg-light' : ''}`}>
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input me-3 mt-0"
                        type="radio"
                        name="paymentMethod"
                        value="pay_now"
                        checked={shippingData.paymentMethod === 'pay_now'}
                        onChange={handleInputChange}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="fw-bold text-danger">
                            <i className="bi bi-credit-card-2-front-fill me-2"></i>
                            Pay Now (SSLCommerz Sandboxed)
                          </div>
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">
                            bKash • Nagad • Cards
                          </span>
                        </div>
                        <small className="text-muted d-block mt-1">
                          Instant online payment via SSLCommerz sandbox demo. You will be redirected to the secure gateway upon clicking confirm.
                        </small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '80px' }}>
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Order Summary ({items.length} items)</h5>
              </div>
              <div className="card-body">
                {/* Item List */}
                <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div className="me-2">
                        <div className="fw-semibold small text-truncate" style={{ maxWidth: '220px' }}>
                          {product.name}
                        </div>
                        <small className="text-muted">
                          Qty: {quantity} × ৳{product.price.toFixed(2)}
                        </small>
                      </div>
                      <span className="fw-bold small">
                        ৳{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="card bg-light border-0 p-3 mb-3">
                  <label className="form-label small fw-bold mb-1">
                    <i className="bi bi-tag-fill me-1 text-primary"></i> Apply Coupon Code
                  </label>
                  {!appliedCoupon ? (
                    <div>
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control text-uppercase"
                          placeholder="e.g. SAVE10"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponInput.trim()}
                        >
                          {validatingCoupon ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                      <div className="form-text small mt-1 text-muted">
                        Available test codes: <strong className="text-dark">SAVE10</strong> (10% off), <strong className="text-dark">GADGET50</strong> (৳50 off)
                      </div>
                      {couponError && (
                        <div className="text-danger small mt-1">
                          <i className="bi bi-x-circle me-1"></i>
                          {couponError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border border-success">
                      <div>
                        <span className="badge bg-success me-2">{appliedCoupon.code}</span>
                        <small className="text-success fw-semibold">
                          {appliedCoupon.message}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        onClick={handleRemoveCoupon}
                        title="Remove coupon"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Items Subtotal</span>
                  <span className="fw-semibold">৳{cartTotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    Delivery Charge ({shippingData.district.toLowerCase() === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span className="fw-semibold">৳{deliveryCharge.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Coupon Discount</span>
                    <span className="fw-bold">-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">Total Payable</span>
                  <span className="fs-5 fw-bold text-primary">৳{grandTotal.toFixed(2)} BDT</span>
                </div>

                <button
                  type="submit"
                  className={`btn w-100 py-2 fw-bold shadow-sm ${
                    shippingData.paymentMethod === 'pay_now' ? 'btn-danger' : 'btn-success'
                  }`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : shippingData.paymentMethod === 'pay_now' ? (
                    <>
                      <i className="bi bi-credit-card-fill me-2"></i>
                      Proceed to SSLCommerz Payment (৳{grandTotal.toFixed(2)})
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Confirm & Place Order (৳{grandTotal.toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
