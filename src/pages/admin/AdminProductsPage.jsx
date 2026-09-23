import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, uploadService } from '../../services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Upload progress states
  const [uploadingFeature, setUploadingFeature] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form modal state
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: 'Computer Accessories',
    stock: '',
    image_url: '',
    images: [],
  });

  const categories = [
    'Computer Accessories',
    'Cables & Chargers',
    'Audio',
    'Power Banks',
    'Mobile Gadgets',
    'USB Devices',
  ];

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateForm = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: '',
      description: '',
      price: '',
      category: 'Computer Accessories',
      stock: '10',
      image_url: '',
      images: [],
    });
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url || '',
      images: product.images ? [...product.images] : [],
    });
    setShowForm(true);
  };

  // Upload feature image directly from computer
  const handleFeatureFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFeature(true);
    setError(null);
    try {
      const res = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      setError(err.message || 'Failed to upload feature image');
    } finally {
      setUploadingFeature(false);
    }
  };

  // Upload additional gallery images directly from computer (up to 5)
  const handleGalleryFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = (formData.images || []).length;
    const remainingSlots = 5 - currentCount;

    if (remainingSlots <= 0) {
      setError('You have already reached the maximum of 5 additional gallery images.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setError(`Only ${remainingSlots} more image(s) could be selected. Max limit is 5 gallery images.`);
    }

    setUploadingGallery(true);
    try {
      const res = await uploadService.uploadMultiple(filesToUpload);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...res.urls].slice(0, 5),
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock, 10),
      image_url: formData.image_url || null,
      images: formData.images || [],
    };

    try {
      if (isEditing) {
        await adminService.updateProduct(formData.id, payload);
        setSuccessMsg(`Product #${formData.id} updated successfully!`);
      } else {
        await adminService.createProduct(payload);
        setSuccessMsg('New gadget created successfully!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    setError(null);
    setSuccessMsg(null);
    try {
      await adminService.deleteProduct(id);
      setSuccessMsg(`Product #${id} was deleted successfully.`);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Could not delete product');
    }
  };

  return (
    <div className="container py-4">
      {/* Admin Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">Product Inventory Management</h1>
          <p className="text-muted small mb-0">Create, edit, and organize store gadget inventory</p>
        </div>

        <div className="d-flex gap-3 align-items-center mt-2 mt-md-0">
          <div className="nav nav-pills">
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
            <Link to="/admin/products" className="nav-link active">
              Products
            </Link>
            <Link to="/admin/orders" className="nav-link">
              Orders
            </Link>
            <Link to="/admin/users" className="nav-link">
              Users
            </Link>
          </div>

          <button className="btn btn-primary btn-sm fw-semibold" onClick={openCreateForm}>
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </button>
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

      {/* Add / Edit Inline Form Modal */}
      {showForm && (
        <div className="card shadow mb-4 border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              {isEditing ? `Edit Product #${formData.id}` : 'Create New Gadget'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowForm(false)}
            ></button>
          </div>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                {/* Feature Image Upload / URL */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Feature Image * (Main image)
                  </label>
                  <div className="input-group mb-2">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFeatureFileUpload}
                      disabled={uploadingFeature}
                    />
                    {uploadingFeature && (
                      <span className="input-group-text">
                        <span className="spinner-border spinner-border-sm text-primary"></span>
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Or enter direct image URL (https://...)"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />

                  {formData.image_url && (
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <img
                        src={formData.image_url}
                        alt="Feature preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="rounded border"
                      />
                      <small className="text-success fw-semibold">
                        <i className="bi bi-check-circle me-1"></i> Feature Image Selected
                      </small>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-1 ms-auto"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Gallery Images (Up to 5 images) */}
                <div className="col-12">
                  <label className="form-label small fw-semibold d-flex justify-content-between align-items-center">
                    <span>
                      Additional Gallery Images (Up to 5 images from computer)
                    </span>
                    <span className="badge bg-secondary">
                      {formData.images.length}/5 Selected
                    </span>
                  </label>

                  <div className="input-group mb-2">
                    <input
                      type="file"
                      multiple
                      className="form-control"
                      accept="image/*"
                      onChange={handleGalleryFilesUpload}
                      disabled={uploadingGallery || formData.images.length >= 5}
                    />
                    {uploadingGallery && (
                      <span className="input-group-text">
                        <span className="spinner-border spinner-border-sm text-primary"></span>
                      </span>
                    )}
                  </div>

                  {formData.images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 pt-2">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="position-relative border rounded p-1 bg-white shadow-sm"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="rounded"
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '20px', height: '20px', fontSize: '10px' }}
                            onClick={() => handleRemoveGalleryImage(idx)}
                            title="Remove this image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">
                    {isEditing ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Stock</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60'}
                            alt={p.name}
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            className="rounded border"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=80&auto=format&fit=crop&q=60';
                            }}
                          />
                          <div>
                            <div className="fw-semibold">{p.name}</div>
                            <div className="d-flex gap-2 align-items-center">
                              <small className="text-muted">ID: #{p.id}</small>
                              {p.images && p.images.length > 0 && (
                                <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>
                                  <i className="bi bi-images me-1"></i>+{p.images.length} images
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{p.category}</span>
                      </td>
                      <td className="fw-bold">৳{p.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <i className="bi bi-star-fill text-warning small"></i>
                          <span className="fw-semibold small">
                            {p.average_rating ? p.average_rating.toFixed(1) : '0.0'}
                          </span>
                          <small className="text-muted">({p.review_count})</small>
                        </div>
                      </td>
                      <td>
                        {p.stock > 0 ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            {p.stock} units
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                            Out of stock
                          </span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => openEditForm(p)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
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
